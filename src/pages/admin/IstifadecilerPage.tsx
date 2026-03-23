import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Eye, Edit, Ban, Mail, Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const users = Array.from({ length: 15 }, (_, i) => ({
  id: 5000 + i,
  name: ["Əli Məmmədov", "Leyla Həsənova", "Rəşad Kərimov", "Nigar Əliyeva", "Tural İsmayılov"][i % 5],
  email: ["ali@mail.az", "leyla@gmail.com", "rashad@mail.az", "nigar@yahoo.com", "tural@mail.az"][i % 5],
  phone: "+994 50 " + String(100 + i * 11) + " " + String(20 + i * 7).padStart(2, "0") + " " + String(30 + i * 3).padStart(2, "0"),
  ads: Math.floor(Math.random() * 50),
  date: "2026-0" + (1 + (i % 3)) + "-" + String(10 + i).padStart(2, "0"),
  role: (["İstifadəçi", "İstifadəçi", "Moderator", "İstifadəçi", "Admin"] as const)[i % 5],
  status: i % 8 === 0 ? "bloklanmis" as const : "aktiv" as const,
}));

const roleColor: Record<string, string> = {
  İstifadəçi: "bg-muted text-muted-foreground",
  Moderator: "bg-admin-info/10 text-admin-info",
  Admin: "bg-admin-accent/15 text-admin-accent",
};

export default function IstifadecilerPage() {
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="bg-card rounded-lg border border-border p-4 flex flex-wrap gap-3 items-end">
        <Input placeholder="İstifadəçi axtar..." className="h-9 flex-1 min-w-[200px]" />
        <Select><SelectTrigger className="w-[130px] h-9"><SelectValue placeholder="Rol" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Hamısı</SelectItem>
            <SelectItem value="user">İstifadəçi</SelectItem>
            <SelectItem value="mod">Moderator</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
        <Select><SelectTrigger className="w-[130px] h-9"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Hamısı</SelectItem>
            <SelectItem value="aktiv">Aktiv</SelectItem>
            <SelectItem value="blok">Bloklanmış</SelectItem>
          </SelectContent>
        </Select>
        <Button size="sm" className="bg-admin-accent text-accent-foreground hover:bg-admin-accent/90"><Search size={14} className="mr-1" /> Axtar</Button>
      </div>

      <div className="bg-card rounded-lg border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground text-left bg-muted/30">
              <th className="p-3 w-10"><input type="checkbox" className="rounded" /></th>
              <th className="p-3 font-medium">ID</th>
              <th className="p-3 font-medium">Ad</th>
              <th className="p-3 font-medium">Email</th>
              <th className="p-3 font-medium">Telefon</th>
              <th className="p-3 font-medium">Elan</th>
              <th className="p-3 font-medium">Qeydiyyat</th>
              <th className="p-3 font-medium">Rol</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium">Əməliyyat</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                <td className="p-3"><input type="checkbox" className="rounded" /></td>
                <td className="p-3 text-muted-foreground">#{u.id}</td>
                <td className="p-3 font-medium">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-admin-accent flex items-center justify-center text-xs font-bold text-accent-foreground">{u.name[0]}</div>
                    {u.name}
                  </div>
                </td>
                <td className="p-3 text-muted-foreground">{u.email}</td>
                <td className="p-3 text-muted-foreground text-xs">{u.phone}</td>
                <td className="p-3 tabular-nums">{u.ads}</td>
                <td className="p-3 text-muted-foreground text-xs">{u.date}</td>
                <td className="p-3"><span className={`text-xs font-medium px-2 py-0.5 rounded ${roleColor[u.role]}`}>{u.role}</span></td>
                <td className="p-3"><StatusBadge status={u.status} /></td>
                <td className="p-3">
                  <div className="flex gap-0.5">
                    <Button variant="ghost" size="icon" className="h-7 w-7"><Eye size={13} /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7"><Edit size={13} /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-admin-danger"><Ban size={13} /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7"><Mail size={13} /></Button>
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
