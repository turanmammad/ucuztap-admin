import { useState } from "react";
import { Bot, Shield, Image, Copy, DollarSign, ArrowRight, TrendingUp, AlertTriangle } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

const tools = [
  {
    icon: Shield,
    title: "Spam Filteri",
    desc: "Spam elanları avtomatik aşkarlayır",
    stats: "234 spam aşkarlandı, 12 yanlış pozitiv",
    defaultOn: true,
    hasSlider: true,
    details: [
      { label: "Bu gün aşkarlanan", value: "34" },
      { label: "Bu həftə", value: "234" },
      { label: "Yanlış pozitiv", value: "12 (5.1%)" },
      { label: "Dəqiqlik", value: "94.9%" },
    ],
    recentFlags: [
      { id: 10042, title: "PULSUZ iPhone QAZAN!!!", reason: "Spam sözlər", time: "14:23" },
      { id: 10039, title: "Tez qazanc — evdən iş", reason: "Şübhəli məzmun", time: "13:10" },
      { id: 10035, title: "Ucuz kredit, sənədsiz", reason: "Fırıldaq şübhəsi", time: "11:45" },
    ],
  },
  {
    icon: Image,
    title: "Şəkil Moderasiyası",
    desc: "Uyğunsuz şəkillər avtomatik bloklanır",
    stats: "18 şəkil bloklanıb bu həftə",
    defaultOn: true,
    hasSlider: false,
    details: [
      { label: "Bu həftə bloklanan", value: "18" },
      { label: "Bu ay", value: "67" },
      { label: "Yanlış pozitiv", value: "3 (4.5%)" },
      { label: "Ortalama cavab müddəti", value: "1.2 san" },
    ],
    recentFlags: [
      { id: 10040, title: "Elan #10040", reason: "Uyğunsuz şəkil", time: "12:30" },
      { id: 10037, title: "Elan #10037", reason: "Lisenziyasız logo", time: "10:15" },
    ],
  },
  {
    icon: Copy,
    title: "Dublikat Aşkarlama",
    desc: "Eyni elanları tapır və birləşdirir",
    stats: "45 dublikat bu həftə",
    defaultOn: false,
    hasSlider: false,
    details: [
      { label: "Bu həftə tapılan", value: "45" },
      { label: "Avtomatik silinən", value: "32" },
      { label: "Manual baxış gözləyən", value: "13" },
      { label: "Oxşarlıq həddi", value: "85%" },
    ],
    recentFlags: [
      { id: 10038, title: "Mercedes C220d (x3)", reason: "Eyni şəkillər, eyni təsvir", time: "15:00" },
      { id: 10033, title: "iPhone 15 Pro (x2)", reason: "Eyni telefon nömrəsi", time: "09:20" },
    ],
  },
  {
    icon: DollarSign,
    title: "Qiymət Anomaliyası",
    desc: "Şübhəli qiymətləri aşkarlayır",
    stats: "23 elan bu həftə",
    defaultOn: true,
    hasSlider: true,
    details: [
      { label: "Bu həftə aşkarlanan", value: "23" },
      { label: "Ortalama sapma", value: "72%" },
      { label: "Ən çox kateqoriya", value: "Nəqliyyat" },
      { label: "Təsdiqlənən anomaliya", value: "18 (78%)" },
    ],
    recentFlags: [
      { id: 10041, title: "BMW X5 — 500 ₼", reason: "Bazar dəyərindən 95% aşağı", time: "13:45" },
      { id: 10036, title: "3 otaqlı mənzil — 100 ₼", reason: "Bazar dəyərindən 99% aşağı", time: "08:30" },
    ],
  },
];

export default function AiPage() {
  const [states, setStates] = useState(tools.map((t) => t.defaultOn));
  const [sliderValues, setSliderValues] = useState([85, 0, 0, 75]);
  const [detailIdx, setDetailIdx] = useState<number | null>(null);

  const toggle = (i: number) => {
    setStates((s) => s.map((v, j) => (j === i ? !v : v)));
    toast({
      title: states[i] ? `⏸️ ${tools[i].title} söndürüldü` : `▶️ ${tools[i].title} aktivləşdirildi`,
    });
  };

  const detailTool = detailIdx !== null ? tools[detailIdx] : null;

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center gap-2">
        <Bot size={20} className="text-admin-accent" />
        <h2 className="text-lg font-semibold">AI Alətlər</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tools.map((tool, i) => (
          <div key={tool.title} className="bg-card rounded-lg border border-border p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-admin-accent/10 flex items-center justify-center">
                  <tool.icon size={18} className="text-admin-accent" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">{tool.title}</h3>
                  <p className="text-xs text-muted-foreground">{tool.desc}</p>
                </div>
              </div>
              <Switch checked={states[i]} onCheckedChange={() => toggle(i)} />
            </div>

            {tool.hasSlider && (
              <div className="mb-3">
                <label className="text-xs text-muted-foreground">Confidence threshold: {sliderValues[i]}%</label>
                <Slider
                  value={[sliderValues[i]]}
                  onValueChange={(v) => setSliderValues((s) => s.map((sv, j) => j === i ? v[0] : sv))}
                  max={100}
                  step={1}
                  className="mt-1"
                />
              </div>
            )}

            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">Son 24 saat: {tool.stats}</p>
              <Button variant="ghost" size="sm" className="text-xs text-admin-accent h-7" onClick={() => setDetailIdx(i)}>
                Ətraflı <ArrowRight size={12} className="ml-1" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Dialog */}
      <Dialog open={detailIdx !== null} onOpenChange={() => setDetailIdx(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {detailTool && <detailTool.icon size={18} className="text-admin-accent" />}
              {detailTool?.title} — Ətraflı
            </DialogTitle>
          </DialogHeader>
          {detailTool && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {detailTool.details.map((d) => (
                  <div key={d.label} className="bg-muted/30 rounded-lg p-3">
                    <p className="text-lg font-bold">{d.value}</p>
                    <p className="text-[10px] text-muted-foreground">{d.label}</p>
                  </div>
                ))}
              </div>

              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Son aşkarlananlar</h4>
                <div className="space-y-1.5">
                  {detailTool.recentFlags.map((f) => (
                    <div key={f.id} className="flex items-center gap-2 py-2 px-3 rounded-md bg-muted/20 text-sm">
                      <AlertTriangle size={14} className="text-admin-warning shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-xs truncate">{f.title}</p>
                        <p className="text-[10px] text-muted-foreground">{f.reason}</p>
                      </div>
                      <span className="text-[10px] text-muted-foreground">{f.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
