import { FileText, BarChart3, Users, Clock } from "lucide-react";
import { KpiCard } from "@/components/admin/KpiCard";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

const lineData = Array.from({ length: 30 }, (_, i) => ({
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

const recentAds = [
  { id: 1042, title: "Mercedes C220d, 2019", user: "Əli M.", category: "Nəqliyyat", status: "gozlemede" as const },
  { id: 1041, title: "3 otaqlı mənzil, Nəsimi", user: "Leyla H.", category: "Daşınmaz əmlak", status: "gozlemede" as const },
  { id: 1040, title: "iPhone 15 Pro Max", user: "Rəşad K.", category: "Elektronika", status: "gozlemede" as const },
  { id: 1039, title: "Ofis təmiri xidməti", user: "Kamran N.", category: "Xidmətlər", status: "gozlemede" as const },
  { id: 1038, title: "BMW X5, 2021", user: "Nicat V.", category: "Nəqliyyat", status: "gozlemede" as const },
];

const recentUsers = [
  { name: "Əli Məmmədov", email: "ali@mail.az", date: "Bu gün, 14:23" },
  { name: "Leyla Həsənova", email: "leyla@gmail.com", date: "Bu gün, 13:45" },
  { name: "Rəşad Kərimov", email: "rashad@mail.az", date: "Bu gün, 12:10" },
  { name: "Nigar Əliyeva", email: "nigar@yahoo.com", date: "Bu gün, 11:30" },
  { name: "Tural İsmayılov", email: "tural@mail.az", date: "Bu gün, 10:15" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Ümumi Elanlar" value="7.5M" change="↑ 2.3%" trend="up" icon={FileText} color="blue" />
        <KpiCard title="Bu gün" value="1,234 yeni" change="↑ 12%" trend="up" icon={BarChart3} color="green" />
        <KpiCard title="İstifadəçilər" value="176K" change="↑ 5.1%" trend="up" icon={Users} color="purple" />
        <KpiCard title="Gözləmədə" value="456" change="↓ 8%" trend="down" icon={Clock} color="orange" />
      </div>

      {/* Revenue */}
      <div className="bg-card rounded-lg border border-border p-5">
        <div className="flex items-center gap-8">
          <div>
            <p className="text-sm text-muted-foreground">Bu ay gəlir</p>
            <p className="text-2xl font-bold">12,450 ₼</p>
          </div>
          <div className="border-l border-border pl-8">
            <p className="text-sm text-muted-foreground">Ötən ay</p>
            <p className="text-xl font-semibold text-muted-foreground">11,200 ₼</p>
          </div>
          <div className="text-admin-success text-sm font-medium">↑ 11.2%</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 bg-card rounded-lg border border-border p-5">
          <h3 className="text-sm font-semibold mb-4">Yeni elanlar / Gün</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))' }} />
                <Line type="monotone" dataKey="ads" stroke="#3b82f6" strokeWidth={2} dot={false} />
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
                {p.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Ads */}
        <div className="bg-card rounded-lg border border-border p-5">
          <h3 className="text-sm font-semibold mb-4">Son Elanlar</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground text-left">
                  <th className="pb-2 font-medium">ID</th>
                  <th className="pb-2 font-medium">Başlıq</th>
                  <th className="pb-2 font-medium">Status</th>
                  <th className="pb-2 font-medium">Əməliyyat</th>
                </tr>
              </thead>
              <tbody>
                {recentAds.map((ad) => (
                  <tr key={ad.id} className="border-b border-border/50 last:border-0">
                    <td className="py-2.5 text-muted-foreground">#{ad.id}</td>
                    <td className="py-2.5 font-medium">{ad.title}</td>
                    <td className="py-2.5"><StatusBadge status={ad.status} /></td>
                    <td className="py-2.5">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-admin-success"><Check size={14} /></Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-admin-danger"><X size={14} /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-card rounded-lg border border-border p-5">
          <h3 className="text-sm font-semibold mb-4">Son Qeydiyyatlar</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground text-left">
                  <th className="pb-2 font-medium">Ad</th>
                  <th className="pb-2 font-medium">Email</th>
                  <th className="pb-2 font-medium">Tarix</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.map((u, i) => (
                  <tr key={i} className="border-b border-border/50 last:border-0">
                    <td className="py-2.5 font-medium">{u.name}</td>
                    <td className="py-2.5 text-muted-foreground">{u.email}</td>
                    <td className="py-2.5 text-muted-foreground text-xs">{u.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
