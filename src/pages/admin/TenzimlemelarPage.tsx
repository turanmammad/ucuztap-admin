import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

const tabs = ["Ümumi", "SEO", "Email", "Ödəniş", "Limitlər", "Rollar"];

function UmumiTab() {
  const [title, setTitle] = useState("ucuztap.az — Pulsuz Elanlar");
  const [desc, setDesc] = useState("Azərbaycanda ən böyük pulsuz elan saytı");
  const [maintenance, setMaintenance] = useState(false);

  return (
    <div className="space-y-4">
      <div><label className="text-sm font-medium">Sayt başlığı</label><Input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1" /></div>
      <div><label className="text-sm font-medium">Sayt təsviri</label><Textarea value={desc} onChange={(e) => setDesc(e.target.value)} className="mt-1" rows={2} /></div>
      <div className="flex items-center justify-between py-2">
        <div><p className="text-sm font-medium">Texniki iş rejimi</p><p className="text-xs text-muted-foreground">Saytı müvəqqəti bağla</p></div>
        <Switch checked={maintenance} onCheckedChange={(v) => { setMaintenance(v); toast({ title: v ? "⚠️ Texniki iş rejimi aktiv" : "✅ Sayt açıqdır" }); }} />
      </div>
      <Button className="bg-admin-accent text-accent-foreground hover:bg-admin-accent/90" onClick={() => toast({ title: "✅ Yadda saxlanıldı", description: "Ümumi tənzimləmələr yeniləndi" })}>Yadda saxla</Button>
    </div>
  );
}

function SeoTab() {
  return (
    <div className="space-y-4">
      <div><label className="text-sm font-medium">Meta title template</label><Input defaultValue="{title} | ucuztap.az" className="mt-1" /></div>
      <div><label className="text-sm font-medium">Meta description template</label><Input defaultValue="{title} - {category} elanı ucuztap.az saytında" className="mt-1" /></div>
      <div><label className="text-sm font-medium">GA4 ID</label><Input placeholder="G-XXXXXXXXXX" className="mt-1" /></div>
      <div><label className="text-sm font-medium">Yandex Metrica ID</label><Input defaultValue="32707595" className="mt-1" /></div>
      <Button className="bg-admin-accent text-accent-foreground hover:bg-admin-accent/90" onClick={() => toast({ title: "✅ SEO tənzimləmələri yadda saxlanıldı" })}>Yadda saxla</Button>
    </div>
  );
}

function EmailTab() {
  const handleTest = () => {
    toast({ title: "📧 Test email göndərilir..." });
    setTimeout(() => toast({ title: "✅ Test email göndərildi", description: "admin@ucuztap.az adresinə göndərildi" }), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div><label className="text-sm font-medium">SMTP Host</label><Input placeholder="smtp.gmail.com" className="mt-1" /></div>
        <div><label className="text-sm font-medium">Port</label><Input placeholder="587" className="mt-1" /></div>
      </div>
      <div><label className="text-sm font-medium">Username</label><Input placeholder="noreply@ucuztap.az" className="mt-1" /></div>
      <div><label className="text-sm font-medium">Password</label><Input type="password" placeholder="••••••" className="mt-1" /></div>
      <div className="flex gap-2">
        <Button className="bg-admin-accent text-accent-foreground hover:bg-admin-accent/90" onClick={() => toast({ title: "✅ Email tənzimləmələri yadda saxlanıldı" })}>Yadda saxla</Button>
        <Button variant="outline" onClick={handleTest}>Test email göndər</Button>
      </div>
    </div>
  );
}

function OdenisTab() {
  return (
    <div className="space-y-4">
      <div><label className="text-sm font-medium">Payriff API Key</label><Input type="password" placeholder="••••••" className="mt-1" /></div>
      <div><label className="text-sm font-medium">Webhook URL</label><Input defaultValue="https://api.ucuztap.az/webhooks/payriff" className="mt-1" readOnly /></div>
      <h4 className="text-sm font-semibold mt-4">Qiymətlər</h4>
      <div className="grid grid-cols-3 gap-4">
        <div><label className="text-xs text-muted-foreground">VIP</label><Input defaultValue="5" className="mt-1" /></div>
        <div><label className="text-xs text-muted-foreground">Premium</label><Input defaultValue="10" className="mt-1" /></div>
        <div><label className="text-xs text-muted-foreground">İrəli</label><Input defaultValue="2" className="mt-1" /></div>
      </div>
      <Button className="bg-admin-accent text-accent-foreground hover:bg-admin-accent/90" onClick={() => toast({ title: "✅ Ödəniş tənzimləmələri yadda saxlanıldı" })}>Yadda saxla</Button>
    </div>
  );
}

function LimitlerTab() {
  return (
    <div className="space-y-4">
      {[
        { label: "Max şəkil sayı", value: "10" },
        { label: "Max elan (istifadəçi başına)", value: "50" },
        { label: "Elan müddəti (gün)", value: "30" },
        { label: "Max başlıq uzunluğu", value: "100" },
        { label: "Max təsvir uzunluğu", value: "5000" },
      ].map((item) => (
        <div key={item.label}>
          <label className="text-sm font-medium">{item.label}</label>
          <Input defaultValue={item.value} className="mt-1 w-[200px]" />
        </div>
      ))}
      <Button className="bg-admin-accent text-accent-foreground hover:bg-admin-accent/90" onClick={() => toast({ title: "✅ Limitlər yadda saxlanıldı" })}>Yadda saxla</Button>
    </div>
  );
}

function RollarTab() {
  const roles = [
    { name: "Admin", desc: "Tam giriş — bütün əməliyyatlar", color: "bg-admin-accent/15 text-admin-accent" },
    { name: "Moderator", desc: "Elanlar + İstifadəçilər idarəsi", color: "bg-admin-info/10 text-admin-info" },
    { name: "Editor", desc: "Məzmun idarəsi", color: "bg-admin-success/10 text-admin-success" },
  ];
  return (
    <div className="space-y-3">
      {roles.map((r) => (
        <div key={r.name} className="flex items-center justify-between p-4 border border-border rounded-lg">
          <div className="flex items-center gap-3">
            <span className={cn("px-2.5 py-1 rounded text-xs font-semibold", r.color)}>{r.name}</span>
            <span className="text-sm text-muted-foreground">{r.desc}</span>
          </div>
          <Button variant="outline" size="sm" onClick={() => toast({ title: `${r.name} rolu redaktə edilir...` })}>Redaktə</Button>
        </div>
      ))}
    </div>
  );
}

const tabComponents = [UmumiTab, SeoTab, EmailTab, OdenisTab, LimitlerTab, RollarTab];

export default function TenzimlemelarPage() {
  const [active, setActive] = useState(0);
  const ActiveTab = tabComponents[active];

  return (
    <div className="space-y-4 animate-fade-in">
      <h2 className="text-lg font-semibold">Tənzimləmələr</h2>
      <div className="flex gap-1 border-b border-border">
        {tabs.map((t, i) => (
          <button
            key={t}
            onClick={() => setActive(i)}
            className={cn(
              "px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors",
              active === i ? "border-admin-accent text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="bg-card rounded-lg border border-border p-6">
        <ActiveTab />
      </div>
    </div>
  );
}
