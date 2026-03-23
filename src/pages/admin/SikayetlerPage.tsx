import { useState } from "react";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { Eye, Check, Ban, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

interface Complaint {
  id: number;
  reporter: string;
  target: string;
  reason: string;
  status: "yeni" | "arasdirili" | "hell";
  date: string;
  detail: string;
}

const initialComplaints: Complaint[] = [
  { id: 1, reporter: "Nigar Ə.", target: "Elan #10042", reason: "Saxta elan", status: "yeni", date: "2026-03-23", detail: "İstifadəçi bildirir ki, elanda göstərilən avtomobil artıq satılıb, lakin elan hələ də aktivdir. Şəkillər internetdən götürülüb." },
  { id: 2, reporter: "Tural İ.", target: "User: Əli M.", reason: "Spam mesajlar", status: "arasdirili", date: "2026-03-22", detail: "İstifadəçi hər gün 50+ eyni mesaj göndərir müxtəlif elanlara. Avtomatik bot kimi davranır." },
  { id: 3, reporter: "Leyla H.", target: "Elan #10038", reason: "Uyğunsuz şəkil", status: "hell", date: "2026-03-21", detail: "Elanda uyğunsuz məzmunlu şəkil var idi. Şəkil silindi, istifadəçiyə xəbərdarlıq göndərildi." },
  { id: 4, reporter: "Rəşad K.", target: "Elan #10035", reason: "Yanlış qiymət", status: "yeni", date: "2026-03-20", detail: "Elanda Mercedes C-Class üçün 500 ₼ qiymət göstərilib. Real bazar dəyərindən 50x aşağıdır." },
  { id: 5, reporter: "Kamran N.", target: "User: Test User", reason: "Fake profil", status: "arasdirili", date: "2026-03-19", detail: "Profil şəkli stock fotodur. Telefon nömrəsi mövcud deyil. Bütün elanları şübhəli qiymətlərlə yerləşdirilib." },
  { id: 6, reporter: "Əli M.", target: "Elan #10030", reason: "Dublikat elan", status: "hell", date: "2026-03-18", detail: "Bu elan #10028 ilə tamamilə eynidir. Eyni şəkillər, eyni təsvir, eyni qiymət." },
];

export default function SikayetlerPage() {
  const [complaints, setComplaints] = useState(initialComplaints);
  const [viewComplaint, setViewComplaint] = useState<Complaint | null>(null);

  const handleResolve = (id: number) => {
    setComplaints((prev) => prev.map((c) => c.id === id ? { ...c, status: "hell" as const } : c));
    setViewComplaint(null);
    toast({ title: "✅ Şikayət həll edildi", description: `Şikayət #${id} həll olundu` });
  };

  const handleDeleteAd = (id: number) => {
    setComplaints((prev) => prev.map((c) => c.id === id ? { ...c, status: "hell" as const } : c));
    setViewComplaint(null);
    toast({ title: "🗑️ Elan silindi", description: `Şikayət #${id} — elan silindi` });
  };

  const handleBlockUser = (id: number) => {
    setComplaints((prev) => prev.map((c) => c.id === id ? { ...c, status: "hell" as const } : c));
    setViewComplaint(null);
    toast({ title: "🚫 İstifadəçi bloklandı", description: `Şikayət #${id} — istifadəçi bloklandı` });
  };

  const handleInvestigate = (id: number) => {
    setComplaints((prev) => prev.map((c) => c.id === id ? { ...c, status: "arasdirili" as const } : c));
    toast({ title: "🔍 Araşdırılır", description: `Şikayət #${id} araşdırmaya götürüldü` });
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Şikayətlər</h2>
        <div className="flex gap-3 text-xs">
          <span className="px-2 py-1 rounded bg-admin-danger/10 text-admin-danger font-medium">
            Yeni: {complaints.filter((c) => c.status === "yeni").length}
          </span>
          <span className="px-2 py-1 rounded bg-admin-warning/10 text-admin-warning font-medium">
            Araşdırılır: {complaints.filter((c) => c.status === "arasdirili").length}
          </span>
          <span className="px-2 py-1 rounded bg-admin-success/10 text-admin-success font-medium">
            Həll: {complaints.filter((c) => c.status === "hell").length}
          </span>
        </div>
      </div>

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
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setViewComplaint(c)}>
                      <Eye size={13} />
                    </Button>
                    {c.status !== "hell" && (
                      <>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-admin-success" onClick={() => handleResolve(c.id)}>
                          <Check size={13} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-admin-danger" onClick={() => handleDeleteAd(c.id)}>
                          <Trash2 size={13} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-admin-danger" onClick={() => handleBlockUser(c.id)}>
                          <Ban size={13} />
                        </Button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!viewComplaint} onOpenChange={() => setViewComplaint(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              Şikayət #{viewComplaint?.id}
              {viewComplaint && <StatusBadge status={viewComplaint.status} />}
            </DialogTitle>
          </DialogHeader>
          {viewComplaint && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Şikayətçi:</span> <span className="font-medium">{viewComplaint.reporter}</span></div>
                <div><span className="text-muted-foreground">Hədəf:</span> <span className="font-medium">{viewComplaint.target}</span></div>
                <div><span className="text-muted-foreground">Səbəb:</span> <span className="font-medium">{viewComplaint.reason}</span></div>
                <div><span className="text-muted-foreground">Tarix:</span> <span className="font-medium">{viewComplaint.date}</span></div>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-1">Ətraflı təsvir</h4>
                <p className="text-sm bg-muted/20 rounded-lg p-3 leading-relaxed">{viewComplaint.detail}</p>
              </div>
              {viewComplaint.status !== "hell" && (
                <div className="flex gap-2 pt-2 border-t border-border">
                  {viewComplaint.status === "yeni" && (
                    <Button size="sm" variant="outline" onClick={() => { handleInvestigate(viewComplaint.id); setViewComplaint(null); }}>
                      🔍 Araşdır
                    </Button>
                  )}
                  <Button size="sm" className="bg-admin-success text-primary-foreground hover:bg-admin-success/90" onClick={() => handleResolve(viewComplaint.id)}>
                    <Check size={14} className="mr-1" /> Həll et
                  </Button>
                  <Button size="sm" variant="outline" className="text-admin-danger border-admin-danger/30" onClick={() => handleDeleteAd(viewComplaint.id)}>
                    <Trash2 size={14} className="mr-1" /> Elanı sil
                  </Button>
                  <Button size="sm" variant="outline" className="text-admin-danger border-admin-danger/30" onClick={() => handleBlockUser(viewComplaint.id)}>
                    <Ban size={14} className="mr-1" /> Useri blokla
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
