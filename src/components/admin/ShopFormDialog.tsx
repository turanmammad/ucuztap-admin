import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { Upload, X, Plus, Clock, Instagram, Facebook, Globe, Phone, Trash2, Store, Sparkles, Wand2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface WorkHour {
  day: string;
  open: string;
  close: string;
  closed: boolean;
}

export interface ShopFormData {
  name: string;
  description: string;
  category: string;
  location: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  plan: string;
  instagram: string;
  facebook: string;
  tiktok: string;
  whatsapp: string;
  logoPreview: string | null;
  bannerPreview: string | null;
  workHours: WorkHour[];
}

const defaultWorkHours: WorkHour[] = [
  { day: "Bazar ertəsi", open: "09:00", close: "18:00", closed: false },
  { day: "Çərşənbə axşamı", open: "09:00", close: "18:00", closed: false },
  { day: "Çərşənbə", open: "09:00", close: "18:00", closed: false },
  { day: "Cümə axşamı", open: "09:00", close: "18:00", closed: false },
  { day: "Cümə", open: "09:00", close: "18:00", closed: false },
  { day: "Şənbə", open: "10:00", close: "16:00", closed: false },
  { day: "Bazar", open: "", close: "", closed: true },
];

const emptyForm: ShopFormData = {
  name: "", description: "", category: "", location: "", address: "",
  phone: "", email: "", website: "", plan: "Pulsuz",
  instagram: "", facebook: "", tiktok: "", whatsapp: "",
  logoPreview: null, bannerPreview: null,
  workHours: defaultWorkHours.map((h) => ({ ...h })),
};

interface ShopFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: ShopFormData) => void;
  editData?: Partial<ShopFormData> | null;
  title?: string;
}

const formTabs = ["Əsas", "İş saatları", "Sosial media", "Görünüş"];

// Auto-fill templates based on category
const autoFillTemplates: Record<string, Partial<ShopFormData>> = {
  "Nəqliyyat": {
    description: "Azərbaycanda ən etibarlı avtomobil satış mərkəzi. Geniş çeşid, sərfəli qiymətlər və zəmanətli xidmət. Hər büdcəyə uyğun nəqliyyat vasitələri mövcuddur.",
    address: "Heydər Əliyev prospekti 120",
    phone: "+994 50 555 55 55",
    email: "info@avtosalon.az",
    website: "https://avtosalon.az",
    instagram: "@avtosalon_az",
    facebook: "facebook.com/avtosalon.az",
    whatsapp: "+994 50 555 55 55",
  },
  "Elektronika": {
    description: "Ən son texnologiya məhsulları. Apple, Samsung, Xiaomi və digər brendlərin rəsmi distribütoru. Zəmanət və servis xidməti mövcuddur.",
    address: "28 May küçəsi 42",
    phone: "+994 55 444 44 44",
    email: "info@techstore.az",
    website: "https://techstore.az",
    instagram: "@techstore_az",
    facebook: "facebook.com/techstore.az",
    whatsapp: "+994 55 444 44 44",
  },
  "Daşınmaz əmlak": {
    description: "Bakının ən etibarlı daşınmaz əmlak agentliyi. Mənzil, villa, ofis və torpaq sahələrinin alqı-satqısı və icarəsi. 10+ illik təcrübə.",
    address: "Nizami küçəsi 88",
    phone: "+994 70 333 33 33",
    email: "info@emlak.az",
    website: "https://emlak.az",
    instagram: "@emlak_az",
    facebook: "facebook.com/emlak.az",
    whatsapp: "+994 70 333 33 33",
  },
  "Ev və bağ": {
    description: "Keyfiyyətli mebel, dekor və bağ aksesuarları. Müasir dizayn, ən yaxşı materiallar. Pulsuz çatdırılma və quraşdırma xidməti.",
    address: "Tbilisi prospekti 55",
    phone: "+994 51 222 22 22",
    email: "info@evimbag.az",
    website: "https://evimbag.az",
    instagram: "@evimbag_az",
    facebook: "facebook.com/evimbag.az",
    whatsapp: "+994 51 222 22 22",
  },
  "Xidmətlər": {
    description: "Peşəkar xidmət komandası. Təmir, təmizlik, nəqliyyat və digər xidmətlər. Keyfiyyətli iş, münasib qiymətlər.",
    address: "Bakıxanov küçəsi 30",
    phone: "+994 55 111 11 11",
    email: "info@xidmet.az",
    website: "https://xidmet.az",
    instagram: "@xidmet_az",
    facebook: "facebook.com/xidmet.az",
    whatsapp: "+994 55 111 11 11",
  },
  "Geyim": {
    description: "Ən son moda trendləri. Kişi, qadın və uşaq geyimləri. Dünya brendləri və yerli istehsal. Hər büdcəyə uyğun seçimlər.",
    address: "Fountains Square, Park Bulvar",
    phone: "+994 50 777 77 77",
    email: "info@fashion.az",
    website: "https://fashion.az",
    instagram: "@fashion_az",
    facebook: "facebook.com/fashion.az",
    whatsapp: "+994 50 777 77 77",
  },
};

export function ShopFormDialog({ open, onClose, onSave, editData, title }: ShopFormDialogProps) {
  const [tab, setTab] = useState(0);
  const [form, setForm] = useState<ShopFormData>(() => editData ? { ...emptyForm, ...editData } : { ...emptyForm, workHours: defaultWorkHours.map((h) => ({ ...h })) });
  const logoRef = useRef<HTMLInputElement>(null);
  const bannerRef = useRef<HTMLInputElement>(null);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [autoFilling, setAutoFilling] = useState(false);

  const update = <K extends keyof ShopFormData>(key: K, value: ShopFormData[K]) => setForm((f) => ({ ...f, [key]: value }));

  const updateWorkHour = (index: number, field: keyof WorkHour, value: string | boolean) => {
    setForm((f) => ({
      ...f,
      workHours: f.workHours.map((h, i) => i === index ? { ...h, [field]: value } : h),
    }));
  };

  const handleFileChange = (field: "logoPreview" | "bannerPreview", e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Xəta", description: "Fayl ölçüsü 5MB-dan böyük ola bilməz", variant: "destructive" });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => update(field, reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleAutoFill = () => {
    if (!form.category) {
      toast({ title: "⚠️ Kateqoriya seçin", description: "Auto-doldurma üçün əvvəlcə kateqoriya seçilməlidir", variant: "destructive" });
      return;
    }
    setAutoFilling(true);
    setTimeout(() => {
      const template = autoFillTemplates[form.category] || autoFillTemplates["Xidmətlər"];
      const shopName = form.name || `${form.category} Mağazası`;
      setForm((f) => ({
        ...f,
        ...template,
        name: f.name || shopName,
        location: f.location || "Bakı, Nəsimi",
      }));
      setAutoFilling(false);
      toast({ title: "✨ Auto-doldurma tamamlandı", description: "Məlumatlar AI tərəfindən dolduruldu. Dəyişiklik edə bilərsiniz." });
    }, 1500);
  };

  const handleAiBanner = () => {
    if (!form.name && !form.category) {
      toast({ title: "⚠️ Məlumat lazımdır", description: "Banner yaratmaq üçün mağaza adı və ya kateqoriya daxil edin", variant: "destructive" });
      return;
    }
    setAiGenerating(true);
    // Simulate AI banner generation with a gradient canvas
    setTimeout(() => {
      const canvas = document.createElement("canvas");
      canvas.width = 1200;
      canvas.height = 300;
      const ctx = canvas.getContext("2d")!;

      // Generate gradient based on category
      const gradients: Record<string, [string, string]> = {
        "Nəqliyyat": ["#1e3a5f", "#2d6a9f"],
        "Elektronika": ["#1a1a2e", "#4a00e0"],
        "Daşınmaz əmlak": ["#2d3436", "#636e72"],
        "Ev və bağ": ["#134e5e", "#71b280"],
        "Xidmətlər": ["#373b44", "#4286f4"],
        "Geyim": ["#434343", "#000000"],
      };
      const [c1, c2] = gradients[form.category] || ["#667eea", "#764ba2"];
      const grad = ctx.createLinearGradient(0, 0, 1200, 300);
      grad.addColorStop(0, c1);
      grad.addColorStop(1, c2);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1200, 300);

      // Add subtle pattern
      ctx.globalAlpha = 0.05;
      for (let i = 0; i < 20; i++) {
        ctx.beginPath();
        ctx.arc(Math.random() * 1200, Math.random() * 300, Math.random() * 80 + 20, 0, Math.PI * 2);
        ctx.fillStyle = "#fff";
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Add shop name
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 48px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(form.name || "Mağaza", 600, 160);

      // Add category
      ctx.font = "20px system-ui, sans-serif";
      ctx.globalAlpha = 0.8;
      ctx.fillText(form.category || "", 600, 200);

      // Add decorative line
      ctx.globalAlpha = 0.4;
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(400, 230);
      ctx.lineTo(800, 230);
      ctx.stroke();

      const dataUrl = canvas.toDataURL("image/png");
      update("bannerPreview", dataUrl);
      setAiGenerating(false);
      toast({ title: "🎨 AI Banner yaradıldı", description: "Banner uğurla generasiya edildi" });
    }, 2000);
  };

  const handleSave = () => {
    if (!form.name.trim()) {
      toast({ title: "Xəta", description: "Mağaza adı daxil edin", variant: "destructive" });
      return;
    }
    if (!form.category) {
      toast({ title: "Xəta", description: "Kateqoriya seçin", variant: "destructive" });
      return;
    }
    onSave(form);
    setForm({ ...emptyForm, workHours: defaultWorkHours.map((h) => ({ ...h })) });
    setTab(0);
  };

  const handleClose = () => {
    onClose();
    setForm({ ...emptyForm, workHours: defaultWorkHours.map((h) => ({ ...h })) });
    setTab(0);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Store size={18} className="text-admin-accent" />
            {title || "Yeni mağaza yarat"}
          </DialogTitle>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-border -mx-6 px-6">
          {formTabs.map((t, i) => (
            <button
              key={t}
              onClick={() => setTab(i)}
              className={cn(
                "px-3 py-2 text-sm font-medium border-b-2 -mb-px transition-colors",
                tab === i ? "border-admin-accent text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="space-y-4 min-h-[300px]">
          {/* Tab 0: Əsas */}
          {tab === 0 && (
            <div className="space-y-4 animate-fade-in">
              {/* Auto-fill button */}
              <div className="flex items-center justify-between p-3 bg-primary/5 border border-primary/10 rounded-lg">
                <div className="flex items-center gap-2">
                  <Wand2 size={16} className="text-primary" />
                  <div>
                    <p className="text-xs font-medium">AI Auto-doldurma</p>
                    <p className="text-[10px] text-muted-foreground">Kateqoriyaya uyğun bütün sahələri avtomatik doldurun</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleAutoFill}
                  disabled={autoFilling}
                  className="text-xs"
                >
                  {autoFilling ? (
                    <><Loader2 size={12} className="mr-1 animate-spin" /> Doldurulur...</>
                  ) : (
                    <><Sparkles size={12} className="mr-1" /> Auto-doldur</>
                  )}
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-sm font-medium">Mağaza adı *</label>
                  <Input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Məs: AutoMax Motors" className="mt-1" maxLength={100} />
                </div>
                <div>
                  <label className="text-sm font-medium">Kateqoriya *</label>
                  <Select value={form.category} onValueChange={(v) => update("category", v)}>
                    <SelectTrigger className="mt-1"><SelectValue placeholder="Seçin" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Nəqliyyat">Nəqliyyat</SelectItem>
                      <SelectItem value="Elektronika">Elektronika</SelectItem>
                      <SelectItem value="Daşınmaz əmlak">Daşınmaz əmlak</SelectItem>
                      <SelectItem value="Ev və bağ">Ev və bağ</SelectItem>
                      <SelectItem value="Xidmətlər">Xidmətlər</SelectItem>
                      <SelectItem value="Geyim">Geyim</SelectItem>
                      <SelectItem value="Digər">Digər</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Plan</label>
                  <Select value={form.plan} onValueChange={(v) => update("plan", v)}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pulsuz">Pulsuz</SelectItem>
                      <SelectItem value="Biznes">Biznes</SelectItem>
                      <SelectItem value="Premium">Premium</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Lokasiya</label>
                  <Select value={form.location} onValueChange={(v) => update("location", v)}>
                    <SelectTrigger className="mt-1"><SelectValue placeholder="Seçin" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Bakı, Nəsimi">Bakı, Nəsimi</SelectItem>
                      <SelectItem value="Bakı, Yasamal">Bakı, Yasamal</SelectItem>
                      <SelectItem value="Bakı, Səbail">Bakı, Səbail</SelectItem>
                      <SelectItem value="Bakı, Xətai">Bakı, Xətai</SelectItem>
                      <SelectItem value="Sumqayıt">Sumqayıt</SelectItem>
                      <SelectItem value="Gəncə">Gəncə</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Ünvan</label>
                  <Input value={form.address} onChange={(e) => update("address", e.target.value)} placeholder="Küçə, bina №" className="mt-1" maxLength={200} />
                </div>
                <div>
                  <label className="text-sm font-medium">Telefon</label>
                  <Input value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+994 50 XXX XX XX" className="mt-1" maxLength={20} />
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="info@magazaadi.az" className="mt-1" type="email" maxLength={100} />
                </div>
                <div>
                  <label className="text-sm font-medium">Vebsayt</label>
                  <Input value={form.website} onChange={(e) => update("website", e.target.value)} placeholder="https://magazaadi.az" className="mt-1" maxLength={200} />
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium">Təsvir</label>
                  <Textarea value={form.description} onChange={(e) => update("description", e.target.value)} placeholder="Mağaza haqqında qısa təsvir..." className="mt-1" rows={3} maxLength={1000} />
                  <p className="text-[10px] text-muted-foreground mt-1">{form.description.length}/1000</p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 1: İş saatları */}
          {tab === 1 && (
            <div className="space-y-3 animate-fade-in">
              <div className="flex items-center gap-2 mb-2">
                <Clock size={16} className="text-admin-accent" />
                <h4 className="text-sm font-semibold">İş saatları</h4>
              </div>
              {form.workHours.map((h, i) => (
                <div key={h.day} className="flex items-center gap-3 py-1.5">
                  <span className="text-sm font-medium w-[140px]">{h.day}</span>
                  <Switch
                    checked={!h.closed}
                    onCheckedChange={(checked) => updateWorkHour(i, "closed", !checked)}
                  />
                  {h.closed ? (
                    <span className="text-xs text-muted-foreground">Bağlı</span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Input type="time" value={h.open} onChange={(e) => updateWorkHour(i, "open", e.target.value)} className="h-8 w-[110px] text-xs" />
                      <span className="text-muted-foreground text-xs">—</span>
                      <Input type="time" value={h.close} onChange={(e) => updateWorkHour(i, "close", e.target.value)} className="h-8 w-[110px] text-xs" />
                    </div>
                  )}
                </div>
              ))}
              <div className="mt-3 p-3 bg-muted/30 rounded-lg">
                <p className="text-xs text-muted-foreground">💡 İş saatları mağazanın profilində göstəriləcək. Müştərilər mağazanın açıq/bağlı olduğunu görə biləcək.</p>
              </div>
            </div>
          )}

          {/* Tab 2: Sosial media */}
          {tab === 2 && (
            <div className="space-y-4 animate-fade-in">
              <p className="text-xs text-muted-foreground">Sosial media hesablarını əlavə edin — mağaza profilində göstəriləcək.</p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0">
                    <Instagram size={16} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-muted-foreground">Instagram</label>
                    <Input value={form.instagram} onChange={(e) => update("instagram", e.target.value)} placeholder="@magazaadi" className="h-8 mt-0.5" maxLength={100} />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
                    <Facebook size={16} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-muted-foreground">Facebook</label>
                    <Input value={form.facebook} onChange={(e) => update("facebook", e.target.value)} placeholder="facebook.com/magazaadi" className="h-8 mt-0.5" maxLength={200} />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-black flex items-center justify-center shrink-0">
                    <span className="text-white text-xs font-bold">TT</span>
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-muted-foreground">TikTok</label>
                    <Input value={form.tiktok} onChange={(e) => update("tiktok", e.target.value)} placeholder="@magazaadi" className="h-8 mt-0.5" maxLength={100} />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-green-500 flex items-center justify-center shrink-0">
                    <Phone size={16} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-muted-foreground">WhatsApp</label>
                    <Input value={form.whatsapp} onChange={(e) => update("whatsapp", e.target.value)} placeholder="+994 50 XXX XX XX" className="h-8 mt-0.5" maxLength={20} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Görünüş — Logo & Banner */}
          {tab === 3 && (
            <div className="space-y-5 animate-fade-in">
              {/* Logo */}
              <div>
                <label className="text-sm font-medium">Mağaza logosu</label>
                <p className="text-xs text-muted-foreground mb-2">Tövsiyə olunan ölçü: 200×200 px, PNG və ya JPG, maks 5MB</p>
                <div className="flex items-center gap-4">
                  <div
                    onClick={() => logoRef.current?.click()}
                    className="w-24 h-24 rounded-xl border-2 border-dashed border-border hover:border-admin-accent/50 flex items-center justify-center cursor-pointer transition-colors bg-muted/20 overflow-hidden"
                  >
                    {form.logoPreview ? (
                      <img src={form.logoPreview} alt="Logo" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center">
                        <Upload size={20} className="mx-auto text-muted-foreground" />
                        <span className="text-[10px] text-muted-foreground mt-1 block">Logo yüklə</span>
                      </div>
                    )}
                  </div>
                  {form.logoPreview && (
                    <Button variant="ghost" size="sm" className="text-admin-danger" onClick={() => update("logoPreview", null)}>
                      <Trash2 size={14} className="mr-1" /> Sil
                    </Button>
                  )}
                  <input ref={logoRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={(e) => handleFileChange("logoPreview", e)} />
                </div>
              </div>

              {/* Banner */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-sm font-medium">Banner şəkli</label>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleAiBanner}
                    disabled={aiGenerating}
                    className="text-xs h-7"
                  >
                    {aiGenerating ? (
                      <><Loader2 size={12} className="mr-1 animate-spin" /> Generasiya edilir...</>
                    ) : (
                      <><Sparkles size={12} className="mr-1" /> AI ilə yarat</>
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mb-2">Tövsiyə olunan ölçü: 1200×300 px, PNG və ya JPG, maks 5MB</p>
                <div
                  onClick={() => bannerRef.current?.click()}
                  className={cn(
                    "w-full h-32 rounded-xl border-2 border-dashed border-border hover:border-admin-accent/50 flex items-center justify-center cursor-pointer transition-colors bg-muted/20 overflow-hidden",
                    aiGenerating && "pointer-events-none opacity-60"
                  )}
                >
                  {aiGenerating ? (
                    <div className="text-center">
                      <Loader2 size={28} className="mx-auto text-primary animate-spin" />
                      <span className="text-xs text-muted-foreground mt-2 block">AI banner hazırlayır...</span>
                    </div>
                  ) : form.bannerPreview ? (
                    <img src={form.bannerPreview} alt="Banner" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center">
                      <Upload size={24} className="mx-auto text-muted-foreground" />
                      <span className="text-xs text-muted-foreground mt-1 block">Banner yüklə (1200×300)</span>
                    </div>
                  )}
                </div>
                {form.bannerPreview && !aiGenerating && (
                  <div className="flex gap-2 mt-1">
                    <Button variant="ghost" size="sm" className="text-admin-danger" onClick={() => update("bannerPreview", null)}>
                      <Trash2 size={14} className="mr-1" /> Banneri sil
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handleAiBanner} className="text-xs">
                      <Sparkles size={14} className="mr-1" /> Yenidən yarat
                    </Button>
                  </div>
                )}
                <input ref={bannerRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={(e) => handleFileChange("bannerPreview", e)} />
              </div>

              {/* Preview */}
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Önizləmə</h4>
                <div className="border border-border rounded-xl overflow-hidden">
                  <div className="h-20 bg-muted flex items-center justify-center">
                    {form.bannerPreview ? (
                      <img src={form.bannerPreview} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs text-muted-foreground">Banner sahəsi</span>
                    )}
                  </div>
                  <div className="p-3 flex items-center gap-3 -mt-6 relative">
                    <div className="w-12 h-12 rounded-xl border-2 border-card bg-card flex items-center justify-center overflow-hidden shadow-sm">
                      {form.logoPreview ? (
                        <img src={form.logoPreview} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <Store size={20} className="text-muted-foreground" />
                      )}
                    </div>
                    <div className="mt-5">
                      <p className="text-sm font-semibold">{form.name || "Mağaza adı"}</p>
                      <p className="text-[10px] text-muted-foreground">{form.category || "Kateqoriya"} • {form.location || "Lokasiya"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between pt-3 border-t border-border">
          <div className="flex gap-1">
            {tab > 0 && (
              <Button variant="outline" size="sm" onClick={() => setTab(tab - 1)}>← Əvvəlki</Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleClose}>Ləğv</Button>
            {tab < formTabs.length - 1 ? (
              <Button size="sm" className="bg-admin-accent text-accent-foreground hover:bg-admin-accent/90" onClick={() => setTab(tab + 1)}>
                Növbəti →
              </Button>
            ) : (
              <Button size="sm" className="bg-admin-success text-primary-foreground hover:bg-admin-success/90" onClick={handleSave}>
                {editData ? "Yadda saxla" : "Yarat"}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
