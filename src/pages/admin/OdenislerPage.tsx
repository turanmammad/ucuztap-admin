import { useState } from "react";
import { KpiCard } from "@/components/admin/KpiCard";
import { CreditCard, Download, Eye, RotateCcw, Search, X, Filter, ArrowUpDown, ChevronLeft, ChevronRight, TrendingUp, Receipt, Clock, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { DateRangeFilter, ExcelExportButton } from "@/components/admin/TableToolbar";
import { SortableHeader } from "@/components/admin/SortableHeader";
import { exportToExcel, isInDateRange, sortData, nextSortDir, type SortDir } from "@/lib/table-utils";
import { format } from "date-fns";

interface Payment {
  id: number;
  user: string;
  userEmail: string;
  amount: number;
  service: string;
  method: string;
  status: "odenlib" | "gozleyir" | "legv" | "qaytarilib";
  date: string;
  transactionId: string;
  ip: string;
  note?: string;
}

const initialPayments: Payment[] = Array.from({ length: 40 }, (_, i) => ({
  id: 8000 + i,
  user: ["Əli M.", "Leyla H.", "Rəşad K.", "Kamran N.", "Nicat V.", "Günel Ə.", "Orxan B.", "Səbinə İ."][i % 8],
  userEmail: ["ali@mail.az", "leyla@gmail.com", "rashad@mail.az", "kamran@outlook.com", "nicat@mail.az", "gunel@gmail.com", "orxan@mail.az", "sebine@yahoo.com"][i % 8],
  amount: [5, 10, 2, 10, 5, 15, 2, 20][i % 8],
  service: ["VIP", "Premium", "İrəli", "Premium", "VIP", "Mağaza Biznes", "İrəli", "Mağaza Premium"][i % 8],
  method: ["Payriff", "Kart", "Balans", "Payriff", "Kart"][i % 5],
  status: (["odenlib", "odenlib", "gozleyir", "odenlib", "legv", "odenlib", "qaytarilib", "odenlib"] as const)[i % 8],
  date: "2026-03-" + String(25 - (i % 25)).padStart(2, "0") + " " + String(8 + (i % 16)).padStart(2, "0") + ":" + String(10 + i * 2).slice(0, 2).padStart(2, "0"),
  transactionId: "TXN" + String(100000 + i * 37),
  ip: `185.129.${40 + (i % 20)}.${10 + (i % 100)}`,
  note: i % 7 === 0 ? "Müştəri tərəfindən şikayət edilib" : undefined,
}));

export default function OdenislerPage() {
  const [payments, setPayments] = useState(initialPayments);
  const [viewPayment, setViewPayment] = useState<Payment | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"date" | "amount">("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 15;

  const handleRefund = (id: number) => {
    setPayments((prev) => prev.map((p) => p.id === id ? { ...p, status: "qaytarilib" as const } : p));
    setViewPayment(null);
    toast({ title: "↩️ Ödəniş qaytarıldı", description: `Ödəniş #${id} qaytarıldı` });
  };

  const handleCancel = (id: number) => {
    setPayments((prev) => prev.map((p) => p.id === id ? { ...p, status: "legv" as const } : p));
    setViewPayment(null);
    toast({ title: "❌ Ödəniş ləğv edildi", description: `Ödəniş #${id} ləğv olundu` });
  };

  const handleApprove = (id: number) => {
    setPayments((prev) => prev.map((p) => p.id === id ? { ...p, status: "odenlib" as const } : p));
    setViewPayment(null);
    toast({ title: "✅ Ödəniş təsdiqləndi", description: `Ödəniş #${id} təsdiqləndi` });
  };

  const handleExport = () => {
    const csv = "ID,İstifadəçi,Email,Məbləğ,Xidmət,Metod,Status,Tarix,Transaction ID\n" +
      payments.map((p) => `${p.id},${p.user},${p.userEmail},${p.amount} ₼,${p.service},${p.method},${p.status},${p.date},${p.transactionId}`).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "odenisler.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "📥 CSV yükləndi" });
  };

  const filtered = payments.filter(p => {
    if (statusFilter !== "all" && p.status !== statusFilter) return false;
    if (serviceFilter !== "all" && p.service !== serviceFilter) return false;
    if (methodFilter !== "all" && p.method !== methodFilter) return false;
    if (dateFilter === "today" && !p.date.startsWith("2026-03-25")) return false;
    if (dateFilter === "week" && !["2026-03-25", "2026-03-24", "2026-03-23", "2026-03-22", "2026-03-21", "2026-03-20", "2026-03-19"].some(d => p.date.startsWith(d))) return false;
    if (searchQuery && !p.user.toLowerCase().includes(searchQuery.toLowerCase()) && !p.transactionId.toLowerCase().includes(searchQuery.toLowerCase()) && !p.userEmail.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  }).sort((a, b) => {
    const mul = sortDir === "desc" ? -1 : 1;
    if (sortBy === "amount") return (a.amount - b.amount) * mul;
    return a.date.localeCompare(b.date) * mul;
  });

  const pageCount = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const totalAll = payments.filter(p => p.status === "odenlib").reduce((s, p) => s + p.amount, 0);
  const totalPending = payments.filter(p => p.status === "gozleyir").reduce((s, p) => s + p.amount, 0);
  const totalRefunded = payments.filter(p => p.status === "qaytarilib").reduce((s, p) => s + p.amount, 0);
  const totalCancelled = payments.filter(p => p.status === "legv").reduce((s, p) => s + p.amount, 0);
  const successRate = payments.length > 0 ? Math.round(payments.filter(p => p.status === "odenlib").length / payments.length * 100) : 0;

  const services = [...new Set(payments.map(p => p.service))];
  const methods = [...new Set(payments.map(p => p.method))];

  return (
    <div className="space-y-4 animate-fade-in">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: "Ümumi gəlir", value: `${totalAll.toLocaleString()} ₼`, icon: CreditCard, color: "text-admin-success", bg: "bg-admin-success/10" },
          { label: "Gözləyir", value: `${totalPending.toLocaleString()} ₼`, icon: Clock, color: "text-admin-warning", bg: "bg-admin-warning/10" },
          { label: "Qaytarılıb", value: `${totalRefunded.toLocaleString()} ₼`, icon: RotateCcw, color: "text-admin-info", bg: "bg-admin-info/10" },
          { label: "Ləğv", value: `${totalCancelled.toLocaleString()} ₼`, icon: XCircle, color: "text-admin-danger", bg: "bg-admin-danger/10" },
          { label: "Uğur faizi", value: `${successRate}%`, icon: CheckCircle, color: "text-admin-success", bg: "bg-admin-success/10" },
          { label: "Ödənişlər", value: String(payments.length), icon: Receipt, color: "text-admin-info", bg: "bg-admin-info/10" },
        ].map(kpi => (
          <div key={kpi.label} className="bg-card rounded-lg border border-border p-3">
            <div className="flex items-center gap-2 mb-1">
              <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center", kpi.bg)}>
                <kpi.icon size={14} className={kpi.color} />
              </div>
            </div>
            <p className={cn("text-lg font-bold", kpi.color)}>{kpi.value}</p>
            <p className="text-[10px] text-muted-foreground">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-card rounded-lg border border-border p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:items-end flex-wrap">
          <Input placeholder="Axtar (ad, email, TXN)..." className="h-9 flex-1 min-w-[180px]" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          <Select value={statusFilter} onValueChange={v => { setStatusFilter(v); setCurrentPage(1); }}>
            <SelectTrigger className="w-[130px] h-9"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Hamısı</SelectItem>
              <SelectItem value="odenlib">Ödənilib ✅</SelectItem>
              <SelectItem value="gozleyir">Gözləyir ⏳</SelectItem>
              <SelectItem value="legv">Ləğv ❌</SelectItem>
              <SelectItem value="qaytarilib">Qaytarılıb ↩️</SelectItem>
            </SelectContent>
          </Select>
          <Select value={serviceFilter} onValueChange={v => { setServiceFilter(v); setCurrentPage(1); }}>
            <SelectTrigger className="w-[140px] h-9"><SelectValue placeholder="Xidmət" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Bütün xidmətlər</SelectItem>
              {services.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={methodFilter} onValueChange={v => { setMethodFilter(v); setCurrentPage(1); }}>
            <SelectTrigger className="w-[120px] h-9"><SelectValue placeholder="Metod" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Hamısı</SelectItem>
              {methods.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={dateFilter} onValueChange={v => { setDateFilter(v); setCurrentPage(1); }}>
            <SelectTrigger className="w-[120px] h-9"><SelectValue placeholder="Tarix" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Hamısı</SelectItem>
              <SelectItem value="today">Bu gün</SelectItem>
              <SelectItem value="week">Bu həftə</SelectItem>
            </SelectContent>
          </Select>
          <Button size="sm" variant="outline" onClick={handleExport}><Download size={14} className="mr-1" /> CSV</Button>
          {(statusFilter !== "all" || serviceFilter !== "all" || methodFilter !== "all" || dateFilter !== "all" || searchQuery) && (
            <Button size="sm" variant="ghost" className="text-xs" onClick={() => { setStatusFilter("all"); setServiceFilter("all"); setMethodFilter("all"); setDateFilter("all"); setSearchQuery(""); }}>
              <X size={12} className="mr-1" /> Sıfırla
            </Button>
          )}
        </div>
      </div>

      <div className="text-xs text-muted-foreground flex items-center justify-between">
        <span>{filtered.length} ödəniş tapıldı</span>
        <Button size="sm" variant="ghost" className="text-xs h-7" onClick={() => { setSortBy(sortBy === "date" ? "amount" : "date"); setSortDir("desc"); }}>
          <ArrowUpDown size={12} className="mr-1" /> {sortBy === "date" ? "Tarixə görə" : "Məbləğə görə"}
        </Button>
      </div>

      {/* Table */}
      <div className="bg-card rounded-lg border border-border overflow-x-auto">
        <table className="w-full text-sm" style={{ minWidth: 800 }}>
          <thead>
            <tr className="border-b border-border text-muted-foreground text-left bg-muted/30 text-xs">
              <th className="p-3 font-medium">ID</th>
              <th className="p-3 font-medium">İstifadəçi</th>
              <th className="p-3 font-medium">Məbləğ</th>
              <th className="p-3 font-medium">Xidmət</th>
              <th className="p-3 font-medium">Metod</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium">Tarix</th>
              <th className="p-3 font-medium">TXN</th>
              <th className="p-3 font-medium">Əməliyyat</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((p) => (
              <tr key={p.id} className={cn("border-b border-border/50 hover:bg-muted/20 transition-colors cursor-pointer", p.note && "bg-admin-warning/[0.02]")} onClick={() => setViewPayment(p)}>
                <td className="p-3 text-muted-foreground text-xs">#{p.id}</td>
                <td className="p-3">
                  <div>
                    <span className="font-medium text-xs">{p.user}</span>
                    <p className="text-[10px] text-muted-foreground">{p.userEmail}</p>
                  </div>
                </td>
                <td className="p-3 font-bold tabular-nums text-xs">{p.amount} ₼</td>
                <td className="p-3 text-xs">{p.service}</td>
                <td className="p-3 text-xs text-muted-foreground">{p.method}</td>
                <td className="p-3"><StatusBadge status={p.status} /></td>
                <td className="p-3 text-muted-foreground text-[10px] whitespace-nowrap">{p.date}</td>
                <td className="p-3 text-[10px] font-mono text-muted-foreground">{p.transactionId}</td>
                <td className="p-3" onClick={e => e.stopPropagation()}>
                  <div className="flex gap-0.5">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setViewPayment(p)}><Eye size={13} /></Button>
                    {p.status === "odenlib" && (
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-admin-warning" onClick={() => handleRefund(p.id)}><RotateCcw size={13} /></Button>
                    )}
                    {p.status === "gozleyir" && (
                      <>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-admin-success" onClick={() => handleApprove(p.id)}><CheckCircle size={13} /></Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-admin-danger" onClick={() => handleCancel(p.id)}><XCircle size={13} /></Button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span className="text-xs">{filtered.length} ödəniş, səhifə {currentPage}/{pageCount}</span>
        <div className="flex gap-1 items-center">
          <Button variant="outline" size="icon" className="h-8 w-8" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}><ChevronLeft size={14} /></Button>
          {Array.from({ length: Math.min(pageCount, 5) }, (_, i) => i + 1).map(p => (
            <Button key={p} variant={p === currentPage ? "default" : "outline"} size="sm" className="h-8 w-8" onClick={() => setCurrentPage(p)}>{p}</Button>
          ))}
          <Button variant="outline" size="icon" className="h-8 w-8" disabled={currentPage >= pageCount} onClick={() => setCurrentPage(p => p + 1)}><ChevronRight size={14} /></Button>
        </div>
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!viewPayment} onOpenChange={() => setViewPayment(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">Ödəniş #{viewPayment?.id} <StatusBadge status={viewPayment?.status || "gozleyir"} /></DialogTitle>
          </DialogHeader>
          {viewPayment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  { label: "İstifadəçi", value: viewPayment.user },
                  { label: "Email", value: viewPayment.userEmail },
                  { label: "Məbləğ", value: `${viewPayment.amount} ₼`, bold: true },
                  { label: "Xidmət", value: viewPayment.service },
                  { label: "Ödəniş metodu", value: viewPayment.method },
                  { label: "Tarix", value: viewPayment.date },
                  { label: "Transaction ID", value: viewPayment.transactionId },
                  { label: "IP ünvanı", value: viewPayment.ip },
                ].map(f => (
                  <div key={f.label}>
                    <span className="text-muted-foreground text-xs">{f.label}:</span>
                    <p className={cn("text-sm", (f as any).bold && "font-bold")}>{f.value}</p>
                  </div>
                ))}
              </div>
              {viewPayment.note && (
                <div className="bg-admin-warning/5 border border-admin-warning/20 rounded-lg p-3 flex items-start gap-2">
                  <AlertTriangle size={14} className="text-admin-warning mt-0.5 shrink-0" />
                  <p className="text-xs text-muted-foreground">{viewPayment.note}</p>
                </div>
              )}
              <div className="flex gap-2 pt-2 border-t border-border">
                {viewPayment.status === "odenlib" && (
                  <Button size="sm" variant="outline" className="text-admin-warning border-admin-warning/30 flex-1" onClick={() => handleRefund(viewPayment.id)}>
                    <RotateCcw size={14} className="mr-1" /> Qaytар
                  </Button>
                )}
                {viewPayment.status === "gozleyir" && (
                  <>
                    <Button size="sm" className="bg-admin-success text-primary-foreground hover:bg-admin-success/90 flex-1" onClick={() => handleApprove(viewPayment.id)}>
                      <CheckCircle size={14} className="mr-1" /> Təsdiqlə
                    </Button>
                    <Button size="sm" variant="outline" className="text-admin-danger border-admin-danger/30 flex-1" onClick={() => handleCancel(viewPayment.id)}>
                      <XCircle size={14} className="mr-1" /> Ləğv et
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
