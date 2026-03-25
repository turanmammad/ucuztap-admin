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
  Upload, ChevronRight, TrendingUp, Check, X, FileText, CreditCard, CalendarDays,
  AlertTriangle, Send, User,
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

// Duration config
const durationOptions = [
  { id: "1d", label: "1 gün", days: 1, multiplier: 1 },
  { id: "3d", label: "3 gün", days: 3, multiplier: 3 },
  { id: "1w", label: "1 həftə", days: 7, multiplier: 6 },
  { id: "2w", label: "2 həftə", days: 14, multiplier: 12 },
  { id: "1m", label: "1 ay", days: 30, multiplier: 20 },
  { id: "3m", label: "3 ay", days: 90, multiplier: 51 },
  { id: "6m", label: "6 ay", days: 180, multiplier: 90 },
];

interface AdRequest {
  id: number;
  advertiser: string;
  company: string;
  email: string;
  phone: string;
  slotId: string;
  description: string;
  targetUrl: string;
  duration: string; // duration option id
  durationDays: number;
  totalPrice: number;
  status: "yeni" | "təsdiqləndi" | "rədd" | "ödənilib" | "aktiv";
  paymentStatus: "gözləyir" | "ödənilib" | "ləğv";
  paymentMethod?: string;
  paymentDate?: string;
  createdAt: string;
  note?: string;
  imageUploaded: boolean;
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

const mockRequests: AdRequest[] = [
  { id: 501, advertiser: "Əhməd Hüseynov", company: "TechStore AZ", email: "ahmed@techstore.az", phone: "+994 50 444 55 66", slotId: "header-top", description: "Yeni iPhone 16 satışı üçün reklam banneri. Qara fonda ağ yazı ilə.", targetUrl: "https://techstore.az/iphone16", duration: "1m", durationDays: 30, totalPrice: 500, status: "yeni", paymentStatus: "gözləyir", createdAt: "2026-03-24 14:30", imageUploaded: true },
  { id: 502, advertiser: "Nigar Əliyeva", company: "GlamBeauty", email: "nigar@glambeauty.az", phone: "+994 55 333 22 11", slotId: "sidebar-right", description: "Kosmetika mağazası üçün bahar kampaniyası. Çəhrayı tonlarda.", targetUrl: "https://glambeauty.az", duration: "2w", durationDays: 14, totalPrice: 240, status: "yeni", paymentStatus: "gözləyir", createdAt: "2026-03-24 10:15", imageUploaded: false },
  { id: 503, advertiser: "Rəşad Məmmədov", company: "AutoPlus", email: "rashad@autoplus.az", phone: "+994 70 555 44 33", slotId: "listing-inline", description: "Avtomobil təmir xidmətləri reklamı.", targetUrl: "https://autoplus.az", duration: "1w", durationDays: 7, totalPrice: 180, status: "təsdiqləndi", paymentStatus: "gözləyir", createdAt: "2026-03-23 16:45", imageUploaded: true },
  { id: 504, advertiser: "Kamran Nəsirov", company: "FoodDelivery", email: "kamran@fooddelivery.az", phone: "+994 50 777 88 99", slotId: "header-mobile", description: "Yemək çatdırılma xidməti, pulsuz çatdırılma kampaniyası.", targetUrl: "https://fooddelivery.az", duration: "3m", durationDays: 90, totalPrice: 765, status: "ödənilib", paymentStatus: "ödənilib", paymentMethod: "Bank köçürməsi", paymentDate: "2026-03-22", createdAt: "2026-03-20 09:00", imageUploaded: true },
  { id: 505, advertiser: "Leyla Həsənova", company: "EduCenter", email: "leyla@educenter.az", phone: "+994 55 222 33 44", slotId: "detail-bottom", description: "İngilis dili kursları reklamı.", targetUrl: "https://educenter.az", duration: "1d", durationDays: 1, totalPrice: 18, status: "rədd", paymentStatus: "ləğv", note: "Banner keyfiyyəti aşağıdır, yeni dizayn tələb olunur.", createdAt: "2026-03-22 11:30", imageUploaded: true },
  { id: 506, advertiser: "Orxan Babayev", company: "SportMax", email: "orxan@sportmax.az", phone: "+994 70 111 22 33", slotId: "sidebar-sticky", description: "İdman avadanlıqları, 40% endirim.", targetUrl: "https://sportmax.az", duration: "1m", durationDays: 30, totalPrice: 700, status: "aktiv", paymentStatus: "ödənilib", paymentMethod: "Kart", paymentDate: "2026-03-18", createdAt: "2026-03-17 13:20", imageUploaded: true },
];

const statusConfig: Record<string, { label: string; class: string }> = {
  aktiv: { label: "Aktiv", class: "bg-emerald-500/10 text-emerald-600" },
  gozlemede: { label: "Gözləmədə", class: "bg-amber-500/10 text-amber-600" },
  bitib: { label: "Bitib", class: "bg-gray-500/10 text-gray-500" },
  pauzada: { label: "Pauzada", class: "bg-blue-500/10 text-blue-600" },
};

const requestStatusConfig: Record<string, { label: string; class: string }> = {
  yeni: { label: "Yeni sorğu", class: "bg-amber-500/10 text-amber-600" },
  "təsdiqləndi": { label: "Təsdiqləndi", class: "bg-blue-500/10 text-blue-600" },
  "rədd": { label: "Rədd edildi", class: "bg-red-500/10 text-red-600" },
  "ödənilib": { label: "Ödənilib", class: "bg-emerald-500/10 text-emerald-600" },
  aktiv: { label: "Aktiv", class: "bg-emerald-500/10 text-emerald-600" },
};

const paymentStatusConfig: Record<string, { label: string; class: string; icon: typeof CreditCard }> = {
  "gözləyir": { label: "Gözləyir", class: "bg-amber-500/10 text-amber-600", icon: Clock },
  "ödənilib": { label: "Ödənilib", class: "bg-emerald-500/10 text-emerald-600", icon: Check },
  "ləğv": { label: "Ləğv", class: "bg-red-500/10 text-red-600", icon: X },
};

const deviceIcon = { all: Monitor, desktop: Monitor, mobile: Smartphone };

// === SLOT EDIT DIALOG ===
function SlotEditDialog({ slot, open, onClose, onSave }: {
  slot: BannerSlot | null; open: boolean; onClose: () => void;
  onSave: (slot: BannerSlot) => void;
}) {
  const [data, setData] = useState<BannerSlot | null>(slot);
  // Sync with prop
  if (slot && (!data || slot.id !== data.id)) {
    setData(slot);
  }
  if (!slot && data) {
    setData(null);
  }
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
  const [duration, setDuration] = useState("1m");
  const [startDate, setStartDate] = useState(banner?.startDate || new Date().toISOString().split("T")[0]);

  const selectedSlot = slots.find(s => s.id === slotId);
  const selectedDuration = durationOptions.find(d => d.id === duration);
  const totalPrice = selectedSlot && selectedDuration ? selectedSlot.priceDaily * selectedDuration.multiplier : 0;

  // Auto-calculate end date
  const endDate = (() => {
    if (!startDate || !selectedDuration) return "";
    const d = new Date(startDate);
    d.setDate(d.getDate() + selectedDuration.days);
    return d.toISOString().split("T")[0];
  })();

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

          {/* Duration selection */}
          <div>
            <label className="text-sm font-medium">Müddət</label>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5 mt-1">
              {durationOptions.map(d => (
                <button key={d.id} onClick={() => setDuration(d.id)}
                  className={cn(
                    "px-2 py-1.5 rounded-md border text-xs font-medium transition-all text-center",
                    duration === d.id ? "border-admin-accent bg-admin-accent/10 text-admin-accent" : "border-border text-muted-foreground hover:border-admin-accent/40"
                  )}>
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-sm font-medium">Başlama</label><Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="mt-1" /></div>
            <div>
              <label className="text-sm font-medium">Bitmə</label>
              <Input type="date" value={endDate} readOnly className="mt-1 bg-muted/30" />
            </div>
          </div>

          {/* Price summary */}
          {selectedSlot && selectedDuration && (
            <div className="bg-admin-accent/5 border border-admin-accent/20 rounded-lg p-3 flex items-center justify-between">
              <div className="text-xs space-y-0.5">
                <p className="text-muted-foreground">{selectedSlot.name} • {selectedDuration.label}</p>
                <p className="text-muted-foreground">Günlük: {selectedSlot.priceDaily} ₼ × {selectedDuration.multiplier}</p>
              </div>
              <p className="text-lg font-bold text-admin-accent">{totalPrice} ₼</p>
            </div>
          )}

          {/* Image upload placeholder */}
          <div>
            <label className="text-sm font-medium">Banner Şəkli</label>
            <div className="mt-1 border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-admin-accent/50 transition-colors cursor-pointer">
              <Upload size={24} className="mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Şəkil yükləyin və ya sürükləyin</p>
              <p className="text-[10px] text-muted-foreground mt-1">
                {selectedSlot?.size || "728×90"} • PNG, JPG, GIF, WebP • Max 2MB
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
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const selectedSlot = slots.find(s => s.id === slotId);

  const generateBannerCanvas = (w: number, h: number): string => {
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d")!;

    // Color schemes
    const schemes: Record<string, { bg1: string; bg2: string; accent: string; text: string; subtext: string }> = {
      auto: { bg1: "#0f172a", bg2: "#1e3a5f", accent: "#f59e0b", text: "#ffffff", subtext: "#94a3b8" },
      brand: { bg1: "#1a1a2e", bg2: "#16213e", accent: "#e94560", text: "#ffffff", subtext: "#a0aec0" },
      warm: { bg1: "#7c2d12", bg2: "#c2410c", accent: "#fbbf24", text: "#ffffff", subtext: "#fed7aa" },
      cool: { bg1: "#0c4a6e", bg2: "#0369a1", accent: "#22d3ee", text: "#ffffff", subtext: "#bae6fd" },
      dark: { bg1: "#09090b", bg2: "#18181b", accent: "#a78bfa", text: "#ffffff", subtext: "#71717a" },
      light: { bg1: "#f8fafc", bg2: "#e2e8f0", accent: "#2563eb", text: "#0f172a", subtext: "#64748b" },
    };
    const colors = schemes[colorScheme] || schemes.auto;

    // Style-based rendering
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, colors.bg1);
    grad.addColorStop(1, colors.bg2);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Decorative shapes based on style
    if (style === "modern" || style === "bold") {
      ctx.fillStyle = colors.accent + "20";
      ctx.beginPath();
      ctx.arc(w * 0.85, h * 0.3, Math.min(w, h) * 0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(w * 0.1, h * 0.8, Math.min(w, h) * 0.25, 0, Math.PI * 2);
      ctx.fill();
    }
    if (style === "bold") {
      ctx.fillStyle = colors.accent;
      ctx.fillRect(0, h - 4, w, 4);
      ctx.fillRect(0, 0, 4, h);
    }
    if (style === "elegant") {
      ctx.strokeStyle = colors.accent + "40";
      ctx.lineWidth = 1;
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(w * 0.6 + i * 15, 0);
        ctx.lineTo(w + i * 15, h);
        ctx.stroke();
      }
    }
    if (style === "minimal") {
      ctx.fillStyle = colors.accent;
      ctx.fillRect(w * 0.04, h * 0.15, 3, h * 0.7);
    }

    // Extract text from prompt
    const lines = prompt.split(/[.!,\n]/).map(s => s.trim()).filter(Boolean);
    const mainText = lines[0] || "Banner";
    const subText = lines[1] || "";

    // Quoted text extraction
    const quoted = prompt.match(/'([^']+)'/)?.[1] || prompt.match(/"([^"]+)"/)?.[1];

    const isWide = w / h > 3;
    const padding = Math.max(w * 0.05, 16);

    if (isWide) {
      // Wide banner (leaderboard)
      const fontSize = Math.min(h * 0.4, 32);
      ctx.font = `bold ${fontSize}px system-ui, sans-serif`;
      ctx.fillStyle = colors.text;
      ctx.textBaseline = "middle";
      ctx.fillText(mainText.slice(0, 40), padding, h * 0.42, w * 0.55);

      if (quoted || subText) {
        ctx.font = `bold ${fontSize * 1.1}px system-ui, sans-serif`;
        ctx.fillStyle = colors.accent;
        const ctaText = quoted || subText;
        const textWidth = ctx.measureText(ctaText).width;
        const btnX = w - padding - textWidth - 30;
        // CTA button
        ctx.beginPath();
        const btnH = fontSize * 1.6;
        const btnY = (h - btnH) / 2;
        const btnW = textWidth + 30;
        const r = btnH / 2;
        ctx.moveTo(btnX + r, btnY);
        ctx.lineTo(btnX + btnW - r, btnY);
        ctx.arc(btnX + btnW - r, btnY + r, r, -Math.PI / 2, Math.PI / 2);
        ctx.lineTo(btnX + r, btnY + btnH);
        ctx.arc(btnX + r, btnY + r, r, Math.PI / 2, -Math.PI / 2);
        ctx.fillStyle = colors.accent;
        ctx.fill();
        ctx.fillStyle = colors.bg1;
        ctx.font = `bold ${fontSize * 0.85}px system-ui, sans-serif`;
        ctx.fillText(ctaText, btnX + 15, h * 0.52, btnW - 30);
      }
    } else {
      // Square/tall banners
      const titleSize = Math.min(w * 0.08, h * 0.08, 36);
      ctx.font = `bold ${titleSize}px system-ui, sans-serif`;
      ctx.fillStyle = colors.text;
      ctx.textBaseline = "top";

      // Word wrap
      const maxW = w - padding * 2;
      const words = mainText.split(" ");
      let line = "";
      let y = h * 0.2;
      for (const word of words) {
        const test = line + (line ? " " : "") + word;
        if (ctx.measureText(test).width > maxW && line) {
          ctx.fillText(line, padding, y, maxW);
          y += titleSize * 1.3;
          line = word;
        } else {
          line = test;
        }
      }
      if (line) ctx.fillText(line, padding, y, maxW);

      // Sub text or quoted CTA
      if (quoted) {
        const ctaSize = Math.min(titleSize * 0.9, 28);
        const ctaY = h * 0.7;
        ctx.font = `bold ${ctaSize}px system-ui, sans-serif`;
        const tw = ctx.measureText(quoted).width;
        const btnW = tw + 30;
        const btnH = ctaSize * 2;
        const btnX = padding;
        ctx.fillStyle = colors.accent;
        const r = 6;
        ctx.beginPath();
        ctx.roundRect(btnX, ctaY, btnW, btnH, r);
        ctx.fill();
        ctx.fillStyle = colors.bg1;
        ctx.fillText(quoted, btnX + 15, ctaY + ctaSize * 0.45, btnW - 30);
      } else if (subText) {
        ctx.font = `${titleSize * 0.6}px system-ui, sans-serif`;
        ctx.fillStyle = colors.subtext;
        ctx.fillText(subText, padding, h * 0.65, maxW);
      }
    }

    // Watermark
    ctx.font = `${Math.max(8, Math.min(w, h) * 0.04)}px system-ui`;
    ctx.fillStyle = colors.subtext + "60";
    ctx.textAlign = "right";
    ctx.textBaseline = "bottom";
    ctx.fillText("ucuztap.az", w - 8, h - 6);

    return canvas.toDataURL("image/png");
  };

  const handleGenerate = () => {
    if (!prompt.trim()) { toast({ title: "Xəta", description: "Təsvir yazın", variant: "destructive" }); return; }
    if (!selectedSlot) return;
    setGenerating(true);
    setPreviewUrl(null);

    setTimeout(() => {
      const url = generateBannerCanvas(selectedSlot.width, selectedSlot.height);
      setPreviewUrl(url);
      setGenerating(false);
    }, 1500);
  };

  const handleApply = () => {
    if (!previewUrl) return;
    onGenerate({ prompt, slotId, style, colorScheme, size: selectedSlot?.size, imageUrl: previewUrl });
    toast({ title: "✨ AI Banner tətbiq edildi", description: `${selectedSlot?.size} ölçüsündə banner yaradıldı` });
    onClose();
    setPreviewUrl(null);
    setPrompt("");
  };

  return (
    <Dialog open={open} onOpenChange={() => { onClose(); setPreviewUrl(null); }}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles size={18} className="text-admin-accent" />
            AI Banner Hazırla
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Banner Yeri</label>
            <Select value={slotId} onValueChange={v => { setSlotId(v); setPreviewUrl(null); }}>
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
            <Textarea value={prompt} onChange={e => { setPrompt(e.target.value); setPreviewUrl(null); }} className="mt-1" rows={3}
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
                <button key={s.id} onClick={() => { setStyle(s.id); setPreviewUrl(null); }}
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
            <Select value={colorScheme} onValueChange={v => { setColorScheme(v); setPreviewUrl(null); }}>
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

          {/* Preview */}
          <div className="border border-border rounded-lg overflow-hidden">
            <div className="bg-muted/20 p-2 text-[10px] text-muted-foreground flex items-center justify-between">
              <span>Önizləmə — {selectedSlot?.size || "728×90"}</span>
              <span className="text-admin-accent">AI ✨</span>
            </div>
            <div className="bg-gradient-to-br from-muted/30 to-muted/10 flex items-center justify-center overflow-hidden"
              style={{ minHeight: 80, maxHeight: 250 }}>
              {generating ? (
                <div className="flex flex-col items-center gap-2 animate-pulse py-6">
                  <Wand2 size={24} className="text-admin-accent animate-spin" />
                  <span className="text-xs text-muted-foreground">AI hazırlayır...</span>
                </div>
              ) : previewUrl ? (
                <img src={previewUrl} alt="AI Banner Preview" className="w-full h-auto object-contain" />
              ) : (
                <span className="text-xs text-muted-foreground py-6">Təsvir yazıb "AI ilə Hazırla" basın</span>
              )}
            </div>
          </div>

          {previewUrl ? (
            <div className="flex gap-2">
              <Button className="flex-1 bg-admin-accent text-accent-foreground hover:bg-admin-accent/90" onClick={handleApply}>
                <Sparkles size={14} className="mr-2" /> Tətbiq et
              </Button>
              <Button variant="outline" onClick={handleGenerate}>
                <Wand2 size={14} className="mr-1" /> Yenidən
              </Button>
            </div>
          ) : (
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
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// === REQUEST DETAIL DIALOG ===
function RequestDetailDialog({ request, slots, open, onClose, onApprove, onReject, onConfirmPayment }: {
  request: AdRequest | null; slots: BannerSlot[]; open: boolean; onClose: () => void;
  onApprove: (id: number) => void; onReject: (id: number, reason: string) => void;
  onConfirmPayment: (id: number, method: string) => void;
}) {
  const [rejectMode, setRejectMode] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Kart");

  if (!request) return null;

  const slot = slots.find(s => s.id === request.slotId);
  const dur = durationOptions.find(d => d.id === request.duration);
  const reqStatus = requestStatusConfig[request.status];
  const payStatus = paymentStatusConfig[request.paymentStatus];
  const PayIcon = payStatus.icon;

  return (
    <Dialog open={open} onOpenChange={() => { onClose(); setRejectMode(false); setRejectReason(""); }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 flex-wrap">
            <FileText size={18} className="text-admin-accent" />
            Reklam Sorğusu #{request.id}
            <span className={cn("text-[10px] px-2 py-0.5 rounded font-medium", reqStatus.class)}>{reqStatus.label}</span>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Advertiser info */}
          <div className="bg-muted/30 rounded-lg p-4 space-y-2">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1"><User size={12} /> Reklamçı</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-muted-foreground text-xs">Ad:</span><p className="font-medium">{request.advertiser}</p></div>
              <div><span className="text-muted-foreground text-xs">Şirkət:</span><p className="font-medium">{request.company}</p></div>
              <div><span className="text-muted-foreground text-xs">Email:</span><p className="text-xs">{request.email}</p></div>
              <div><span className="text-muted-foreground text-xs">Telefon:</span><p className="text-xs font-mono">{request.phone}</p></div>
            </div>
          </div>

          {/* Banner details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase">Banner Yeri</h4>
                <p className="text-sm font-medium mt-0.5">{slot?.name || request.slotId}</p>
                <p className="text-[10px] text-muted-foreground">{slot?.location} • {slot?.size}</p>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase">Hədəf URL</h4>
                <a href={request.targetUrl} target="_blank" rel="noreferrer" className="text-xs text-admin-accent hover:underline flex items-center gap-1">
                  {request.targetUrl} <ExternalLink size={10} />
                </a>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase">Təsvir</h4>
                <p className="text-sm mt-0.5 bg-muted/20 rounded p-2">{request.description}</p>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase">Banner şəkli</h4>
                <span className={cn("text-xs", request.imageUploaded ? "text-admin-success" : "text-admin-warning")}>
                  {request.imageUploaded ? "✓ Yüklənib" : "✗ Yüklənməyib"}
                </span>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase">Sorğu tarixi</h4>
                <p className="text-xs text-muted-foreground">{request.createdAt}</p>
              </div>
            </div>

            {/* Duration & Payment */}
            <div className="space-y-3">
              <div className="bg-admin-accent/5 border border-admin-accent/20 rounded-lg p-3 space-y-2">
                <h4 className="text-xs font-semibold flex items-center gap-1"><CalendarDays size={12} className="text-admin-accent" /> Müddət & Qiymət</h4>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{dur?.label || request.duration}</span>
                  <span className="text-sm text-muted-foreground">({request.durationDays} gün)</span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-border">
                  <span className="text-xs text-muted-foreground">Günlük tarif:</span>
                  <span className="text-xs font-medium">{slot?.priceDaily || "—"} ₼</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">Ümumi:</span>
                  <span className="text-lg font-bold text-admin-accent">{request.totalPrice} ₼</span>
                </div>
              </div>

              <div className={cn("rounded-lg border p-3 space-y-2", payStatus.class.replace("/10", "/5").replace("text-", "border-").split(" ")[0] + "/20")}>
                <h4 className="text-xs font-semibold flex items-center gap-1"><CreditCard size={12} /> Ödəniş</h4>
                <div className="flex items-center gap-2">
                  <PayIcon size={14} />
                  <span className={cn("text-sm font-medium px-2 py-0.5 rounded", payStatus.class)}>{payStatus.label}</span>
                </div>
                {request.paymentMethod && (
                  <p className="text-xs text-muted-foreground">Metod: {request.paymentMethod}</p>
                )}
                {request.paymentDate && (
                  <p className="text-xs text-muted-foreground">Tarix: {request.paymentDate}</p>
                )}
              </div>

              {request.note && (
                <div className="bg-admin-danger/5 border border-admin-danger/20 rounded-lg p-3">
                  <h4 className="text-xs font-semibold text-admin-danger flex items-center gap-1"><AlertTriangle size={12} /> Qeyd</h4>
                  <p className="text-xs mt-1">{request.note}</p>
                </div>
              )}
            </div>
          </div>

          {/* Reject mode */}
          {rejectMode && (
            <div className="space-y-2 animate-fade-in border-t border-border pt-3">
              <label className="text-sm font-medium text-admin-danger">Rədd səbəbi:</label>
              <Textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)} placeholder="Rədd səbəbini yazın..." rows={2} />
              <div className="flex gap-2">
                <Button size="sm" className="bg-admin-danger text-primary-foreground hover:bg-admin-danger/90" onClick={() => {
                  if (!rejectReason.trim()) { toast({ title: "Səbəb yazın", variant: "destructive" }); return; }
                  onReject(request.id, rejectReason);
                  setRejectMode(false); setRejectReason("");
                }}><X size={14} className="mr-1" /> Rədd et</Button>
                <Button size="sm" variant="outline" onClick={() => { setRejectMode(false); setRejectReason(""); }}>Ləğv</Button>
              </div>
            </div>
          )}

          {/* Actions */}
          {!rejectMode && (
            <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
              {request.status === "yeni" && (
                <>
                  <Button onClick={() => onApprove(request.id)} className="flex-1 bg-admin-success text-primary-foreground hover:bg-admin-success/90">
                    <Check size={14} className="mr-1" /> Təsdiqlə
                  </Button>
                  <Button onClick={() => setRejectMode(true)} variant="outline" className="flex-1 text-admin-danger border-admin-danger/30">
                    <X size={14} className="mr-1" /> Rədd et
                  </Button>
                </>
              )}
              {(request.status === "təsdiqləndi" && request.paymentStatus === "gözləyir") && (
                <div className="w-full space-y-2">
                  <div className="flex gap-2 items-end">
                    <div className="flex-1">
                      <label className="text-xs font-medium">Ödəniş metodu</label>
                      <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                        <SelectTrigger className="mt-1 h-8"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Kart">Kart</SelectItem>
                          <SelectItem value="Bank köçürməsi">Bank köçürməsi</SelectItem>
                          <SelectItem value="Nağd">Nağd</SelectItem>
                          <SelectItem value="Balans">Balans</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={() => onConfirmPayment(request.id, paymentMethod)} className="bg-admin-accent text-accent-foreground hover:bg-admin-accent/90 h-8">
                      <CreditCard size={14} className="mr-1" /> Ödənişi təsdiqlə
                    </Button>
                  </div>
                </div>
              )}
              {request.status === "ödənilib" && (
                <Button className="flex-1 bg-admin-accent text-accent-foreground hover:bg-admin-accent/90" onClick={() => {
                  toast({ title: "🚀 Reklam aktivləşdirildi", description: `#${request.id} — ${request.durationDays} gün müddətinə` });
                  onClose();
                }}>
                  <Send size={14} className="mr-1" /> Reklamı aktivləşdir
                </Button>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// === MAIN PAGE ===
export default function ReklamlarPage() {
  const [slots, setSlots] = useState(bannerSlots);
  const [banners, setBanners] = useState(mockBanners);
  const [requests, setRequests] = useState(mockRequests);
  const [activeTab, setActiveTab] = useState<"banners" | "slots" | "pricing" | "requests">("banners");
  const [editSlot, setEditSlot] = useState<BannerSlot | null>(null);
  const [bannerForm, setBannerForm] = useState(false);
  const [editBanner, setEditBanner] = useState<Banner | null>(null);
  const [aiDialog, setAiDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<AdRequest | null>(null);

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

  const handleApproveRequest = (id: number) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: "təsdiqləndi" as const } : r));
    setSelectedRequest(null);
    toast({ title: "✅ Sorğu təsdiqləndi", description: `#${id} — ödəniş gözlənilir` });
  };

  const handleRejectRequest = (id: number, reason: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: "rədd" as const, paymentStatus: "ləğv" as const, note: reason } : r));
    setSelectedRequest(null);
    toast({ title: "❌ Sorğu rədd edildi", description: `#${id}: ${reason}` });
  };

  const handleConfirmPayment = (id: number, method: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: "ödənilib" as const, paymentStatus: "ödənilib" as const, paymentMethod: method, paymentDate: new Date().toISOString().split("T")[0] } : r));
    setSelectedRequest(null);
    toast({ title: "💰 Ödəniş təsdiqləndi", description: `#${id} — ${method}` });
  };

  const newRequestCount = requests.filter(r => r.status === "yeni").length;
  const pendingPaymentCount = requests.filter(r => r.status === "təsdiqləndi" && r.paymentStatus === "gözləyir").length;

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
          { id: "requests", label: "Sorğular", count: requests.length },
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

      {/* New request alert */}
      {newRequestCount > 0 && activeTab !== "requests" && (
        <div className="bg-admin-accent/5 border border-admin-accent/20 rounded-lg px-4 py-2.5 flex items-center justify-between gap-2 animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-admin-accent/10 flex items-center justify-center">
              <FileText size={14} className="text-admin-accent" />
            </span>
            <div>
              <p className="text-xs font-medium">{newRequestCount} yeni reklam sorğusu</p>
              {pendingPaymentCount > 0 && <p className="text-[10px] text-muted-foreground">{pendingPaymentCount} ödəniş gözləyir</p>}
            </div>
          </div>
          <Button size="sm" variant="outline" onClick={() => setActiveTab("requests")} className="text-[10px] h-7 border-admin-accent/30 text-admin-accent">
            Sorğulara keç
          </Button>
        </div>
      )}

      {/* === REQUESTS TAB === */}
      {activeTab === "requests" && (
        <div className="space-y-3">
          {/* Request stats */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {[
              { label: "Ümumi", value: requests.length, color: "text-foreground" },
              { label: "Yeni", value: newRequestCount, color: "text-amber-500" },
              { label: "Təsdiqləndi", value: requests.filter(r => r.status === "təsdiqləndi").length, color: "text-blue-500" },
              { label: "Ödənilib", value: requests.filter(r => r.status === "ödənilib").length, color: "text-emerald-500" },
              { label: "Rədd", value: requests.filter(r => r.status === "rədd").length, color: "text-red-500" },
            ].map(s => (
              <div key={s.label} className="bg-card rounded-lg border border-border p-3 text-center">
                <p className={cn("text-xl font-bold", s.color)}>{s.value}</p>
                <p className="text-[10px] text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Request cards */}
          <div className="space-y-2">
            {requests.map(req => {
              const slot = slots.find(s => s.id === req.slotId);
              const st = requestStatusConfig[req.status];
              const ps = paymentStatusConfig[req.paymentStatus];
              const dur = durationOptions.find(d => d.id === req.duration);
              return (
                <div key={req.id} onClick={() => setSelectedRequest(req)}
                  className={cn(
                    "bg-card rounded-lg border border-border p-4 cursor-pointer hover:shadow-md transition-all",
                    req.status === "yeni" && "border-admin-accent/30 bg-admin-accent/[0.02]"
                  )}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-muted-foreground">#{req.id}</span>
                        <span className="font-medium text-sm">{req.company}</span>
                        <span className={cn("text-[10px] px-1.5 py-0.5 rounded font-medium", st.class)}>{st.label}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 truncate">{req.description}</p>
                      <div className="flex items-center gap-3 mt-2 text-[11px] text-muted-foreground flex-wrap">
                        <span className="flex items-center gap-1"><User size={10} /> {req.advertiser}</span>
                        <span className="flex items-center gap-1"><Layout size={10} /> {slot?.name || req.slotId}</span>
                        <span className="flex items-center gap-1"><CalendarDays size={10} /> {dur?.label}</span>
                        <span className="flex items-center gap-1"><Clock size={10} /> {req.createdAt.split(" ")[0]}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-lg font-bold text-admin-accent">{req.totalPrice} ₼</p>
                      <div className="flex items-center gap-1 justify-end mt-1">
                        <span className={cn("text-[9px] px-1.5 py-0.5 rounded font-medium", ps.class)}>{ps.label}</span>
                      </div>
                      {req.status === "yeni" && (
                        <div className="flex gap-1 mt-2" onClick={e => e.stopPropagation()}>
                          <Button size="sm" className="h-6 text-[10px] bg-admin-success text-primary-foreground hover:bg-admin-success/90 px-2" onClick={() => handleApproveRequest(req.id)}>
                            <Check size={10} className="mr-0.5" /> Təsdiqlə
                          </Button>
                          <Button size="sm" variant="outline" className="h-6 text-[10px] text-admin-danger border-admin-danger/30 px-2" onClick={() => {
                            handleRejectRequest(req.id, "Admin tərəfindən rədd edildi");
                          }}>
                            <X size={10} />
                          </Button>
                        </div>
                      )}
                      {(req.status === "təsdiqləndi" && req.paymentStatus === "gözləyir") && (
                        <Button size="sm" className="h-6 text-[10px] bg-admin-accent text-accent-foreground hover:bg-admin-accent/90 px-2 mt-2" onClick={e => { e.stopPropagation(); setSelectedRequest(req); }}>
                          <CreditCard size={10} className="mr-0.5" /> Ödəniş
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

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
      <BannerFormDialog banner={editBanner} slots={slots} open={bannerForm} onClose={() => { setBannerForm(false); setEditBanner(null); }} onSave={handleBannerCreate} />
      <AiBannerDialog slots={slots} open={aiDialog} onClose={() => setAiDialog(false)} onGenerate={handleAiGenerate} />
      <RequestDetailDialog request={selectedRequest} slots={slots} open={!!selectedRequest} onClose={() => setSelectedRequest(null)} onApprove={handleApproveRequest} onReject={handleRejectRequest} onConfirmPayment={handleConfirmPayment} />
    </div>
  );
}
