import { KpiCard } from "@/components/admin/KpiCard";
import { CreditCard } from "lucide-react";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { Download, Eye } from "lucide-react";

const payments = Array.from({ length: 12 }, (_, i) => ({
  id: 8000 + i,
  user: ["Əli M.", "Leyla H.", "Rəşad K.", "Kamran N.", "Nicat V."][i % 5],
  amount: [5, 10, 2, 10, 5][i % 5],
  service: ["VIP", "Premium", "İrəli", "Premium", "VIP"][i % 5],
  status: (["odenlib", "odenlib", "gozleyir", "odenlib", "legv"] as const)[i % 5],
  date: "2026-03-" + String(23 - i).padStart(2, "0"),
}));

export default function OdenislerPage() {
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KpiCard title="Bu ay" value="12,450 ₼" change="↑ 11%" trend="up" icon={CreditCard} color="blue" />
        <KpiCard title="Bu həftə" value="3,200 ₼" change="↑ 8%" trend="up" icon={CreditCard} color="green" />
        <KpiCard title="Bu gün" value="450 ₼" change="↑ 15%" trend="up" icon={CreditCard} color="purple" />
      </div>

      <div className="flex justify-end">
        <Button variant="outline" size="sm"><Download size={14} className="mr-1" /> CSV Export</Button>
      </div>

      <div className="bg-card rounded-lg border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground text-left bg-muted/30">
              <th className="p-3 font-medium">ID</th>
              <th className="p-3 font-medium">İstifadəçi</th>
              <th className="p-3 font-medium">Məbləğ</th>
              <th className="p-3 font-medium">Xidmət</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium">Tarix</th>
              <th className="p-3 font-medium">Əməliyyat</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                <td className="p-3 text-muted-foreground">#{p.id}</td>
                <td className="p-3 font-medium">{p.user}</td>
                <td className="p-3 font-medium tabular-nums">{p.amount} ₼</td>
                <td className="p-3">{p.service}</td>
                <td className="p-3"><StatusBadge status={p.status} /></td>
                <td className="p-3 text-muted-foreground text-xs">{p.date}</td>
                <td className="p-3"><Button variant="ghost" size="icon" className="h-7 w-7"><Eye size={13} /></Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
