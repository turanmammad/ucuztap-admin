import { Bot, Shield, Image, Copy, DollarSign, ArrowRight } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

const tools = [
  {
    icon: Shield,
    title: "Spam Filteri",
    desc: "Spam elanları avtomatik aşkarlayır",
    stats: "234 spam aşkarlandı, 12 yanlış pozitiv",
    defaultOn: true,
    hasSlider: true,
  },
  {
    icon: Image,
    title: "Şəkil Moderasiyası",
    desc: "Uyğunsuz şəkillər avtomatik bloklanır",
    stats: "18 şəkil bloklanıb bu həftə",
    defaultOn: true,
    hasSlider: false,
  },
  {
    icon: Copy,
    title: "Dublikat Aşkarlama",
    desc: "Eyni elanları tapır və birləşdirir",
    stats: "45 dublikat bu həftə",
    defaultOn: false,
    hasSlider: false,
  },
  {
    icon: DollarSign,
    title: "Qiymət Anomaliyası",
    desc: "Şübhəli qiymətləri aşkarlayır",
    stats: "23 elan bu həftə",
    defaultOn: true,
    hasSlider: true,
  },
];

export default function AiPage() {
  const [states, setStates] = useState(tools.map((t) => t.defaultOn));
  const toggle = (i: number) => setStates((s) => s.map((v, j) => (j === i ? !v : v)));

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
                <label className="text-xs text-muted-foreground">Confidence threshold: 85%</label>
                <Slider defaultValue={[85]} max={100} step={1} className="mt-1" />
              </div>
            )}

            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">Son 24 saat: {tool.stats}</p>
              <button className="text-xs text-admin-accent hover:underline flex items-center gap-1">
                Ətraflı <ArrowRight size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
