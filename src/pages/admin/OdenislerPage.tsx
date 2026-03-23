import { useState } from "react";
import { KpiCard } from "@/components/admin/KpiCard";
import { CreditCard, Download, Eye, RotateCcw } from "lucide-react";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

interface Payment {
  id: number;
  user: string;
  amount: number;
  service: string;
  status: "odenlib" | "gozleyir" | "legv" | "qaytarilib";
  date: string;
}

const initialPayments: Payment[] = Array.from({ length: 12 }, (_, i) => ({
  id: 8000 + i,
  user: ["Əli M.", "Leyla H.", "Rəşad K.", "Kamran N.", "Nicat V."][i % 5],
  amount: [5, 10, 2, 10, 5][i % 5],
  service: ["VIP", "Premium", "İrəli", "Premium", "VIP"][i % 5],
  status: (["odenlib", "odenlib", "gozleyir", "odenlib", "legv"] as const)[i % 5],
  date: "2026-03-" + String(23 - i).padStart(2, "0"),
}));

export default function OdenislerPage() {
  const [payments, setPayments] = useState(initialPayments);
  const [viewPayment, setViewPayment] = useState<Payment | null>(null);

  const handleRefund = (id: number) => {
    setPayments((prev) => prev.map((p) => p.id === id ? { ...p, status: "qaytarilib" as const } : p));
    setViewPayment(null);
    toast({ title: "↩️ Ödəniş qaytarıldı", description: `Ödəniş #${id} qaytarıldı` });
  };

  const handleExport = () => {
    const csv = "ID,İstifadəçi,Məbləğ,Xidmət,Status,Tarix\n" +
      payments.map((p) => `${p.id},${p.user},${p.amount} ₼,${p.service},${p.status},${p.date}`).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "odenisler.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "📥 CSV yükləndi", description: "Ödənişlər CSV faylı yükləndi" });
  };

  const totalMonth = payments.filter((p) => p.status === "odenlib").reduce((s, p) => s + p.amount, 0);

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KpiCard title="Bu ay" value={`${totalMonth.toLocaleString()} ₼`} change="↑ 11%" trend="up" icon={CreditCard} color="blue" />
        <KpiCard title="Bu həftə" value="3,200 ₼" change="↑ 8%" trend="up" icon={CreditCard} color="green" />
        <KpiCard title="Bu gün" value="450 ₼" change="↑ 15%" trend="up" icon={CreditCard} color="purple" />
      </div>

      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={handleExport}><Download size={14} className="mr-1" /> CSV Export</Button>
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
                <td className="p-3">
                  <div className="flex gap-0.5">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setViewPayment(p)}><Eye size={13} /></Button>
                    {p.status === "odenlib" && (
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-admin-warning" onClick={() => handleRefund(p.id)}>
                        <RotateCcw size={13} />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!viewPayment} onOpenChange={() => setViewPayment(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Ödəniş #{viewPayment?.id}</DialogTitle>
          </DialogHeader>
          {viewPayment && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">İstifadəçi:</span> <span className="font-medium">{viewPayment.user}</span></div>
                <div><span className="text-muted-foreground">Məbləğ:</span> <span className="font-bold">{viewPayment.amount} ₼</span></div>
                <div><span className="text-muted-foreground">Xidmət:</span> <span className="font-medium">{viewPayment.service}</span></div>
                <div><span className="text-muted-foreground">Tarix:</span> <span className="font-medium">{viewPayment.date}</span></div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Status:</span>
                <StatusBadge status={viewPayment.status} />
              </div>
              {viewPayment.status === "odenlib" && (
                <Button size="sm" variant="outline" className="text-admin-warning border-admin-warning/30 w-full" onClick={() => handleRefund(viewPayment.id)}>
                  <RotateCcw size={14} className="mr-1" /> Ödənişi qaytар
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
