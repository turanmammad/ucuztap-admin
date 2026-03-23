import { useState, useEffect } from "react";
import {
  Server, Database, Globe, Shield, HardDrive, Cpu, MemoryStick, Wifi,
  CheckCircle2, AlertTriangle, XCircle, Activity, RefreshCw, Clock,
  ArrowUpRight, ArrowDownRight, Zap, Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area,
} from "recharts";

type ServiceStatus = "operational" | "degraded" | "down";

interface ServiceItem {
  name: string;
  status: ServiceStatus;
  uptime: string;
  responseTime: number;
  icon: typeof Server;
  lastIncident?: string;
}

const initialServices: ServiceItem[] = [
  { name: "Web Server (Nginx)", status: "operational", uptime: "99.98%", responseTime: 42, icon: Globe },
  { name: "API Server", status: "operational", uptime: "99.95%", responseTime: 68, icon: Server },
  { name: "PostgreSQL Database", status: "operational", uptime: "99.99%", responseTime: 12, icon: Database },
  { name: "Redis Cache", status: "operational", uptime: "99.97%", responseTime: 3, icon: Zap },
  { name: "CDN (Cloudflare)", status: "operational", uptime: "100%", responseTime: 8, icon: Globe },
  { name: "Email Server (SMTP)", status: "degraded", uptime: "98.2%", responseTime: 340, icon: Wifi, lastIncident: "2 saat əvvəl — yüksək gecikmə" },
  { name: "Object Storage (S3)", status: "operational", uptime: "99.99%", responseTime: 22, icon: HardDrive },
  { name: "SSL/TLS Sertifikatları", status: "operational", uptime: "100%", responseTime: 0, icon: Shield },
];

const responseTimeHistory = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}:00`,
  api: 40 + Math.floor(Math.random() * 60),
  db: 8 + Math.floor(Math.random() * 15),
  cdn: 5 + Math.floor(Math.random() * 10),
}));

const cpuHistory = Array.from({ length: 30 }, (_, i) => ({
  min: `${i}m`,
  usage: 25 + Math.floor(Math.random() * 35),
}));

const incidentLog = [
  { date: "Bu gün, 14:32", service: "Email Server", type: "warning", message: "SMTP cavab müddəti 300ms-dən yuxarı qalxdı" },
  { date: "Dünən, 22:15", service: "API Server", type: "resolved", message: "Qısa müddətli 502 xətası — avtomatik yenidən başladıldı" },
  { date: "21 Mar, 09:00", service: "Database", type: "maintenance", message: "Planlaşdırılmış baxım — indeks optimallaşdırması" },
  { date: "19 Mar, 16:45", service: "CDN", type: "resolved", message: "Cloudflare keş təmizləndi — müvəffəqiyyətli" },
  { date: "18 Mar, 11:20", service: "SSL", type: "info", message: "SSL sertifikat yeniləmə — ucuztap.az" },
];

const statusConfig: Record<ServiceStatus, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  operational: { label: "İşləyir", color: "text-emerald-500", icon: CheckCircle2 },
  degraded: { label: "Yavaşlama", color: "text-amber-500", icon: AlertTriangle },
  down: { label: "Dayanıb", color: "text-red-500", icon: XCircle },
};

export default function SystemStatusPage() {
  const [services, setServices] = useState(initialServices);
  const [cpuUsage, setCpuUsage] = useState(34);
  const [ramUsage, setRamUsage] = useState(62);
  const [diskUsage, setDiskUsage] = useState(47);
  const [networkIn, setNetworkIn] = useState(124);
  const [networkOut, setNetworkOut] = useState(89);
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCpuUsage(prev => Math.max(10, Math.min(90, prev + Math.floor(Math.random() * 11 - 5))));
      setRamUsage(prev => Math.max(30, Math.min(85, prev + Math.floor(Math.random() * 5 - 2))));
      setNetworkIn(prev => Math.max(50, Math.min(300, prev + Math.floor(Math.random() * 21 - 10))));
      setNetworkOut(prev => Math.max(30, Math.min(200, prev + Math.floor(Math.random() * 15 - 7))));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setServices(prev => prev.map(s =>
        s.name === "Email Server (SMTP)" && Math.random() > 0.5
          ? { ...s, status: "operational" as ServiceStatus, responseTime: 120, lastIncident: undefined }
          : { ...s, responseTime: Math.max(1, s.responseTime + Math.floor(Math.random() * 11 - 5)) }
      ));
      setLastRefresh(new Date());
      setRefreshing(false);
      toast({ title: "✅ Status yeniləndi", description: "Bütün servislər yoxlanıldı" });
    }, 1500);
  };

  const operationalCount = services.filter(s => s.status === "operational").length;
  const overallStatus = services.every(s => s.status === "operational")
    ? "operational" : services.some(s => s.status === "down") ? "down" : "degraded";

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Activity size={22} className="text-emerald-500" />
            Sistem Vəziyyəti
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Son yeniləmə: {lastRefresh.toLocaleTimeString("az-AZ")}
          </p>
        </div>
        <Button onClick={handleRefresh} disabled={refreshing} variant="outline" size="sm" className="gap-2">
          <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
          {refreshing ? "Yenilənir..." : "Yenilə"}
        </Button>
      </div>

      {/* Overall Status Banner */}
      <div className={`rounded-lg border p-4 flex items-center gap-4 ${
        overallStatus === "operational" ? "bg-emerald-500/5 border-emerald-500/20" :
        overallStatus === "degraded" ? "bg-amber-500/5 border-amber-500/20" :
        "bg-red-500/5 border-red-500/20"
      }`}>
        {overallStatus === "operational" ? (
          <CheckCircle2 className="text-emerald-500 shrink-0" size={28} />
        ) : overallStatus === "degraded" ? (
          <AlertTriangle className="text-amber-500 shrink-0" size={28} />
        ) : (
          <XCircle className="text-red-500 shrink-0" size={28} />
        )}
        <div>
          <p className="font-semibold">
            {overallStatus === "operational" ? "Bütün sistemlər işləyir" :
             overallStatus === "degraded" ? "Bəzi sistemlərdə yavaşlama var" :
             "Kritik problem aşkarlandı"}
          </p>
          <p className="text-sm text-muted-foreground">
            {operationalCount}/{services.length} servis normal işləyir
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className={`inline-flex h-2.5 w-2.5 rounded-full ${
            overallStatus === "operational" ? "bg-emerald-500" :
            overallStatus === "degraded" ? "bg-amber-500 animate-pulse" : "bg-red-500 animate-pulse"
          }`} />
          <span className="text-xs font-medium">
            {overallStatus === "operational" ? "Normal" : overallStatus === "degraded" ? "Diqqət" : "Kritik"}
          </span>
        </div>
      </div>

      {/* Server Resources */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <ResourceCard icon={Cpu} label="CPU İstifadəsi" value={cpuUsage} unit="%" color={cpuUsage > 70 ? "amber" : "emerald"} />
        <ResourceCard icon={MemoryStick} label="RAM İstifadəsi" value={ramUsage} unit="%" subtext="8 GB / 16 GB" color={ramUsage > 75 ? "amber" : "emerald"} />
        <ResourceCard icon={HardDrive} label="Disk İstifadəsi" value={diskUsage} unit="%" subtext="94 GB / 200 GB" color={diskUsage > 80 ? "red" : "emerald"} />
        <ResourceCard icon={ArrowDownRight} label="Gələn Trafik" value={networkIn} unit="MB/s" color="blue" />
        <ResourceCard icon={ArrowUpRight} label="Gedən Trafik" value={networkOut} unit="MB/s" color="blue" />
      </div>

      {/* Services Grid */}
      <div id="services" className="bg-card rounded-lg border border-border">
        <div className="p-4 border-b border-border">
          <h3 className="text-sm font-semibold">Servislər</h3>
        </div>
        <div className="divide-y divide-border">
          {services.map((service) => {
            const cfg = statusConfig[service.status];
            const StatusIcon = cfg.icon;
            const SvcIcon = service.icon;
            return (
              <div key={service.name} className="flex items-center gap-4 px-4 py-3 hover:bg-muted/30 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center shrink-0">
                  <SvcIcon size={16} className="text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{service.name}</p>
                  {service.lastIncident && (
                    <p className="text-xs text-amber-500 mt-0.5">{service.lastIncident}</p>
                  )}
                </div>
                <div className="text-right text-xs text-muted-foreground hidden sm:block">
                  <p>Uptime: {service.uptime}</p>
                </div>
                <div className="text-right tabular-nums text-xs min-w-[60px] hidden md:block">
                  <span className={service.responseTime > 200 ? "text-amber-500 font-medium" : "text-muted-foreground"}>
                    {service.responseTime}ms
                  </span>
                </div>
                <div className={`flex items-center gap-1.5 text-xs font-medium ${cfg.color} min-w-[80px] justify-end`}>
                  <StatusIcon size={14} />
                  {cfg.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card rounded-lg border border-border p-5">
          <h3 className="text-sm font-semibold mb-4">Cavab Müddəti (Son 24 saat)</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={responseTimeHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="hour" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" interval={3} />
                <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" unit="ms" />
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))', fontSize: 12 }} />
                <Line type="monotone" dataKey="api" stroke="#3b82f6" strokeWidth={2} dot={false} name="API" />
                <Line type="monotone" dataKey="db" stroke="#22c55e" strokeWidth={2} dot={false} name="Database" />
                <Line type="monotone" dataKey="cdn" stroke="#f59e0b" strokeWidth={2} dot={false} name="CDN" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-card rounded-lg border border-border p-5">
          <h3 className="text-sm font-semibold mb-4">CPU İstifadəsi (Son 30 dəq)</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cpuHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="min" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" interval={4} />
                <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" unit="%" domain={[0, 100]} />
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))', fontSize: 12 }} />
                <defs>
                  <linearGradient id="cpuGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="usage" stroke="#3b82f6" strokeWidth={2} fill="url(#cpuGrad)" name="CPU" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Incident Log */}
      <div className="bg-card rounded-lg border border-border">
        <div className="p-4 border-b border-border">
          <h3 className="text-sm font-semibold">Son Hadisələr</h3>
        </div>
        <div className="divide-y divide-border">
          {incidentLog.map((inc, i) => (
            <div key={i} className="flex items-start gap-3 px-4 py-3 hover:bg-muted/20 transition-colors">
              <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${
                inc.type === "warning" ? "bg-amber-500" :
                inc.type === "resolved" ? "bg-emerald-500" :
                inc.type === "maintenance" ? "bg-blue-500" : "bg-gray-400"
              }`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-medium">{inc.service}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                    inc.type === "warning" ? "bg-amber-500/10 text-amber-600" :
                    inc.type === "resolved" ? "bg-emerald-500/10 text-emerald-600" :
                    inc.type === "maintenance" ? "bg-blue-500/10 text-blue-600" : "bg-gray-100 text-gray-500"
                  }`}>
                    {inc.type === "warning" ? "Xəbərdarlıq" :
                     inc.type === "resolved" ? "Həll olundu" :
                     inc.type === "maintenance" ? "Baxım" : "Məlumat"}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">{inc.message}</p>
              </div>
              <span className="text-[10px] text-muted-foreground whitespace-nowrap shrink-0">{inc.date}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center gap-2 text-sm font-medium mb-3">
            <Clock size={14} className="text-muted-foreground" />
            Uptime
          </div>
          <p className="text-2xl font-bold tabular-nums">45 gün, 12 saat</p>
          <p className="text-xs text-muted-foreground mt-1">Son yenidən başlama: 6 Fevral 2026</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center gap-2 text-sm font-medium mb-3">
            <Eye size={14} className="text-muted-foreground" />
            Canlı İstifadəçilər
          </div>
          <p className="text-2xl font-bold tabular-nums text-emerald-500">2,847</p>
          <p className="text-xs text-muted-foreground mt-1">Hazırda saytda aktiv</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center gap-2 text-sm font-medium mb-3">
            <Database size={14} className="text-muted-foreground" />
            Database
          </div>
          <p className="text-2xl font-bold tabular-nums">4.2 GB</p>
          <p className="text-xs text-muted-foreground mt-1">Sorğu sayı: 12.4K/dəq</p>
        </div>
      </div>
    </div>
  );
}

function ResourceCard({ icon: Icon, label, value, unit, subtext, color }: {
  icon: typeof Cpu; label: string; value: number; unit: string; subtext?: string;
  color: "emerald" | "amber" | "red" | "blue";
}) {
  const colorClasses = {
    emerald: "text-emerald-500",
    amber: "text-amber-500",
    red: "text-red-500",
    blue: "text-blue-500",
  };
  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
        <Icon size={14} />
        {label}
      </div>
      <p className={`text-xl font-bold tabular-nums ${colorClasses[color]}`}>
        {value}{unit}
      </p>
      {subtext && <p className="text-[10px] text-muted-foreground mt-1">{subtext}</p>}
      {unit === "%" && (
        <Progress value={value} className="h-1.5 mt-2" />
      )}
    </div>
  );
}
