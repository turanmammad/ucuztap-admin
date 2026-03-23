import { useState } from "react";
import { Mail, MessageSquare, Send, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

export default function EmailSmsPage() {
  const [emailTo, setEmailTo] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [emailSending, setEmailSending] = useState(false);

  const [smsTo, setSmsTo] = useState("");
  const [smsBody, setSmsBody] = useState("");
  const [smsSending, setSmsSending] = useState(false);

  const [sentHistory, setSentHistory] = useState<{ type: string; to: string; date: string }[]>([]);

  const handleEmailSend = () => {
    if (!emailTo || !emailSubject.trim() || !emailBody.trim()) {
      toast({ title: "Xəta", description: "Bütün sahələri doldurun", variant: "destructive" });
      return;
    }
    setEmailSending(true);
    setTimeout(() => {
      setEmailSending(false);
      setSentHistory((prev) => [{ type: "Email", to: emailTo, date: new Date().toLocaleTimeString() }, ...prev]);
      toast({ title: "✅ Email göndərildi", description: `${emailTo} qrupuna email göndərildi` });
      setEmailSubject("");
      setEmailBody("");
    }, 1500);
  };

  const handleSmsSend = () => {
    if (!smsTo || !smsBody.trim()) {
      toast({ title: "Xəta", description: "Bütün sahələri doldurun", variant: "destructive" });
      return;
    }
    setSmsSending(true);
    setTimeout(() => {
      setSmsSending(false);
      setSentHistory((prev) => [{ type: "SMS", to: smsTo, date: new Date().toLocaleTimeString() }, ...prev]);
      toast({ title: "✅ SMS göndərildi", description: `${smsTo} qrupuna SMS göndərildi` });
      setSmsBody("");
    }, 1500);
  };

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
            <Select value={emailTo} onValueChange={setEmailTo}>
              <SelectTrigger className="h-9"><SelectValue placeholder="Kimə göndərilsin?" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Bütün istifadəçilər">Bütün istifadəçilər</SelectItem>
                <SelectItem value="Aktiv istifadəçilər">Aktiv istifadəçilər</SelectItem>
                <SelectItem value="Qeyri-aktiv (30+ gün)">Qeyri-aktiv (30+ gün)</SelectItem>
                <SelectItem value="VIP müştərilər">VIP müştərilər</SelectItem>
              </SelectContent>
            </Select>
            <Input placeholder="Mövzu" className="h-9" value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} />
            <Textarea placeholder="Mesaj mətni..." rows={5} value={emailBody} onChange={(e) => setEmailBody(e.target.value)} />
            <Button
              className="bg-admin-accent text-accent-foreground hover:bg-admin-accent/90 w-full"
              onClick={handleEmailSend}
              disabled={emailSending}
            >
              {emailSending ? "Göndərilir..." : <><Send size={14} className="mr-1" /> Email göndər</>}
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
            <Select value={smsTo} onValueChange={setSmsTo}>
              <SelectTrigger className="h-9"><SelectValue placeholder="Kimə göndərilsin?" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Bütün istifadəçilər">Bütün istifadəçilər</SelectItem>
                <SelectItem value="Aktiv istifadəçilər">Aktiv istifadəçilər</SelectItem>
                <SelectItem value="Telefon nömrəsi olanlar">Telefon nömrəsi olanlar</SelectItem>
              </SelectContent>
            </Select>
            <Textarea placeholder="SMS mətni (160 simvol)..." rows={3} maxLength={160} value={smsBody} onChange={(e) => setSmsBody(e.target.value)} />
            <p className="text-xs text-muted-foreground">Qalan: {160 - smsBody.length} simvol | Təxmini xərc: 0.03 ₼/SMS</p>
            <Button
              className="bg-admin-success text-primary-foreground hover:bg-admin-success/90 w-full"
              onClick={handleSmsSend}
              disabled={smsSending}
            >
              {smsSending ? "Göndərilir..." : <><Send size={14} className="mr-1" /> SMS göndər</>}
            </Button>
          </div>
        </div>
      </div>

      {/* Sent history */}
      {sentHistory.length > 0 && (
        <div className="bg-card rounded-lg border border-border p-5">
          <h3 className="text-sm font-semibold mb-3">Son göndərilənlər</h3>
          <div className="space-y-2">
            {sentHistory.map((h, i) => (
              <div key={i} className="flex items-center gap-3 text-sm py-1.5 border-b border-border/50 last:border-0">
                <Check size={14} className="text-admin-success" />
                <span className="font-medium">{h.type}</span>
                <span className="text-muted-foreground">→ {h.to}</span>
                <span className="text-xs text-muted-foreground ml-auto">{h.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
