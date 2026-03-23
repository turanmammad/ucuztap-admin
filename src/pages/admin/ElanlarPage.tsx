import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Search, Eye, Check, X, Trash2, Edit, Bot } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const mockAds = Array.from({ length: 20 }, (_, i) => ({
  id: 10000 + i,
  title: ["Mercedes C220d, 2019", "3 otaqlı mənzil, Nəsimi", "iPhone 15 Pro Max", "Samsung TV 55\"", "BMW X5, 2021"][i % 5],
  user: ["Əli M.", "Leyla H.", "Rəşad K.", "Kamran N.", "Nicat V."][i % 5],
  category: ["Nəqliyyat", "Daşınmaz əmlak", "Elektronika", "Elektronika", "Nəqliyyat"][i % 5],
  price: [25000, 85000, 2800, 1200, 62000][i % 5],
  views: Math.floor(Math.random() * 5000),
  status: (["aktiv", "gozlemede", "redd", "aktiv", "vip"] as const)[i % 5],
  date: "2026-03-" + String(23 - (i % 10)).padStart(2, "0"),
  aiFlag: i % 7 === 0,
}));

export default function ElanlarPage() {
  const [selected, setSelected] = useState<number[]>([]);
  const toggleSelect = (id: number) => setSelected((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);
  const toggleAll = () => setSelected(selected.length === mockAds.length ? [] : mockAds.map((a) => a.id));

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Filters */}
      <div className="bg-card rounded-lg border border-border p-4">
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[200px]">
            <Input placeholder="Elan axtar..." className="h-9" />
          </div>
          <Select><SelectTrigger className="w-[150px] h-9"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Hamısı</SelectItem>
              <SelectItem value="aktiv">Aktiv</SelectItem>
              <SelectItem value="gozlemede">Gözləmədə</SelectItem>
              <SelectItem value="redd">Rədd</SelectItem>
              <SelectItem value="silinmis">Silinmiş</SelectItem>
            </SelectContent>
          </Select>
          <Select><SelectTrigger className="w-[150px] h-9"><SelectValue placeholder="Kateqoriya" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Hamısı</SelectItem>
              <SelectItem value="transport">Nəqliyyat</SelectItem>
              <SelectItem value="realestate">Daşınmaz əmlak</SelectItem>
              <SelectItem value="electronics">Elektronika</SelectItem>
            </SelectContent>
          </Select>
          <Button size="sm" className="bg-admin-accent text-accent-foreground hover:bg-admin-accent/90">
            <Search size={14} className="mr-1" /> Axtar
          </Button>
        </div>
      </div>

      {/* Bulk actions */}
      {selected.length > 0 && (
        <div className="bg-admin-info/5 border border-admin-info/20 rounded-lg px-4 py-2.5 flex items-center gap-3 text-sm animate-fade-in">
          <span className="font-medium">{selected.length} elan seçildi:</span>
          <Button size="sm" variant="outline" className="h-7 text-xs text-admin-success border-admin-success/30"><Check size={12} className="mr-1" /> Təsdiqlə</Button>
          <Button size="sm" variant="outline" className="h-7 text-xs text-admin-danger border-admin-danger/30"><X size={12} className="mr-1" /> Rədd et</Button>
          <Button size="sm" variant="outline" className="h-7 text-xs text-admin-danger border-admin-danger/30"><Trash2 size={12} className="mr-1" /> Sil</Button>
        </div>
      )}

      {/* Table */}
      <div className="bg-card rounded-lg border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground text-left bg-muted/30">
              <th className="p-3 w-10"><input type="checkbox" checked={selected.length === mockAds.length} onChange={toggleAll} className="rounded" /></th>
              <th className="p-3 font-medium">ID</th>
              <th className="p-3 font-medium">Başlıq</th>
              <th className="p-3 font-medium">İstifadəçi</th>
              <th className="p-3 font-medium">Kateqoriya</th>
              <th className="p-3 font-medium">Qiymət</th>
              <th className="p-3 font-medium">👁️</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium">Tarix</th>
              <th className="p-3 font-medium">Əməliyyat</th>
            </tr>
          </thead>
          <tbody>
            {mockAds.map((ad) => (
              <tr key={ad.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                <td className="p-3"><input type="checkbox" checked={selected.includes(ad.id)} onChange={() => toggleSelect(ad.id)} className="rounded" /></td>
                <td className="p-3 text-muted-foreground">#{ad.id}</td>
                <td className="p-3 font-medium">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-muted rounded shrink-0" />
                    <span className="truncate max-w-[180px]">{ad.title}</span>
                    {ad.aiFlag && <span className="text-[10px] bg-admin-warning/10 text-admin-warning px-1.5 py-0.5 rounded font-medium flex items-center gap-0.5"><Bot size={10} /> AI: Şübhəli</span>}
                  </div>
                </td>
                <td className="p-3">{ad.user}</td>
                <td className="p-3 text-muted-foreground">{ad.category}</td>
                <td className="p-3 font-medium tabular-nums">{ad.price.toLocaleString()} ₼</td>
                <td className="p-3 text-muted-foreground tabular-nums">{ad.views.toLocaleString()}</td>
                <td className="p-3"><StatusBadge status={ad.status} /></td>
                <td className="p-3 text-muted-foreground text-xs">{ad.date}</td>
                <td className="p-3">
                  <div className="flex gap-0.5">
                    <Button variant="ghost" size="icon" className="h-7 w-7"><Eye size={13} /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-admin-success"><Check size={13} /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-admin-danger"><X size={13} /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7"><Edit size={13} /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-admin-danger"><Trash2 size={13} /></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          Səhifə başına:
          <Select defaultValue="20"><SelectTrigger className="w-[70px] h-8"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((p) => (
            <Button key={p} variant={p === 1 ? "default" : "outline"} size="sm" className="h-8 w-8">{p}</Button>
          ))}
        </div>
      </div>
    </div>
  );
}
