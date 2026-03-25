import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Search, Eye, Check, X, Trash2, Edit, Bot, Filter, Calendar, ChevronLeft, ChevronRight, Crown, Zap, ArrowUp, Star, Save, ImagePlus, XCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { useSearchParams } from "react-router-dom";
import { cn } from "@/lib/utils";

interface Ad {
  id: number;
  title: string;
  user: string;
  userEmail: string;
  userPhone: string;
  userAds: number;
  category: string;
  subcategory: string;
  price: number;
  currency: string;
  views: number;
  status: "aktiv" | "gozlemede" | "redd" | "silinmis" | "vip";
  date: string;
  aiFlag: boolean;
  aiReason?: string;
  description: string;
  location: string;
  images: string[];
  contactName: string;
  featured: boolean;
  promotion?: "vip" | "premium" | "ireli" | null;
  promotionExpiry?: string;
}

const mockAds: Ad[] = Array.from({ length: 25 }, (_, i) => ({
  id: 10000 + i,
  title: [
    "Mercedes C220d, 2019, 45.000 km",
    "3 otaqlı mənzil, Nəsimi r., 90 m²",
    "iPhone 15 Pro Max 256GB Natural Titanium",
    "Samsung QN55Q80C 55\" QLED 4K TV",
    "BMW X5 xDrive30d M Sport, 2021",
    "2 otaqlı mənzil, Yasamal, 65 m²",
    "MacBook Pro 14\" M3 Pro 18GB",
    "Toyota Camry 2.5 Hybrid, 2023",
    "Ofis mebeli dəsti — stol + 4 stul",
    "Xiaomi 14 Ultra 512GB",
  ][i % 10],
  user: ["Əli Məmmədov", "Leyla Həsənova", "Rəşad Kərimov", "Kamran Nəsirov", "Nicat Vəliyev", "Günel Əhmədova", "Orxan Babayev", "Səbinə İsmayılova"][i % 8],
  userEmail: ["ali@mail.az", "leyla@gmail.com", "rashad@mail.az", "kamran@outlook.com", "nicat@mail.az", "gunel@gmail.com", "orxan@mail.az", "sebine@yahoo.com"][i % 8],
  userPhone: "+994 50 " + String(300 + i * 11).slice(0, 3) + " " + String(20 + i * 7).padStart(2, "0") + " " + String(40 + i * 3).padStart(2, "0"),
  userAds: Math.floor(3 + Math.random() * 40),
  category: ["Nəqliyyat", "Daşınmaz əmlak", "Elektronika", "Elektronika", "Nəqliyyat", "Daşınmaz əmlak", "Elektronika", "Nəqliyyat", "Ev və bağ", "Elektronika"][i % 10],
  subcategory: ["Avtomobil", "Mənzil", "Telefon", "TV", "Avtomobil", "Mənzil", "Kompüter", "Avtomobil", "Mebel", "Telefon"][i % 10],
  price: [25000, 85000, 2800, 1200, 62000, 55000, 4200, 48000, 800, 1950][i % 10],
  currency: "AZN",
  views: Math.floor(50 + Math.random() * 5000),
  status: (["gozlemede", "gozlemede", "aktiv", "gozlemede", "aktiv", "vip", "gozlemede", "redd", "gozlemede", "aktiv"] as const)[i % 10],
  date: "2026-03-" + String(23 - (i % 10)).padStart(2, "0") + " " + String(8 + (i % 14)).padStart(2, "0") + ":" + String(10 + i * 3).slice(0, 2),
  aiFlag: i % 5 === 0,
  aiReason: i % 5 === 0 ? ["Şübhəli qiymət — bazar dəyərindən 70% aşağı", "Dublikat elan — #10032 ilə eyni", "Spam sözlər aşkarlandı", "Uyğunsuz şəkil aşkarlandı", "Saxta əlaqə nömrəsi"][i % 5] : undefined,
  description: [
    "Mercedes-Benz C220d, 2019-cu il buraxılış, 45.000 km yürüş, dizel mühərrik, avtomatik sürətlər qutusu. Tam texniki baxışdan keçib.",
    "Nəsimi rayonu, 28 May metrosuna yaxın. 16/9 mərtəbə, sahə 90 m², 3 otaq, təmirli. Qaz, su, işıq daimi.",
    "iPhone 15 Pro Max, 256GB, Natural Titanium rəngi. Yeni, qutuda. Apple Azərbaycan zəmanəti 1 il.",
    "Samsung 55 düym QLED 4K Smart TV. 2024-cü il modeli. Zəmanət 2 il.",
    "BMW X5 xDrive30d M Sport paket, 2021, 32.000 km. Panorama, Harman Kardon, head-up display.",
  ][i % 5],
  location: ["Bakı, Nəsimi", "Bakı, Yasamal", "Bakı, Səbail", "Bakı, Xətai", "Sumqayıt", "Gəncə"][i % 6],
  images: Array.from({ length: 3 + (i % 5) }, (_, j) => `img_${i}_${j}`),
  contactName: ["Əli", "Leyla", "Rəşad", "Kamran", "Nicat"][i % 5],
  featured: i % 6 === 0,
  promotion: ([null, "vip", null, "premium", null, "ireli", null, null, null, null] as const)[i % 10],
  promotionExpiry: i % 4 === 1 ? "2026-04-" + String(5 + i).padStart(2, "0") : undefined,
}));

const promotionConfig = {
  vip: { label: "VIP", icon: Crown, color: "bg-admin-accent/15 text-admin-accent", price: "5 ₼/gün" },
  premium: { label: "Premium", icon: Star, color: "bg-admin-info/10 text-admin-info", price: "10 ₼/gün" },
  ireli: { label: "İrəli çək", icon: ArrowUp, color: "bg-admin-success/10 text-admin-success", price: "2 ₼" },
};

function AdEditDialog({ ad, open, onClose, onSave }: {
  ad: Ad | null;
  open: boolean;
  onClose: () => void;
  onSave: (ad: Ad) => void;
}) {
  const [form, setForm] = useState<Partial<Ad>>({});

  useEffect(() => {
    if (ad) setForm({ ...ad });
  }, [ad]);

  if (!ad) return null;

  const update = (key: keyof Ad, value: any) => setForm(prev => ({ ...prev, [key]: value }));

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-auto">
        <DialogHeader>
          <DialogTitle>Elan #{ad.id} — Redaktə</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Başlıq</label>
            <Input value={form.title || ""} onChange={e => update("title", e.target.value)} className="mt-1" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">Qiymət</label>
              <Input type="number" value={form.price || 0} onChange={e => update("price", Number(e.target.value))} className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">Valyuta</label>
              <Select value={form.currency || "AZN"} onValueChange={v => update("currency", v)}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="AZN">AZN</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">Kateqoriya</label>
              <Select value={form.category || ""} onValueChange={v => update("category", v)}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Nəqliyyat", "Daşınmaz əmlak", "Elektronika", "Ev və bağ"].map(c => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Lokasiya</label>
              <Input value={form.location || ""} onChange={e => update("location", e.target.value)} className="mt-1" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Təsvir</label>
            <Textarea value={form.description || ""} onChange={e => update("description", e.target.value)} className="mt-1" rows={4} />
          </div>

          {/* Images Section */}
          <div className="border-t border-border pt-4">
            <label className="text-sm font-semibold flex items-center gap-2 mb-3">
              <ImagePlus size={14} className="text-admin-accent" /> Şəkillər ({(form.images || []).length})
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
              {(form.images || []).map((img, idx) => {
                const hue = ((img.charCodeAt(4) || 0) * 37 + idx * 60) % 360;
                return (
                  <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden border border-border">
                    <div
                      className="w-full h-full flex items-center justify-center text-[10px] text-white font-mono"
                      style={{ background: `hsl(${hue}, 45%, 55%)` }}
                    >
                      {idx + 1}
                    </div>
                    <button
                      type="button"
                      onClick={() => update("images", (form.images || []).filter((_, j) => j !== idx))}
                      className="absolute top-0.5 right-0.5 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <XCircle size={14} />
                    </button>
                  </div>
                );
              })}
              <button
                type="button"
                onClick={() => {
                  const newImg = `img_new_${Date.now()}`;
                  update("images", [...(form.images || []), newImg]);
                  toast({ title: "🖼️ Şəkil əlavə edildi", description: "Yeni şəkil uğurla yükləndi" });
                }}
                className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-admin-accent/50 flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-admin-accent transition-colors"
              >
                <ImagePlus size={18} />
                <span className="text-[10px]">Əlavə et</span>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">Status</label>
              <Select value={form.status || "gozlemede"} onValueChange={v => update("status", v)}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="aktiv">Aktiv</SelectItem>
                  <SelectItem value="gozlemede">Gözləmədə</SelectItem>
                  <SelectItem value="redd">Rədd</SelectItem>
                  <SelectItem value="vip">VIP</SelectItem>
                  <SelectItem value="silinmis">Silinmiş</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Əlaqə adı</label>
              <Input value={form.contactName || ""} onChange={e => update("contactName", e.target.value)} className="mt-1" />
            </div>
          </div>

          {/* Promotion Section */}
          <div className="border-t border-border pt-4">
            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2"><Zap size={14} className="text-admin-accent" /> Elanı irəli çək / VIP / Premium</h4>
            <div className="grid grid-cols-3 gap-2">
              {(Object.entries(promotionConfig) as [keyof typeof promotionConfig, typeof promotionConfig[keyof typeof promotionConfig]][]).map(([key, cfg]) => (
                <button
                  key={key}
                  onClick={() => update("promotion", form.promotion === key ? null : key)}
                  className={cn(
                    "p-3 rounded-lg border-2 transition-all text-center",
                    form.promotion === key ? "border-admin-accent bg-admin-accent/5" : "border-border hover:border-admin-accent/40"
                  )}
                >
                  <cfg.icon size={20} className="mx-auto mb-1" />
                  <p className="text-xs font-semibold">{cfg.label}</p>
                  <p className="text-[10px] text-muted-foreground">{cfg.price}</p>
                </button>
              ))}
            </div>
            {form.promotion && (
              <div className="mt-2">
                <label className="text-xs text-muted-foreground">Bitmə tarixi</label>
                <Input type="date" value={form.promotionExpiry || ""} onChange={e => update("promotionExpiry", e.target.value)} className="mt-1 h-8" />
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            <Button className="flex-1 bg-admin-accent text-accent-foreground hover:bg-admin-accent/90" onClick={() => {
              onSave(form as Ad);
              toast({ title: "✅ Elan yeniləndi", description: `#${ad.id} uğurla redaktə edildi` });
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

function PromotionDialog({ ad, open, onClose, onApply }: {
  ad: Ad | null;
  open: boolean;
  onClose: () => void;
  onApply: (id: number, type: "vip" | "premium" | "ireli", days: number) => void;
}) {
  const [type, setType] = useState<"vip" | "premium" | "ireli">("vip");
  const [days, setDays] = useState(7);

  if (!ad) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Zap size={18} className="text-admin-accent" /> Elanı yüksəlt — #{ad.id}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground truncate">{ad.title}</p>
          <div className="grid grid-cols-3 gap-2">
            {(Object.entries(promotionConfig) as [keyof typeof promotionConfig, typeof promotionConfig[keyof typeof promotionConfig]][]).map(([key, cfg]) => (
              <button
                key={key}
                onClick={() => setType(key)}
                className={cn(
                  "p-4 rounded-lg border-2 transition-all text-center",
                  type === key ? "border-admin-accent bg-admin-accent/5 shadow-sm" : "border-border hover:border-admin-accent/40"
                )}
              >
                <cfg.icon size={24} className={cn("mx-auto mb-2", type === key ? "text-admin-accent" : "text-muted-foreground")} />
                <p className="text-sm font-semibold">{cfg.label}</p>
                <p className="text-xs text-muted-foreground">{cfg.price}</p>
              </button>
            ))}
          </div>
          <div>
            <label className="text-sm font-medium">Müddət (gün)</label>
            <div className="flex gap-2 mt-1">
              {[3, 7, 14, 30].map(d => (
                <button
                  key={d}
                  onClick={() => setDays(d)}
                  className={cn(
                    "px-3 py-1.5 rounded-md text-sm font-medium border transition-colors",
                    days === d ? "bg-admin-accent text-accent-foreground border-admin-accent" : "border-border hover:bg-muted"
                  )}
                >
                  {d} gün
                </button>
              ))}
            </div>
          </div>
          <div className="bg-muted/30 rounded-lg p-3 text-center">
            <p className="text-xs text-muted-foreground">Ümumi</p>
            <p className="text-lg font-bold">{type === "ireli" ? "2 ₼" : `${type === "vip" ? 5 * days : 10 * days} ₼`}</p>
          </div>
          <Button className="w-full bg-admin-accent text-accent-foreground hover:bg-admin-accent/90" onClick={() => onApply(ad.id, type, days)}>
            <Zap size={14} className="mr-1" /> Aktivləşdir
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function AdDetailDialog({ ad, open, onClose, onApprove, onReject, onEdit, onPromote }: {
  ad: Ad | null;
  open: boolean;
  onClose: () => void;
  onApprove: (id: number) => void;
  onReject: (id: number, reason: string) => void;
  onEdit: (ad: Ad) => void;
  onPromote: (ad: Ad) => void;
}) {
  const [rejectMode, setRejectMode] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  if (!ad) return null;

  const handleReject = () => {
    if (!rejectReason.trim()) {
      toast({ title: "Xəta", description: "Rədd səbəbi yazılmalıdır", variant: "destructive" });
      return;
    }
    onReject(ad.id, rejectReason);
    setRejectMode(false);
    setRejectReason("");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 flex-wrap">
            <span>Elan #{ad.id}</span>
            <StatusBadge status={ad.status} />
            {ad.promotion && (
              <span className={cn("text-xs px-2 py-0.5 rounded font-medium", promotionConfig[ad.promotion].color)}>
                {promotionConfig[ad.promotion].label}
              </span>
            )}
            {ad.aiFlag && (
              <span className="text-xs bg-admin-warning/10 text-admin-warning px-2 py-1 rounded font-medium flex items-center gap-1">
                <Bot size={12} /> AI Xəbərdarlıq
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {ad.aiFlag && ad.aiReason && (
            <div className="bg-admin-warning/5 border border-admin-warning/20 rounded-lg p-3 flex items-start gap-2">
              <Bot size={16} className="text-admin-warning mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-admin-warning">AI Moderasiya Xəbərdarlığı</p>
                <p className="text-xs text-muted-foreground mt-0.5">{ad.aiReason}</p>
              </div>
            </div>
          )}

          {/* Promotion badge */}
          {ad.promotion && (
            <div className={cn("rounded-lg p-3 flex items-center justify-between", promotionConfig[ad.promotion].color)}>
              <div className="flex items-center gap-2">
                {(() => { const Icon = promotionConfig[ad.promotion!].icon; return <Icon size={16} />; })()}
                <span className="text-sm font-medium">{promotionConfig[ad.promotion].label} aktiv</span>
              </div>
              {ad.promotionExpiry && <span className="text-xs">Bitmə: {ad.promotionExpiry}</span>}
            </div>
          )}

          <div>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Şəkillər ({ad.images.length})</h4>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {ad.images.map((_, j) => (
                <div key={j} className="w-24 h-24 bg-muted rounded-lg shrink-0 flex items-center justify-center text-xs text-muted-foreground">
                  Şəkil {j + 1}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div><h4 className="text-xs font-semibold text-muted-foreground uppercase">Başlıq</h4><p className="text-sm font-medium mt-0.5">{ad.title}</p></div>
              <div><h4 className="text-xs font-semibold text-muted-foreground uppercase">Kateqoriya</h4><p className="text-sm mt-0.5">{ad.category} → {ad.subcategory}</p></div>
              <div><h4 className="text-xs font-semibold text-muted-foreground uppercase">Qiymət</h4><p className="text-sm font-bold mt-0.5">{ad.price.toLocaleString()} ₼</p></div>
              <div><h4 className="text-xs font-semibold text-muted-foreground uppercase">Lokasiya</h4><p className="text-sm mt-0.5">{ad.location}</p></div>
              <div><h4 className="text-xs font-semibold text-muted-foreground uppercase">Tarix</h4><p className="text-sm text-muted-foreground mt-0.5">{ad.date}</p></div>
              <div><h4 className="text-xs font-semibold text-muted-foreground uppercase">Baxış sayı</h4><p className="text-sm mt-0.5 tabular-nums">{ad.views.toLocaleString()}</p></div>
            </div>

            <div className="bg-muted/30 rounded-lg p-4 space-y-3">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase">İstifadəçi məlumatları</h4>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-admin-accent flex items-center justify-center font-bold text-accent-foreground">{ad.user[0]}</div>
                <div>
                  <p className="text-sm font-medium">{ad.user}</p>
                  <p className="text-xs text-muted-foreground">{ad.userEmail}</p>
                </div>
              </div>
              <div className="text-sm space-y-1">
                <div className="flex justify-between"><span className="text-muted-foreground">Telefon:</span><span className="font-mono text-xs">{ad.userPhone}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Ümumi elanlar:</span><span className="font-medium">{ad.userAds}</span></div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-1">Təsvir</h4>
            <p className="text-sm leading-relaxed bg-muted/20 rounded-lg p-3">{ad.description}</p>
          </div>

          {rejectMode && (
            <div className="space-y-2 animate-fade-in">
              <h4 className="text-sm font-medium text-admin-danger">Rədd səbəbi:</h4>
              <Textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder="Rədd səbəbini yazın..." rows={3} className="border-admin-danger/30 focus:ring-admin-danger/30" />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleReject} className="bg-admin-danger text-primary-foreground hover:bg-admin-danger/90"><X size={14} className="mr-1" /> Rədd et</Button>
                <Button size="sm" variant="outline" onClick={() => { setRejectMode(false); setRejectReason(""); }}>Ləğv</Button>
              </div>
            </div>
          )}

          {!rejectMode && (
            <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
              {ad.status === "gozlemede" && (
                <>
                  <Button onClick={() => onApprove(ad.id)} className="bg-admin-success text-primary-foreground hover:bg-admin-success/90 flex-1">
                    <Check size={16} className="mr-1" /> Təsdiqlə
                  </Button>
                  <Button onClick={() => setRejectMode(true)} variant="outline" className="text-admin-danger border-admin-danger/30 hover:bg-admin-danger/5 flex-1">
                    <X size={16} className="mr-1" /> Rədd et
                  </Button>
                </>
              )}
              <Button variant="outline" onClick={() => { onClose(); onEdit(ad); }}>
                <Edit size={14} className="mr-1" /> Redaktə
              </Button>
              <Button variant="outline" className="text-admin-accent border-admin-accent/30 hover:bg-admin-accent/5" onClick={() => { onClose(); onPromote(ad); }}>
                <Zap size={14} className="mr-1" /> VIP/Premium/İrəli
              </Button>
              <Button variant="outline" className="text-admin-danger border-admin-danger/30 hover:bg-admin-danger/5" onClick={() => {
                onReject(ad.id, "Elan admin tərəfindən silindi");
              }}>
                <Trash2 size={14} className="mr-1" /> Sil
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function ElanlarPage() {
  const [ads, setAds] = useState(mockAds);
  const [selected, setSelected] = useState<number[]>([]);
  const [detailAd, setDetailAd] = useState<Ad | null>(null);
  const [editAd, setEditAd] = useState<Ad | null>(null);
  const [promoteAd, setPromoteAd] = useState<Ad | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState("20");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [promotionFilter, setPromotionFilter] = useState("all");
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const status = searchParams.get("status");
    if (status && ["aktiv", "gozlemede", "redd", "vip", "silinmis", "all"].includes(status)) {
      setStatusFilter(status);
      setCurrentPage(1);
    }
  }, [searchParams]);

  const toggleSelect = (id: number) => setSelected((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);

  const filteredAds = ads.filter((ad) => {
    if (statusFilter !== "all" && ad.status !== statusFilter) return false;
    if (categoryFilter !== "all") {
      const catMap: Record<string, string> = { transport: "Nəqliyyat", realestate: "Daşınmaz əmlak", electronics: "Elektronika", evbag: "Ev və bağ" };
      if (ad.category !== catMap[categoryFilter]) return false;
    }
    if (promotionFilter !== "all") {
      if (promotionFilter === "none" && ad.promotion) return false;
      if (promotionFilter !== "none" && ad.promotion !== promotionFilter) return false;
    }
    if (searchQuery && !ad.title.toLowerCase().includes(searchQuery.toLowerCase()) && !ad.user.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const pageCount = Math.max(1, Math.ceil(filteredAds.length / Number(perPage)));
  const paginatedAds = filteredAds.slice((currentPage - 1) * Number(perPage), currentPage * Number(perPage));

  const toggleAll = () => setSelected(selected.length === paginatedAds.length ? [] : paginatedAds.map((a) => a.id));

  const handleApprove = (id: number) => {
    setAds((prev) => prev.map((a) => a.id === id ? { ...a, status: "aktiv" as const } : a));
    setDetailAd(null);
    toast({ title: "✅ Elan təsdiqləndi", description: `Elan #${id} uğurla təsdiqləndi` });
  };

  const handleReject = (id: number, reason: string) => {
    setAds((prev) => prev.map((a) => a.id === id ? { ...a, status: "redd" as const } : a));
    setDetailAd(null);
    toast({ title: "❌ Elan rədd edildi", description: `Elan #${id}: ${reason}` });
  };

  const handleSaveEdit = (updatedAd: Ad) => {
    setAds(prev => prev.map(a => a.id === updatedAd.id ? updatedAd : a));
    setEditAd(null);
  };

  const handlePromotion = (id: number, type: "vip" | "premium" | "ireli", days: number) => {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + days);
    setAds(prev => prev.map(a => a.id === id ? {
      ...a,
      promotion: type,
      promotionExpiry: expiry.toISOString().split("T")[0],
      status: type === "vip" ? "vip" as const : a.status,
    } : a));
    setPromoteAd(null);
    toast({ title: `⚡ ${promotionConfig[type].label} aktivləşdirildi`, description: `Elan #${id} — ${days} gün müddətinə` });
  };

  const handleBulkApprove = () => {
    setAds((prev) => prev.map((a) => selected.includes(a.id) && a.status === "gozlemede" ? { ...a, status: "aktiv" as const } : a));
    toast({ title: "✅ Toplu təsdiq", description: `${selected.length} elan təsdiqləndi` });
    setSelected([]);
  };
  const handleBulkReject = () => {
    setAds((prev) => prev.map((a) => selected.includes(a.id) && a.status === "gozlemede" ? { ...a, status: "redd" as const } : a));
    toast({ title: "❌ Toplu rədd", description: `${selected.length} elan rədd edildi` });
    setSelected([]);
  };
  const handleBulkDelete = () => {
    setAds((prev) => prev.map((a) => selected.includes(a.id) ? { ...a, status: "silinmis" as const } : a));
    toast({ title: "🗑️ Silindi", description: `${selected.length} elan silindi` });
    setSelected([]);
  };

  const pendingCount = ads.filter((a) => a.status === "gozlemede").length;
  const vipCount = ads.filter(a => a.promotion === "vip").length;
  const premiumCount = ads.filter(a => a.promotion === "premium").length;

  return (
    <div className="space-y-3 sm:space-y-4 animate-fade-in">
      {pendingCount > 0 && (
        <div className="bg-admin-warning/5 border border-admin-warning/20 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-admin-warning/10 flex items-center justify-center shrink-0">
              <Filter size={14} className="text-admin-warning" />
            </span>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-medium">{pendingCount} elan təsdiq gözləyir</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground hidden sm:block">Gözləmədəki elanları nəzərdən keçirin</p>
            </div>
          </div>
          <Button size="sm" variant="outline" onClick={() => setStatusFilter("gozlemede")} className="border-admin-warning/30 text-admin-warning hover:bg-admin-warning/5 text-[10px] sm:text-xs h-7 sm:h-8 shrink-0">Göstər</Button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {[
          { label: "Ümumi", value: ads.length, color: "text-admin-info" },
          { label: "Aktiv", value: ads.filter(a => a.status === "aktiv").length, color: "text-admin-success" },
          { label: "Gözləmədə", value: pendingCount, color: "text-admin-warning" },
          { label: "VIP", value: vipCount, color: "text-admin-accent" },
          { label: "Premium", value: premiumCount, color: "text-admin-info" },
        ].map(s => (
          <div key={s.label} className="bg-card rounded-lg border border-border p-3 text-center">
            <p className={cn("text-xl font-bold", s.color)}>{s.value}</p>
            <p className="text-[10px] text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-card rounded-lg border border-border p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:items-end">
          <div className="flex-1">
            <Input placeholder="Axtar..." className="h-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Select value={statusFilter} onValueChange={v => { setStatusFilter(v); setCurrentPage(1); }}>
              <SelectTrigger className="w-full sm:w-[140px] h-9"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Hamısı ({ads.length})</SelectItem>
                <SelectItem value="aktiv">Aktiv</SelectItem>
                <SelectItem value="gozlemede">Gözləmədə</SelectItem>
                <SelectItem value="redd">Rədd</SelectItem>
                <SelectItem value="vip">VIP</SelectItem>
                <SelectItem value="silinmis">Silinmiş</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={v => { setCategoryFilter(v); setCurrentPage(1); }}>
              <SelectTrigger className="w-full sm:w-[140px] h-9"><SelectValue placeholder="Kateqoriya" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Hamısı</SelectItem>
                <SelectItem value="transport">Nəqliyyat</SelectItem>
                <SelectItem value="realestate">Daşınmaz əmlak</SelectItem>
                <SelectItem value="electronics">Elektronika</SelectItem>
                <SelectItem value="evbag">Ev və bağ</SelectItem>
              </SelectContent>
            </Select>
            <Select value={promotionFilter} onValueChange={v => { setPromotionFilter(v); setCurrentPage(1); }}>
              <SelectTrigger className="w-full sm:w-[130px] h-9"><SelectValue placeholder="Promosyon" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Hamısı</SelectItem>
                <SelectItem value="vip">VIP</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="ireli">İrəli</SelectItem>
                <SelectItem value="none">Adi</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {(statusFilter !== "all" || categoryFilter !== "all" || promotionFilter !== "all") && (
            <Button size="sm" variant="ghost" onClick={() => { setStatusFilter("all"); setCategoryFilter("all"); setPromotionFilter("all"); setSearchQuery(""); }} className="text-xs h-7">
              <X size={12} className="mr-1" /> Sıfırla
            </Button>
          )}
        </div>
      </div>

      {selected.length > 0 && (
        <div className="bg-admin-info/5 border border-admin-info/20 rounded-lg px-3 sm:px-4 py-2 flex flex-wrap items-center gap-2 text-sm animate-fade-in">
          <span className="font-medium text-xs">{selected.length} seçildi:</span>
          <Button size="sm" variant="outline" className="h-7 text-xs text-admin-success border-admin-success/30" onClick={handleBulkApprove}><Check size={12} className="mr-1" /> Təsdiqlə</Button>
          <Button size="sm" variant="outline" className="h-7 text-xs text-admin-danger border-admin-danger/30" onClick={handleBulkReject}><X size={12} className="mr-1" /> Rədd</Button>
          <Button size="sm" variant="outline" className="h-7 text-xs text-admin-danger border-admin-danger/30" onClick={handleBulkDelete}><Trash2 size={12} className="mr-1" /> Sil</Button>
          <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => setSelected([])}>Ləğv</Button>
        </div>
      )}

      <div className="text-xs text-muted-foreground">{filteredAds.length} nəticə tapıldı</div>

      {/* Mobile Card View */}
      <div className="sm:hidden space-y-2">
        {paginatedAds.map((ad) => (
          <div key={ad.id} onClick={() => setDetailAd(ad)} className={cn("bg-card rounded-lg border border-border p-3 cursor-pointer active:bg-muted/30 transition-colors", ad.status === "gozlemede" && "border-admin-warning/30")}>
            <div className="flex items-start gap-3">
              <input type="checkbox" checked={selected.includes(ad.id)} onChange={() => toggleSelect(ad.id)} className="rounded mt-1 shrink-0" onClick={(e) => e.stopPropagation()} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-medium truncate">{ad.title}</span>
                  <StatusBadge status={ad.status} />
                </div>
                <div className="flex items-center gap-2 mt-1.5 text-[11px] text-muted-foreground">
                  <span>{ad.user}</span><span>•</span><span className="font-medium text-foreground">{ad.price.toLocaleString()}₼</span>
                  {ad.promotion && <span className={cn("px-1 rounded text-[9px] font-medium", promotionConfig[ad.promotion].color)}>{promotionConfig[ad.promotion].label}</span>}
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                    <span>👁️ {ad.views > 999 ? `${(ad.views/1000).toFixed(0)}K` : ad.views}</span>
                    <span>{ad.date.split(" ")[0]}</span>
                  </div>
                  <div className="flex gap-0.5" onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-admin-accent" onClick={() => setPromoteAd(ad)}><Zap size={14} /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditAd(ad)}><Edit size={14} /></Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table */}
      <div className="hidden sm:block bg-card rounded-lg border border-border overflow-x-auto">
        <table className="w-full text-sm" style={{ minWidth: 850 }}>
          <thead>
            <tr className="border-b border-border text-muted-foreground text-left bg-muted/30 text-xs">
              <th className="px-2 py-2.5 w-7"><input type="checkbox" checked={selected.length === paginatedAds.length && paginatedAds.length > 0} onChange={toggleAll} className="rounded" /></th>
              <th className="px-2 py-2.5 font-medium w-12">ID</th>
              <th className="px-2 py-2.5 font-medium">Başlıq</th>
              <th className="px-2 py-2.5 font-medium w-20">İstifadəçi</th>
              <th className="px-2 py-2.5 font-medium w-16">Qiymət</th>
              <th className="px-2 py-2.5 font-medium w-16">Promosyon</th>
              <th className="px-2 py-2.5 font-medium w-10">👁️</th>
              <th className="px-2 py-2.5 font-medium w-16">Status</th>
              <th className="px-2 py-2.5 font-medium w-[72px]">Tarix</th>
              <th className="px-2 py-2.5 font-medium w-28">Əməliyyat</th>
            </tr>
          </thead>
          <tbody>
            {paginatedAds.map((ad) => (
              <tr key={ad.id} className={cn("border-b border-border/50 hover:bg-muted/20 transition-colors cursor-pointer", ad.status === "gozlemede" && "bg-admin-warning/[0.02]")} onClick={() => setDetailAd(ad)}>
                <td className="px-2 py-2" onClick={(e) => e.stopPropagation()}><input type="checkbox" checked={selected.includes(ad.id)} onChange={() => toggleSelect(ad.id)} className="rounded" /></td>
                <td className="px-2 py-2 text-muted-foreground text-[11px]">#{ad.id}</td>
                <td className="px-2 py-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <div className="w-6 h-6 bg-muted rounded shrink-0" />
                    <span className="font-medium text-xs truncate max-w-[180px]">{ad.title}</span>
                  </div>
                </td>
                <td className="px-2 py-2 text-[11px] truncate max-w-[75px]">{ad.user}</td>
                <td className="px-2 py-2 font-medium tabular-nums text-[11px]">{ad.price.toLocaleString()}₼</td>
                <td className="px-2 py-2">
                  {ad.promotion ? (
                    <span className={cn("text-[9px] px-1.5 py-0.5 rounded font-medium", promotionConfig[ad.promotion].color)}>{promotionConfig[ad.promotion].label}</span>
                  ) : <span className="text-[10px] text-muted-foreground">—</span>}
                </td>
                <td className="px-2 py-2 text-muted-foreground tabular-nums text-[11px]">{ad.views > 999 ? `${(ad.views/1000).toFixed(0)}K` : ad.views}</td>
                <td className="px-2 py-2"><StatusBadge status={ad.status} /></td>
                <td className="px-2 py-2 text-muted-foreground text-[10px] whitespace-nowrap">{ad.date}</td>
                <td className="px-2 py-2" onClick={(e) => e.stopPropagation()}>
                  <div className="flex gap-px">
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setDetailAd(ad)}><Eye size={11} /></Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setEditAd(ad)}><Edit size={11} /></Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-admin-accent" onClick={() => setPromoteAd(ad)}><Zap size={11} /></Button>
                    {ad.status === "gozlemede" && <Button variant="ghost" size="icon" className="h-6 w-6 text-admin-success" onClick={() => handleApprove(ad.id)}><Check size={11} /></Button>}
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-admin-danger" onClick={() => {
                      setAds((prev) => prev.map((a) => a.id === ad.id ? { ...a, status: "silinmis" as const } : a));
                      toast({ title: "🗑️ Silindi" });
                    }}><Trash2 size={11} /></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="text-xs hidden sm:inline">Səhifə başına:</span>
          <Select value={perPage} onValueChange={v => { setPerPage(v); setCurrentPage(1); }}>
            <SelectTrigger className="w-[70px] h-8"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-xs">{filteredAds.length} elan</span>
        </div>
        <div className="flex gap-1 items-center">
          <Button variant="outline" size="icon" className="h-8 w-8" disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}><ChevronLeft size={14} /></Button>
          {Array.from({ length: Math.min(pageCount, 5) }, (_, i) => i + 1).map((p) => (
            <Button key={p} variant={p === currentPage ? "default" : "outline"} size="sm" className="h-8 w-8" onClick={() => setCurrentPage(p)}>{p}</Button>
          ))}
          <Button variant="outline" size="icon" className="h-8 w-8" disabled={currentPage >= pageCount} onClick={() => setCurrentPage((p) => p + 1)}><ChevronRight size={14} /></Button>
        </div>
      </div>

      {/* Dialogs */}
      <AdDetailDialog ad={detailAd} open={!!detailAd} onClose={() => setDetailAd(null)} onApprove={handleApprove} onReject={handleReject} onEdit={setEditAd} onPromote={setPromoteAd} />
      <AdEditDialog ad={editAd} open={!!editAd} onClose={() => setEditAd(null)} onSave={handleSaveEdit} />
      <PromotionDialog ad={promoteAd} open={!!promoteAd} onClose={() => setPromoteAd(null)} onApply={handlePromotion} />
    </div>
  );
}
