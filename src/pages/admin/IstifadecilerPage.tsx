import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Eye, Edit, Ban, Mail, Search, X, Phone, Calendar, MapPin, CreditCard, FileText, Clock, Shield, Send, Save, User, ChevronLeft, ChevronRight, Bot, AlertTriangle, TrendingDown, Zap, RefreshCw, ArrowDownRight } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { DateRangeFilter, ExcelExportButton } from "@/components/admin/TableToolbar";
import { SortableHeader } from "@/components/admin/SortableHeader";
import { exportToExcel, isInDateRange, sortData, nextSortDir, type SortDir } from "@/lib/table-utils";
import { format } from "date-fns";

// === AI Risk Analysis ===
interface UserRiskFlag {
  type: "many_rejected" | "spam_pattern" | "fast_posting" | "fake_info" | "complaint_target" | "duplicate_ads" | "banned_words" | "low_quality_pattern" | "multiple_accounts" | "price_manipulation";
  severity: "low" | "medium" | "high";
  message: string;
}

interface UserRiskProfile {
  riskScore: number; // 0-100, 100 = ən riskli
  riskLevel: "aşağı" | "orta" | "yüksək" | "kritik";
  flags: UserRiskFlag[];
  recommendation: string;
}

const riskFlagConfig: Record<UserRiskFlag["type"], { label: string; color: string }> = {
  many_rejected: { label: "Çox rədd edilən", color: "text-admin-danger" },
  spam_pattern: { label: "Spam paterni", color: "text-admin-danger" },
  fast_posting: { label: "Sürətli paylaşım", color: "text-admin-warning" },
  fake_info: { label: "Saxta məlumat", color: "text-admin-danger" },
  complaint_target: { label: "Şikayət hədəfi", color: "text-admin-warning" },
  duplicate_ads: { label: "Təkrar elanlar", color: "text-admin-warning" },
  banned_words: { label: "Qadağan sözlər", color: "text-admin-danger" },
  low_quality_pattern: { label: "Aşağı keyfiyyət", color: "text-muted-foreground" },
  multiple_accounts: { label: "Çoxlu hesab", color: "text-admin-danger" },
  price_manipulation: { label: "Qiymət manipulyasiyası", color: "text-admin-warning" },
};

const riskLevelConfig: Record<string, { label: string; class: string; bgClass: string }> = {
  "aşağı": { label: "Aşağı risk", class: "text-admin-success", bgClass: "bg-admin-success/10 text-admin-success" },
  "orta": { label: "Orta risk", class: "text-admin-warning", bgClass: "bg-admin-warning/10 text-admin-warning" },
  "yüksək": { label: "Yüksək risk", class: "text-admin-danger", bgClass: "bg-admin-danger/10 text-admin-danger" },
  "kritik": { label: "Kritik risk", class: "text-admin-danger", bgClass: "bg-admin-danger/20 text-admin-danger" },
};

function analyzeUserRisk(user: UserData): UserRiskProfile {
  const flags: UserRiskFlag[] = [];

  // 1. Rədd edilən elan nisbəti
  const rejectedAds = user.userAds.filter(a => a.status === "redd").length;
  const deletedAds = user.userAds.filter(a => a.status === "silinmis").length;
  const totalAds = user.userAds.length;
  const badRatio = totalAds > 0 ? (rejectedAds + deletedAds) / totalAds : 0;
  if (badRatio > 0.5 && totalAds >= 3) {
    flags.push({ type: "many_rejected", severity: "high", message: `Elanlarının ${Math.round(badRatio * 100)}%-i rədd/silinmiş (${rejectedAds + deletedAds}/${totalAds})` });
  } else if (badRatio > 0.3 && totalAds >= 3) {
    flags.push({ type: "many_rejected", severity: "medium", message: `Elanlarının ${Math.round(badRatio * 100)}%-i rədd/silinmiş` });
  }

  // 2. Spam pattern — çoxlu gözləmədə olan elan
  const pendingAds = user.userAds.filter(a => a.status === "gozlemede").length;
  if (pendingAds >= 5) {
    flags.push({ type: "spam_pattern", severity: "high", message: `${pendingAds} elan gözləmədədir — spam şübhəsi` });
  } else if (pendingAds >= 3) {
    flags.push({ type: "spam_pattern", severity: "medium", message: `${pendingAds} elan gözləmədə — sürətli paylaşım` });
  }

  // 3. Sürətli paylaşım (eyni gündə çox elan)
  const adDates = user.userAds.map(a => a.date);
  const dateCounts: Record<string, number> = {};
  adDates.forEach(d => { dateCounts[d] = (dateCounts[d] || 0) + 1; });
  const maxInDay = Math.max(...Object.values(dateCounts), 0);
  if (maxInDay >= 5) {
    flags.push({ type: "fast_posting", severity: "high", message: `Bir gündə ${maxInDay} elan paylaşıb — bot/spam davranışı` });
  } else if (maxInDay >= 3) {
    flags.push({ type: "fast_posting", severity: "medium", message: `Bir gündə ${maxInDay} elan paylaşıb` });
  }

  // 4. Saxta əlaqə məlumatları
  if (user.phone && /(\d)\1{5,}/.test(user.phone.replace(/\D/g, ""))) {
    flags.push({ type: "fake_info", severity: "high", message: "Telefon nömrəsi saxta görünür (təkrarlanan rəqəmlər)" });
  }
  if (user.email && /^[a-z]{1,3}\d{5,}@/.test(user.email.toLowerCase())) {
    flags.push({ type: "fake_info", severity: "medium", message: "Email adresi avtogenerə olunmuş görünür" });
  }

  // 5. Şikayət hədəfi
  const complaints = user.activity.filter(a => a.action.includes("Şikayət"));
  if (complaints.length >= 3) {
    flags.push({ type: "complaint_target", severity: "high", message: `${complaints.length} şikayət alıb` });
  } else if (complaints.length >= 1) {
    flags.push({ type: "complaint_target", severity: "medium", message: `${complaints.length} şikayət alıb` });
  }

  // 6. Təkrar elanlar (eyni başlıqlı)
  const titles = user.userAds.map(a => a.title.toLowerCase());
  const uniqueTitles = new Set(titles);
  if (titles.length > uniqueTitles.size && titles.length >= 3) {
    const dupCount = titles.length - uniqueTitles.size;
    flags.push({ type: "duplicate_ads", severity: "medium", message: `${dupCount} təkrar elan başlığı var` });
  }

  // 7. Aşağı keyfiyyət paterni (elanların əksəriyyəti az baxışlı)
  const lowViewAds = user.userAds.filter(a => a.views < 30).length;
  if (lowViewAds > totalAds * 0.7 && totalAds >= 3) {
    flags.push({ type: "low_quality_pattern", severity: "low", message: `Elanlarının ${Math.round((lowViewAds / totalAds) * 100)}%-i 30-dan az baxış alıb` });
  }

  // 8. Qiymət manipulyasiyası (çox ucuz qiymətlər)
  const suspiciouslyLow = user.userAds.filter(a => a.price > 0 && a.price < 10).length;
  if (suspiciouslyLow >= 2) {
    flags.push({ type: "price_manipulation", severity: "medium", message: `${suspiciouslyLow} elan 10₼-dən aşağı qiymətə qoyulub` });
  }

  // 9. Hesab yaşı vs elan sayı (yeni hesab, çox elan = şübhəli)
  const regDate = new Date(user.date);
  const daysSinceReg = Math.max(1, Math.floor((Date.now() - regDate.getTime()) / 86400000));
  const adsPerDay = user.ads / daysSinceReg;
  if (adsPerDay > 2 && user.ads > 10) {
    flags.push({ type: "fast_posting", severity: "high", message: `Gündə ortalama ${adsPerDay.toFixed(1)} elan — yeni hesab, çox elan` });
  }

  // 10. Bloklanmış istifadəçi hələ aktiv (əvvəl bloklanıb amma açılıb)
  const blockHistory = user.activity.filter(a => a.action.includes("blok") || a.detail.includes("blok"));
  if (blockHistory.length > 0 && user.status === "aktiv") {
    flags.push({ type: "multiple_accounts", severity: "medium", message: "Əvvəllər bloklanıb — risk qrupu" });
  }

  // Score
  const highCount = flags.filter(f => f.severity === "high").length;
  const medCount = flags.filter(f => f.severity === "medium").length;
  const lowCount = flags.filter(f => f.severity === "low").length;
  const riskScore = Math.min(100, highCount * 28 + medCount * 14 + lowCount * 5 + (user.status === "bloklanmis" ? 15 : 0));

  const riskLevel: UserRiskProfile["riskLevel"] = riskScore >= 75 ? "kritik" : riskScore >= 50 ? "yüksək" : riskScore >= 25 ? "orta" : "aşağı";

  const recommendations: Record<string, string> = {
    "kritik": "Dərhal bloklanmalı və bütün elanları nəzərdən keçirilməlidir",
    "yüksək": "Elanları manual olaraq yoxlanmalı, xəbərdarlıq göndərilməlidir",
    "orta": "Monitorinq altında saxlanılmalı, növbəti pozuntu zamanı bloklanmalıdır",
    "aşağı": "Normal istifadəçi, xüsusi əməliyyat tələb olunmur",
  };

  return { riskScore, riskLevel, flags, recommendation: recommendations[riskLevel] };
}

interface UserData {
  id: number;
  name: string;
  email: string;
  phone: string;
  ads: number;
  date: string;
  role: "İstifadəçi" | "Moderator" | "Admin";
  status: "aktiv" | "bloklanmis";
  location: string;
  lastActive: string;
  totalSpent: number;
  verified: boolean;
  bio: string;
  riskProfile?: UserRiskProfile;
  userAds: { id: number; title: string; status: "aktiv" | "gozlemede" | "redd" | "silinmis" | "vip"; date: string; price: number; views: number }[];
  payments: { id: number; amount: number; service: string; status: "odenlib" | "gozleyir" | "legv" | "qaytarilib"; date: string }[];
  activity: { action: string; detail: string; date: string }[];
}

const mockUsers: UserData[] = Array.from({ length: 15 }, (_, i) => ({
  id: 5000 + i,
  name: ["Əli Məmmədov", "Leyla Həsənova", "Rəşad Kərimov", "Nigar Əliyeva", "Tural İsmayılov", "Günel Əhmədova", "Orxan Babayev", "Səbinə İsmayılova"][i % 8],
  email: ["ali@mail.az", "leyla@gmail.com", "rashad@mail.az", "nigar@yahoo.com", "tural@mail.az", "gunel@gmail.com", "orxan@mail.az", "sebine@yahoo.com"][i % 8],
  phone: "+994 50 " + String(100 + i * 11) + " " + String(20 + i * 7).padStart(2, "0") + " " + String(30 + i * 3).padStart(2, "0"),
  ads: Math.floor(3 + Math.random() * 50),
  date: "2025-" + String(1 + (i % 12)).padStart(2, "0") + "-" + String(5 + (i % 20)).padStart(2, "0"),
  role: (["İstifadəçi", "İstifadəçi", "Moderator", "İstifadəçi", "Admin", "İstifadəçi", "İstifadəçi", "Moderator"] as const)[i % 8],
  status: i % 8 === 0 ? "bloklanmis" as const : "aktiv" as const,
  location: ["Bakı, Nəsimi", "Bakı, Yasamal", "Bakı, Səbail", "Sumqayıt", "Gəncə", "Bakı, Xətai"][i % 6],
  lastActive: ["Bu gün, 14:23", "Bu gün, 11:05", "Dünən, 22:30", "3 gün əvvəl", "Bu gün, 09:15", "1 həftə əvvəl"][i % 6],
  totalSpent: Math.floor(Math.random() * 200),
  verified: i % 3 !== 2,
  bio: ["Avtomobil həvəskarı", "Daşınmaz əmlak agenti", "Elektronika satıcısı", "Freelancer", "Kiçik biznes sahibi", ""][i % 6],
  userAds: Array.from({ length: 3 + (i % 4) }, (_, j) => ({
    id: 10000 + i * 10 + j,
    title: ["Mercedes C220d, 2019", "3 otaqlı mənzil, Nəsimi", "iPhone 15 Pro Max", "Samsung TV 55\"", "MacBook Pro 14\"", "BMW X5, 2021", "Ofis mebeli dəsti"][j % 7],
    status: (["aktiv", "gozlemede", "aktiv", "redd", "vip", "aktiv", "silinmis"] as const)[j % 7],
    date: "2026-03-" + String(23 - j * 2).padStart(2, "0"),
    price: [25000, 85000, 2800, 1200, 4200, 62000, 800][j % 7],
    views: Math.floor(20 + Math.random() * 3000),
  })),
  payments: Array.from({ length: 2 + (i % 3) }, (_, j) => ({
    id: 8000 + i * 10 + j,
    amount: [5, 10, 2, 10, 5][j % 5],
    service: ["VIP", "Premium", "İrəli", "Premium", "VIP"][j % 5],
    status: (["odenlib", "odenlib", "gozleyir", "odenlib", "legv"] as const)[j % 5],
    date: "2026-03-" + String(20 - j * 3).padStart(2, "0"),
  })),
  activity: [
    { action: "Elan əlavə etdi", detail: `Elan #${10000 + i * 10}`, date: "2026-03-23 14:23" },
    { action: "Profili yenilədi", detail: "Telefon nömrəsi dəyişdi", date: "2026-03-22 11:05" },
    { action: "Elan redaktə etdi", detail: `Elan #${10000 + i * 10 + 1} — qiyməti dəyişdi`, date: "2026-03-21 09:30" },
    { action: "VIP aktivləşdirdi", detail: `Elan #${10000 + i * 10} — 5 ₼`, date: "2026-03-20 16:45" },
    { action: "Giriş etdi", detail: "IP: 185.129.xx.xx", date: "2026-03-19 08:12" },
    { action: "Şikayət aldı", detail: "Elan #" + (10000 + i * 10 + 2) + " — spam şübhəsi", date: "2026-03-18 14:00" },
  ],
}));

const roleColor: Record<string, string> = {
  İstifadəçi: "bg-muted text-muted-foreground",
  Moderator: "bg-admin-info/10 text-admin-info",
  Admin: "bg-admin-accent/15 text-admin-accent",
};

const profileTabs = ["Ümumi", "Elanlar", "Ödənişlər", "Aktivlik"];

// Full edit dialog for all user fields
function UserEditDialog({ user, open, onClose, onSave }: {
  user: UserData | null;
  open: boolean;
  onClose: () => void;
  onSave: (user: UserData) => void;
}) {
  const [form, setForm] = useState<Partial<UserData>>({});

  const syncForm = () => {
    if (user) setForm({ ...user });
  };
  // Sync when user changes
  if (user && form.id !== user.id) syncForm();

  if (!user) return null;
  const update = (key: keyof UserData, value: any) => setForm(prev => ({ ...prev, [key]: value }));

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><User size={18} /> İstifadəçi #{user.id} — Tam Redaktə</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">Ad Soyad</label>
              <Input value={form.name || ""} onChange={e => update("name", e.target.value)} className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input type="email" value={form.email || ""} onChange={e => update("email", e.target.value)} className="mt-1" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">Telefon</label>
              <Input value={form.phone || ""} onChange={e => update("phone", e.target.value)} className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">Lokasiya</label>
              <Input value={form.location || ""} onChange={e => update("location", e.target.value)} className="mt-1" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Bio</label>
            <Textarea value={form.bio || ""} onChange={e => update("bio", e.target.value)} className="mt-1" rows={2} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-sm font-medium">Rol</label>
              <Select value={form.role || "İstifadəçi"} onValueChange={v => update("role", v)}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="İstifadəçi">İstifadəçi</SelectItem>
                  <SelectItem value="Moderator">Moderator</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Status</label>
              <Select value={form.status || "aktiv"} onValueChange={v => update("status", v)}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="aktiv">Aktiv</SelectItem>
                  <SelectItem value="bloklanmis">Bloklanmış</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Təsdiqlənmiş</label>
              <Select value={form.verified ? "yes" : "no"} onValueChange={v => update("verified", v === "yes")}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Bəli ✓</SelectItem>
                  <SelectItem value="no">Xeyr</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-2 pt-2 border-t border-border">
            <Button className="flex-1 bg-admin-accent text-accent-foreground hover:bg-admin-accent/90" onClick={() => {
              onSave(form as UserData);
              toast({ title: "✅ İstifadəçi yeniləndi", description: `#${user.id} bütün məlumatları yeniləndi` });
            }}>
              <Save size={14} className="mr-1" /> Yadda saxla
            </Button>
            <Button variant="outline" onClick={onClose}>Ləğv</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function UserDetailDialog({ user, open, onClose, onBlock, onUnblock, onEdit }: {
  user: UserData | null;
  open: boolean;
  onClose: () => void;
  onBlock: (id: number) => void;
  onUnblock: (id: number) => void;
  onEdit: (user: UserData) => void;
}) {
  const [tab, setTab] = useState(0);
  const [msgMode, setMsgMode] = useState(false);
  const [msg, setMsg] = useState("");

  if (!user) return null;

  const risk = user.riskProfile;

  const handleSendMsg = () => {
    if (!msg.trim()) return;
    toast({ title: "📧 Mesaj göndərildi", description: `${user.name} — ${msg.slice(0, 50)}...` });
    setMsg("");
    setMsgMode(false);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 flex-wrap">
            <span>İstifadəçi #{user.id}</span>
            <StatusBadge status={user.status} />
            <span className={`text-xs px-2 py-0.5 rounded font-medium ${roleColor[user.role]}`}>{user.role}</span>
            {user.verified && <span className="text-xs bg-admin-info/10 text-admin-info px-2 py-0.5 rounded">✓ Təsdiqlənmiş</span>}
            {risk && (
              <span className={cn("text-[10px] px-2 py-0.5 rounded font-medium", riskLevelConfig[risk.riskLevel].bgClass)}>
                ⚠ Risk: {risk.riskScore}/100
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {/* Risk alert */}
          {risk && risk.riskScore >= 25 && (
            <div className={cn("rounded-lg border p-3 space-y-2 animate-fade-in",
              risk.riskLevel === "kritik" ? "bg-admin-danger/5 border-admin-danger/30" :
              risk.riskLevel === "yüksək" ? "bg-admin-danger/5 border-admin-danger/20" :
              "bg-admin-warning/5 border-admin-warning/20"
            )}>
              <div className="flex items-center gap-2">
                <AlertTriangle size={14} className={riskLevelConfig[risk.riskLevel].class} />
                <span className={cn("text-sm font-semibold", riskLevelConfig[risk.riskLevel].class)}>
                  {riskLevelConfig[risk.riskLevel].label} — {risk.riskScore}/100
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{risk.recommendation}</p>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {risk.flags.map((f, i) => (
                  <div key={i} className="flex items-center gap-1 text-[10px] bg-card rounded px-2 py-1 border border-border">
                    <span className={cn("w-1.5 h-1.5 rounded-full",
                      f.severity === "high" ? "bg-admin-danger" : f.severity === "medium" ? "bg-admin-warning" : "bg-muted-foreground"
                    )} />
                    <span className="font-medium">{riskFlagConfig[f.type].label}:</span>
                    <span className="text-muted-foreground">{f.message}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="flex gap-4 items-start">
            <div className="w-16 h-16 rounded-full bg-admin-accent flex items-center justify-center text-xl font-bold text-accent-foreground shrink-0">{user.name[0]}</div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold">{user.name}</h3>
              {user.bio && <p className="text-sm text-muted-foreground">{user.bio}</p>}
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Mail size={12} /> {user.email}</span>
                <span className="flex items-center gap-1"><Phone size={12} /> {user.phone}</span>
                <span className="flex items-center gap-1"><MapPin size={12} /> {user.location}</span>
                <span className="flex items-center gap-1"><Calendar size={12} /> Qeydiyyat: {user.date}</span>
                <span className="flex items-center gap-1"><Clock size={12} /> Son aktivlik: {user.lastActive}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {[
              { label: "Elanlar", value: user.ads, icon: FileText, color: "text-admin-info" },
              { label: "Xərclənib", value: `${user.totalSpent} ₼`, icon: CreditCard, color: "text-admin-success" },
              { label: "Baxışlar", value: user.userAds.reduce((s, a) => s + a.views, 0).toLocaleString(), icon: Eye, color: "text-admin-accent" },
              { label: "Rol", value: user.role, icon: Shield, color: "text-muted-foreground" },
            ].map((s) => (
              <div key={s.label} className="bg-muted/30 rounded-lg p-3 text-center">
                <s.icon size={16} className={cn("mx-auto mb-1", s.color)} />
                <p className="text-lg font-bold">{s.value}</p>
                <p className="text-[10px] text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-1 border-b border-border">
            {profileTabs.map((t, i) => (
              <button key={t} onClick={() => setTab(i)} className={cn("px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors", tab === i ? "border-admin-accent text-foreground" : "border-transparent text-muted-foreground hover:text-foreground")}>
                {t}
                {i === 1 && <span className="ml-1 text-[10px] bg-muted px-1.5 py-0.5 rounded-full">{user.userAds.length}</span>}
                {i === 2 && <span className="ml-1 text-[10px] bg-muted px-1.5 py-0.5 rounded-full">{user.payments.length}</span>}
              </button>
            ))}
          </div>

          <div className="min-h-[200px]">
            {tab === 0 && (
              <div className="grid grid-cols-2 gap-4 animate-fade-in">
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase">Əsas məlumatlar</h4>
                  {[
                    { label: "Ad", value: user.name },
                    { label: "Email", value: user.email },
                    { label: "Telefon", value: user.phone },
                    { label: "Lokasiya", value: user.location },
                    { label: "Qeydiyyat tarixi", value: user.date },
                    { label: "Son aktivlik", value: user.lastActive },
                  ].map(f => (
                    <div key={f.label} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{f.label}:</span>
                      <span className="font-medium">{f.value}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase">Statistika</h4>
                  {[
                    { label: "Ümumi elanlar", value: user.ads },
                    { label: "Aktiv elanlar", value: user.userAds.filter(a => a.status === "aktiv").length },
                    { label: "Gözləmədə", value: user.userAds.filter(a => a.status === "gozlemede").length },
                    { label: "Ümumi xərc", value: `${user.totalSpent} ₼` },
                    { label: "Ödəniş sayı", value: user.payments.length },
                  ].map(f => (
                    <div key={f.label} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{f.label}:</span>
                      <span className="font-medium">{String(f.value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {tab === 1 && (
              <div className="animate-fade-in">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-border text-muted-foreground text-left"><th className="pb-2 font-medium">ID</th><th className="pb-2 font-medium">Başlıq</th><th className="pb-2 font-medium">Qiymət</th><th className="pb-2 font-medium">Baxış</th><th className="pb-2 font-medium">Status</th><th className="pb-2 font-medium">Tarix</th></tr></thead>
                  <tbody>
                    {user.userAds.map(ad => (
                      <tr key={ad.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                        <td className="py-2.5 text-muted-foreground">#{ad.id}</td>
                        <td className="py-2.5"><div className="flex items-center gap-2"><div className="w-7 h-7 bg-muted rounded shrink-0" /><span className="font-medium text-xs">{ad.title}</span></div></td>
                        <td className="py-2.5 font-medium tabular-nums text-xs">{ad.price.toLocaleString()} ₼</td>
                        <td className="py-2.5 text-muted-foreground tabular-nums text-xs">{ad.views.toLocaleString()}</td>
                        <td className="py-2.5"><StatusBadge status={ad.status} /></td>
                        <td className="py-2.5 text-muted-foreground text-xs">{ad.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {tab === 2 && (
              <div className="animate-fade-in">
                <div className="flex items-center justify-between mb-3"><p className="text-xs text-muted-foreground">Ümumi xərc: <span className="font-semibold text-foreground">{user.totalSpent} ₼</span></p></div>
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-border text-muted-foreground text-left"><th className="pb-2 font-medium">ID</th><th className="pb-2 font-medium">Xidmət</th><th className="pb-2 font-medium">Məbləğ</th><th className="pb-2 font-medium">Status</th><th className="pb-2 font-medium">Tarix</th></tr></thead>
                  <tbody>
                    {user.payments.map(p => (
                      <tr key={p.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                        <td className="py-2.5 text-muted-foreground">#{p.id}</td>
                        <td className="py-2.5 font-medium">{p.service}</td>
                        <td className="py-2.5 font-medium tabular-nums">{p.amount} ₼</td>
                        <td className="py-2.5"><StatusBadge status={p.status} /></td>
                        <td className="py-2.5 text-muted-foreground text-xs">{p.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {tab === 3 && (
              <div className="space-y-0 animate-fade-in">
                {user.activity.map((a, i) => (
                  <div key={i} className="flex gap-3 py-2.5 border-b border-border/50 last:border-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-admin-accent mt-2 shrink-0" />
                    <div className="flex-1 min-w-0"><p className="text-sm font-medium">{a.action}</p><p className="text-xs text-muted-foreground">{a.detail}</p></div>
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap font-mono">{a.date}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {msgMode && (
            <div className="space-y-2 animate-fade-in border-t border-border pt-3">
              <h4 className="text-sm font-medium">Mesaj göndər — {user.name}</h4>
              <Textarea value={msg} onChange={e => setMsg(e.target.value)} placeholder="Mesajınızı yazın..." rows={3} />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSendMsg} className="bg-admin-accent text-accent-foreground hover:bg-admin-accent/90"><Send size={14} className="mr-1" /> Göndər</Button>
                <Button size="sm" variant="outline" onClick={() => { setMsgMode(false); setMsg(""); }}>Ləğv</Button>
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-2 border-t border-border">
            {!msgMode && <Button size="sm" variant="outline" onClick={() => setMsgMode(true)}><Mail size={14} className="mr-1" /> Mesaj göndər</Button>}
            <Button size="sm" variant="outline" onClick={() => { onClose(); onEdit(user); }}><Edit size={14} className="mr-1" /> Tam Redaktə</Button>
            {user.status === "aktiv" ? (
              <Button size="sm" variant="outline" className="text-admin-danger border-admin-danger/30 hover:bg-admin-danger/5" onClick={() => onBlock(user.id)}><Ban size={14} className="mr-1" /> Blokla</Button>
            ) : (
              <Button size="sm" variant="outline" className="text-admin-success border-admin-success/30 hover:bg-admin-success/5" onClick={() => onUnblock(user.id)}><Shield size={14} className="mr-1" /> Bloku aç</Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function IstifadecilerPage() {
  const [users, setUsers] = useState(mockUsers);
  const [detailUser, setDetailUser] = useState<UserData | null>(null);
  const [editUser, setEditUser] = useState<UserData | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDirState] = useState<SortDir>(null);
  const [aiScanning, setAiScanning] = useState(false);
  const [aiScanDone, setAiScanDone] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [showRiskPanel, setShowRiskPanel] = useState(false);
  const perPage = 10;

  const handleAiScan = () => {
    setAiScanning(true);
    setScanProgress(0);
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setAiScanning(false);
          setAiScanDone(true);
          setShowRiskPanel(true);
          setUsers(prev => prev.map(u => ({ ...u, riskProfile: analyzeUserRisk(u) })));
          const analyzed = users.map(u => analyzeUserRisk(u));
          const critical = analyzed.filter(r => r.riskLevel === "kritik").length;
          const high = analyzed.filter(r => r.riskLevel === "yüksək").length;
          toast({
            title: "🤖 AI Risk Analizi tamamlandı",
            description: `${users.length} istifadəçi analiz edildi — ${critical} kritik, ${high} yüksək riskli`,
          });
          return 0;
        }
        return prev + Math.random() * 12 + 3;
      });
    }, 200);
  };

  const riskyUsers = users
    .filter(u => u.riskProfile && u.riskProfile.riskScore >= 25)
    .sort((a, b) => (b.riskProfile?.riskScore || 0) - (a.riskProfile?.riskScore || 0));

  const handleSort = (key: string) => {
    if (sortKey === key) {
      const nd = nextSortDir(sortDir);
      setSortDirState(nd);
      if (!nd) setSortKey(null);
    } else {
      setSortKey(key);
      setSortDirState("asc");
    }
  };

  const fromStr = dateFrom ? format(dateFrom, "yyyy-MM-dd") : "";
  const toStr = dateTo ? format(dateTo, "yyyy-MM-dd") : "";

  let filtered = users.filter((u) => {
    if (roleFilter !== "all") {
      const roleMap: Record<string, string> = { user: "İstifadəçi", mod: "Moderator", admin: "Admin" };
      if (u.role !== roleMap[roleFilter]) return false;
    }
    if (statusFilter !== "all") {
      if (statusFilter === "aktiv" && u.status !== "aktiv") return false;
      if (statusFilter === "blok" && u.status !== "bloklanmis") return false;
    }
    if (!isInDateRange(u.date, fromStr, toStr)) return false;
    if (searchQuery && !u.name.toLowerCase().includes(searchQuery.toLowerCase()) && !u.email.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  if (sortKey && sortDir) {
    filtered = sortData(filtered, sortKey as keyof UserData, sortDir);
  }

  const pageCount = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const handleBlock = (id: number) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: "bloklanmis" as const } : u));
    setDetailUser(null);
    toast({ title: "🚫 İstifadəçi bloklandı", description: `İstifadəçi #${id} bloklandı` });
  };

  const handleUnblock = (id: number) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: "aktiv" as const } : u));
    setDetailUser(null);
    toast({ title: "✅ Blok açıldı", description: `İstifadəçi #${id} aktivləşdirildi` });
  };

  const handleSaveEdit = (updatedUser: UserData) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    setEditUser(null);
    setDetailUser(null);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Ümumi", value: users.length, color: "text-admin-info" },
          { label: "Aktiv", value: users.filter(u => u.status === "aktiv").length, color: "text-admin-success" },
          { label: "Bloklanmış", value: users.filter(u => u.status === "bloklanmis").length, color: "text-admin-danger" },
          { label: "Admin/Mod", value: users.filter(u => u.role !== "İstifadəçi").length, color: "text-admin-accent" },
        ].map(s => (
          <div key={s.label} className="bg-card rounded-lg border border-border p-3 text-center">
            <p className={cn("text-xl font-bold", s.color)}>{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-lg border border-border p-4 flex flex-wrap gap-3 items-end">
        <Input placeholder="Ad və ya email axtar..." className="h-9 flex-1 min-w-[200px]" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        <Select value={roleFilter} onValueChange={v => { setRoleFilter(v); setCurrentPage(1); }}>
          <SelectTrigger className="w-[130px] h-9"><SelectValue placeholder="Rol" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Hamısı</SelectItem>
            <SelectItem value="user">İstifadəçi</SelectItem>
            <SelectItem value="mod">Moderator</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={v => { setStatusFilter(v); setCurrentPage(1); }}>
          <SelectTrigger className="w-[130px] h-9"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Hamısı</SelectItem>
            <SelectItem value="aktiv">Aktiv</SelectItem>
            <SelectItem value="blok">Bloklanmış</SelectItem>
          </SelectContent>
        </Select>
        <DateRangeFilter dateFrom={dateFrom} dateTo={dateTo} onDateFromChange={d => { setDateFrom(d); setCurrentPage(1); }} onDateToChange={d => { setDateTo(d); setCurrentPage(1); }} />
        <ExcelExportButton onClick={() => exportToExcel(filtered, [
          { key: "id", label: "ID" },
          { key: "name", label: "Ad" },
          { key: "email", label: "Email" },
          { key: "phone", label: "Telefon" },
          { key: "ads", label: "Elan sayı" },
          { key: "date", label: "Qeydiyyat" },
          { key: "role", label: "Rol" },
          { key: "status", label: "Status" },
          { key: "totalSpent", label: "Xərc" },
        ], "istifadeciler")} />
        {(roleFilter !== "all" || statusFilter !== "all" || searchQuery || dateFrom || dateTo) && (
          <Button size="sm" variant="ghost" className="text-xs" onClick={() => { setRoleFilter("all"); setStatusFilter("all"); setSearchQuery(""); setDateFrom(undefined); setDateTo(undefined); }}>
            <X size={12} className="mr-1" /> Sıfırla
          </Button>
        )}
      </div>

      <div className="text-xs text-muted-foreground">{filtered.length} nəticə</div>

      <div className="bg-card rounded-lg border border-border overflow-x-auto">
        <table className="min-w-[850px] w-full text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground text-left bg-muted/30">
              <SortableHeader label="ID" sortKey="id" currentSort={sortKey} currentDir={sortDir} onSort={handleSort} className="w-[50px]" />
              <SortableHeader label="Ad" sortKey="name" currentSort={sortKey} currentDir={sortDir} onSort={handleSort} />
              <SortableHeader label="Email" sortKey="email" currentSort={sortKey} currentDir={sortDir} onSort={handleSort} />
              <th className="p-3 font-medium w-[120px]">Telefon</th>
              <SortableHeader label="Elan" sortKey="ads" currentSort={sortKey} currentDir={sortDir} onSort={handleSort} className="w-[50px]" />
              <SortableHeader label="Qeydiyyat" sortKey="date" currentSort={sortKey} currentDir={sortDir} onSort={handleSort} className="w-[85px]" />
              <SortableHeader label="Rol" sortKey="role" currentSort={sortKey} currentDir={sortDir} onSort={handleSort} className="w-[75px]" />
              <th className="p-3 font-medium w-[70px]">Status</th>
              <th className="p-3 font-medium w-[120px]">Əməliyyat</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map(u => (
              <tr key={u.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors cursor-pointer" onClick={() => setDetailUser(u)}>
                <td className="p-3 text-muted-foreground text-xs">#{u.id}</td>
                <td className="p-3 font-medium">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-admin-accent flex items-center justify-center text-[10px] font-bold text-accent-foreground shrink-0">{u.name[0]}</div>
                    <div className="min-w-0">
                      <span className="text-xs block truncate">{u.name}</span>
                      {u.verified && <span className="text-admin-info text-[9px]">✓</span>}
                    </div>
                  </div>
                </td>
                <td className="p-3 text-muted-foreground text-xs truncate max-w-[140px]">{u.email}</td>
                <td className="p-3 text-muted-foreground text-[11px] font-mono">{u.phone}</td>
                <td className="p-3 tabular-nums text-xs">{u.ads}</td>
                <td className="p-3 text-muted-foreground text-[11px]">{u.date}</td>
                <td className="p-3"><span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${roleColor[u.role]}`}>{u.role}</span></td>
                <td className="p-3"><StatusBadge status={u.status} /></td>
                <td className="p-3" onClick={e => e.stopPropagation()}>
                  <div className="flex gap-0.5">
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setDetailUser(u)}><Eye size={12} /></Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setEditUser(u)}><Edit size={12} /></Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-admin-danger" onClick={() => u.status === "aktiv" ? handleBlock(u.id) : handleUnblock(u.id)}><Ban size={12} /></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span className="text-xs">{filtered.length} istifadəçi</span>
        <div className="flex gap-1 items-center">
          <Button variant="outline" size="icon" className="h-8 w-8" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}><ChevronLeft size={14} /></Button>
          {Array.from({ length: Math.min(pageCount, 5) }, (_, i) => i + 1).map(p => (
            <Button key={p} variant={p === currentPage ? "default" : "outline"} size="sm" className="h-8 w-8" onClick={() => setCurrentPage(p)}>{p}</Button>
          ))}
          <Button variant="outline" size="icon" className="h-8 w-8" disabled={currentPage >= pageCount} onClick={() => setCurrentPage(p => p + 1)}><ChevronRight size={14} /></Button>
        </div>
      </div>

      <UserDetailDialog user={detailUser} open={!!detailUser} onClose={() => setDetailUser(null)} onBlock={handleBlock} onUnblock={handleUnblock} onEdit={(u) => { setDetailUser(null); setEditUser(u); }} />
      <UserEditDialog user={editUser} open={!!editUser} onClose={() => setEditUser(null)} onSave={handleSaveEdit} />
    </div>
  );
}
