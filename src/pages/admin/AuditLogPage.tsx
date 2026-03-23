import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const allLogs = [
  { date: "2026-03-23 14:23:01", admin: "Admin User", action: "Elan təsdiqləndi", detail: "#10042 — Mercedes C220d", ip: "185.129.xx.xx" },
  { date: "2026-03-23 14:10:45", admin: "Admin User", action: "İstifadəçi bloklandı", detail: "User #5012 — spam", ip: "185.129.xx.xx" },
  { date: "2026-03-23 13:55:12", admin: "Moderator1", action: "Elan silindi", detail: "#10038 — uyğunsuz məzmun", ip: "31.171.xx.xx" },
  { date: "2026-03-23 13:40:00", admin: "Admin User", action: "Kateqoriya əlavə edildi", detail: "Elektrik skuterləri", ip: "185.129.xx.xx" },
  { date: "2026-03-23 12:20:33", admin: "Moderator1", action: "Elan rədd edildi", detail: "#10035 — saxta elan", ip: "31.171.xx.xx" },
  { date: "2026-03-23 11:05:10", admin: "Admin User", action: "Tənzimləmə dəyişdirildi", detail: "Max images: 10 → 15", ip: "185.129.xx.xx" },
  { date: "2026-03-22 18:30:45", admin: "Admin User", action: "Ödəniş qaytarıldı", detail: "Payment #8005 — 10 ₼", ip: "185.129.xx.xx" },
  { date: "2026-03-22 16:12:00", admin: "Moderator1", action: "Şikayət həll edildi", detail: "Complaint #3", ip: "31.171.xx.xx" },
];

const actionMap: Record<string, string[]> = {
  approve: ["təsdiqləndi"],
  reject: ["rədd edildi"],
  delete: ["silindi"],
  block: ["bloklandı"],
  settings: ["dəyişdirildi", "əlavə edildi"],
};

export default function AuditLogPage() {
  const [adminSearch, setAdminSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("all");

  const filtered = allLogs.filter((l) => {
    if (adminSearch && !l.admin.toLowerCase().includes(adminSearch.toLowerCase())) return false;
    if (actionFilter !== "all") {
      const keywords = actionMap[actionFilter] || [];
      if (!keywords.some((k) => l.action.toLowerCase().includes(k))) return false;
    }
    return true;
  });

  const hasFilters = adminSearch || actionFilter !== "all";

  return (
    <div className="space-y-4 animate-fade-in">
      <h2 className="text-lg font-semibold">Audit Log — Kim nə etdi</h2>

      <div className="bg-card rounded-lg border border-border p-4 flex flex-wrap gap-3 items-end">
        <Input
          placeholder="Admin adı..."
          className="h-9 w-[180px]"
          value={adminSearch}
          onChange={(e) => setAdminSearch(e.target.value)}
        />
        <Select value={actionFilter} onValueChange={setActionFilter}>
          <SelectTrigger className="w-[180px] h-9"><SelectValue placeholder="Əməliyyat növü" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Hamısı</SelectItem>
            <SelectItem value="approve">Təsdiqləmə</SelectItem>
            <SelectItem value="reject">Rədd etmə</SelectItem>
            <SelectItem value="delete">Silmə</SelectItem>
            <SelectItem value="block">Bloklamaq</SelectItem>
            <SelectItem value="settings">Tənzimləmə</SelectItem>
          </SelectContent>
        </Select>
        {hasFilters && (
          <Button size="sm" variant="ghost" onClick={() => { setAdminSearch(""); setActionFilter("all"); }} className="text-xs">
            <X size={12} className="mr-1" /> Sıfırla
          </Button>
        )}
        <span className="text-xs text-muted-foreground ml-auto">{filtered.length} nəticə</span>
      </div>

      <div className="bg-card rounded-lg border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground text-left bg-muted/30">
              <th className="p-3 font-medium">Tarix</th>
              <th className="p-3 font-medium">Admin</th>
              <th className="p-3 font-medium">Əməliyyat</th>
              <th className="p-3 font-medium">Detallar</th>
              <th className="p-3 font-medium">IP</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((l, i) => (
              <tr key={i} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                <td className="p-3 text-muted-foreground text-xs font-mono whitespace-nowrap">{l.date}</td>
                <td className="p-3 font-medium">{l.admin}</td>
                <td className="p-3">{l.action}</td>
                <td className="p-3 text-muted-foreground">{l.detail}</td>
                <td className="p-3 text-muted-foreground font-mono text-xs">{l.ip}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">Nəticə tapılmadı</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
