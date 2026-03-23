import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Search, Eye, Check, X, Trash2, Edit, Bot, Filter, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

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
    "Mercedes-Benz C220d, 2019-cu il buraxılış, 45.000 km yürüş, dizel mühərrik, avtomatik sürətlər qutusu. Tam texniki baxışdan keçib. Yeni rezinlər, yağ dəyişdirilib. Kredit yoxdur, barter yoxdur. Qiymətdə endirim mümkündür.",
    "Nəsimi rayonu, 28 May metrosuna yaxın. 16/9 mərtəbə, sahə 90 m², 3 otaq, təmirli. Qaz, su, işıq daimi. Kupça var. Mebelli verilir.",
    "iPhone 15 Pro Max, 256GB, Natural Titanium rəngi. Yeni, qutuda. Apple Azərbaycan zəmanəti 1 il. Adapter və kabel daxildir.",
    "Samsung 55 düym QLED 4K Smart TV. 2024-cü il modeli. Zəmanət 2 il. Divara montaj pulsuz. Qutu açılmayıb.",
    "BMW X5 xDrive30d M Sport paket, 2021, 32.000 km. Panorama, Harman Kardon, head-up display. İdeal vəziyyətdə.",
  ][i % 5],
  location: ["Bakı, Nəsimi", "Bakı, Yasamal", "Bakı, Səbail", "Bakı, Xətai", "Sumqayıt", "Gəncə"][i % 6],
  images: Array.from({ length: 3 + (i % 5) }, (_, j) => `img_${i}_${j}`),
  contactName: ["Əli", "Leyla", "Rəşad", "Kamran", "Nicat"][i % 5],
  featured: i % 6 === 0,
}));

function AdDetailDialog({ ad, open, onClose, onApprove, onReject }: {
  ad: Ad | null;
  open: boolean;
  onClose: () => void;
  onApprove: (id: number) => void;
  onReject: (id: number, reason: string) => void;
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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span>Elan #{ad.id}</span>
            <StatusBadge status={ad.status} />
            {ad.aiFlag && (
              <span className="text-xs bg-admin-warning/10 text-admin-warning px-2 py-1 rounded font-medium flex items-center gap-1">
                <Bot size={12} /> AI Xəbərdarlıq
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {/* AI Warning */}
          {ad.aiFlag && ad.aiReason && (
            <div className="bg-admin-warning/5 border border-admin-warning/20 rounded-lg p-3 flex items-start gap-2">
              <Bot size={16} className="text-admin-warning mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-admin-warning">AI Moderasiya Xəbərdarlığı</p>
                <p className="text-xs text-muted-foreground mt-0.5">{ad.aiReason}</p>
              </div>
            </div>
          )}

          {/* Images */}
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

          {/* Ad Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase">Başlıq</h4>
                <p className="text-sm font-medium mt-0.5">{ad.title}</p>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase">Kateqoriya</h4>
                <p className="text-sm mt-0.5">{ad.category} → {ad.subcategory}</p>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase">Qiymət</h4>
                <p className="text-sm font-bold mt-0.5">{ad.price.toLocaleString()} ₼</p>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase">Lokasiya</h4>
                <p className="text-sm mt-0.5">{ad.location}</p>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase">Tarix</h4>
                <p className="text-sm text-muted-foreground mt-0.5">{ad.date}</p>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase">Baxış sayı</h4>
                <p className="text-sm mt-0.5 tabular-nums">{ad.views.toLocaleString()}</p>
              </div>
            </div>

            {/* User Info */}
            <div className="bg-muted/30 rounded-lg p-4 space-y-3">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase">İstifadəçi məlumatları</h4>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-admin-accent flex items-center justify-center font-bold text-accent-foreground">
                  {ad.user[0]}
                </div>
                <div>
                  <p className="text-sm font-medium">{ad.user}</p>
                  <p className="text-xs text-muted-foreground">{ad.userEmail}</p>
                </div>
              </div>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Telefon:</span>
                  <span className="font-mono text-xs">{ad.userPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ümumi elanlar:</span>
                  <span className="font-medium">{ad.userAds}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-1">Təsvir</h4>
            <p className="text-sm leading-relaxed bg-muted/20 rounded-lg p-3">{ad.description}</p>
          </div>

          {/* Reject reason input */}
          {rejectMode && (
            <div className="space-y-2 animate-fade-in">
              <h4 className="text-sm font-medium text-admin-danger">Rədd səbəbi:</h4>
              <Textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Rədd səbəbini yazın... (istifadəçiyə göndəriləcək)"
                rows={3}
                className="border-admin-danger/30 focus:ring-admin-danger/30"
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleReject} className="bg-admin-danger text-primary-foreground hover:bg-admin-danger/90">
                  <X size={14} className="mr-1" /> Rədd et
                </Button>
                <Button size="sm" variant="outline" onClick={() => { setRejectMode(false); setRejectReason(""); }}>Ləğv</Button>
              </div>
            </div>
          )}

          {/* Actions */}
          {ad.status === "gozlemede" && !rejectMode && (
            <div className="flex gap-2 pt-2 border-t border-border">
              <Button
                onClick={() => onApprove(ad.id)}
                className="bg-admin-success text-primary-foreground hover:bg-admin-success/90 flex-1"
              >
                <Check size={16} className="mr-1" /> Təsdiqlə
              </Button>
              <Button
                onClick={() => setRejectMode(true)}
                variant="outline"
                className="text-admin-danger border-admin-danger/30 hover:bg-admin-danger/5 flex-1"
              >
                <X size={16} className="mr-1" /> Rədd et
              </Button>
              <Button variant="outline" className="text-admin-danger border-admin-danger/30 hover:bg-admin-danger/5">
                <Trash2 size={16} className="mr-1" /> Sil
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
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState("20");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [editAd, setEditAd] = useState<Ad | null>(null);

  const toggleSelect = (id: number) => setSelected((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);

  const filteredAds = ads.filter((ad) => {
    if (statusFilter !== "all" && ad.status !== statusFilter) return false;
    if (categoryFilter !== "all") {
      const catMap: Record<string, string> = { transport: "Nəqliyyat", realestate: "Daşınmaz əmlak", electronics: "Elektronika", evbag: "Ev və bağ" };
      if (ad.category !== catMap[categoryFilter]) return false;
    }
    if (searchQuery && !ad.title.toLowerCase().includes(searchQuery.toLowerCase()) && !ad.user.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const toggleAll = () => setSelected(selected.length === filteredAds.length ? [] : filteredAds.map((a) => a.id));

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

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Pending banner */}
      {pendingCount > 0 && (
        <div className="bg-admin-warning/5 border border-admin-warning/20 rounded-lg px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-admin-warning/10 flex items-center justify-center">
              <Filter size={16} className="text-admin-warning" />
            </span>
            <div>
              <p className="text-sm font-medium">{pendingCount} elan təsdiq gözləyir</p>
              <p className="text-xs text-muted-foreground">Gözləmədəki elanları nəzərdən keçirin</p>
            </div>
          </div>
          <Button size="sm" variant="outline" onClick={() => setStatusFilter("gozlemede")} className="border-admin-warning/30 text-admin-warning hover:bg-admin-warning/5">
            Gözləyənləri göstər
          </Button>
        </div>
      )}

      {/* Filters */}
      <div className="bg-card rounded-lg border border-border p-4">
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="Elan başlığı və ya istifadəçi axtar..."
              className="h-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px] h-9"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Hamısı ({ads.length})</SelectItem>
              <SelectItem value="aktiv">Aktiv ({ads.filter((a) => a.status === "aktiv").length})</SelectItem>
              <SelectItem value="gozlemede">Gözləmədə ({ads.filter((a) => a.status === "gozlemede").length})</SelectItem>
              <SelectItem value="redd">Rədd ({ads.filter((a) => a.status === "redd").length})</SelectItem>
              <SelectItem value="vip">VIP ({ads.filter((a) => a.status === "vip").length})</SelectItem>
              <SelectItem value="silinmis">Silinmiş ({ads.filter((a) => a.status === "silinmis").length})</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[150px] h-9"><SelectValue placeholder="Kateqoriya" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Hamısı</SelectItem>
              <SelectItem value="transport">Nəqliyyat</SelectItem>
              <SelectItem value="realestate">Daşınmaz əmlak</SelectItem>
              <SelectItem value="electronics">Elektronika</SelectItem>
              <SelectItem value="evbag">Ev və bağ</SelectItem>
            </SelectContent>
          </Select>
          <Button size="sm" className="bg-admin-accent text-accent-foreground hover:bg-admin-accent/90">
            <Search size={14} className="mr-1" /> Axtar
          </Button>
          {statusFilter !== "all" && (
            <Button size="sm" variant="ghost" onClick={() => setStatusFilter("all")} className="text-xs">
              <X size={12} className="mr-1" /> Filtri sıfırla
            </Button>
          )}
        </div>
      </div>

      {/* Bulk actions */}
      {selected.length > 0 && (
        <div className="bg-admin-info/5 border border-admin-info/20 rounded-lg px-4 py-2.5 flex items-center gap-3 text-sm animate-fade-in">
          <span className="font-medium">{selected.length} elan seçildi:</span>
          <Button size="sm" variant="outline" className="h-7 text-xs text-admin-success border-admin-success/30" onClick={handleBulkApprove}>
            <Check size={12} className="mr-1" /> Təsdiqlə
          </Button>
          <Button size="sm" variant="outline" className="h-7 text-xs text-admin-danger border-admin-danger/30" onClick={handleBulkReject}>
            <X size={12} className="mr-1" /> Rədd et
          </Button>
          <Button size="sm" variant="outline" className="h-7 text-xs text-admin-danger border-admin-danger/30" onClick={handleBulkDelete}>
            <Trash2 size={12} className="mr-1" /> Sil
          </Button>
          <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => setSelected([])}>
            Seçimi ləğv et
          </Button>
        </div>
      )}

      {/* Results count */}
      <div className="text-xs text-muted-foreground">
        {filteredAds.length} nəticə tapıldı
      </div>

      {/* Table */}
      <div className="bg-card rounded-lg border border-border overflow-x-auto -mx-4 sm:mx-0">
        <table className="w-full text-sm" style={{ minWidth: 780 }}>
          <thead>
            <tr className="border-b border-border text-muted-foreground text-left bg-muted/30 text-xs">
              <th className="px-2 py-2.5 w-7">
                <input type="checkbox" checked={selected.length === filteredAds.length && filteredAds.length > 0} onChange={toggleAll} className="rounded" />
              </th>
              <th className="px-2 py-2.5 font-medium w-12">ID</th>
              <th className="px-2 py-2.5 font-medium">Başlıq</th>
              <th className="px-2 py-2.5 font-medium w-20">İstifadəçi</th>
              <th className="px-2 py-2.5 font-medium w-[72px]">Kateqoriya</th>
              <th className="px-2 py-2.5 font-medium w-16">Qiymət</th>
              <th className="px-2 py-2.5 font-medium w-10">👁️</th>
              <th className="px-2 py-2.5 font-medium w-16">Status</th>
              <th className="px-2 py-2.5 font-medium w-[72px]">Tarix</th>
              <th className="px-2 py-2.5 font-medium w-24">Əməliyyat</th>
            </tr>
          </thead>
          <tbody>
            {filteredAds.map((ad) => (
              <tr
                key={ad.id}
                className={`border-b border-border/50 hover:bg-muted/20 transition-colors cursor-pointer ${ad.status === "gozlemede" ? "bg-admin-warning/[0.02]" : ""}`}
                onClick={() => setDetailAd(ad)}
              >
                <td className="px-2 py-2" onClick={(e) => e.stopPropagation()}>
                  <input type="checkbox" checked={selected.includes(ad.id)} onChange={() => toggleSelect(ad.id)} className="rounded" />
                </td>
                <td className="px-2 py-2 text-muted-foreground text-[11px]">#{ad.id}</td>
                <td className="px-2 py-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <div className="w-6 h-6 bg-muted rounded shrink-0" />
                    <div className="min-w-0 flex-1">
                      <span className="font-medium text-xs block truncate max-w-[180px]">{ad.title}</span>
                      <div className="flex items-center gap-1">
                        {ad.featured && <span className="text-[8px] bg-admin-accent/15 text-admin-accent px-0.5 rounded">⭐</span>}
                        {ad.aiFlag && (
                          <span className="text-[8px] bg-admin-warning/10 text-admin-warning px-0.5 rounded font-medium">⚠️AI</span>
                        )}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-2 py-2">
                  <span className="text-[11px] truncate block max-w-[75px]">{ad.user}</span>
                </td>
                <td className="px-2 py-2 text-muted-foreground text-[11px]">{ad.category}</td>
                <td className="px-2 py-2 font-medium tabular-nums text-[11px]">{ad.price.toLocaleString()}₼</td>
                <td className="px-2 py-2 text-muted-foreground tabular-nums text-[11px]">{ad.views > 999 ? `${(ad.views/1000).toFixed(0)}K` : ad.views}</td>
                <td className="px-2 py-2"><StatusBadge status={ad.status} /></td>
                <td className="px-2 py-2 text-muted-foreground text-[10px] whitespace-nowrap">{ad.date}</td>
                <td className="px-2 py-2" onClick={(e) => e.stopPropagation()}>
                  <div className="flex gap-px">
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setDetailAd(ad)}><Eye size={11} /></Button>
                    {ad.status === "gozlemede" && (
                      <>
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-admin-success" onClick={() => handleApprove(ad.id)}><Check size={11} /></Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-admin-danger" onClick={() => handleReject(ad.id, "Admin tərəfindən rədd edildi")}><X size={11} /></Button>
                      </>
                    )}
                    <Button variant="ghost" size="icon" className="h-6 w-6"><Edit size={11} /></Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-admin-danger" onClick={() => {
                      setAds((prev) => prev.map((a) => a.id === ad.id ? { ...a, status: "silinmis" as const } : a));
                      toast({ title: "🗑️ Silindi", description: `Elan #${ad.id} silindi` });
                    }}><Trash2 size={11} /></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          Səhifə başına:
          <Select value={perPage} onValueChange={setPerPage}>
            <SelectTrigger className="w-[70px] h-8"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-xs ml-2">
            {filteredAds.length} elan, səhifə {currentPage}
          </span>
        </div>
        <div className="flex gap-1 items-center">
          <Button variant="outline" size="icon" className="h-8 w-8" disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>
            <ChevronLeft size={14} />
          </Button>
          {[1, 2, 3].map((p) => (
            <Button key={p} variant={p === currentPage ? "default" : "outline"} size="sm" className="h-8 w-8" onClick={() => setCurrentPage(p)}>{p}</Button>
          ))}
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage((p) => p + 1)}>
            <ChevronRight size={14} />
          </Button>
        </div>
      </div>

      {/* Detail Dialog */}
      <AdDetailDialog
        ad={detailAd}
        open={!!detailAd}
        onClose={() => setDetailAd(null)}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
}
