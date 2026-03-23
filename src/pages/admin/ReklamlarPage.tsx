import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import {
  Monitor, Smartphone, Layout, Image, Sparkles, DollarSign, Eye, MousePointer,
  Plus, Edit, Trash2, ToggleLeft, Copy, BarChart3, Clock, ExternalLink, Wand2,
  Upload, ChevronRight, TrendingUp,
} from "lucide-react";

// === TYPES ===
interface BannerSlot {
  id: string;
  name: string;
  location: string;
  size: string;
  width: number;
  height: number;
  device: "all" | "desktop" | "mobile";
  priceDaily: number;
  priceWeekly: number;
  priceMonthly: number;
  active: boolean;
  currentBanner: Banner | null;
}

interface Banner {
  id: number;
  title: string;
  advertiser: string;
  slotId: string;
  imageUrl: string;
  targetUrl: string;
  startDate: string;
  endDate: string;
  status: "aktiv" | "gozlemede" | "bitib" | "pauzada";
  impressions: number;
  clicks: number;
  ctr: number;
  revenue: number;
  aiGenerated: boolean;
}

// === MOCK DATA ===
const bannerSlots: BannerSlot[] = [
  { id: "header-top", name: "Header Üst Banner", location: "Ana səhifə — header üstü", size: "728×90", width: 728, height: 90, device: "desktop", priceDaily: 25, priceWeekly: 150, priceMonthly: 500, active: true, currentBanner: null },
  { id: "header-mobile", name: "Mobil Header Banner", location: "Ana səhifə — header üstü (mobil)", size: "320×50", width: 320, height: 50, device: "mobile", priceDaily: 15, priceWeekly: 90, priceMonthly: 300, active: true, currentBanner: null },
  { id: "sidebar-right", name: "Sağ Sidebar", location: "Elan siyahı — sağ sidebar", size: "300×250", width: 300, height: 250, device: "desktop", priceDaily: 20, priceWeekly: 120, priceMonthly: 400, active: true, currentBanner: null },
  { id: "sidebar-sticky", name: "Sticky Sidebar", location: "Elan detalı — sticky sağ panel", size: "300×600", width: 300, height: 600, device: "desktop", priceDaily: 35, priceWeekly: 200, priceMonthly: 700, active: true, currentBanner: null },
  { id: "listing-inline", name: "Siyahı İçi Reklam", location: "Elan siyahısında hər 10-cu sətir", size: "728×90", width: 728, height: 90, device: "all", priceDaily: 30, priceWeekly: 180, priceMonthly: 600, active: true, currentBanner: null },
  { id: "detail-bottom", name: "Elan Altı Banner", location: "Elan detalı — alt hissə", size: "728×90", width: 728, height: 90, device: "all", priceDaily: 18, priceWeekly: 100, priceMonthly: 350, active: true, currentBanner: null },
  { id: "category-top", name: "Kateqoriya Banner", location: "Kateqoriya səhifəsi — üst hissə", size: "970×250", width: 970, height: 250, device: "desktop", priceDaily: 40, priceWeekly: 250, priceMonthly: 900, active: false, currentBanner: null },
  { id: "interstitial", name: "Tam Ekran Reklam", location: "Mobil — elan açılışı arası", size: "320×480", width: 320, height: 480, device: "mobile", priceDaily: 50, priceWeekly: 300, priceMonthly: 1000, active: false, currentBanner: null },
  { id: "footer-banner", name: "Footer Banner", location: "Ana səhifə — footer üstü", size: "970×90", width: 970, height: 90, device: "all", priceDaily: 12, priceWeekly: 70, priceMonthly: 250, active: true, currentBanner: null },
];

const mockBanners: Banner[] = [
  { id: 1, title: "Yeni il Kampaniyası — Kapital Bank", advertiser: "Kapital Bank", slotId: "header-top", imageUrl: "", targetUrl: "https://kapitalbank.az", startDate: "2026-03-01", endDate: "2026-03-31", status: "aktiv", impressions: 245600, clicks: 3420, ctr: 1.39, revenue: 500, aiGenerated: false },
  { id: 2, title: "Azercell 5G Tarif", advertiser: "Azercell", slotId: "sidebar-right", imageUrl: "", targetUrl: "https://azercell.com", startDate: "2026-03-10", endDate: "2026-04-10", status: "aktiv", impressions: 189300, clicks: 2890, ctr: 1.53, revenue: 400, aiGenerated: false },
  { id: 3, title: "Premium Mənzillər — PASHA Living", advertiser: "PASHA Construction", slotId: "sidebar-sticky", imageUrl: "", targetUrl: "https://pashaliving.az", startDate: "2026-03-15", endDate: "2026-04-15", status: "aktiv", impressions: 134200, clicks: 2100, ctr: 1.56, revenue: 700, aiGenerated: true },
  { id: 4, title: "Bolt Food — 50% Endirim", advertiser: "Bolt", slotId: "listing-inline", imageUrl: "", targetUrl: "https://food.bolt.eu", startDate: "2026-02-20", endDate: "2026-03-20", status: "bitib", impressions: 312000, clicks: 5600, ctr: 1.79, revenue: 600, aiGenerated: false },
  { id: 5, title: "Wolt Azərbaycan", advertiser: "Wolt", slotId: "detail-bottom", imageUrl: "", targetUrl: "https://wolt.com/az", startDate: "2026-03-05", endDate: "2026-04-05", status: "aktiv", impressions: 87500, clicks: 1240, ctr: 1.42, revenue: 350, aiGenerated: true },
  { id: 6, title: "Samsung Galaxy S26", advertiser: "Samsung AZ", slotId: "header-mobile", imageUrl: "", targetUrl: "https://samsung.com/az", startDate: "2026-03-18", endDate: "2026-04-18", status: "gozlemede", impressions: 0, clicks: 0, ctr: 0, revenue: 0, aiGenerated: false },
  { id: 7, title: "ABB iç dizayn", advertiser: "ABB Group", slotId: "category-top", imageUrl: "", targetUrl: "https://abb-group.az", startDate: "2026-03-22", endDate: "2026-04-22", status: "pauzada", impressions: 45200, clicks: 620, ctr: 1.37, revenue: 250, aiGenerated: false },
];

const statusConfig: Record<string, { label: string; class: string }> = {
  aktiv: { label: "Aktiv", class: "bg-emerald-500/10 text-emerald-600" },
  gozlemede: { label: "Gözləmədə", class: "bg-amber-500/10 text-amber-600" },
  bitib: { label: "Bitib", class: "bg-gray-500/10 text-gray-500" },
  pauzada: { label: "Pauzada", class: "bg-blue-500/10 text-blue-600" },
};

const deviceIcon = { all: Monitor, desktop: Monitor, mobile: Smartphone };

// === SLOT EDIT DIALOG ===
function SlotEditDialog({ slot, open, onClose, onSave }: {
  slot: BannerSlot | null; open: boolean; onClose: () => void;
  onSave: (slot: BannerSlot) => void;
}) {
  const [data, setData] = useState<BannerSlot | null>(slot);
  if (!data) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>Banner Yeri — {data.name}</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div><label className="text-sm font-medium">Ad</label><Input value={data.name} onChange={e => setData({ ...data, name: e.target.value })} className="mt-1" /></div>
          <div><label className="text-sm font-medium">Lokasiya</label><Input value={data.location} onChange={e => setData({ ...data, location: e.target.value })} className="mt-1" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-sm font-medium">Eni (px)</label><Input type="number" value={data.width} onChange={e => setData({ ...data, width: +e.target.value, size: `${e.target.value}×${data.height}` })} className="mt-1" /></div>
            <div><label className="text-sm font-medium">Hündürlüyü (px)</label><Input type="number" value={data.height} onChange={e => setData({ ...data, height: +e.target.value, size: `${data.width}×${e.target.value}` })} className="mt-1" /></div>
          </div>
          <div><label className="text-sm font-medium">Cihaz</label>
            <Select value={data.device} onValueChange={v => setData({ ...data, device: v as any })}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Hamısı</SelectItem>
                <SelectItem value="desktop">Desktop</SelectItem>
                <SelectItem value="mobile">Mobil</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <h4 className="text-sm font-semibold pt-2">Qiymətlər (₼)</h4>
          <div className="grid grid-cols-3 gap-3">
            <div><label className="text-xs text-muted-foreground">Günlük</label><Input type="number" value={data.priceDaily} onChange={e => setData({ ...data, priceDaily: +e.target.value })} className="mt-1" /></div>
            <div><label className="text-xs text-muted-foreground">Həftəlik</label><Input type="number" value={data.priceWeekly} onChange={e => setData({ ...data, priceWeekly: +e.target.value })} className="mt-1" /></div>
            <div><label className="text-xs text-muted-foreground">Aylıq</label><Input type="number" value={data.priceMonthly} onChange={e => setData({ ...data, priceMonthly: +e.target.value })} className="mt-1" /></div>
          </div>
          <div className="flex items-center justify-between">
            <div><p className="text-sm font-medium">Aktiv</p><p className="text-xs text-muted-foreground">Bu yer satışa açıqdır</p></div>
            <Switch checked={data.active} onCheckedChange={v => setData({ ...data, active: v })} />
          </div>
          <div className="flex gap-2 pt-2">
            <Button className="flex-1 bg-admin-accent text-accent-foreground hover:bg-admin-accent/90" onClick={() => { onSave(data); onClose(); toast({ title: "✅ Banner yeri yeniləndi" }); }}>Yadda saxla</Button>
            <Button variant="outline" onClick={onClose}>Ləğv</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// === BANNER CREATE/EDIT DIALOG ===
function BannerFormDialog({ banner, slots, open, onClose, onSave }: {
  banner: Banner | null; slots: BannerSlot[]; open: boolean; onClose: () => void;
  onSave: (b: Partial<Banner>) => void;
}) {
  const [title, setTitle] = useState(banner?.title || "");
  const [advertiser, setAdvertiser] = useState(banner?.advertiser || "");
  const [slotId, setSlotId] = useState(banner?.slotId || slots[0]?.id || "");
  const [targetUrl, setTargetUrl] = useState(banner?.targetUrl || "");
  const [startDate, setStartDate] = useState(banner?.startDate || "");
  const [endDate, setEndDate] = useState(banner?.endDate || "");

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>{banner ? "Banner Redaktə" : "Yeni Banner"}</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div><label className="text-sm font-medium">Başlıq</label><Input value={title} onChange={e => setTitle(e.target.value)} className="mt-1" placeholder="Reklam başlığı" /></div>
          <div><label className="text-sm font-medium">Reklamçı</label><Input value={advertiser} onChange={e => setAdvertiser(e.target.value)} className="mt-1" placeholder="Şirkət adı" /></div>
          <div><label className="text-sm font-medium">Banner Yeri</label>
            <Select value={slotId} onValueChange={setSlotId}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                {slots.filter(s => s.active).map(s => (
                  <SelectItem key={s.id} value={s.id}>{s.name} ({s.size})</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div><label className="text-sm font-medium">Hədəf URL</label><Input value={targetUrl} onChange={e => setTargetUrl(e.target.value)} className="mt-1" placeholder="https://..." /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-sm font-medium">Başlama</label><Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="mt-1" /></div>
            <div><label className="text-sm font-medium">Bitmə</label><Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="mt-1" /></div>
          </div>

          {/* Image upload placeholder */}
          <div>
            <label className="text-sm font-medium">Banner Şəkli</label>
            <div className="mt-1 border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-admin-accent/50 transition-colors cursor-pointer">
              <Upload size={24} className="mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Şəkil yükləyin və ya sürükləyin</p>
              <p className="text-[10px] text-muted-foreground mt-1">
                {slots.find(s => s.id === slotId)?.size || "728×90"} • PNG, JPG, GIF, WebP • Max 2MB
              </p>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button className="flex-1 bg-admin-accent text-accent-foreground hover:bg-admin-accent/90" onClick={() => {
              onSave({ title, advertiser, slotId, targetUrl, startDate, endDate, status: "gozlemede" });
              onClose();
            }}>
              {banner ? "Yenilə" : "Yarat"}
            </Button>
            <Button variant="outline" onClick={onClose}>Ləğv</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// === AI BANNER GENERATOR DIALOG ===
function AiBannerDialog({ slots, open, onClose, onGenerate }: {
  slots: BannerSlot[]; open: boolean; onClose: () => void;
  onGenerate: (data: any) => void;
}) {
  const [prompt, setPrompt] = useState("");
  const [slotId, setSlotId] = useState(slots[0]?.id || "");
  const [style, setStyle] = useState("modern");
  const [generating, setGenerating] = useState(false);
  const [colorScheme, setColorScheme] = useState("auto");

  const selectedSlot = slots.find(s => s.id === slotId);

  const handleGenerate = () => {
    if (!prompt.trim()) { toast({ title: "Xəta", description: "Təsvir yazın", variant: "destructive" }); return; }
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      onGenerate({ prompt, slotId, style, colorScheme, size: selectedSlot?.size });
      toast({ title: "✨ AI Banner hazırlandı", description: `${selectedSlot?.size} ölçüsündə banner generasiya edildi` });
      onClose();
    }, 3000);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles size={18} className="text-admin-accent" />
            AI Banner Hazırla
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Banner Yeri</label>
            <Select value={slotId} onValueChange={setSlotId}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                {slots.filter(s => s.active).map(s => (
                  <SelectItem key={s.id} value={s.id}>{s.name} ({s.size})</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedSlot && (
              <div className="mt-2 p-2 bg-muted/30 rounded text-xs text-muted-foreground">
                Ölçü: <span className="font-medium text-foreground">{selectedSlot.width} × {selectedSlot.height}px</span> • {selectedSlot.device === "mobile" ? "Mobil" : selectedSlot.device === "desktop" ? "Desktop" : "Bütün cihazlar"}
              </div>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Təsvir</label>
            <Textarea value={prompt} onChange={e => setPrompt(e.target.value)} className="mt-1" rows={3}
              placeholder="Nümunə: Kapital Bank kredit kampaniyası üçün mavi tonlarda professional banner. '0% faiz, 12 ay' yazılsın." />
          </div>

          <div>
            <label className="text-sm font-medium">Stil</label>
            <div className="grid grid-cols-4 gap-2 mt-1">
              {[
                { id: "modern", label: "Modern" },
                { id: "minimal", label: "Minimal" },
                { id: "bold", label: "Cəsarətli" },
                { id: "elegant", label: "Zərif" },
              ].map(s => (
                <button key={s.id} onClick={() => setStyle(s.id)}
                  className={cn(
                    "px-3 py-2 rounded-md border text-xs font-medium transition-all",
                    style === s.id ? "border-admin-accent bg-admin-accent/10 text-admin-accent" : "border-border text-muted-foreground hover:border-admin-accent/40"
                  )}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Rəng sxemi</label>
            <Select value={colorScheme} onValueChange={setColorScheme}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">Avtomatik (təsvirə uyğun)</SelectItem>
                <SelectItem value="brand">Brend rəngləri</SelectItem>
                <SelectItem value="warm">İsti tonlar</SelectItem>
                <SelectItem value="cool">Soyuq tonlar</SelectItem>
                <SelectItem value="dark">Tünd fon</SelectItem>
                <SelectItem value="light">Açıq fon</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Preview placeholder */}
          <div className="border border-border rounded-lg overflow-hidden">
            <div className="bg-muted/20 p-2 text-[10px] text-muted-foreground flex items-center justify-between">
              <span>Önizləmə — {selectedSlot?.size || "728×90"}</span>
              <span className="text-admin-accent">AI ✨</span>
            </div>
            <div className="bg-gradient-to-br from-muted/30 to-muted/10 flex items-center justify-center" style={{ height: Math.min(selectedSlot?.height || 90, 200), aspectRatio: selectedSlot ? `${selectedSlot.width}/${selectedSlot.height}` : undefined }}>
              {generating ? (
                <div className="flex flex-col items-center gap-2 animate-pulse">
                  <Wand2 size={24} className="text-admin-accent animate-spin" />
                  <span className="text-xs text-muted-foreground">AI hazırlayır...</span>
                </div>
              ) : (
                <span className="text-xs text-muted-foreground">Banner burada görünəcək</span>
              )}
            </div>
          </div>

          <Button
            className="w-full bg-gradient-to-r from-admin-accent to-amber-400 text-accent-foreground hover:opacity-90"
            onClick={handleGenerate}
            disabled={generating}
          >
            {generating ? (
              <><Wand2 size={14} className="mr-2 animate-spin" /> Hazırlanır...</>
            ) : (
              <><Sparkles size={14} className="mr-2" /> AI ilə Hazırla</>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// === MAIN PAGE ===
export default function ReklamlarPage() {
  const [slots, setSlots] = useState(bannerSlots);
  const [banners, setBanners] = useState(mockBanners);
  const [activeTab, setActiveTab] = useState<"banners" | "slots" | "pricing">("banners");
  const [editSlot, setEditSlot] = useState<BannerSlot | null>(null);
  const [bannerForm, setBannerForm] = useState(false);
  const [editBanner, setEditBanner] = useState<Banner | null>(null);
  const [aiDialog, setAiDialog] = useState(false);

  const totalRevenue = banners.reduce((s, b) => s + b.revenue, 0);
  const totalImpressions = banners.reduce((s, b) => s + b.impressions, 0);
  const totalClicks = banners.reduce((s, b) => s + b.clicks, 0);
  const avgCtr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : "0";

  const handleSlotSave = (updated: BannerSlot) => {
    setSlots(prev => prev.map(s => s.id === updated.id ? updated : s));
  };

  const handleBannerCreate = (data: Partial<Banner>) => {
    if (editBanner) {
      // Edit mode
      setBanners(prev => prev.map(b => b.id === editBanner.id ? {
        ...b,
        title: data.title || b.title,
        advertiser: data.advertiser || b.advertiser,
        slotId: data.slotId || b.slotId,
        targetUrl: data.targetUrl || b.targetUrl,
        startDate: data.startDate || b.startDate,
        endDate: data.endDate || b.endDate,
      } : b));
      setEditBanner(null);
      toast({ title: "✅ Banner yeniləndi", description: `"${data.title}" redaktə edildi` });
    } else {
      const newBanner: Banner = {
        id: banners.length + 100 + Math.floor(Math.random() * 1000),
        title: data.title || "",
        advertiser: data.advertiser || "",
        slotId: data.slotId || "",
        imageUrl: "",
        targetUrl: data.targetUrl || "",
        startDate: data.startDate || "",
        endDate: data.endDate || "",
        status: "gozlemede",
        impressions: 0,
        clicks: 0,
        ctr: 0,
        revenue: 0,
        aiGenerated: false,
      };
      setBanners(prev => [newBanner, ...prev]);
      toast({ title: "✅ Banner yaradıldı", description: `"${data.title}" əlavə edildi` });
    }
  };

  const handleAiGenerate = (data: any) => {
    const newBanner: Banner = {
      id: banners.length + 200,
      title: `AI Banner — ${data.prompt.slice(0, 30)}...`,
      advertiser: "AI Generated",
      slotId: data.slotId,
      imageUrl: "",
      targetUrl: "",
      startDate: new Date().toISOString().split("T")[0],
      endDate: "",
      status: "gozlemede",
      impressions: 0,
      clicks: 0,
      ctr: 0,
      revenue: 0,
      aiGenerated: true,
    };
    setBanners(prev => [newBanner, ...prev]);
  };

  const toggleBannerStatus = (id: number) => {
    setBanners(prev => prev.map(b => b.id === id ? { ...b, status: b.status === "aktiv" ? "pauzada" as const : "aktiv" as const } : b));
    toast({ title: "Status dəyişdirildi" });
  };

  const deleteBanner = (id: number) => {
    setBanners(prev => prev.filter(b => b.id !== id));
    toast({ title: "🗑️ Banner silindi" });
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Layout size={20} className="text-admin-accent" />
          Reklam İdarəsi
        </h2>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="gap-1.5" onClick={() => setAiDialog(true)}>
            <Sparkles size={14} className="text-admin-accent" /> AI Banner
          </Button>
          <Button size="sm" className="bg-admin-accent text-accent-foreground hover:bg-admin-accent/90 gap-1.5" onClick={() => setBannerForm(true)}>
            <Plus size={14} /> Yeni Banner
          </Button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Ümumi Gəlir", value: `${totalRevenue.toLocaleString()} ₼`, icon: DollarSign, color: "text-emerald-500" },
          { label: "İmpressions", value: totalImpressions > 1000000 ? `${(totalImpressions / 1000000).toFixed(1)}M` : `${(totalImpressions / 1000).toFixed(0)}K`, icon: Eye, color: "text-blue-500" },
          { label: "Kliklər", value: `${(totalClicks / 1000).toFixed(1)}K`, icon: MousePointer, color: "text-purple-500" },
          { label: "Ort. CTR", value: `${avgCtr}%`, icon: TrendingUp, color: "text-amber-500" },
        ].map(kpi => (
          <div key={kpi.label} className="bg-card rounded-lg border border-border p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <kpi.icon size={13} />
              {kpi.label}
            </div>
            <p className={`text-xl font-bold tabular-nums ${kpi.color}`}>{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border">
        {([
          { id: "banners", label: "Bannerlər", count: banners.length },
          { id: "slots", label: "Banner Yerləri", count: slots.length },
          { id: "pricing", label: "Qiymət Siyahısı" },
        ] as const).map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors",
              activeTab === tab.id ? "border-admin-accent text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
            )}>
            {tab.label}
            {"count" in tab && <span className="ml-1.5 text-[10px] bg-muted px-1.5 py-0.5 rounded-full">{tab.count}</span>}
          </button>
        ))}
      </div>

      {/* === BANNERS TAB === */}
      {activeTab === "banners" && (
        <div className="bg-card rounded-lg border border-border overflow-x-auto">
          <table className="min-w-[850px] w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground text-left bg-muted/30">
                <th className="p-3 font-medium w-[50px]">ID</th>
                <th className="p-3 font-medium">Banner</th>
                <th className="p-3 font-medium w-[100px]">Reklamçı</th>
                <th className="p-3 font-medium w-[100px]">Yer</th>
                <th className="p-3 font-medium w-[80px]">İmpress.</th>
                <th className="p-3 font-medium w-[60px]">Klik</th>
                <th className="p-3 font-medium w-[55px]">CTR</th>
                <th className="p-3 font-medium w-[70px]">Gəlir</th>
                <th className="p-3 font-medium w-[75px]">Status</th>
                <th className="p-3 font-medium w-[100px]">Əməliyyat</th>
              </tr>
            </thead>
            <tbody>
              {banners.map(b => {
                const slot = slots.find(s => s.id === b.slotId);
                const st = statusConfig[b.status];
                return (
                  <tr key={b.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                    <td className="p-3 text-muted-foreground text-xs">#{b.id}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-12 h-8 bg-muted rounded flex items-center justify-center shrink-0">
                          <Image size={12} className="text-muted-foreground" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs font-medium block truncate">{b.title}</span>
                          <div className="flex items-center gap-1">
                            {b.aiGenerated && <span className="text-[9px] bg-admin-accent/10 text-admin-accent px-1 rounded">✨ AI</span>}
                            <span className="text-[10px] text-muted-foreground">{b.startDate} → {b.endDate}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-xs truncate max-w-[100px]">{b.advertiser}</td>
                    <td className="p-3 text-xs text-muted-foreground">{slot?.name?.split(" ").slice(0, 2).join(" ") || b.slotId}</td>
                    <td className="p-3 tabular-nums text-xs">{b.impressions > 1000 ? `${(b.impressions / 1000).toFixed(0)}K` : b.impressions}</td>
                    <td className="p-3 tabular-nums text-xs">{b.clicks > 1000 ? `${(b.clicks / 1000).toFixed(1)}K` : b.clicks}</td>
                    <td className="p-3 tabular-nums text-xs font-medium">{b.ctr}%</td>
                    <td className="p-3 tabular-nums text-xs font-medium">{b.revenue} ₼</td>
                    <td className="p-3"><span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${st.class}`}>{st.label}</span></td>
                    <td className="p-3">
                      <div className="flex gap-0.5">
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => toggleBannerStatus(b.id)}>
                          <ToggleLeft size={12} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => { setEditBanner(b); setBannerForm(true); }}>
                          <Edit size={12} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => {
                          const copy: Banner = { ...b, id: banners.length + 300 + Math.floor(Math.random() * 1000), title: `${b.title} (Kopya)`, status: "gozlemede" };
                          setBanners(prev => [copy, ...prev]);
                          toast({ title: "📋 Banner kopyalandı", description: `"${b.title}" kopyası yaradıldı` });
                        }}>
                          <Copy size={12} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-admin-danger" onClick={() => deleteBanner(b.id)}><Trash2 size={12} /></Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* === SLOTS TAB === */}
      {activeTab === "slots" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {slots.map(slot => {
            const DevIcon = deviceIcon[slot.device];
            return (
              <div key={slot.id} className={cn(
                "bg-card rounded-lg border p-4 transition-all hover:shadow-md",
                slot.active ? "border-border" : "border-border/50 opacity-60"
              )}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-sm font-semibold">{slot.name}</h4>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{slot.location}</p>
                  </div>
                  <Switch checked={slot.active} onCheckedChange={v => {
                    setSlots(prev => prev.map(s => s.id === slot.id ? { ...s, active: v } : s));
                    toast({ title: v ? "✅ Yer aktivləşdirildi" : "⏸️ Yer deaktiv edildi" });
                  }} />
                </div>

                {/* Size preview */}
                <div className="bg-muted/30 rounded-md p-3 mb-3 flex items-center gap-3">
                  <div className="border border-dashed border-border rounded flex items-center justify-center text-[9px] text-muted-foreground"
                    style={{ width: Math.min(slot.width / 5, 120), height: Math.min(slot.height / 5, 60) }}>
                    {slot.size}
                  </div>
                  <div className="text-xs space-y-0.5">
                    <p className="font-medium">{slot.size}</p>
                    <p className="text-muted-foreground flex items-center gap-1"><DevIcon size={11} /> {slot.device === "all" ? "Bütün cihazlar" : slot.device === "desktop" ? "Desktop" : "Mobil"}</p>
                  </div>
                </div>

                {/* Pricing */}
                <div className="flex items-center gap-2 text-xs mb-3">
                  <span className="bg-muted/50 px-2 py-1 rounded tabular-nums"><span className="text-muted-foreground">Gün:</span> {slot.priceDaily}₼</span>
                  <span className="bg-muted/50 px-2 py-1 rounded tabular-nums"><span className="text-muted-foreground">Həftə:</span> {slot.priceWeekly}₼</span>
                  <span className="bg-muted/50 px-2 py-1 rounded tabular-nums"><span className="text-muted-foreground">Ay:</span> {slot.priceMonthly}₼</span>
                </div>

                <Button variant="outline" size="sm" className="w-full h-7 text-xs" onClick={() => setEditSlot(slot)}>
                  <Edit size={11} className="mr-1" /> Redaktə
                </Button>
              </div>
            );
          })}
        </div>
      )}

      {/* === PRICING TAB === */}
      {activeTab === "pricing" && (
        <div className="space-y-4">
          <div className="bg-card rounded-lg border border-border overflow-x-auto">
            <table className="min-w-[700px] w-full text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground text-left bg-muted/30">
                  <th className="p-3 font-medium">Banner Yeri</th>
                  <th className="p-3 font-medium w-[80px]">Ölçü</th>
                  <th className="p-3 font-medium w-[70px]">Cihaz</th>
                  <th className="p-3 font-medium w-[80px]">Günlük</th>
                  <th className="p-3 font-medium w-[80px]">Həftəlik</th>
                  <th className="p-3 font-medium w-[80px]">Aylıq</th>
                  <th className="p-3 font-medium w-[60px]">Status</th>
                </tr>
              </thead>
              <tbody>
                {slots.map(slot => (
                  <tr key={slot.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                    <td className="p-3">
                      <p className="text-xs font-medium">{slot.name}</p>
                      <p className="text-[10px] text-muted-foreground">{slot.location}</p>
                    </td>
                    <td className="p-3 text-xs font-mono">{slot.size}</td>
                    <td className="p-3 text-xs text-muted-foreground">{slot.device === "all" ? "Hamısı" : slot.device === "desktop" ? "Desktop" : "Mobil"}</td>
                    <td className="p-3 tabular-nums text-xs font-medium">{slot.priceDaily} ₼</td>
                    <td className="p-3 tabular-nums text-xs font-medium">{slot.priceWeekly} ₼</td>
                    <td className="p-3 tabular-nums text-xs font-medium text-admin-accent">{slot.priceMonthly} ₼</td>
                    <td className="p-3">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${slot.active ? "bg-emerald-500/10 text-emerald-600" : "bg-gray-500/10 text-gray-500"}`}>
                        {slot.active ? "Aktiv" : "Deaktiv"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-muted/30 rounded-lg p-4 text-xs text-muted-foreground space-y-1">
            <p className="font-medium text-foreground text-sm mb-2">Qiymət qaydaları</p>
            <p>• Həftəlik qiymət = günlük × 6 (1 gün pulsuz)</p>
            <p>• Aylıq qiymət = günlük × 20 (10 gün pulsuz)</p>
            <p>• 3+ ay sifariş: əlavə 15% endirim</p>
            <p>• AI ilə hazırlanan bannerlər üçün əlavə +5₼ xidmət haqqı</p>
          </div>
        </div>
      )}

      {/* Dialogs */}
      <SlotEditDialog slot={editSlot} open={!!editSlot} onClose={() => setEditSlot(null)} onSave={handleSlotSave} />
      <BannerFormDialog banner={editBanner} slots={slots} open={bannerForm} onClose={() => setBannerForm(false)} onSave={handleBannerCreate} />
      <AiBannerDialog slots={slots} open={aiDialog} onClose={() => setAiDialog(false)} onGenerate={handleAiGenerate} />
    </div>
  );
}
