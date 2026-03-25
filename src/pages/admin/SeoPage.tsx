import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import {
  Search, Globe, FileText, TrendingUp, AlertTriangle, Check, X, RefreshCw,
  Zap, Eye, Link, Image, Code, BarChart3, ArrowUpRight, ArrowDownRight,
  Clock, Shield, Smartphone, Monitor, ExternalLink, Settings, Wand2,
  ChevronRight, Star, Target, Activity, Hash, Type, Layers,
} from "lucide-react";

// === TYPES ===
interface SeoScore {
  category: string;
  score: number;
  maxScore: number;
  icon: typeof Search;
  issues: { type: "error" | "warning" | "ok"; text: string }[];
}

interface PageSeoData {
  url: string;
  title: string;
  titleLength: number;
  metaDesc: string;
  metaDescLength: number;
  h1Count: number;
  imgWithoutAlt: number;
  brokenLinks: number;
  loadTime: number;
  mobileScore: number;
  indexable: boolean;
  canonical: string;
  ogImage: boolean;
  structuredData: boolean;
  lastCrawled: string;
  score: number;
}

interface AutoSeoRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  lastRun?: string;
  fixedCount?: number;
  category: "meta" | "content" | "technical" | "image";
}

// === MOCK DATA ===
const mockPages: PageSeoData[] = [
  { url: "/", title: "ucuztap.az — Pulsuz Elanlar Saytı", titleLength: 36, metaDesc: "Azərbaycanda ən böyük pulsuz elan saytı. Alış-satış, icarə, xidmət elanları.", metaDescLength: 72, h1Count: 1, imgWithoutAlt: 0, brokenLinks: 0, loadTime: 1.2, mobileScore: 95, indexable: true, canonical: "https://ucuztap.az/", ogImage: true, structuredData: true, lastCrawled: "2026-03-25 08:00", score: 96 },
  { url: "/elanlar", title: "Bütün Elanlar — ucuztap.az", titleLength: 26, metaDesc: "Azərbaycanda pulsuz elanlar. Ən son elanları kəşf edin.", metaDescLength: 54, h1Count: 1, imgWithoutAlt: 3, brokenLinks: 0, loadTime: 1.8, mobileScore: 90, indexable: true, canonical: "https://ucuztap.az/elanlar", ogImage: true, structuredData: true, lastCrawled: "2026-03-25 08:00", score: 82 },
  { url: "/kateqoriya/elektronika", title: "Elektronika — ucuztap.az", titleLength: 24, metaDesc: "", metaDescLength: 0, h1Count: 1, imgWithoutAlt: 5, brokenLinks: 1, loadTime: 2.1, mobileScore: 85, indexable: true, canonical: "", ogImage: false, structuredData: false, lastCrawled: "2026-03-24 14:30", score: 52 },
  { url: "/kateqoriya/neqliyyat", title: "Nəqliyyat Elanları", titleLength: 18, metaDesc: "Avtomobil, motosiklet və digər nəqliyyat elanları.", metaDescLength: 50, h1Count: 2, imgWithoutAlt: 8, brokenLinks: 2, loadTime: 2.5, mobileScore: 78, indexable: true, canonical: "https://ucuztap.az/kateqoriya/neqliyyat", ogImage: true, structuredData: false, lastCrawled: "2026-03-24 14:30", score: 58 },
  { url: "/kateqoriya/emlak", title: "Əmlak", titleLength: 5, metaDesc: "", metaDescLength: 0, h1Count: 0, imgWithoutAlt: 12, brokenLinks: 0, loadTime: 3.0, mobileScore: 72, indexable: true, canonical: "", ogImage: false, structuredData: false, lastCrawled: "2026-03-23 09:00", score: 28 },
  { url: "/elan/12345", title: "iPhone 15 Pro Max satılır — ucuztap.az", titleLength: 38, metaDesc: "iPhone 15 Pro Max, 256GB, ağ rəng. Əla vəziyyətdədir.", metaDescLength: 54, h1Count: 1, imgWithoutAlt: 0, brokenLinks: 0, loadTime: 1.5, mobileScore: 92, indexable: true, canonical: "https://ucuztap.az/elan/12345", ogImage: true, structuredData: true, lastCrawled: "2026-03-25 10:00", score: 94 },
  { url: "/haqqimizda", title: "Haqqımızda", titleLength: 10, metaDesc: "ucuztap.az haqqında məlumat.", metaDescLength: 28, h1Count: 1, imgWithoutAlt: 1, brokenLinks: 0, loadTime: 0.8, mobileScore: 98, indexable: true, canonical: "", ogImage: false, structuredData: false, lastCrawled: "2026-03-20 06:00", score: 62 },
  { url: "/elaqe", title: "Əlaqə — ucuztap.az", titleLength: 18, metaDesc: "", metaDescLength: 0, h1Count: 1, imgWithoutAlt: 0, brokenLinks: 0, loadTime: 0.6, mobileScore: 99, indexable: false, canonical: "", ogImage: false, structuredData: false, lastCrawled: "2026-03-20 06:00", score: 45 },
];

const autoSeoRules: AutoSeoRule[] = [
  { id: "auto-meta-title", name: "Avtomatik Title Tag", description: "Başlığı olmayan və ya qısa olan səhifələrə avtomatik title tag generasiya edir", enabled: true, lastRun: "2026-03-25 06:00", fixedCount: 14, category: "meta" },
  { id: "auto-meta-desc", name: "Avtomatik Meta Description", description: "Meta description olmayan səhifələrə kontentə əsasən avtomatik yaradır", enabled: true, lastRun: "2026-03-25 06:00", fixedCount: 23, category: "meta" },
  { id: "auto-canonical", name: "Avtomatik Canonical URL", description: "Dublikat content riski olan səhifələrə canonical tag əlavə edir", enabled: true, lastRun: "2026-03-25 06:00", fixedCount: 8, category: "technical" },
  { id: "auto-alt-text", name: "Avtomatik Alt Text", description: "Şəkilləri analiz edərək uyğun alt text generasiya edir", enabled: true, lastRun: "2026-03-24 22:00", fixedCount: 156, category: "image" },
  { id: "auto-og-image", name: "OG Image Generasiya", description: "Open Graph şəkli olmayan səhifələrə avtomatik OG image yaradır", enabled: false, lastRun: "2026-03-24 22:00", fixedCount: 5, category: "meta" },
  { id: "auto-structured-data", name: "Schema.org Markup", description: "Elan səhifələrinə Product/Offer, kateqoriyalara ItemList schema əlavə edir", enabled: true, lastRun: "2026-03-25 06:00", fixedCount: 340, category: "technical" },
  { id: "auto-sitemap", name: "Dinamik Sitemap", description: "Yeni elanlar əlavə olunduqca sitemap.xml avtomatik yenilənir", enabled: true, lastRun: "2026-03-25 08:30", fixedCount: 1250, category: "technical" },
  { id: "auto-redirect", name: "Silinmiş Elan Redirect", description: "Silinmiş elan URL-lərini kateqoriya səhifəsinə 301 redirect edir", enabled: true, lastRun: "2026-03-25 07:00", fixedCount: 89, category: "technical" },
  { id: "auto-img-compress", name: "Şəkil Optimizasiya", description: "Yüklənən şəkilləri WebP formatına çevirir və sıxır", enabled: true, lastRun: "2026-03-25 09:00", fixedCount: 4200, category: "image" },
  { id: "auto-internal-links", name: "Daxili Linklər", description: "Elan təsvirindəki açar sözlərə əsasən daxili link təklifləri verir", enabled: false, category: "content" },
  { id: "auto-heading-fix", name: "Heading Strukturu", description: "H1 olmayan və ya çoxlu H1 olan səhifələrin heading strukturunu düzəldir", enabled: true, lastRun: "2026-03-24 22:00", fixedCount: 7, category: "content" },
  { id: "auto-noindex", name: "Boş Kateqoriya Noindex", description: "Elanı olmayan kateqoriya səhifələrinə noindex əlavə edir", enabled: true, lastRun: "2026-03-25 06:00", fixedCount: 3, category: "technical" },
];

const globalSeoMetrics = {
  overallScore: 74,
  indexedPages: 12840,
  totalPages: 13200,
  avgLoadTime: 1.8,
  mobileReady: 92,
  brokenLinks: 3,
  missingMeta: 18,
  missingAlt: 29,
  duplicateContent: 5,
  crawlErrors: 2,
  sitemapPages: 12500,
  robotsTxtValid: true,
};

const scoreColor = (s: number) => s >= 80 ? "text-admin-success" : s >= 50 ? "text-admin-warning" : "text-admin-danger";
const scoreBg = (s: number) => s >= 80 ? "bg-admin-success" : s >= 50 ? "bg-admin-warning" : "bg-admin-danger";

// === COMPONENTS ===

function ScoreCircle({ score, size = 64 }: { score: number; size?: number }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="hsl(var(--border))" strokeWidth={4} />
        <circle cx={size/2} cy={size/2} r={r} fill="none"
          stroke={score >= 80 ? "hsl(var(--admin-success))" : score >= 50 ? "hsl(var(--admin-warning))" : "hsl(var(--admin-danger))"}
          strokeWidth={4} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" className="transition-all duration-700" />
      </svg>
      <span className={cn("absolute text-sm font-bold", scoreColor(score))}>{score}</span>
    </div>
  );
}

function SeoKpiCard({ icon: Icon, label, value, sub, trend, trendUp }: { icon: typeof Search; label: string; value: string | number; sub?: string; trend?: string; trendUp?: boolean }) {
  return (
    <div className="bg-card rounded-lg border border-border p-4 space-y-1">
      <div className="flex items-center justify-between">
        <span className="w-8 h-8 rounded-lg bg-admin-accent/10 flex items-center justify-center"><Icon size={16} className="text-admin-accent" /></span>
        {trend && (
          <span className={cn("text-[10px] font-medium flex items-center gap-0.5", trendUp ? "text-admin-success" : "text-admin-danger")}>
            {trendUp ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />} {trend}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
      {sub && <p className="text-[10px] text-muted-foreground">{sub}</p>}
    </div>
  );
}

// === TABS ===
function OverviewTab() {
  const m = globalSeoMetrics;
  const categoryScores: SeoScore[] = [
    { category: "Meta Taglar", score: 78, maxScore: 100, icon: FileText, issues: [
      { type: "warning", text: `${m.missingMeta} səhifədə meta description yoxdur` },
      { type: "ok", text: "Title taglar optimal uzunluqdadır" },
      { type: "warning", text: "3 səhifədə duplicate title var" },
    ]},
    { category: "Texniki SEO", score: 85, maxScore: 100, icon: Code, issues: [
      { type: "ok", text: "robots.txt faylı validdir" },
      { type: "ok", text: `Sitemap ${m.sitemapPages.toLocaleString()} səhifə ilə aktualdir` },
      { type: "error", text: `${m.crawlErrors} crawl xətası aşkarlandı` },
      { type: "ok", text: "SSL sertifikatı aktivdir" },
    ]},
    { category: "Kontent", score: 65, maxScore: 100, icon: Type, issues: [
      { type: "warning", text: `${m.duplicateContent} dublikat kontent aşkarlandı` },
      { type: "warning", text: "12 səhifədə H1 tag yoxdur" },
      { type: "ok", text: "Kontent uzunluğu əksər səhifələrdə optimaldır" },
    ]},
    { category: "Şəkillər", score: 58, maxScore: 100, icon: Image, issues: [
      { type: "error", text: `${m.missingAlt} şəkildə alt text yoxdur` },
      { type: "warning", text: "15 şəkil 200KB-dan böyükdür" },
      { type: "ok", text: "WebP formatı aktiv istifadədədir" },
    ]},
    { category: "Mobil", score: m.mobileReady, maxScore: 100, icon: Smartphone, issues: [
      { type: "ok", text: "Viewport meta tag bütün səhifələrdə var" },
      { type: "ok", text: "Responsive dizayn aktiv" },
      { type: "warning", text: "3 səhifədə font ölçüsü çox kiçikdir" },
    ]},
    { category: "Performans", score: 72, maxScore: 100, icon: Zap, issues: [
      { type: "ok", text: `Orta yüklənmə vaxtı: ${m.avgLoadTime}s` },
      { type: "warning", text: "2 səhifədə LCP 2.5s-dən çoxdur" },
      { type: "ok", text: "Gzip sıxılma aktivdir" },
    ]},
  ];

  return (
    <div className="space-y-4">
      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <SeoKpiCard icon={TrendingUp} label="Ümumi SEO Skoru" value={`${m.overallScore}/100`} trend="+5" trendUp />
        <SeoKpiCard icon={Globe} label="İndeksə düşən" value={`${m.indexedPages.toLocaleString()}`} sub={`${m.totalPages.toLocaleString()} ümumi səhifədən`} trend="+120" trendUp />
        <SeoKpiCard icon={AlertTriangle} label="Problemlər" value={m.missingMeta + m.missingAlt + m.brokenLinks + m.crawlErrors} sub="Toplam xəta/xəbərdarlıq" trend="-8" trendUp />
        <SeoKpiCard icon={Zap} label="Orta Yüklənmə" value={`${m.avgLoadTime}s`} sub="Son 7 gün" trend="-0.3s" trendUp />
      </div>

      {/* Overall score + categories */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-card rounded-lg border border-border p-5 flex flex-col items-center justify-center gap-3">
          <ScoreCircle score={m.overallScore} size={100} />
          <p className="text-sm font-semibold">Ümumi SEO Skoru</p>
          <p className="text-xs text-muted-foreground text-center">Son yoxlama: Bu gün 08:00</p>
          <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => toast({ title: "🔄 Yenidən skan edilir..." })}>
            <RefreshCw size={12} className="mr-1" /> Yenidən skan et
          </Button>
        </div>
        <div className="lg:col-span-2 space-y-2">
          {categoryScores.map(cat => (
            <div key={cat.category} className="bg-card rounded-lg border border-border p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <cat.icon size={14} className="text-admin-accent" />
                  <span className="text-sm font-medium">{cat.category}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={cat.score} className="w-20 h-1.5" />
                  <span className={cn("text-xs font-bold min-w-[28px] text-right", scoreColor(cat.score))}>{cat.score}</span>
                </div>
              </div>
              <div className="space-y-1">
                {cat.issues.map((issue, i) => (
                  <div key={i} className="flex items-center gap-2 text-[11px]">
                    {issue.type === "ok" && <Check size={10} className="text-admin-success shrink-0" />}
                    {issue.type === "warning" && <AlertTriangle size={10} className="text-admin-warning shrink-0" />}
                    {issue.type === "error" && <X size={10} className="text-admin-danger shrink-0" />}
                    <span className="text-muted-foreground">{issue.text}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PagesTab() {
  const [filter, setFilter] = useState<"all" | "good" | "warning" | "bad">("all");
  const [search, setSearch] = useState("");

  const filtered = mockPages.filter(p => {
    if (search && !p.url.includes(search) && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (filter === "good") return p.score >= 80;
    if (filter === "warning") return p.score >= 50 && p.score < 80;
    if (filter === "bad") return p.score < 50;
    return true;
  });

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-2.5 top-2.5 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Səhifə axtar..." className="pl-8 h-9" />
        </div>
        <div className="flex gap-1.5">
          {(["all", "good", "warning", "bad"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} className={cn(
              "px-3 py-1.5 rounded-md text-xs font-medium transition-all border",
              filter === f ? "border-admin-accent bg-admin-accent/10 text-admin-accent" : "border-border text-muted-foreground hover:border-admin-accent/40"
            )}>
              {f === "all" ? "Hamısı" : f === "good" ? "Yaxşı (80+)" : f === "warning" ? "Orta" : "Zəif (<50)"}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {filtered.map(page => (
          <div key={page.url} className="bg-card rounded-lg border border-border p-4 hover:shadow-sm transition-all">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono text-muted-foreground">{page.url}</span>
                  {!page.indexable && <span className="text-[9px] px-1.5 py-0.5 rounded bg-admin-danger/10 text-admin-danger font-medium">NOINDEX</span>}
                </div>
                <p className="text-sm font-medium mt-0.5 truncate">{page.title}</p>
                {page.metaDesc ? (
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">{page.metaDesc}</p>
                ) : (
                  <p className="text-xs text-admin-danger mt-0.5">⚠ Meta description yoxdur</p>
                )}
                <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground flex-wrap">
                  <span className="flex items-center gap-1"><Type size={9} /> Title: {page.titleLength} simvol</span>
                  <span className="flex items-center gap-1"><Hash size={9} /> H1: {page.h1Count}</span>
                  <span className="flex items-center gap-1"><Image size={9} /> Alt yox: {page.imgWithoutAlt}</span>
                  <span className="flex items-center gap-1"><Link size={9} /> Qırıq link: {page.brokenLinks}</span>
                  <span className="flex items-center gap-1"><Clock size={9} /> {page.loadTime}s</span>
                  <span className="flex items-center gap-1"><Smartphone size={9} /> Mobil: {page.mobileScore}%</span>
                </div>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  {page.ogImage && <span className="text-[9px] px-1.5 py-0.5 rounded bg-admin-success/10 text-admin-success font-medium">OG Image</span>}
                  {page.structuredData && <span className="text-[9px] px-1.5 py-0.5 rounded bg-admin-info/10 text-admin-info font-medium">Schema.org</span>}
                  {page.canonical && <span className="text-[9px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-medium">Canonical</span>}
                  {!page.ogImage && <span className="text-[9px] px-1.5 py-0.5 rounded bg-admin-warning/10 text-admin-warning font-medium">OG yoxdur</span>}
                  {!page.structuredData && <span className="text-[9px] px-1.5 py-0.5 rounded bg-admin-warning/10 text-admin-warning font-medium">Schema yoxdur</span>}
                </div>
              </div>
              <div className="shrink-0 flex flex-col items-center gap-1">
                <ScoreCircle score={page.score} size={48} />
                <span className="text-[9px] text-muted-foreground">{page.lastCrawled.split(" ")[0]}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AutoSeoTab() {
  const [rules, setRules] = useState(autoSeoRules);
  const [running, setRunning] = useState<string | null>(null);
  const [scanProgress, setScanProgress] = useState(0);

  const toggleRule = (id: string) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
    toast({ title: "Auto SEO qaydası yeniləndi" });
  };

  const runRule = (id: string) => {
    setRunning(id);
    setScanProgress(0);
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setRunning(null);
          setRules(prevRules => prevRules.map(r => r.id === id ? {
            ...r, lastRun: new Date().toLocaleString("az-AZ"), fixedCount: (r.fixedCount || 0) + Math.floor(Math.random() * 10) + 1
          } : r));
          toast({ title: "✅ Auto SEO tamamlandı", description: `${autoSeoRules.find(r => r.id === id)?.name} qaydası icra edildi` });
          return 0;
        }
        return prev + Math.random() * 25;
      });
    }, 400);
  };

  const runAll = () => {
    setRunning("all");
    setScanProgress(0);
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setRunning(null);
          setRules(prevRules => prevRules.map(r => r.enabled ? {
            ...r, lastRun: new Date().toLocaleString("az-AZ"), fixedCount: (r.fixedCount || 0) + Math.floor(Math.random() * 15) + 1
          } : r));
          toast({ title: "🚀 Bütün Auto SEO qaydaları icra edildi" });
          return 0;
        }
        return prev + Math.random() * 8;
      });
    }, 300);
  };

  const categoryIcon: Record<string, typeof Search> = { meta: FileText, content: Type, technical: Code, image: Image };
  const categoryLabel: Record<string, string> = { meta: "Meta", content: "Kontent", technical: "Texniki", image: "Şəkil" };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h3 className="text-sm font-semibold flex items-center gap-1.5"><Wand2 size={14} className="text-admin-accent" /> Avtomatik SEO Xidmətləri</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{rules.filter(r => r.enabled).length}/{rules.length} qayda aktiv • Toplam {rules.reduce((a, r) => a + (r.fixedCount || 0), 0).toLocaleString()} düzəliş edilib</p>
        </div>
        <Button size="sm" onClick={runAll} disabled={!!running} className="bg-admin-accent text-accent-foreground hover:bg-admin-accent/90 h-8 text-xs">
          {running === "all" ? <><RefreshCw size={12} className="mr-1 animate-spin" /> İcra olunur...</> : <><Zap size={12} className="mr-1" /> Hamısını işlət</>}
        </Button>
      </div>

      {running && (
        <div className="bg-admin-accent/5 border border-admin-accent/20 rounded-lg p-3 animate-fade-in">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-medium">Auto SEO icra olunur...</span>
            <span className="text-muted-foreground">{Math.min(100, Math.round(scanProgress))}%</span>
          </div>
          <Progress value={Math.min(100, scanProgress)} className="h-1.5" />
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {(["meta", "content", "technical", "image"] as const).map(cat => {
          const catRules = rules.filter(r => r.category === cat);
          const CatIcon = categoryIcon[cat];
          return (
            <div key={cat} className="bg-card rounded-lg border border-border p-3 text-center">
              <CatIcon size={16} className="mx-auto text-admin-accent mb-1" />
              <p className="text-xs font-semibold">{categoryLabel[cat]}</p>
              <p className="text-lg font-bold">{catRules.filter(r => r.enabled).length}/{catRules.length}</p>
              <p className="text-[10px] text-muted-foreground">{catRules.reduce((a, r) => a + (r.fixedCount || 0), 0)} düzəliş</p>
            </div>
          );
        })}
      </div>

      {/* Rules */}
      <div className="space-y-2">
        {rules.map(rule => {
          const CatIcon = categoryIcon[rule.category];
          return (
            <div key={rule.id} className={cn("bg-card rounded-lg border border-border p-4 transition-all", rule.enabled ? "" : "opacity-60")}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <CatIcon size={12} className="text-admin-accent" />
                    <span className="text-sm font-medium">{rule.name}</span>
                    <span className={cn("text-[9px] px-1.5 py-0.5 rounded font-medium", rule.enabled ? "bg-admin-success/10 text-admin-success" : "bg-muted text-muted-foreground")}>
                      {rule.enabled ? "Aktiv" : "Deaktiv"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{rule.description}</p>
                  <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground flex-wrap">
                    {rule.lastRun && <span className="flex items-center gap-1"><Clock size={9} /> Son: {rule.lastRun}</span>}
                    {rule.fixedCount !== undefined && <span className="flex items-center gap-1"><Check size={9} className="text-admin-success" /> {rule.fixedCount} düzəliş</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button size="sm" variant="outline" className="h-7 text-[10px] px-2" disabled={!rule.enabled || !!running} onClick={() => runRule(rule.id)}>
                    {running === rule.id ? <RefreshCw size={10} className="animate-spin" /> : <><Zap size={10} className="mr-0.5" /> İşlət</>}
                  </Button>
                  <Switch checked={rule.enabled} onCheckedChange={() => toggleRule(rule.id)} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SettingsTab() {
  const [robotsTxt, setRobotsTxt] = useState("User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\nSitemap: https://ucuztap.az/sitemap.xml");
  const [sitemapAuto, setSitemapAuto] = useState(true);
  const [indexNewPages, setIndexNewPages] = useState(true);
  const [canonicalAuto, setCanonicalAuto] = useState(true);
  const [ogAutoGenerate, setOgAutoGenerate] = useState(true);
  const [schemaType, setSchemaType] = useState("Product");
  const [googleVerification, setGoogleVerification] = useState("google-verification-code-123");
  const [bingVerification, setBingVerification] = useState("");
  const [yandexVerification, setYandexVerification] = useState("");
  const [analyticsId, setAnalyticsId] = useState("G-XXXXXXXXXX");
  const [yandexMetrikaId, setYandexMetrikaId] = useState("");
  const [defaultTitle, setDefaultTitle] = useState("{elan_basliq} — ucuztap.az");
  const [defaultDesc, setDefaultDesc] = useState("{elan_basliq}. {kateqoriya} elanları ucuztap.az saytında. {qiymet}");

  // Yandex connection status
  const [yandexConnected, setYandexConnected] = useState(false);

  const connectYandex = () => {
    if (!yandexVerification.trim() && !yandexMetrikaId.trim()) {
      toast({ title: "⚠ Yandex məlumatları boşdur", description: "Verification kodu və ya Metrika ID-ni daxil edin", variant: "destructive" });
      return;
    }
    setYandexConnected(true);
    toast({ title: "✅ Yandex qoşuldu", description: "Yandex Webmaster & Metrika uğurla aktivləşdirildi" });
  };

  // Generate head code
  const headCodes: { service: string; code: string; active: boolean }[] = [
    { service: "Google Search Console", code: googleVerification ? `<meta name="google-site-verification" content="${googleVerification}" />` : "", active: !!googleVerification },
    { service: "Bing Webmaster", code: bingVerification ? `<meta name="msvalidate.01" content="${bingVerification}" />` : "", active: !!bingVerification },
    { service: "Yandex Webmaster", code: yandexVerification ? `<meta name="yandex-verification" content="${yandexVerification}" />` : "", active: !!yandexVerification },
    { service: "Google Analytics", code: analyticsId ? `<script async src="https://www.googletagmanager.com/gtag/js?id=${analyticsId}"></script>\n<script>\n  window.dataLayer = window.dataLayer || [];\n  function gtag(){dataLayer.push(arguments);}\n  gtag('js', new Date());\n  gtag('config', '${analyticsId}');\n</script>` : "", active: !!analyticsId },
    { service: "Yandex Metrika", code: yandexMetrikaId ? `<script type="text/javascript">\n  (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};\n  m[i].l=1*new Date();\n  for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}\n  k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})\n  (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");\n  ym(${yandexMetrikaId}, "init", {\n    clickmap:true,\n    trackLinks:true,\n    accurateTrackBounce:true,\n    webvisor:true\n  });\n</script>\n<noscript><div><img src="https://mc.yandex.ru/watch/${yandexMetrikaId}" style="position:absolute; left:-9999px;" alt="" /></div></noscript>` : "", active: !!yandexMetrikaId },
  ];

  const allActiveCode = headCodes.filter(c => c.active).map(c => `<!-- ${c.service} -->\n${c.code}`).join("\n\n");

  return (
    <div className="space-y-4">
      {/* Global templates */}
      <div className="bg-card rounded-lg border border-border p-4 space-y-3">
        <h3 className="text-sm font-semibold flex items-center gap-1.5"><Settings size={14} className="text-admin-accent" /> Ümumi SEO Şablonları</h3>
        <div>
          <label className="text-xs font-medium">Elan Title Şablonu</label>
          <Input value={defaultTitle} onChange={e => setDefaultTitle(e.target.value)} className="mt-1 text-xs font-mono" />
          <p className="text-[10px] text-muted-foreground mt-0.5">Dəyişənlər: {"{elan_basliq}"}, {"{kateqoriya}"}, {"{qiymet}"}, {"{seher}"}</p>
        </div>
        <div>
          <label className="text-xs font-medium">Elan Meta Description Şablonu</label>
          <Textarea value={defaultDesc} onChange={e => setDefaultDesc(e.target.value)} className="mt-1 text-xs font-mono" rows={2} />
        </div>
      </div>

      {/* Toggles */}
      <div className="bg-card rounded-lg border border-border p-4 space-y-3">
        <h3 className="text-sm font-semibold flex items-center gap-1.5"><Globe size={14} className="text-admin-accent" /> İndeksləmə Tənzimləmələri</h3>
        <div className="space-y-3">
          {[
            { label: "Yeni elanları avtomatik indeksləmə", desc: "Google & Yandex-ə yeni elan əlavə olunduqda xəbər verilir", value: indexNewPages, set: setIndexNewPages },
            { label: "Avtomatik canonical URL", desc: "Hər səhifəyə canonical tag avtomatik əlavə olunur", value: canonicalAuto, set: setCanonicalAuto },
            { label: "Dinamik sitemap.xml", desc: "Sitemap yeni elanlarla avtomatik yenilənir (Google & Yandex)", value: sitemapAuto, set: setSitemapAuto },
            { label: "OG Image avtomatik generasiya", desc: "Şəkli olmayan elanlar üçün OG image yaradılır", value: ogAutoGenerate, set: setOgAutoGenerate },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <Switch checked={item.value} onCheckedChange={item.set} />
            </div>
          ))}
        </div>
      </div>

      {/* Schema */}
      <div className="bg-card rounded-lg border border-border p-4 space-y-3">
        <h3 className="text-sm font-semibold flex items-center gap-1.5"><Code size={14} className="text-admin-accent" /> Strukturlaşdırılmış Data</h3>
        <div>
          <label className="text-xs font-medium">Elan Schema Tipi</label>
          <Select value={schemaType} onValueChange={setSchemaType}>
            <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Product">Product (Məhsul)</SelectItem>
              <SelectItem value="Offer">Offer (Təklif)</SelectItem>
              <SelectItem value="Vehicle">Vehicle (Nəqliyyat)</SelectItem>
              <SelectItem value="RealEstateListing">RealEstateListing (Əmlak)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Verification & Analytics — Google + Bing + Yandex */}
      <div className="bg-card rounded-lg border border-border p-4 space-y-4">
        <h3 className="text-sm font-semibold flex items-center gap-1.5"><Shield size={14} className="text-admin-accent" /> Verifikasiya & Analitika</h3>
        
        {/* Google */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-[#4285F4] flex items-center justify-center text-[9px] font-bold text-white">G</div>
            <span className="text-xs font-semibold">Google</span>
            {googleVerification && <span className="text-[9px] bg-admin-success/10 text-admin-success px-1.5 py-0.5 rounded font-medium">Qoşulub ✓</span>}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div><label className="text-xs font-medium">Search Console Verification</label><Input value={googleVerification} onChange={e => setGoogleVerification(e.target.value)} className="mt-1 text-xs font-mono" placeholder="google-site-verification kodu" /></div>
            <div><label className="text-xs font-medium">Analytics ID</label><Input value={analyticsId} onChange={e => setAnalyticsId(e.target.value)} className="mt-1 text-xs font-mono" placeholder="G-XXXXXXXXXX" /></div>
          </div>
        </div>

        {/* Bing */}
        <div className="space-y-2 border-t border-border pt-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-[#008373] flex items-center justify-center text-[9px] font-bold text-white">B</div>
            <span className="text-xs font-semibold">Bing</span>
            {bingVerification && <span className="text-[9px] bg-admin-success/10 text-admin-success px-1.5 py-0.5 rounded font-medium">Qoşulub ✓</span>}
          </div>
          <div><label className="text-xs font-medium">Webmaster Verification</label><Input value={bingVerification} onChange={e => setBingVerification(e.target.value)} className="mt-1 text-xs font-mono" placeholder="msvalidate.01 kodu" /></div>
        </div>

        {/* Yandex */}
        <div className="space-y-2 border-t border-border pt-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-[#FC3F1D] flex items-center justify-center text-[9px] font-bold text-white">Y</div>
            <span className="text-xs font-semibold">Yandex</span>
            {yandexConnected && <span className="text-[9px] bg-admin-success/10 text-admin-success px-1.5 py-0.5 rounded font-medium">Qoşulub ✓</span>}
            {!yandexConnected && (yandexVerification || yandexMetrikaId) && <span className="text-[9px] bg-admin-warning/10 text-admin-warning px-1.5 py-0.5 rounded font-medium">Qoşulmayıb</span>}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium">Yandex Webmaster Verification</label>
              <Input value={yandexVerification} onChange={e => setYandexVerification(e.target.value)} className="mt-1 text-xs font-mono" placeholder="yandex-verification kodu" />
              <p className="text-[10px] text-muted-foreground mt-0.5">webmaster.yandex.com → Saytlar → Doğrulama → Meta tag</p>
            </div>
            <div>
              <label className="text-xs font-medium">Yandex Metrika ID</label>
              <Input value={yandexMetrikaId} onChange={e => setYandexMetrikaId(e.target.value)} className="mt-1 text-xs font-mono" placeholder="12345678" />
              <p className="text-[10px] text-muted-foreground mt-0.5">metrika.yandex.com → Sayğac nömrəsi</p>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Button size="sm" className="h-7 text-[10px] bg-[#FC3F1D] text-white hover:bg-[#FC3F1D]/90" onClick={connectYandex}>
              <Zap size={10} className="mr-1" /> Yandex-i qoş
            </Button>
            <p className="text-[10px] text-muted-foreground">Yandex Webmaster + Metrika eyni anda aktivləşir</p>
          </div>
        </div>
      </div>

      {/* Generated Head Codes */}
      <div className="bg-card rounded-lg border border-border p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold flex items-center gap-1.5"><Code size={14} className="text-admin-accent" /> Generasiya olunmuş HTML Head Kodları</h3>
          <Button size="sm" variant="outline" className="h-7 text-[10px]" onClick={() => {
            navigator.clipboard.writeText(allActiveCode);
            toast({ title: "📋 Kodlar kopyalandı" });
          }}>Hamısını kopyala</Button>
        </div>
        <p className="text-[10px] text-muted-foreground">Bu kodları saytınızın {"<head>"} bölməsinə əlavə edin. Qoşulmuş xidmətlər avtomatik generasiya olunur.</p>
        
        {/* Status badges */}
        <div className="flex flex-wrap gap-1.5">
          {headCodes.map(c => (
            <span key={c.service} className={cn("text-[9px] px-2 py-0.5 rounded font-medium border",
              c.active ? "bg-admin-success/10 text-admin-success border-admin-success/20" : "bg-muted text-muted-foreground border-border"
            )}>
              {c.active ? "✓" : "✗"} {c.service}
            </span>
          ))}
        </div>

        {/* Code blocks per service */}
        {headCodes.filter(c => c.active).map(c => (
          <div key={c.service} className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">{c.service}</span>
              <Button size="sm" variant="ghost" className="h-5 text-[9px] px-2" onClick={() => {
                navigator.clipboard.writeText(c.code);
                toast({ title: `📋 ${c.service} kodu kopyalandı` });
              }}>Kopyala</Button>
            </div>
            <pre className="bg-muted/50 rounded-md p-3 text-[10px] font-mono text-muted-foreground overflow-x-auto whitespace-pre-wrap border border-border">
              {c.code}
            </pre>
          </div>
        ))}

        {headCodes.filter(c => c.active).length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-4">Heç bir xidmət qoşulmayıb. Yuxarıda verification kodlarını daxil edin.</p>
        )}
      </div>

      {/* robots.txt */}
      <div className="bg-card rounded-lg border border-border p-4 space-y-3">
        <h3 className="text-sm font-semibold flex items-center gap-1.5"><FileText size={14} className="text-admin-accent" /> robots.txt</h3>
        <Textarea value={robotsTxt} onChange={e => setRobotsTxt(e.target.value)} className="font-mono text-xs" rows={5} />
      </div>

      <Button className="bg-admin-accent text-accent-foreground hover:bg-admin-accent/90" onClick={() => toast({ title: "✅ SEO tənzimləmələri yadda saxlanıldı" })}>
        Yadda saxla
      </Button>
    </div>
  );
}

// === MAIN PAGE ===
const tabs = [
  { id: "overview", label: "Göstəricilər", icon: BarChart3 },
  { id: "pages", label: "Səhifələr", icon: Globe },
  { id: "auto", label: "Auto SEO", icon: Wand2 },
  { id: "settings", label: "Tənzimləmələr", icon: Settings },
];

export default function SeoPage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Search size={20} className="text-admin-accent" />
            SEO İdarəetmə
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">SEO göstəriciləri, avtomatik optimizasiya və tənzimləmələr</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="text-xs h-8" onClick={() => toast({ title: "🔄 Tam SEO audit başladı..." })}>
            <RefreshCw size={12} className="mr-1" /> Tam Audit
          </Button>
          <Button size="sm" className="bg-admin-accent text-accent-foreground hover:bg-admin-accent/90 h-8 text-xs" onClick={() => toast({ title: "📊 SEO hesabat hazırlanır..." })}>
            <BarChart3 size={12} className="mr-1" /> Hesabat
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-muted/50 p-1 rounded-lg overflow-x-auto">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap",
              activeTab === tab.id ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}>
            <tab.icon size={13} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "overview" && <OverviewTab />}
      {activeTab === "pages" && <PagesTab />}
      {activeTab === "auto" && <AutoSeoTab />}
      {activeTab === "settings" && <SettingsTab />}
    </div>
  );
}
