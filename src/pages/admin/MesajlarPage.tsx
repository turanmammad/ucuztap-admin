import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { MessageSquare, Search, Eye, Flag, Ban, X, AlertTriangle, Clock, User, ChevronLeft, ChevronRight, BarChart3, Shield } from "lucide-react";
import { DateRangeFilter, ExcelExportButton } from "@/components/admin/TableToolbar";
import { SortableHeader } from "@/components/admin/SortableHeader";
import { exportToExcel, isInDateRange, sortData, nextSortDir, type SortDir } from "@/lib/table-utils";
import { format } from "date-fns";

interface Message {
  id: number;
  from: string;
  fromEmail: string;
  to: string;
  toEmail: string;
  subject: string;
  body: string;
  date: string;
  status: "normal" | "spam" | "flagged" | "blocked";
  adId?: number;
  adTitle?: string;
  reported: boolean;
  ip: string;
}

const mockMessages: Message[] = Array.from({ length: 50 }, (_, i) => ({
  id: 20000 + i,
  from: ["Əli M.", "Leyla H.", "Rəşad K.", "Kamran N.", "Nicat V.", "Günel Ə.", "Orxan B.", "Səbinə İ."][i % 8],
  fromEmail: ["ali@mail.az", "leyla@gmail.com", "rashad@mail.az", "kamran@outlook.com", "nicat@mail.az", "gunel@gmail.com", "orxan@mail.az", "sebine@yahoo.com"][i % 8],
  to: ["Tural İ.", "Nigar Ə.", "Əli M.", "Leyla H.", "Rəşad K."][i % 5],
  toEmail: ["tural@mail.az", "nigar@yahoo.com", "ali@mail.az", "leyla@gmail.com", "rashad@mail.az"][i % 5],
  subject: [
    "Avtomobil haqqında sual",
    "Qiymət danışığı",
    "Mənzilin ölçüsü barədə",
    "Çatdırılma mümkündür?",
    "Bu hələ satılıb?",
    "Barter təklifi",
    "***SPAM*** Pul qazanın!",
    "Narahatedici mesaj",
  ][i % 8],
  body: [
    "Salam, avtomobil haqqında daha ətraflı məlumat verə bilərsiniz? Son qiyməti nədir?",
    "Xahiş edirəm qiymətdə endirim edə bilərsinizmi? 20% aşağı sala bilərsinizmi?",
    "Mənzilin dəqiq sahəsi nə qədərdir? Mətbəx ayrıdır?",
    "Bakı daxilində çatdırılma mümkündürmü? Qiymətə daxildir?",
    "Salam, bu elan hələ aktivdir? Satılmayıb ki?",
    "Maşınımla barterdə razıyam, baxa bilərsiniz?",
    "Günə 500$ qazan! Bu linkə keçid edin: spam.com",
    "Sənin elanın yalandır, saxta satıcısan!",
  ][i % 8],
  date: "2026-03-" + String(25 - (i % 25)).padStart(2, "0") + " " + String(8 + (i % 16)).padStart(2, "0") + ":" + String(10 + i * 3).slice(0, 2).padStart(2, "0"),
  status: (["normal", "normal", "normal", "normal", "flagged", "normal", "spam", "flagged"] as const)[i % 8],
  adId: i % 3 === 0 ? 10000 + i : undefined,
  adTitle: i % 3 === 0 ? ["Mercedes C220d", "3 otaqlı mənzil", "iPhone 15 Pro Max"][i % 3] : undefined,
  reported: i % 7 === 0,
  ip: `185.129.${40 + (i % 20)}.${10 + (i % 100)}`,
}));

const statusConfig: Record<string, { label: string; className: string }> = {
  normal: { label: "Normal", className: "bg-admin-success/10 text-admin-success" },
  spam: { label: "Spam", className: "bg-admin-danger/10 text-admin-danger" },
  flagged: { label: "Şübhəli", className: "bg-admin-warning/10 text-admin-warning" },
  blocked: { label: "Bloklanmış", className: "bg-muted text-muted-foreground" },
};

export default function MesajlarPage() {
  const [messages, setMessages] = useState(mockMessages);
  const [viewMsg, setViewMsg] = useState<Message | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);
  const perPage = 20;

  const handleSort = (key: string) => {
    if (sortKey === key) {
      const nd = nextSortDir(sortDir);
      setSortDir(nd);
      if (!nd) setSortKey(null);
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const fromStr = dateFrom ? format(dateFrom, "yyyy-MM-dd") : "";
  const toStr = dateTo ? format(dateTo, "yyyy-MM-dd") : "";

  let filtered = messages.filter(m => {
    if (statusFilter !== "all" && m.status !== statusFilter) return false;
    if (!isInDateRange(m.date, fromStr, toStr)) return false;
    if (searchQuery && !m.from.toLowerCase().includes(searchQuery.toLowerCase()) && !m.to.toLowerCase().includes(searchQuery.toLowerCase()) && !m.subject.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  if (sortKey && sortDir) {
    filtered = sortData(filtered, sortKey as keyof Message, sortDir);
  }

  const pageCount = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const totalMsgs = messages.length;
  const spamCount = messages.filter(m => m.status === "spam").length;
  const flaggedCount = messages.filter(m => m.status === "flagged").length;
  const reportedCount = messages.filter(m => m.reported).length;

  const handleMarkSpam = (id: number) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, status: "spam" as const } : m));
    setViewMsg(null);
    toast({ title: "🚫 Spam olaraq işarələndi" });
  };

  const handleBlock = (id: number) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, status: "blocked" as const } : m));
    setViewMsg(null);
    toast({ title: "🔒 Mesaj bloklandı" });
  };

  const handleClear = (id: number) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, status: "normal" as const, reported: false } : m));
    setViewMsg(null);
    toast({ title: "✅ Mesaj təmizləndi" });
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <h2 className="text-lg font-semibold flex items-center gap-2"><MessageSquare size={20} /> Mesajlaşma Nəzarəti</h2>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Ümumi mesaj", value: totalMsgs, icon: MessageSquare, color: "text-admin-info", bg: "bg-admin-info/10" },
          { label: "Spam", value: spamCount, icon: Ban, color: "text-admin-danger", bg: "bg-admin-danger/10" },
          { label: "Şübhəli", value: flaggedCount, icon: AlertTriangle, color: "text-admin-warning", bg: "bg-admin-warning/10" },
          { label: "Şikayət edilmiş", value: reportedCount, icon: Flag, color: "text-admin-accent", bg: "bg-admin-accent/10" },
        ].map(s => (
          <div key={s.label} className="bg-card rounded-lg border border-border p-3">
            <div className="flex items-center gap-2 mb-1">
              <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center", s.bg)}>
                <s.icon size={14} className={s.color} />
              </div>
            </div>
            <p className={cn("text-lg font-bold", s.color)}>{s.value}</p>
            <p className="text-[10px] text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-card rounded-lg border border-border p-3 flex flex-wrap gap-3 items-end">
        <Input placeholder="Göndərən, alan, mövzu axtar..." className="h-9 flex-1 min-w-[200px]" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        <Select value={statusFilter} onValueChange={v => { setStatusFilter(v); setCurrentPage(1); }}>
          <SelectTrigger className="w-[140px] h-9"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Hamısı</SelectItem>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="spam">Spam</SelectItem>
            <SelectItem value="flagged">Şübhəli</SelectItem>
            <SelectItem value="blocked">Bloklanmış</SelectItem>
          </SelectContent>
        </Select>
        <DateRangeFilter dateFrom={dateFrom} dateTo={dateTo} onDateFromChange={d => { setDateFrom(d); setCurrentPage(1); }} onDateToChange={d => { setDateTo(d); setCurrentPage(1); }} />
        <ExcelExportButton onClick={() => exportToExcel(filtered, [
          { key: "id", label: "ID" },
          { key: "from", label: "Göndərən" },
          { key: "fromEmail", label: "Göndərən Email" },
          { key: "to", label: "Alan" },
          { key: "subject", label: "Mövzu" },
          { key: "status", label: "Status" },
          { key: "date", label: "Tarix" },
        ], "mesajlar")} />
        {(statusFilter !== "all" || searchQuery || dateFrom || dateTo) && (
          <Button size="sm" variant="ghost" className="text-xs" onClick={() => { setStatusFilter("all"); setSearchQuery(""); setDateFrom(undefined); setDateTo(undefined); }}>
            <X size={12} className="mr-1" /> Sıfırla
          </Button>
        )}
      </div>

      <div className="text-xs text-muted-foreground">{filtered.length} mesaj tapıldı</div>

      {/* Table */}
      <div className="bg-card rounded-lg border border-border overflow-x-auto">
        <table className="w-full text-sm" style={{ minWidth: 750 }}>
          <thead>
            <tr className="border-b border-border text-muted-foreground text-left bg-muted/30 text-xs">
              <SortableHeader label="ID" sortKey="id" currentSort={sortKey} currentDir={sortDir} onSort={handleSort} />
              <SortableHeader label="Göndərən" sortKey="from" currentSort={sortKey} currentDir={sortDir} onSort={handleSort} />
              <SortableHeader label="Alan" sortKey="to" currentSort={sortKey} currentDir={sortDir} onSort={handleSort} />
              <SortableHeader label="Mövzu" sortKey="subject" currentSort={sortKey} currentDir={sortDir} onSort={handleSort} />
              <th className="p-3 font-medium">Elan</th>
              <SortableHeader label="Status" sortKey="status" currentSort={sortKey} currentDir={sortDir} onSort={handleSort} />
              <SortableHeader label="Tarix" sortKey="date" currentSort={sortKey} currentDir={sortDir} onSort={handleSort} />
              <th className="p-3 font-medium">Əməliyyat</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map(m => (
              <tr key={m.id} className={cn("border-b border-border/50 hover:bg-muted/20 transition-colors cursor-pointer", m.reported && "bg-admin-warning/[0.02]")} onClick={() => setViewMsg(m)}>
                <td className="p-3 text-muted-foreground text-xs">#{m.id}</td>
                <td className="p-3">
                  <div><span className="text-xs font-medium">{m.from}</span><p className="text-[10px] text-muted-foreground">{m.fromEmail}</p></div>
                </td>
                <td className="p-3">
                  <div><span className="text-xs font-medium">{m.to}</span><p className="text-[10px] text-muted-foreground">{m.toEmail}</p></div>
                </td>
                <td className="p-3 text-xs max-w-[200px] truncate">
                  {m.reported && <Flag size={10} className="inline text-admin-warning mr-1" />}
                  {m.subject}
                </td>
                <td className="p-3 text-[10px] text-muted-foreground">{m.adTitle ? `#${m.adId} ${m.adTitle}` : "—"}</td>
                <td className="p-3">
                  <span className={cn("inline-flex items-center px-2 py-0.5 rounded text-xs font-medium", statusConfig[m.status].className)}>
                    {statusConfig[m.status].label}
                  </span>
                </td>
                <td className="p-3 text-[10px] text-muted-foreground whitespace-nowrap">{m.date}</td>
                <td className="p-3" onClick={e => e.stopPropagation()}>
                  <div className="flex gap-0.5">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setViewMsg(m)}><Eye size={12} /></Button>
                    {m.status !== "spam" && <Button variant="ghost" size="icon" className="h-7 w-7 text-admin-danger" onClick={() => handleMarkSpam(m.id)}><Ban size={12} /></Button>}
                    {m.status !== "normal" && <Button variant="ghost" size="icon" className="h-7 w-7 text-admin-success" onClick={() => handleClear(m.id)}><Shield size={12} /></Button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span className="text-xs">{filtered.length} mesaj</span>
        <div className="flex gap-1 items-center">
          <Button variant="outline" size="icon" className="h-8 w-8" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}><ChevronLeft size={14} /></Button>
          {Array.from({ length: Math.min(pageCount, 5) }, (_, i) => i + 1).map(p => (
            <Button key={p} variant={p === currentPage ? "default" : "outline"} size="sm" className="h-8 w-8" onClick={() => setCurrentPage(p)}>{p}</Button>
          ))}
          <Button variant="outline" size="icon" className="h-8 w-8" disabled={currentPage >= pageCount} onClick={() => setCurrentPage(p => p + 1)}><ChevronRight size={14} /></Button>
        </div>
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!viewMsg} onOpenChange={() => setViewMsg(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Mesaj #{viewMsg?.id}
              {viewMsg && <span className={cn("text-xs px-2 py-0.5 rounded font-medium", statusConfig[viewMsg.status].className)}>{statusConfig[viewMsg.status].label}</span>}
              {viewMsg?.reported && <span className="text-xs bg-admin-warning/10 text-admin-warning px-2 py-0.5 rounded">📢 Şikayət</span>}
            </DialogTitle>
          </DialogHeader>
          {viewMsg && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-xs text-muted-foreground">Göndərən:</span><p className="font-medium">{viewMsg.from}</p><p className="text-xs text-muted-foreground">{viewMsg.fromEmail}</p></div>
                <div><span className="text-xs text-muted-foreground">Alan:</span><p className="font-medium">{viewMsg.to}</p><p className="text-xs text-muted-foreground">{viewMsg.toEmail}</p></div>
                <div><span className="text-xs text-muted-foreground">Tarix:</span><p className="text-sm">{viewMsg.date}</p></div>
                <div><span className="text-xs text-muted-foreground">IP:</span><p className="text-sm font-mono">{viewMsg.ip}</p></div>
              </div>
              {viewMsg.adId && (
                <div className="bg-muted/30 rounded-lg p-3">
                  <span className="text-xs text-muted-foreground">Əlaqəli elan:</span>
                  <p className="text-sm font-medium">#{viewMsg.adId} — {viewMsg.adTitle}</p>
                </div>
              )}
              <div>
                <span className="text-xs text-muted-foreground">Mövzu:</span>
                <p className="text-sm font-semibold">{viewMsg.subject}</p>
              </div>
              <div className="bg-muted/20 rounded-lg p-4">
                <p className="text-sm leading-relaxed">{viewMsg.body}</p>
              </div>
              <div className="flex gap-2 pt-2 border-t border-border">
                {viewMsg.status !== "spam" && (
                  <Button size="sm" variant="outline" className="text-admin-danger border-admin-danger/30" onClick={() => handleMarkSpam(viewMsg.id)}>
                    <Ban size={14} className="mr-1" /> Spam
                  </Button>
                )}
                {viewMsg.status !== "blocked" && (
                  <Button size="sm" variant="outline" className="text-admin-danger border-admin-danger/30" onClick={() => handleBlock(viewMsg.id)}>
                    <Shield size={14} className="mr-1" /> Blokla
                  </Button>
                )}
                {viewMsg.status !== "normal" && (
                  <Button size="sm" variant="outline" className="text-admin-success border-admin-success/30" onClick={() => handleClear(viewMsg.id)}>
                    <Shield size={14} className="mr-1" /> Təmizlə
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
