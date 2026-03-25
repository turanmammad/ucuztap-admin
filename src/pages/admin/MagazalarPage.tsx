import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Search, Eye, Check, X, Edit, Store, MapPin, Phone, Mail, Globe, Star, ShoppingBag, Calendar, Plus, Crown, ArrowUpRight, Zap, Shield } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { ShopFormDialog } from "@/components/admin/ShopFormDialog";
import { cn } from "@/lib/utils";

interface Shop {
  id: number;
  name: string;
  owner: string;
  ownerEmail: string;
  ownerPhone: string;
  category: string;
  location: string;
  address: string;
  status: "aktiv" | "gozlemede" | "bloklanmis";
  adsCount: number;
  rating: number;
  reviews: number;
  website?: string;
  description: string;
  joinDate: string;
  logo: string;
  verified: boolean;
  plan: "Pulsuz" | "Biznes" | "Premium";
  monthlyViews: number;
}

const mockShops: Shop[] = Array.from({ length: 18 }, (_, i) => ({
  id: 3000 + i,
  name: [
    "AutoMax Motors", "Bakı Elektronik", "Premium Emlak", "TechStore AZ",
    "Evim Mebel", "MotoWorld", "Digital Plus", "Gold Estate",
    "Smart Gadget", "HomeStyle", "CarHub Baku", "NetMarket",
    "Luxury Property", "PhoneCenter", "Green Garden", "DriveAZ",
    "CompuShop", "ElitHome",
  ][i],
  owner: ["Əli Məmmədov", "Leyla Həsənova", "Rəşad Kərimov", "Kamran Nəsirov", "Nicat Vəliyev", "Günel Əhmədova"][i % 6],
  ownerEmail: ["ali@automax.az", "leyla@bakuelektronik.az", "rashad@premiumemlak.az", "kamran@techstore.az", "nicat@evimmebel.az", "gunel@motoworld.az"][i % 6],
  ownerPhone: "+994 50 " + String(200 + i * 13).slice(0, 3) + " " + String(50 + i * 7).padStart(2, "0") + " " + String(10 + i * 4).padStart(2, "0"),
  category: ["Nəqliyyat", "Elektronika", "Daşınmaz əmlak", "Elektronika", "Ev və bağ", "Nəqliyyat"][i % 6],
  location: ["Bakı, Nəsimi", "Bakı, Yasamal", "Bakı, Səbail", "Bakı, Xətai", "Sumqayıt", "Gəncə"][i % 6],
  address: ["28 May küçəsi 15", "Nizami küçəsi 42", "Neftçilər pr. 88", "Heydər Əliyev pr. 120", "Sumqayıt şəhəri, Sülh küçəsi 5", "Gəncə şəhəri, Atatürk pr. 30"][i % 6],
  status: (["aktiv", "aktiv", "gozlemede", "aktiv", "aktiv", "bloklanmis", "gozlemede", "aktiv", "aktiv", "gozlemede"] as const)[i % 10],
  adsCount: Math.floor(10 + Math.random() * 300),
  rating: +(3.5 + Math.random() * 1.5).toFixed(1),
  reviews: Math.floor(5 + Math.random() * 200),
  website: i % 3 === 0 ? `https://${["automax", "bakuelektronik", "premiumemlak", "techstore", "evimmebel", "motoworld"][i % 6]}.az` : undefined,
  description: [
    "Azərbaycanda ən böyük avtomobil satış mağazası. 10 ildən artıq təcrübə. Zəmanətli avtomobillər.",
    "Ən yeni elektronika məhsulları. Apple, Samsung, Xiaomi rəsmi distribütor.",
    "Bakının ən etibarlı daşınmaz əmlak agentliyi. 5000+ uğurlu əməliyyat.",
    "Texnologiya dünyasının ən son yenilikləri. Sərfəli qiymətlər.",
    "Keyfiyyətli mebel və ev aksesuarları. Pulsuz çatdırılma.",
    "Motosiklet və ehtiyat hissələri. Yamaha, Honda, Kawasaki.",
  ][i % 6],
  joinDate: "2025-" + String(1 + (i % 12)).padStart(2, "0") + "-" + String(5 + (i % 20)).padStart(2, "0"),
  logo: `shop_${i}`,
  verified: i % 3 !== 2,
  plan: (["Pulsuz", "Biznes", "Premium"] as const)[i % 3],
  monthlyViews: Math.floor(500 + Math.random() * 15000),
}));

const planColor: Record<string, string> = {
  Pulsuz: "bg-muted text-muted-foreground",
  Biznes: "bg-admin-info/10 text-admin-info",
  Premium: "bg-admin-accent/15 text-admin-accent",
};

const planConfig = [
  {
    name: "Pulsuz" as const,
    icon: Store,
    price: "0 ₼/ay",
    color: "border-border",
    features: ["5 elan limiti", "Standart axtarış", "Əsas profil", "Email dəstək"],
    missing: ["Prioritet sıralama", "VIP nişanı", "Analitika", "Banner reklam", "API girişi"],
  },
  {
    name: "Biznes" as const,
    icon: Zap,
    price: "29 ₼/ay",
    color: "border-admin-info",
    popular: true,
    features: ["50 elan limiti", "Prioritet sıralama", "Genişlənmiş profil", "Analitika paneli", "Telefon dəstək", "Sosial media inteqrasiya"],
    missing: ["VIP nişanı", "Banner reklam", "API girişi"],
  },
  {
    name: "Premium" as const,
    icon: Crown,
    price: "79 ₼/ay",
    color: "border-admin-accent",
    features: ["Limitsiz elan", "VIP nişanı", "Banner reklam", "Tam analitika", "API girişi", "24/7 dəstək", "Prioritet göstərilmə", "AI alətlər"],
    missing: [],
  },
];

function PlanUpgradeDialog({ shop, open, onClose, onUpgrade }: {
  shop: Shop | null;
  open: boolean;
  onClose: () => void;
  onUpgrade: (id: number, plan: Shop["plan"]) => void;
}) {
  const [selectedPlan, setSelectedPlan] = useState<Shop["plan"] | null>(null);

  if (!shop) return null;

  const currentIndex = planConfig.findIndex((p) => p.name === shop.plan);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crown size={18} className="text-admin-accent" />
            Paket Yüksəltmə — {shop.name}
          </DialogTitle>
        </DialogHeader>

        <div className="mb-4 p-3 bg-muted/30 rounded-lg flex items-center gap-3">
          <Store size={16} className="text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">{shop.name}</p>
            <p className="text-xs text-muted-foreground">Cari plan: <span className={cn("font-semibold px-1.5 py-0.5 rounded text-[10px]", planColor[shop.plan])}>{shop.plan}</span></p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {planConfig.map((plan, idx) => {
            const isCurrent = plan.name === shop.plan;
            const isDowngrade = idx < currentIndex;
            const isSelected = selectedPlan === plan.name;

            return (
              <div
                key={plan.name}
                onClick={() => !isCurrent && !isDowngrade && setSelectedPlan(plan.name)}
                className={cn(
                  "relative rounded-xl border-2 p-4 transition-all cursor-pointer",
                  plan.color,
                  isSelected && "ring-2 ring-primary shadow-lg",
                  isCurrent && "opacity-60 cursor-default",
                  isDowngrade && "opacity-40 cursor-not-allowed",
                  plan.popular && !isCurrent && "shadow-md"
                )}
              >
                {plan.popular && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-admin-info text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full">
                    Populyar
                  </span>
                )}
                <div className="text-center mb-3">
                  <plan.icon size={24} className={cn(
                    "mx-auto mb-2",
                    plan.name === "Pulsuz" ? "text-muted-foreground" : plan.name === "Biznes" ? "text-admin-info" : "text-admin-accent"
                  )} />
                  <h3 className="font-bold text-sm">{plan.name}</h3>
                  <p className="text-lg font-bold mt-1">{plan.price}</p>
                </div>

                <div className="space-y-1.5 mb-4">
                  {plan.features.map((f) => (
                    <div key={f} className="flex items-center gap-1.5 text-xs">
                      <Check size={12} className="text-admin-success shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                  {plan.missing.map((f) => (
                    <div key={f} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <X size={12} className="shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>

                {isCurrent ? (
                  <div className="text-center py-1.5 text-xs font-medium text-muted-foreground bg-muted rounded-lg">Cari plan</div>
                ) : isDowngrade ? (
                  <div className="text-center py-1.5 text-xs font-medium text-muted-foreground bg-muted rounded-lg">Endirilə bilməz</div>
                ) : (
                  <Button
                    size="sm"
                    className={cn(
                      "w-full text-xs",
                      isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-foreground hover:bg-muted/80"
                    )}
                    onClick={(e) => { e.stopPropagation(); setSelectedPlan(plan.name); }}
                  >
                    {isSelected ? "✓ Seçildi" : "Seç"}
                  </Button>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex justify-between pt-3 border-t border-border mt-2">
          <Button variant="outline" size="sm" onClick={onClose}>Ləğv et</Button>
          <Button
            size="sm"
            disabled={!selectedPlan}
            className="bg-admin-accent text-accent-foreground hover:bg-admin-accent/90"
            onClick={() => {
              if (selectedPlan) {
                onUpgrade(shop.id, selectedPlan);
                onClose();
              }
            }}
          >
            <ArrowUpRight size={14} className="mr-1" />
            {selectedPlan ? `${selectedPlan} planına yüksəlt` : "Plan seçin"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ShopDetailDialog({ shop, open, onClose, onApprove, onReject, onBlock, onEdit, onUpgrade }: {
  shop: Shop | null;
  open: boolean;
  onClose: () => void;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
  onBlock: (id: number) => void;
  onEdit: (shop: Shop) => void;
  onUpgrade: (shop: Shop) => void;
}) {
  if (!shop) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Store size={20} className="text-admin-accent" />
            <span>{shop.name}</span>
            <StatusBadge status={shop.status} />
            {shop.verified && <span className="text-xs bg-admin-info/10 text-admin-info px-2 py-0.5 rounded">✓ Təsdiqlənmiş</span>}
            <span className={`text-xs px-2 py-0.5 rounded ${planColor[shop.plan]}`}>{shop.plan}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {/* Logo & basic */}
          <div className="flex gap-4">
            <div className="w-20 h-20 bg-muted rounded-xl flex items-center justify-center shrink-0">
              <Store size={32} className="text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-sm leading-relaxed text-muted-foreground">{shop.description}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: "Elanlar", value: shop.adsCount, icon: ShoppingBag },
              { label: "Reytinq", value: `${shop.rating} ⭐`, icon: Star },
              { label: "Rəylər", value: shop.reviews, icon: Mail },
              { label: "Aylıq baxış", value: shop.monthlyViews.toLocaleString(), icon: Eye },
            ].map((s) => (
              <div key={s.label} className="bg-muted/30 rounded-lg p-3 text-center">
                <p className="text-lg font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase">Mağaza məlumatları</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2"><MapPin size={14} className="text-muted-foreground" /> {shop.location}</div>
                <div className="flex items-center gap-2 text-muted-foreground text-xs">{shop.address}</div>
                <div className="flex items-center gap-2"><Store size={14} className="text-muted-foreground" /> {shop.category}</div>
                {shop.website && <div className="flex items-center gap-2"><Globe size={14} className="text-muted-foreground" /> <a href={shop.website} className="text-admin-info hover:underline text-xs">{shop.website}</a></div>}
                <div className="flex items-center gap-2"><Calendar size={14} className="text-muted-foreground" /> Qoşulma: {shop.joinDate}</div>
              </div>
            </div>

            <div className="bg-muted/30 rounded-lg p-4 space-y-3">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase">Sahibi</h4>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-admin-accent flex items-center justify-center font-bold text-accent-foreground">{shop.owner[0]}</div>
                <div>
                  <p className="text-sm font-medium">{shop.owner}</p>
                </div>
              </div>
              <div className="space-y-1.5 text-sm">
                <div className="flex items-center gap-2"><Mail size={13} className="text-muted-foreground" /> {shop.ownerEmail}</div>
                <div className="flex items-center gap-2"><Phone size={13} className="text-muted-foreground" /> <span className="font-mono text-xs">{shop.ownerPhone}</span></div>
              </div>
            </div>
          </div>

          {/* Recent ads from this shop */}
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Son elanları</h4>
            <div className="space-y-1.5">
              {[1, 2, 3].map((j) => (
                <div key={j} className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-muted/20 transition-colors">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-muted rounded" />
                    <div>
                      <p className="text-xs font-medium">Elan #{shop.id * 10 + j}</p>
                      <p className="text-[10px] text-muted-foreground">{shop.category} — {shop.location}</p>
                    </div>
                  </div>
                  <StatusBadge status="aktiv" />
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2 border-t border-border">
            {shop.status === "gozlemede" && (
              <>
                <Button onClick={() => onApprove(shop.id)} className="bg-admin-success text-primary-foreground hover:bg-admin-success/90 flex-1">
                  <Check size={16} className="mr-1" /> Təsdiqlə
                </Button>
                <Button onClick={() => onReject(shop.id)} variant="outline" className="text-admin-danger border-admin-danger/30 hover:bg-admin-danger/5 flex-1">
                  <X size={16} className="mr-1" /> Rədd et
                </Button>
              </>
            )}
            {shop.status === "aktiv" && (
              <Button onClick={() => onBlock(shop.id)} variant="outline" className="text-admin-danger border-admin-danger/30 hover:bg-admin-danger/5">
                Blokla
              </Button>
            )}
            <Button variant="outline" onClick={() => onEdit(shop)}><Edit size={14} className="mr-1" /> Redaktə et</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function MagazalarPage() {
  const [shops, setShops] = useState(mockShops);
  const [detailShop, setDetailShop] = useState<Shop | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editShop, setEditShop] = useState<Shop | null>(null);
  const [planFilter, setPlanFilter] = useState("all");

  const filtered = shops.filter((s) => {
    if (statusFilter !== "all" && s.status !== statusFilter) return false;
    if (planFilter !== "all") {
      const planMap: Record<string, string> = { free: "Pulsuz", business: "Biznes", premium: "Premium" };
      if (s.plan !== planMap[planFilter]) return false;
    }
    if (searchQuery && !s.name.toLowerCase().includes(searchQuery.toLowerCase()) && !s.owner.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleApprove = (id: number) => {
    setShops((prev) => prev.map((s) => s.id === id ? { ...s, status: "aktiv" as const, verified: true } : s));
    setDetailShop(null);
    toast({ title: "✅ Mağaza təsdiqləndi", description: `Mağaza #${id} uğurla təsdiqləndi` });
  };

  const handleReject = (id: number) => {
    setShops((prev) => prev.filter((s) => s.id !== id));
    setDetailShop(null);
    toast({ title: "❌ Mağaza rədd edildi", description: `Mağaza #${id} rədd edildi` });
  };

  const handleBlock = (id: number) => {
    setShops((prev) => prev.map((s) => s.id === id ? { ...s, status: "bloklanmis" as const } : s));
    setDetailShop(null);
    toast({ title: "🚫 Mağaza bloklandı", description: `Mağaza #${id} bloklandı` });
  };

  const handleCreate = (data: any) => {
    const newShop: Shop = {
      id: 3000 + shops.length + Math.floor(Math.random() * 100),
      name: data.name,
      owner: "Admin User",
      ownerEmail: data.email || "admin@ucuztap.az",
      ownerPhone: data.phone || "+994 50 000 00 00",
      category: data.category,
      location: data.location || "Bakı",
      address: data.address || "",
      status: "aktiv",
      adsCount: 0,
      rating: 0,
      reviews: 0,
      website: data.website || undefined,
      description: data.description,
      joinDate: new Date().toISOString().split("T")[0],
      logo: data.logoPreview || "",
      verified: true,
      plan: (data.plan || "Pulsuz") as Shop["plan"],
      monthlyViews: 0,
    };
    setShops((prev) => [newShop, ...prev]);
    setFormOpen(false);
    toast({ title: "✅ Mağaza yaradıldı", description: `"${data.name}" uğurla yaradıldı` });
  };

  const handleEdit = (data: any) => {
    if (!editShop) return;
    setShops((prev) => prev.map((s) => s.id === editShop.id ? {
      ...s,
      name: data.name || s.name,
      category: data.category || s.category,
      location: data.location || s.location,
      address: data.address || s.address,
      description: data.description || s.description,
      website: data.website || s.website,
      plan: (data.plan || s.plan) as Shop["plan"],
    } : s));
    setEditShop(null);
    toast({ title: "✅ Mağaza yeniləndi", description: `"${data.name}" uğurla yeniləndi` });
  };

  const openEdit = (shop: Shop) => {
    setDetailShop(null);
    setEditShop(shop);
  };

  const pendingCount = shops.filter((s) => s.status === "gozlemede").length;

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Pending banner */}
      {pendingCount > 0 && (
        <div className="bg-admin-warning/5 border border-admin-warning/20 rounded-lg px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-admin-warning/10 flex items-center justify-center">
              <Store size={16} className="text-admin-warning" />
            </span>
            <div>
              <p className="text-sm font-medium">{pendingCount} mağaza təsdiq gözləyir</p>
              <p className="text-xs text-muted-foreground">Yeni mağaza müraciətlərini nəzərdən keçirin</p>
            </div>
          </div>
          <Button size="sm" variant="outline" onClick={() => setStatusFilter("gozlemede")} className="border-admin-warning/30 text-admin-warning hover:bg-admin-warning/5">
            Gözləyənləri göstər
          </Button>
        </div>
      )}

      {/* Header + Stats */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Mağazalar</h2>
        <Button size="sm" className="bg-admin-accent text-accent-foreground hover:bg-admin-accent/90" onClick={() => setFormOpen(true)}>
          <Plus size={14} className="mr-1" /> Yeni mağaza
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        {[
          { label: "Ümumi mağazalar", value: shops.length, color: "text-admin-info" },
          { label: "Aktiv", value: shops.filter((s) => s.status === "aktiv").length, color: "text-admin-success" },
          { label: "Gözləmədə", value: pendingCount, color: "text-admin-warning" },
          { label: "Bloklanmış", value: shops.filter((s) => s.status === "bloklanmis").length, color: "text-admin-danger" },
        ].map((stat) => (
          <div key={stat.label} className="bg-card rounded-lg border border-border p-4 text-center">
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-card rounded-lg border border-border p-4 flex flex-wrap gap-3 items-end">
        <Input
          placeholder="Mağaza adı və ya sahib axtar..."
          className="h-9 flex-1 min-w-[200px]"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px] h-9"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Hamısı</SelectItem>
            <SelectItem value="aktiv">Aktiv</SelectItem>
            <SelectItem value="gozlemede">Gözləmədə</SelectItem>
            <SelectItem value="bloklanmis">Bloklanmış</SelectItem>
          </SelectContent>
        </Select>
        <Select value={planFilter} onValueChange={setPlanFilter}>
          <SelectTrigger className="w-[140px] h-9"><SelectValue placeholder="Plan" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Hamısı</SelectItem>
            <SelectItem value="free">Pulsuz</SelectItem>
            <SelectItem value="business">Biznes</SelectItem>
            <SelectItem value="premium">Premium</SelectItem>
          </SelectContent>
        </Select>
        <Button size="sm" className="bg-admin-accent text-accent-foreground hover:bg-admin-accent/90">
          <Search size={14} className="mr-1" /> Axtar
        </Button>
        {(statusFilter !== "all" || planFilter !== "all" || searchQuery) && (
          <Button size="sm" variant="ghost" onClick={() => { setStatusFilter("all"); setPlanFilter("all"); setSearchQuery(""); }} className="text-xs">
            <X size={12} className="mr-1" /> Sıfırla
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="bg-card rounded-lg border border-border overflow-x-auto">
        <table className="min-w-[900px] w-full text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground text-left bg-muted/30">
              <th className="p-3 font-medium w-[50px]">ID</th>
              <th className="p-3 font-medium">Mağaza</th>
              <th className="p-3 font-medium w-[100px]">Sahib</th>
              <th className="p-3 font-medium w-[90px]">Kateqoriya</th>
              <th className="p-3 font-medium w-[90px]">Lokasiya</th>
              <th className="p-3 font-medium w-[55px]">Elanlar</th>
              <th className="p-3 font-medium w-[60px]">Reytinq</th>
              <th className="p-3 font-medium w-[65px]">Plan</th>
              <th className="p-3 font-medium w-[70px]">Status</th>
              <th className="p-3 font-medium w-[110px]">Əməliyyat</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((shop) => (
              <tr
                key={shop.id}
                className={`border-b border-border/50 hover:bg-muted/20 transition-colors cursor-pointer ${shop.status === "gozlemede" ? "bg-admin-warning/[0.02]" : ""}`}
                onClick={() => setDetailShop(shop)}
              >
                <td className="p-3 text-muted-foreground text-xs">#{shop.id}</td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-muted rounded-lg flex items-center justify-center shrink-0">
                      <Store size={13} className="text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                      <span className="font-medium text-xs truncate block">{shop.name}</span>
                      {shop.verified && <span className="text-admin-info text-[9px]">✓ Təsdiqlənmiş</span>}
                    </div>
                  </div>
                </td>
                <td className="p-3 text-xs truncate max-w-[100px]">{shop.owner}</td>
                <td className="p-3 text-muted-foreground text-xs">{shop.category}</td>
                <td className="p-3 text-muted-foreground text-xs">{shop.location}</td>
                <td className="p-3 tabular-nums text-xs">{shop.adsCount}</td>
                <td className="p-3">
                  <div className="flex items-center gap-1 text-xs">
                    <Star size={11} className="text-admin-accent fill-admin-accent" />
                    {shop.rating}
                  </div>
                </td>
                <td className="p-3">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${planColor[shop.plan]}`}>{shop.plan}</span>
                </td>
                <td className="p-3"><StatusBadge status={shop.status} /></td>
                <td className="p-3" onClick={(e) => e.stopPropagation()}>
                  <div className="flex gap-0.5">
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setDetailShop(shop)}><Eye size={12} /></Button>
                    {shop.status === "gozlemede" && (
                      <>
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-admin-success" onClick={() => handleApprove(shop.id)}><Check size={12} /></Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-admin-danger" onClick={() => handleReject(shop.id)}><X size={12} /></Button>
                      </>
                    )}
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => openEdit(shop)}><Edit size={12} /></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Dialog */}
      <ShopDetailDialog
        shop={detailShop}
        open={!!detailShop}
        onClose={() => setDetailShop(null)}
        onApprove={handleApprove}
        onReject={handleReject}
        onBlock={handleBlock}
        onEdit={openEdit}
      />

      {/* Create Dialog */}
      <ShopFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleCreate}
        title="Yeni mağaza yarat"
      />

      {/* Edit Dialog */}
      <ShopFormDialog
        open={!!editShop}
        onClose={() => setEditShop(null)}
        onSave={handleEdit}
        title={editShop ? `"${editShop.name}" — Redaktə` : ""}
        editData={editShop ? {
          name: editShop.name,
          description: editShop.description,
          category: editShop.category,
          location: editShop.location,
          address: editShop.address,
          phone: editShop.ownerPhone,
          email: editShop.ownerEmail,
          website: editShop.website || "",
          plan: editShop.plan,
        } : null}
      />
    </div>
  );
}
