import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { Save, Shield, Globe, Bell, Database, Palette, Lock, FileText, Zap, Server, Mail, CreditCard } from "lucide-react";

const tabs = ["Ümumi", "SEO", "Email", "Ödəniş", "Limitlər", "Rollar", "Bildirişlər", "Təhlükəsizlik", "Görünüş", "API"];

function UmumiTab() {
  const [title, setTitle] = useState("ucuztap.az — Pulsuz Elanlar");
  const [desc, setDesc] = useState("Azərbaycanda ən böyük pulsuz elan saytı");
  const [maintenance, setMaintenance] = useState(false);
  const [lang, setLang] = useState("az");
  const [timezone, setTimezone] = useState("Asia/Baku");
  const [contactEmail, setContactEmail] = useState("info@ucuztap.az");
  const [contactPhone, setContactPhone] = useState("+994 12 555 00 00");
  const [footerText, setFooterText] = useState("© 2026 ucuztap.az — Bütün hüquqlar qorunur");

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="text-sm font-medium">Sayt başlığı</label><Input value={title} onChange={e => setTitle(e.target.value)} className="mt-1" /></div>
        <div><label className="text-sm font-medium">Əlaqə emaili</label><Input value={contactEmail} onChange={e => setContactEmail(e.target.value)} className="mt-1" /></div>
      </div>
      <div><label className="text-sm font-medium">Sayt təsviri</label><Textarea value={desc} onChange={e => setDesc(e.target.value)} className="mt-1" rows={2} /></div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div><label className="text-sm font-medium">Əlaqə telefonu</label><Input value={contactPhone} onChange={e => setContactPhone(e.target.value)} className="mt-1" /></div>
        <div>
          <label className="text-sm font-medium">Dil</label>
          <Select value={lang} onValueChange={setLang}>
            <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="az">Azərbaycan</SelectItem>
              <SelectItem value="ru">Русский</SelectItem>
              <SelectItem value="en">English</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium">Vaxt zonası</label>
          <Select value={timezone} onValueChange={setTimezone}>
            <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Asia/Baku">Asia/Baku (GMT+4)</SelectItem>
              <SelectItem value="Europe/Moscow">Europe/Moscow (GMT+3)</SelectItem>
              <SelectItem value="UTC">UTC</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div><label className="text-sm font-medium">Footer mətni</label><Input value={footerText} onChange={e => setFooterText(e.target.value)} className="mt-1" /></div>
      <div className="flex items-center justify-between py-2 bg-admin-warning/5 rounded-lg px-4">
        <div><p className="text-sm font-medium">Texniki iş rejimi</p><p className="text-xs text-muted-foreground">Saytı müvəqqəti bağla</p></div>
        <Switch checked={maintenance} onCheckedChange={v => { setMaintenance(v); toast({ title: v ? "⚠️ Texniki iş rejimi aktiv" : "✅ Sayt açıqdır" }); }} />
      </div>
      <Button className="bg-admin-accent text-accent-foreground hover:bg-admin-accent/90" onClick={() => toast({ title: "✅ Yadda saxlanıldı" })}><Save size={14} className="mr-1" /> Yadda saxla</Button>
    </div>
  );
}

function SeoTab() {
  const [metaTitle, setMetaTitle] = useState("{title} | ucuztap.az");
  const [metaDesc, setMetaDesc] = useState("{title} - {category} elanı ucuztap.az saytında");
  const [ga4, setGa4] = useState("");
  const [yandex, setYandex] = useState("32707595");
  const [fbPixel, setFbPixel] = useState("");
  const [canonical, setCanonical] = useState("https://ucuztap.az");
  const [robots, setRobots] = useState("index, follow");
  const [ogImage, setOgImage] = useState("");
  const [sitemap, setSitemap] = useState(true);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="text-sm font-medium">Meta title template</label><Input value={metaTitle} onChange={e => setMetaTitle(e.target.value)} className="mt-1" /></div>
        <div><label className="text-sm font-medium">Canonical URL</label><Input value={canonical} onChange={e => setCanonical(e.target.value)} className="mt-1" /></div>
      </div>
      <div><label className="text-sm font-medium">Meta description template</label><Input value={metaDesc} onChange={e => setMetaDesc(e.target.value)} className="mt-1" /></div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div><label className="text-sm font-medium">GA4 ID</label><Input placeholder="G-XXXXXXXXXX" value={ga4} onChange={e => setGa4(e.target.value)} className="mt-1" /></div>
        <div><label className="text-sm font-medium">Yandex Metrica ID</label><Input value={yandex} onChange={e => setYandex(e.target.value)} className="mt-1" /></div>
        <div><label className="text-sm font-medium">Facebook Pixel ID</label><Input placeholder="Pixel ID" value={fbPixel} onChange={e => setFbPixel(e.target.value)} className="mt-1" /></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="text-sm font-medium">Robots</label><Input value={robots} onChange={e => setRobots(e.target.value)} className="mt-1" /></div>
        <div><label className="text-sm font-medium">OG Image URL</label><Input placeholder="https://..." value={ogImage} onChange={e => setOgImage(e.target.value)} className="mt-1" /></div>
      </div>
      <div className="flex items-center justify-between py-2">
        <div><p className="text-sm font-medium">Sitemap avtomatik generasiya</p><p className="text-xs text-muted-foreground">sitemap.xml avtomatik yenilənsin</p></div>
        <Switch checked={sitemap} onCheckedChange={setSitemap} />
      </div>
      <Button className="bg-admin-accent text-accent-foreground hover:bg-admin-accent/90" onClick={() => toast({ title: "✅ SEO tənzimləmələri yadda saxlanıldı" })}><Save size={14} className="mr-1" /> Yadda saxla</Button>
    </div>
  );
}

function EmailTab() {
  const [smtpHost, setSmtpHost] = useState("smtp.gmail.com");
  const [smtpPort, setSmtpPort] = useState("587");
  const [smtpUser, setSmtpUser] = useState("noreply@ucuztap.az");
  const [smtpPass, setSmtpPass] = useState("");
  const [fromName, setFromName] = useState("ucuztap.az");
  const [encryption, setEncryption] = useState("tls");
  const handleTest = () => {
    toast({ title: "📧 Test email göndərilir..." });
    setTimeout(() => toast({ title: "✅ Test email göndərildi" }), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div><label className="text-sm font-medium">SMTP Host</label><Input value={smtpHost} onChange={e => setSmtpHost(e.target.value)} className="mt-1" /></div>
        <div><label className="text-sm font-medium">Port</label><Input value={smtpPort} onChange={e => setSmtpPort(e.target.value)} className="mt-1" /></div>
        <div>
          <label className="text-sm font-medium">Şifrələmə</label>
          <Select value={encryption} onValueChange={setEncryption}>
            <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="tls">TLS</SelectItem>
              <SelectItem value="ssl">SSL</SelectItem>
              <SelectItem value="none">Yoxdur</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="text-sm font-medium">Username</label><Input value={smtpUser} onChange={e => setSmtpUser(e.target.value)} className="mt-1" /></div>
        <div><label className="text-sm font-medium">Password</label><Input type="password" value={smtpPass} onChange={e => setSmtpPass(e.target.value)} className="mt-1" /></div>
      </div>
      <div><label className="text-sm font-medium">Göndərən ad</label><Input value={fromName} onChange={e => setFromName(e.target.value)} className="mt-1" /></div>
      <div className="flex gap-2">
        <Button className="bg-admin-accent text-accent-foreground hover:bg-admin-accent/90" onClick={() => toast({ title: "✅ Email tənzimləmələri yadda saxlanıldı" })}><Save size={14} className="mr-1" /> Yadda saxla</Button>
        <Button variant="outline" onClick={handleTest}>Test email göndər</Button>
      </div>
    </div>
  );
}

function OdenisTab() {
  const [payriffKey, setPayriffKey] = useState("");
  const [payriffSecret, setPayriffSecret] = useState("");
  const [currency, setCurrency] = useState("AZN");
  const [testMode, setTestMode] = useState(true);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="text-sm font-medium">Payriff API Key</label><Input type="password" value={payriffKey} onChange={e => setPayriffKey(e.target.value)} className="mt-1" /></div>
        <div><label className="text-sm font-medium">Payriff Secret</label><Input type="password" value={payriffSecret} onChange={e => setPayriffSecret(e.target.value)} className="mt-1" /></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="text-sm font-medium">Webhook URL</label><Input defaultValue="https://api.ucuztap.az/webhooks/payriff" className="mt-1" readOnly /></div>
        <div>
          <label className="text-sm font-medium">Valyuta</label>
          <Select value={currency} onValueChange={setCurrency}>
            <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="AZN">AZN (₼)</SelectItem>
              <SelectItem value="USD">USD ($)</SelectItem>
              <SelectItem value="EUR">EUR (€)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <h4 className="text-sm font-semibold mt-4">Qiymətlər</h4>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "VIP (gün)", value: "5" },
          { label: "Premium (gün)", value: "10" },
          { label: "İrəli çək", value: "2" },
          { label: "Mağaza Biznes (ay)", value: "15" },
        ].map(item => (
          <div key={item.label}><label className="text-xs text-muted-foreground">{item.label}</label><Input defaultValue={item.value} className="mt-1" /></div>
        ))}
      </div>
      <div className="flex items-center justify-between py-2 bg-admin-warning/5 rounded-lg px-4">
        <div><p className="text-sm font-medium">Test rejimi</p><p className="text-xs text-muted-foreground">Real ödənişlər qəbul olunmayacaq</p></div>
        <Switch checked={testMode} onCheckedChange={v => { setTestMode(v); toast({ title: v ? "🧪 Test rejimi aktiv" : "💰 Real rejim aktiv" }); }} />
      </div>
      <Button className="bg-admin-accent text-accent-foreground hover:bg-admin-accent/90" onClick={() => toast({ title: "✅ Ödəniş tənzimləmələri yadda saxlanıldı" })}><Save size={14} className="mr-1" /> Yadda saxla</Button>
    </div>
  );
}

function LimitlerTab() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { label: "Max şəkil sayı (elan başına)", value: "10" },
          { label: "Max elan (istifadəçi başına)", value: "50" },
          { label: "Elan müddəti (gün)", value: "30" },
          { label: "Max başlıq uzunluğu", value: "100" },
          { label: "Max təsvir uzunluğu", value: "5000" },
          { label: "Max fayl ölçüsü (MB)", value: "5" },
          { label: "Elan redaktə limiti (dəfə)", value: "10" },
          { label: "Min elan qiyməti (₼)", value: "0" },
          { label: "Max elan qiyməti (₼)", value: "10000000" },
          { label: "Gündəlik elan limiti", value: "5" },
        ].map(item => (
          <div key={item.label}>
            <label className="text-sm font-medium">{item.label}</label>
            <Input defaultValue={item.value} className="mt-1" />
          </div>
        ))}
      </div>
      <Button className="bg-admin-accent text-accent-foreground hover:bg-admin-accent/90" onClick={() => toast({ title: "✅ Limitlər yadda saxlanıldı" })}><Save size={14} className="mr-1" /> Yadda saxla</Button>
    </div>
  );
}

function RollarTab() {
  const [roles, setRoles] = useState([
    { name: "Admin", desc: "Tam giriş — bütün əməliyyatlar", permissions: ["Elanlar", "İstifadəçilər", "Mağazalar", "Ödənişlər", "Tənzimləmələr", "Sistem"] },
    { name: "Moderator", desc: "Elanlar + İstifadəçilər idarəsi", permissions: ["Elanlar", "İstifadəçilər", "Şikayətlər"] },
    { name: "Editor", desc: "Məzmun idarəsi", permissions: ["Elanlar", "Kateqoriyalar"] },
    { name: "Viewer", desc: "Yalnız baxış", permissions: ["Elanlar (oxu)"] },
  ]);

  const allPerms = ["Elanlar", "İstifadəçilər", "Mağazalar", "Ödənişlər", "Tənzimləmələr", "Sistem", "Şikayətlər", "Kateqoriyalar", "Hesabatlar"];

  return (
    <div className="space-y-4">
      {roles.map((r, idx) => (
        <div key={r.name} className="border border-border rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className={cn("px-2.5 py-1 rounded text-xs font-semibold",
                r.name === "Admin" ? "bg-admin-accent/15 text-admin-accent" :
                r.name === "Moderator" ? "bg-admin-info/10 text-admin-info" :
                "bg-admin-success/10 text-admin-success"
              )}>{r.name}</span>
              <span className="text-sm text-muted-foreground">{r.desc}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {allPerms.map(perm => (
              <button
                key={perm}
                onClick={() => {
                  const newRoles = [...roles];
                  const perms = newRoles[idx].permissions;
                  if (perms.includes(perm)) {
                    newRoles[idx].permissions = perms.filter(p => p !== perm);
                  } else {
                    newRoles[idx].permissions = [...perms, perm];
                  }
                  setRoles(newRoles);
                }}
                className={cn("text-xs px-2 py-1 rounded-md border transition-colors",
                  r.permissions.includes(perm) ? "bg-admin-accent/10 text-admin-accent border-admin-accent/30" : "border-border text-muted-foreground hover:bg-muted"
                )}
              >
                {perm}
              </button>
            ))}
          </div>
        </div>
      ))}
      <Button className="bg-admin-accent text-accent-foreground hover:bg-admin-accent/90" onClick={() => toast({ title: "✅ Rollar yadda saxlanıldı" })}><Save size={14} className="mr-1" /> Yadda saxla</Button>
    </div>
  );
}

function BildirislerTab() {
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(false);
  const [pushNotif, setPushNotif] = useState(true);
  const [adminNotif, setAdminNotif] = useState(true);
  const [newAdNotif, setNewAdNotif] = useState(true);
  const [paymentNotif, setPaymentNotif] = useState(true);
  const [complaintNotif, setComplaintNotif] = useState(true);

  const notifItems = [
    { label: "Email bildirişləri", desc: "Yeni hadisələr email ilə göndərilsin", value: emailNotif, onChange: setEmailNotif },
    { label: "SMS bildirişləri", desc: "Kritik hadisələr SMS ilə göndərilsin", value: smsNotif, onChange: setSmsNotif },
    { label: "Push bildirişləri", desc: "Mobil push bildirişlər aktiv olsun", value: pushNotif, onChange: setPushNotif },
    { label: "Admin bildirişləri", desc: "Admin panelində bildiriş göstər", value: adminNotif, onChange: setAdminNotif },
    { label: "Yeni elan bildirişi", desc: "Yeni elan gəldikdə xəbərdar et", value: newAdNotif, onChange: setNewAdNotif },
    { label: "Ödəniş bildirişi", desc: "Yeni ödəniş gəldikdə xəbərdar et", value: paymentNotif, onChange: setPaymentNotif },
    { label: "Şikayət bildirişi", desc: "Yeni şikayət gəldikdə xəbərdar et", value: complaintNotif, onChange: setComplaintNotif },
  ];

  return (
    <div className="space-y-3">
      {notifItems.map(item => (
        <div key={item.label} className="flex items-center justify-between py-2 px-4 rounded-lg border border-border">
          <div><p className="text-sm font-medium">{item.label}</p><p className="text-xs text-muted-foreground">{item.desc}</p></div>
          <Switch checked={item.value} onCheckedChange={item.onChange} />
        </div>
      ))}
      <Button className="bg-admin-accent text-accent-foreground hover:bg-admin-accent/90" onClick={() => toast({ title: "✅ Bildiriş tənzimləmələri yadda saxlanıldı" })}><Save size={14} className="mr-1" /> Yadda saxla</Button>
    </div>
  );
}

function TehlukesizlikTab() {
  const [twoFa, setTwoFa] = useState(false);
  const [ipWhitelist, setIpWhitelist] = useState("");
  const [sessionTimeout, setSessionTimeout] = useState("30");
  const [loginAttempts, setLoginAttempts] = useState("5");
  const [captcha, setCaptcha] = useState(true);
  const [bruteForce, setBruteForce] = useState(true);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between py-2 px-4 rounded-lg border border-border">
        <div><p className="text-sm font-medium">İki faktorlu doğrulama (2FA)</p><p className="text-xs text-muted-foreground">Admin girişi üçün 2FA tələb et</p></div>
        <Switch checked={twoFa} onCheckedChange={setTwoFa} />
      </div>
      <div className="flex items-center justify-between py-2 px-4 rounded-lg border border-border">
        <div><p className="text-sm font-medium">CAPTCHA</p><p className="text-xs text-muted-foreground">Giriş və qeydiyyat zamanı captcha göstər</p></div>
        <Switch checked={captcha} onCheckedChange={setCaptcha} />
      </div>
      <div className="flex items-center justify-between py-2 px-4 rounded-lg border border-border">
        <div><p className="text-sm font-medium">Brute-force qoruması</p><p className="text-xs text-muted-foreground">Çoxsaylı uğursuz cəhdlərdə IP blokla</p></div>
        <Switch checked={bruteForce} onCheckedChange={setBruteForce} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="text-sm font-medium">Sessiya vaxtı (dəqiqə)</label><Input value={sessionTimeout} onChange={e => setSessionTimeout(e.target.value)} className="mt-1" /></div>
        <div><label className="text-sm font-medium">Max giriş cəhdləri</label><Input value={loginAttempts} onChange={e => setLoginAttempts(e.target.value)} className="mt-1" /></div>
      </div>
      <div><label className="text-sm font-medium">IP Whitelist (vergüllə ayır)</label><Textarea value={ipWhitelist} onChange={e => setIpWhitelist(e.target.value)} className="mt-1" rows={2} placeholder="185.129.0.0/16, 10.0.0.1" /></div>
      <Button className="bg-admin-accent text-accent-foreground hover:bg-admin-accent/90" onClick={() => toast({ title: "✅ Təhlükəsizlik tənzimləmələri yadda saxlanıldı" })}><Save size={14} className="mr-1" /> Yadda saxla</Button>
    </div>
  );
}

function GorunusTab() {
  const [primaryColor, setPrimaryColor] = useState("#6366f1");
  const [darkMode, setDarkMode] = useState(true);
  const [borderRadius, setBorderRadius] = useState("8");
  const [fontSize, setFontSize] = useState("14");

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Primary rəng</label>
          <div className="flex items-center gap-2 mt-1">
            <input type="color" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} className="w-10 h-10 rounded cursor-pointer border-0" />
            <Input value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} className="flex-1" />
          </div>
        </div>
        <div><label className="text-sm font-medium">Border radius (px)</label><Input value={borderRadius} onChange={e => setBorderRadius(e.target.value)} className="mt-1" /></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="text-sm font-medium">Font ölçüsü (px)</label><Input value={fontSize} onChange={e => setFontSize(e.target.value)} className="mt-1" /></div>
        <div className="flex items-center justify-between py-2">
          <div><p className="text-sm font-medium">Dark mode dəstəyi</p></div>
          <Switch checked={darkMode} onCheckedChange={setDarkMode} />
        </div>
      </div>
      <Button className="bg-admin-accent text-accent-foreground hover:bg-admin-accent/90" onClick={() => toast({ title: "✅ Görünüş tənzimləmələri yadda saxlanıldı" })}><Save size={14} className="mr-1" /> Yadda saxla</Button>
    </div>
  );
}

function ApiTab() {
  const [apiKey, setApiKey] = useState("sk_live_ucuztap_" + Math.random().toString(36).slice(2, 14));
  const [rateLimit, setRateLimit] = useState("100");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [apiEnabled, setApiEnabled] = useState(true);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between py-2 px-4 rounded-lg border border-border">
        <div><p className="text-sm font-medium">API aktiv</p><p className="text-xs text-muted-foreground">Xarici inteqrasiyalar üçün API-ni aktiv et</p></div>
        <Switch checked={apiEnabled} onCheckedChange={setApiEnabled} />
      </div>
      <div>
        <label className="text-sm font-medium">API Key</label>
        <div className="flex gap-2 mt-1">
          <Input value={apiKey} readOnly className="font-mono text-xs flex-1" />
          <Button variant="outline" size="sm" onClick={() => { setApiKey("sk_live_ucuztap_" + Math.random().toString(36).slice(2, 14)); toast({ title: "🔑 Yeni API key yaradıldı" }); }}>Yenilə</Button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="text-sm font-medium">Rate limit (req/min)</label><Input value={rateLimit} onChange={e => setRateLimit(e.target.value)} className="mt-1" /></div>
        <div><label className="text-sm font-medium">Webhook URL</label><Input value={webhookUrl} onChange={e => setWebhookUrl(e.target.value)} className="mt-1" placeholder="https://..." /></div>
      </div>
      <Button className="bg-admin-accent text-accent-foreground hover:bg-admin-accent/90" onClick={() => toast({ title: "✅ API tənzimləmələri yadda saxlanıldı" })}><Save size={14} className="mr-1" /> Yadda saxla</Button>
    </div>
  );
}

const tabIcons = [Globe, FileText, Mail, CreditCard, Zap, Shield, Bell, Lock, Palette, Server];
const tabComponents = [UmumiTab, SeoTab, EmailTab, OdenisTab, LimitlerTab, RollarTab, BildirislerTab, TehlukesizlikTab, GorunusTab, ApiTab];

export default function TenzimlemelarPage() {
  const [active, setActive] = useState(0);
  const ActiveTab = tabComponents[active];
  const CreditCard = tabIcons[3]; // just to prevent unused import warning

  return (
    <div className="space-y-4 animate-fade-in">
      <h2 className="text-lg font-semibold">Tənzimləmələr</h2>
      <div className="flex gap-1 overflow-x-auto border-b border-border pb-px">
        {tabs.map((t, i) => {
          const Icon = tabIcons[i];
          return (
            <button
              key={t}
              onClick={() => setActive(i)}
              className={cn(
                "px-3 py-2 text-sm font-medium border-b-2 -mb-px transition-colors flex items-center gap-1.5 whitespace-nowrap",
                active === i ? "border-admin-accent text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon size={14} />
              {t}
            </button>
          );
        })}
      </div>
      <div className="bg-card rounded-lg border border-border p-6">
        <ActiveTab />
      </div>
    </div>
  );
}
