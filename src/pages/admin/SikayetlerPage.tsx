import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { Eye, Check, Ban, Trash2 } from "lucide-react";

const complaints = [
  { id: 1, reporter: "Nigar Ə.", target: "Elan #10042", reason: "Saxta elan", status: "yeni" as const, date: "2026-03-23" },
  { id: 2, reporter: "Tural İ.", target: "User: Əli M.", reason: "Spam mesajlar", status: "arasdirili" as const, date: "2026-03-22" },
  { id: 3, reporter: "Leyla H.", target: "Elan #10038", reason: "Uyğunsuz şəkil", status: "hell" as const, date: "2026-03-21" },
  { id: 4, reporter: "Rəşad K.", target: "Elan #10035", reason: "Yanlış qiymət", status: "yeni" as const, date: "2026-03-20" },
  { id: 5, reporter: "Kamran N.", target: "User: Test User", reason: "Fake profil", status: "arasdirili" as const, date: "2026-03-19" },
  { id: 6, reporter: "Əli M.", target: "Elan #10030", reason: "Dublikat elan", status: "hell" as const, date: "2026-03-18" },
];

export default function SikayetlerPage() {
  return (
    <div className="space-y-4 animate-fade-in">
      <h2 className="text-lg font-semibold">Şikayətlər</h2>
      <div className="bg-card rounded-lg border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground text-left bg-muted/30">
              <th className="p-3 font-medium">ID</th>
              <th className="p-3 font-medium">Şikayətçi</th>
              <th className="p-3 font-medium">Elan/İstifadəçi</th>
              <th className="p-3 font-medium">Səbəb</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium">Tarix</th>
              <th className="p-3 font-medium">Əməliyyat</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((c) => (
              <tr key={c.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                <td className="p-3 text-muted-foreground">#{c.id}</td>
                <td className="p-3 font-medium">{c.reporter}</td>
                <td className="p-3">{c.target}</td>
                <td className="p-3">{c.reason}</td>
                <td className="p-3"><StatusBadge status={c.status} /></td>
                <td className="p-3 text-muted-foreground text-xs">{c.date}</td>
                <td className="p-3">
                  <div className="flex gap-0.5">
                    <Button variant="ghost" size="icon" className="h-7 w-7"><Eye size={13} /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-admin-success"><Check size={13} /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-admin-danger"><Trash2 size={13} /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-admin-danger"><Ban size={13} /></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
