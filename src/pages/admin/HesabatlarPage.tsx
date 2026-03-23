import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell,
} from "recharts";

const revenueData = Array.from({ length: 30 }, (_, i) => ({
  day: `${i + 1}`,
  revenue: Math.floor(300 + Math.random() * 400),
}));

const categoryData = [
  { name: "Nəqliyyat", value: 45230 },
  { name: "Daşınmaz əmlak", value: 32100 },
  { name: "Elektronika", value: 28400 },
  { name: "Xidmətlər", value: 12500 },
  { name: "Ev və bağ", value: 9800 },
];

const cityData = [
  { name: "Bakı", value: 125000 },
  { name: "Sumqayıt", value: 8500 },
  { name: "Gəncə", value: 6200 },
  { name: "Lənkəran", value: 3100 },
  { name: "Mingəçevir", value: 2800 },
];

const deviceData = [
  { name: "Mobile", value: 68, color: "#3b82f6" },
  { name: "Desktop", value: 32, color: "#22c55e" },
];

const userTrend = Array.from({ length: 30 }, (_, i) => ({
  day: `${i + 1}`,
  users: Math.floor(40 + Math.random() * 60),
}));

const arpuData = Array.from({ length: 12 }, (_, i) => ({
  month: ["Yan", "Fev", "Mar", "Apr", "May", "İyn", "İyl", "Avq", "Sen", "Okt", "Noy", "Dek"][i],
  arpu: +(0.05 + Math.random() * 0.08).toFixed(2),
}));

const chartStyle = { borderRadius: 8, border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))' };

export default function HesabatlarPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Hesabatlar</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Download size={14} className="mr-1" /> PDF</Button>
          <Button variant="outline" size="sm"><Download size={14} className="mr-1" /> CSV</Button>
          <Button variant="outline" size="sm"><Download size={14} className="mr-1" /> Excel</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Revenue */}
        <div className="bg-card rounded-lg border border-border p-5">
          <h3 className="text-sm font-semibold mb-4">📈 Gəlir trendi</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={chartStyle} />
                <Line type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category */}
        <div className="bg-card rounded-lg border border-border p-5">
          <h3 className="text-sm font-semibold mb-4">📊 Kateqoriya paylanması</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={120} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={chartStyle} />
                <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* City */}
        <div className="bg-card rounded-lg border border-border p-5">
          <h3 className="text-sm font-semibold mb-4">📍 Şəhər paylanması</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cityData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={100} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={chartStyle} />
                <Bar dataKey="value" fill="#f59e0b" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Device */}
        <div className="bg-card rounded-lg border border-border p-5">
          <h3 className="text-sm font-semibold mb-4">📱 Cihaz: Mobile vs Desktop</h3>
          <div className="h-56 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={deviceData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                  {deviceData.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip contentStyle={chartStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 text-xs">
            {deviceData.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                {d.name} ({d.value}%)
              </div>
            ))}
          </div>
        </div>

        {/* New users */}
        <div className="bg-card rounded-lg border border-border p-5">
          <h3 className="text-sm font-semibold mb-4">👥 Yeni istifadəçilər trendi</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={chartStyle} />
                <Line type="monotone" dataKey="users" stroke="#a855f7" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ARPU */}
        <div className="bg-card rounded-lg border border-border p-5">
          <h3 className="text-sm font-semibold mb-4">💰 ARPU — istifadəçi başına gəlir</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={arpuData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={chartStyle} />
                <Line type="monotone" dataKey="arpu" stroke="#f59e0b" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
