import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronDown, Edit, Plus, Trash2, MapPin } from "lucide-react";

interface LocNode {
  name: string;
  count: number;
  children?: LocNode[];
}

const locations: LocNode[] = [
  { name: "Bakı", count: 125000, children: [
    { name: "Nəsimi", count: 18000 },
    { name: "Yasamal", count: 15000 },
    { name: "Səbail", count: 12000 },
    { name: "Xətai", count: 14000 },
    { name: "Binəqədi", count: 11000 },
    { name: "Nizami", count: 9500 },
  ]},
  { name: "Sumqayıt", count: 8500 },
  { name: "Gəncə", count: 6200 },
  { name: "Lənkəran", count: 3100 },
  { name: "Mingəçevir", count: 2800 },
  { name: "Şəki", count: 2200 },
];

function LocItem({ node, depth = 0 }: { node: LocNode; depth?: number }) {
  const [open, setOpen] = useState(depth === 0);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div>
      <div className="flex items-center gap-2 py-2 px-3 hover:bg-muted/30 rounded-md transition-colors group" style={{ paddingLeft: `${depth * 24 + 12}px` }}>
        {hasChildren ? (
          <button onClick={() => setOpen(!open)} className="w-5 h-5 flex items-center justify-center text-muted-foreground hover:text-foreground">
            {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
        ) : <span className="w-5" />}
        <MapPin size={16} className="text-admin-info shrink-0" />
        <span className="text-sm font-medium flex-1">{node.name}</span>
        <span className="text-xs text-muted-foreground tabular-nums">{node.count.toLocaleString()}</span>
        <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon" className="h-6 w-6"><Edit size={12} /></Button>
          <Button variant="ghost" size="icon" className="h-6 w-6"><Plus size={12} /></Button>
          <Button variant="ghost" size="icon" className="h-6 w-6 text-admin-danger"><Trash2 size={12} /></Button>
        </div>
      </div>
      {hasChildren && open && node.children!.map((child) => <LocItem key={child.name} node={child} depth={depth + 1} />)}
    </div>
  );
}

export default function LokasiyalarPage() {
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Lokasiyalar</h2>
        <Button size="sm" className="bg-admin-accent text-accent-foreground hover:bg-admin-accent/90"><Plus size={14} className="mr-1" /> Yeni lokasiya</Button>
      </div>
      <div className="bg-card rounded-lg border border-border p-2">
        {locations.map((loc) => <LocItem key={loc.name} node={loc} />)}
      </div>
    </div>
  );
}
