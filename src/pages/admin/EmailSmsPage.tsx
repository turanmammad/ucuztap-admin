import { Mail, MessageSquare, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function EmailSmsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-lg font-semibold">Email / SMS Göndərmə</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Email */}
        <div className="bg-card rounded-lg border border-border p-5">
          <div className="flex items-center gap-2 mb-4">
            <Mail size={18} className="text-admin-info" />
            <h3 className="text-sm font-semibold">Email göndər</h3>
          </div>
          <div className="space-y-3">
            <Select><SelectTrigger className="h-9"><SelectValue placeholder="Kimə göndərilsin?" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Bütün istifadəçilər</SelectItem>
                <SelectItem value="active">Aktiv istifadəçilər</SelectItem>
                <SelectItem value="inactive">Qeyri-aktiv (30+ gün)</SelectItem>
                <SelectItem value="vip">VIP müştərilər</SelectItem>
              </SelectContent>
            </Select>
            <Input placeholder="Mövzu" className="h-9" />
            <Textarea placeholder="Mesaj mətni..." rows={5} />
            <Button className="bg-admin-accent text-accent-foreground hover:bg-admin-accent/90 w-full">
              <Send size={14} className="mr-1" /> Email göndər
            </Button>
          </div>
        </div>

        {/* SMS */}
        <div className="bg-card rounded-lg border border-border p-5">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare size={18} className="text-admin-success" />
            <h3 className="text-sm font-semibold">SMS göndər</h3>
          </div>
          <div className="space-y-3">
            <Select><SelectTrigger className="h-9"><SelectValue placeholder="Kimə göndərilsin?" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Bütün istifadəçilər</SelectItem>
                <SelectItem value="active">Aktiv istifadəçilər</SelectItem>
                <SelectItem value="phone">Telefon nömrəsi olanlar</SelectItem>
              </SelectContent>
            </Select>
            <Textarea placeholder="SMS mətni (160 simvol)..." rows={3} maxLength={160} />
            <p className="text-xs text-muted-foreground">Qalan: 160 simvol | Təxmini xərc: 0.03 ₼/SMS</p>
            <Button className="bg-admin-success text-primary-foreground hover:bg-admin-success/90 w-full">
              <Send size={14} className="mr-1" /> SMS göndər
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
