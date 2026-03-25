import { useState, useEffect, useCallback } from "react";
import { FileText, BarChart3, Users, Clock, Check, X, Eye, Activity, CheckCircle2, AlertTriangle, Shield, MessageSquare, CreditCard, Crown, Star, ArrowUpRight } from "lucide-react";
import { KpiCard } from "@/components/admin/KpiCard";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, AreaChart, Area,
} from "recharts";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const initialLineData = Array.from({ length: 30 }, (_, i) => ({
  day: `${i + 1}`,
  ads: Math.floor(800 + Math.random() * 600),
}));

const pieData = [
  { name: "Nəqliyyat", value: 35, color: "#3b82f6" },
  { name: "Daşınmaz əmlak", value: 25, color: "#22c55e" },
  { name: "Elektronika", value: 20, color: "#f59e0b" },
  { name: "Xidmətlər", value: 12, color: "#a855f7" },
  { name: "Digər", value: 8, color: "#6b7280" },
];

// Message statistics data
const messageStats = [
  { day: "Baz.e", sent: 320, received: 280 },
  { day: "Ç.ax", sent: 450, received: 390 },
  { day: "Çər", sent: 380, received: 340 },
  { day: "C.ax", sent: 520, received: 460 },
  { day: "Cümə", sent: 490, received: 420 },
  { day: "Şən", sent: 250, received: 200 },
  { day: "Bazar", sent: 180, received: 140 },
];

// Payment revenue data (last 12 months)
const paymentRevenueData = [
  { month: "Yan", revenue: 8200, transactions: 120 },
  { month: "Fev", revenue: 9100, transactions: 135 },
  { month: "Mar", revenue: 10500, transactions: 158 },
  { month: "Apr", revenue: 9800, transactions: 142 },
  { month: "May", revenue: 11200, transactions: 168 },
  { month: "İyn", revenue: 12800, transactions: 192 },
  { month: "İyl", revenue: 11500, transactions: 175 },
  { month: "Avq", revenue: 13200, transactions: 198 },
  { month: "Sen", revenue: 14100, transactions: 210 },
  { month: "Okt", revenue: 12900, transactions: 195 },
  { month: "Noy", revenue: 15200, transactions: 228 },
  { month: "Dek", revenue: 12450, transactions: 186 },
];

// VIP/Premium activity data
const vipPremiumData = [
  { name: "VIP", active: 342, revenue: 5130, color: "#f59e0b" },
  { name: "Premium", active: 218, revenue: 3270, color: "#a855f7" },
  { name: "İrəli", active: 856, revenue: 4280, color: "#3b82f6" },
];

const vipTrendData = Array.from({ length: 14 }, (_, i) => ({
  day: `${i + 1}`,
  vip: Math.floor(20 + Math.random() * 15),
  premium: Math.floor(12 + Math.random() * 10),
  ireli: Math.floor(40 + Math.random() * 25),
}));

interface RecentAd {
  id: number;
  title: string;
  user: string;
  category: string;
  status: "gozlemede" | "aktiv" | "redd";
  price: number;
}

const initialRecentAds: RecentAd[] = [
  { id: 1042, title: "Mercedes C220d, 2019", user: "Əli M.", category: "Nəqliyyat", status: "gozlemede", price: 25000 },
  { id: 1041, title: "3 otaqlı mənzil, Nəsimi", user: "Leyla H.", category: "Daşınmaz əmlak", status: "gozlemede", price: 85000 },
  { id: 1040, title: "iPhone 15 Pro Max", user: "Rəşad K.", category: "Elektronika", status: "gozlemede", price: 2800 },
  { id: 1039, title: "Ofis təmiri xidməti", user: "Kamran N.", category: "Xidmətlər", status: "gozlemede", price: 500 },
  { id: 1038, title: "BMW X5, 2021", user: "Nicat V.", category: "Nəqliyyat", status: "gozlemede", price: 62000 },
  { id: 1037, title: "Samsung TV 55\"", user: "Günel Ə.", category: "Elektronika", status: "gozlemede", price: 1200 },
  { id: 1036, title: "2 otaqlı mənzil, Yasamal", user: "Orxan B.", category: "Daşınmaz əmlak", status: "gozlemede", price: 55000 },
];

const initialRecentUsers = [
  { name: "Əli Məmmədov", email: "ali@mail.az", date: "Bu gün, 14:23", ads: 12 },
  { name: "Leyla Həsənova", email: "leyla@gmail.com", date: "Bu gün, 13:45", ads: 5 },
  { name: "Rəşad Kərimov", email: "rashad@mail.az", date: "Bu gün, 12:10", ads: 0 },
  { name: "Nigar Əliyeva", email: "nigar@yahoo.com", date: "Bu gün, 11:30", ads: 3 },
  { name: "Tural İsmayılov", email: "tural@mail.az", date: "Bu gün, 10:15", ads: 8 },
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const [recentAds, setRecentAds] = useState(initialRecentAds);
  const [todayCount, setTodayCount] = useState(1234);
  const [lineData, setLineData] = useState(initialLineData);

  // Simulated live counter
  useEffect(() => {
    const interval = setInterval(() => {
      setTodayCount((c) => c + Math.floor(Math.random() * 3));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Simulated live chart update
  useEffect(() => {
    const interval = setInterval(() => {
      setLineData((prev) => {
        const updated = [...prev];
        const lastIdx = updated.length - 1;
        updated[lastIdx] = { ...updated[lastIdx], ads: updated[lastIdx].ads + Math.floor(Math.random() * 10 - 3) };
        return updated;
      });
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const pendingCount = recentAds.filter((a) => a.status === "gozlemede").length;

  const handleApprove = useCallback((id: number) => {
    setRecentAds((prev) => prev.map((a) => a.id === id ? { ...a, status: "aktiv" as const } : a));
    toast({ title: "✅ Elan təsdiqləndi", description: `Elan #${id} uğurla təsdiqləndi` });
  }, []);

  const handleReject = useCallback((id: number) => {
    setRecentAds((prev) => prev.map((a) => a.id === id ? { ...a, status: "redd" as const } : a));
    toast({ title: "❌ Elan rədd edildi", description: `Elan #${id} rədd edildi` });
  }, []);

  const totalAds = 7_500_000 + todayCount;
  const totalUsers = 176_000 + Math.floor(todayCount / 8);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Ümumi Elanlar"
          value={totalAds >= 1_000_000 ? `${(totalAds / 1_000_000).toFixed(1)}M` : totalAds.toLocaleString()}
          change="↑ 2.3%"
          trend="up"
          icon={FileText}
          color="blue"
          sparkData={[12, 14, 18, 16, 22, 20, 25]}
        />
        <KpiCard
          title="Bu gün"
          value={`${todayCount.toLocaleString()} yeni`}
          change="↑ 12%"
          trend="up"
          icon={BarChart3}
          color="green"
          sparkData={[5, 12, 8, 18, 14, 22, 19]}
        />
        <KpiCard
          title="İstifadəçilər"
          value={`${(totalUsers / 1000).toFixed(0)}K`}
          change="↑ 5.1%"
          trend="up"
          icon={Users}
          color="purple"
          sparkData={[8, 10, 12, 11, 15, 14, 18]}
        />
        <KpiCard
          title="Gözləmədə"
          value={String(pendingCount)}
          change={pendingCount < 5 ? "↓ azalır" : "↑ artır"}
          trend={pendingCount < 5 ? "down" : "up"}
          icon={Clock}
          color="orange"
          sparkData={[20, 18, 22, 15, 12, 10, pendingCount]}
        />
      </div>

      {/* Revenue */}
      <div className="bg-card rounded-lg border border-border p-5">
        <div className="flex items-center gap-8 flex-wrap">
          <div>
            <p className="text-sm text-muted-foreground">Bu ay gəlir</p>
            <p className="text-2xl font-bold tabular-nums">12,450 ₼</p>
          </div>
          <div className="border-l border-border pl-8">
            <p className="text-sm text-muted-foreground">Ötən ay</p>
            <p className="text-xl font-semibold text-muted-foreground tabular-nums">11,200 ₼</p>
          </div>
          <div className="text-admin-success text-sm font-medium">↑ 11.2%</div>
          <div className="ml-auto">
            <Button variant="outline" size="sm" onClick={() => navigate("/hesabatlar")}>
              Ətraflı hesabat →
            </Button>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 bg-card rounded-lg border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold">Yeni elanlar / Gün</h3>
            <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded">Son 30 gün</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))' }} />
                <Line type="monotone" dataKey="ads" stroke="#3b82f6" strokeWidth={2} dot={false} animationDuration={300} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="lg:col-span-2 bg-card rounded-lg border border-border p-5">
          <h3 className="text-sm font-semibold mb-4">Kateqoriyalara görə</h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-3 mt-2">
            {pieData.map((p) => (
              <div key={p.name} className="flex items-center gap-1.5 text-xs">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: p.color }} />
                {p.name} ({p.value}%)
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Ads */}
        <div className="bg-card rounded-lg border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold">Son Elanlar</h3>
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground" onClick={() => navigate("/elanlar")}>
              Hamısını gör →
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground text-left">
                  <th className="pb-2 font-medium">ID</th>
                  <th className="pb-2 font-medium">Başlıq</th>
                  <th className="pb-2 font-medium">Qiymət</th>
                  <th className="pb-2 font-medium">Status</th>
                  <th className="pb-2 font-medium">Əməliyyat</th>
                </tr>
              </thead>
              <tbody>
                {recentAds.slice(0, 6).map((ad) => (
                  <tr key={ad.id} className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors">
                    <td className="py-2.5 text-muted-foreground">#{ad.id}</td>
                    <td className="py-2.5">
                      <div>
                        <span className="font-medium text-xs">{ad.title}</span>
                        <p className="text-[10px] text-muted-foreground">{ad.user} • {ad.category}</p>
                      </div>
                    </td>
                    <td className="py-2.5 font-medium tabular-nums text-xs">{ad.price.toLocaleString()} ₼</td>
                    <td className="py-2.5"><StatusBadge status={ad.status} /></td>
                    <td className="py-2.5">
                      {ad.status === "gozlemede" ? (
                        <div className="flex gap-0.5">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-admin-success hover:bg-admin-success/10"
                            onClick={() => handleApprove(ad.id)}
                          >
                            <Check size={14} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-admin-danger hover:bg-admin-danger/10"
                            onClick={() => handleReject(ad.id)}
                          >
                            <X size={14} />
                          </Button>
                        </div>
                      ) : (
                        <span className="text-[10px] text-muted-foreground italic">
                          {ad.status === "aktiv" ? "Təsdiqləndi" : "Rədd edildi"}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {pendingCount > 0 && (
            <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
              <span className="text-xs text-admin-warning font-medium">{pendingCount} elan hələ gözləyir</span>
              <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => navigate("/elanlar")}>
                Elanlar səhifəsinə keç
              </Button>
            </div>
          )}
        </div>

        {/* Recent Users */}
        <div className="bg-card rounded-lg border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold">Son Qeydiyyatlar</h3>
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground" onClick={() => navigate("/istifadeciler")}>
              Hamısını gör →
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground text-left">
                  <th className="pb-2 font-medium">Ad</th>
                  <th className="pb-2 font-medium">Email</th>
                  <th className="pb-2 font-medium">Elan</th>
                  <th className="pb-2 font-medium">Tarix</th>
                </tr>
              </thead>
              <tbody>
                {initialRecentUsers.map((u, i) => (
                  <tr
                    key={i}
                    className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors cursor-pointer"
                    onClick={() => navigate("/istifadeciler")}
                  >
                    <td className="py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-admin-accent flex items-center justify-center text-[10px] font-bold text-accent-foreground shrink-0">
                          {u.name[0]}
                        </div>
                        <span className="font-medium text-xs">{u.name}</span>
                      </div>
                    </td>
                    <td className="py-2.5 text-muted-foreground text-xs">{u.email}</td>
                    <td className="py-2.5 tabular-nums text-xs">{u.ads}</td>
                    <td className="py-2.5 text-muted-foreground text-[10px]">{u.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Message Statistics & Payment Revenue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card rounded-lg border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <MessageSquare size={14} className="text-primary" />
              Mesaj Statistikası
            </h3>
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground" onClick={() => navigate("/mesajlar")}>
              Ətraflı →
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="text-center p-2 rounded-lg bg-muted/50">
              <p className="text-lg font-bold tabular-nums">2,590</p>
              <p className="text-[10px] text-muted-foreground">Göndərilən</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-muted/50">
              <p className="text-lg font-bold tabular-nums">2,230</p>
              <p className="text-[10px] text-muted-foreground">Alınan</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-muted/50">
              <p className="text-lg font-bold text-destructive tabular-nums">12</p>
              <p className="text-[10px] text-muted-foreground">Spam</p>
            </div>
          </div>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={messageStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))' }} />
                <Bar dataKey="sent" name="Göndərilən" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                <Bar dataKey="received" name="Alınan" fill="#22c55e" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <CreditCard size={14} className="text-primary" />
              Ödəniş Gəlir Qrafiki
            </h3>
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground" onClick={() => navigate("/odenisler")}>
              Ətraflı →
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-2 rounded-lg bg-muted/50">
              <p className="text-[10px] text-muted-foreground">İllik gəlir</p>
              <p className="text-lg font-bold tabular-nums">140,950 ₼</p>
              <p className="text-[10px] text-admin-success font-medium">↑ 23.5%</p>
            </div>
            <div className="p-2 rounded-lg bg-muted/50">
              <p className="text-[10px] text-muted-foreground">Tranzaksiya</p>
              <p className="text-lg font-bold tabular-nums">2,107</p>
              <p className="text-[10px] text-admin-success font-medium">↑ 18.2%</p>
            </div>
          </div>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={paymentRevenueData}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))' }} />
                <Area type="monotone" dataKey="revenue" name="Gəlir (₼)" stroke="#22c55e" strokeWidth={2} fill="url(#revenueGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* VIP/Premium Activity */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {vipPremiumData.map((item) => (
          <div key={item.name} className="bg-card rounded-lg border border-border p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {item.name === "VIP" ? <Crown size={16} style={{ color: item.color }} /> : item.name === "Premium" ? <Star size={16} style={{ color: item.color }} /> : <ArrowUpRight size={16} style={{ color: item.color }} />}
                <h3 className="text-sm font-semibold">{item.name}</h3>
              </div>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: `${item.color}20`, color: item.color }}>Aktiv</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-muted-foreground">Aktiv elanlar</span>
                <span className="text-xl font-bold tabular-nums">{item.active}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-muted-foreground">Gəlir</span>
                <span className="text-sm font-semibold tabular-nums">{item.revenue.toLocaleString()} ₼</span>
              </div>
              <div className="w-full bg-muted rounded-full h-1.5 mt-1">
                <div className="h-1.5 rounded-full transition-all" style={{ width: `${(item.active / 856) * 100}%`, background: item.color }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* VIP/Premium Trend */}
      <div className="bg-card rounded-lg border border-border p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Crown size={14} className="text-amber-500" />
            VIP / Premium / İrəli Aktivlik Trendi
          </h3>
          <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded">Son 14 gün</span>
        </div>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={vipTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))' }} />
              <Line type="monotone" dataKey="vip" name="VIP" stroke="#f59e0b" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="premium" name="Premium" stroke="#a855f7" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="ireli" name="İrəli" stroke="#3b82f6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex gap-4 mt-3 justify-center">
          {[{ name: "VIP", color: "#f59e0b" }, { name: "Premium", color: "#a855f7" }, { name: "İrəli", color: "#3b82f6" }].map((l) => (
            <div key={l.name} className="flex items-center gap-1.5 text-xs">
              <span className="w-2.5 h-0.5 rounded-full" style={{ background: l.color }} />
              {l.name}
            </div>
          ))}
        </div>
      </div>

      {/* System Health Strip */}
      <div className="bg-card rounded-lg border border-border p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Activity size={14} className="text-emerald-500" />
            Sistem Vəziyyəti
          </h3>
          <Button variant="ghost" size="sm" className="text-xs text-muted-foreground" onClick={() => navigate("/sistem")}>
            Ətraflı →
          </Button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { name: "Web Server", status: "ok" },
            { name: "API", status: "ok" },
            { name: "Database", status: "ok" },
            { name: "Email SMTP", status: "warn" },
          ].map((s) => (
            <div key={s.name} className="flex items-center gap-2 text-xs">
              {s.status === "ok" ? (
                <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
              ) : (
                <AlertTriangle size={14} className="text-amber-500 shrink-0" />
              )}
              <span className="text-muted-foreground">{s.name}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Shield size={12} />
            SSL: Aktiv
          </span>
          <span>Uptime: 45 gün</span>
          <span>Canlı: 2,847 istifadəçi</span>
        </div>
      </div>
    </div>
  );
}
