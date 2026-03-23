import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronDown, Edit, Plus, Trash2, FolderOpen } from "lucide-react";

interface TreeNode {
  name: string;
  count: number;
  slug: string;
  children?: TreeNode[];
}

const categories: TreeNode[] = [
  { name: "Nəqliyyat", count: 45230, slug: "neqliyyat", children: [
    { name: "Avtomobil", count: 25000, slug: "avtomobil", children: [
      { name: "Mercedes-Benz", count: 3400, slug: "mercedes-benz" },
      { name: "BMW", count: 2800, slug: "bmw" },
      { name: "Toyota", count: 2200, slug: "toyota" },
      { name: "Hyundai", count: 1800, slug: "hyundai" },
    ]},
    { name: "Motosiklet", count: 500, slug: "motosiklet" },
    { name: "Ehtiyat hissələr", count: 3200, slug: "ehtiyat-hisseleri" },
  ]},
  { name: "Daşınmaz əmlak", count: 32100, slug: "dasinmaz-emlak", children: [
    { name: "Mənzil", count: 18000, slug: "menzil" },
    { name: "Ev / Villa", count: 5600, slug: "ev-villa" },
    { name: "Torpaq", count: 3200, slug: "torpaq" },
    { name: "Ofis", count: 2100, slug: "ofis" },
  ]},
  { name: "Elektronika", count: 28400, slug: "elektronika", children: [
    { name: "Telefonlar", count: 15000, slug: "telefonlar" },
    { name: "Kompüterlər", count: 8200, slug: "komputerler" },
    { name: "TV & Audio", count: 3100, slug: "tv-audio" },
  ]},
  { name: "Xidmətlər", count: 12500, slug: "xidmetler" },
  { name: "Ev və bağ", count: 9800, slug: "ev-bag" },
];

function TreeItem({ node, depth = 0 }: { node: TreeNode; depth?: number }) {
  const [open, setOpen] = useState(depth === 0);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div>
      <div
        className="flex items-center gap-2 py-2 px-3 hover:bg-muted/30 rounded-md transition-colors group"
        style={{ paddingLeft: `${depth * 24 + 12}px` }}
      >
        {hasChildren ? (
          <button onClick={() => setOpen(!open)} className="w-5 h-5 flex items-center justify-center text-muted-foreground hover:text-foreground">
            {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
        ) : <span className="w-5" />}
        <FolderOpen size={16} className="text-admin-accent shrink-0" />
        <span className="text-sm font-medium flex-1">{node.name}</span>
        <span className="text-xs text-muted-foreground tabular-nums">{node.count.toLocaleString()}</span>
        <span className="text-xs text-muted-foreground font-mono">{node.slug}</span>
        <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon" className="h-6 w-6"><Edit size={12} /></Button>
          <Button variant="ghost" size="icon" className="h-6 w-6"><Plus size={12} /></Button>
          <Button variant="ghost" size="icon" className="h-6 w-6 text-admin-danger"><Trash2 size={12} /></Button>
        </div>
      </div>
      {hasChildren && open && node.children!.map((child) => (
        <TreeItem key={child.slug} node={child} depth={depth + 1} />
      ))}
    </div>
  );
}

export default function KateqoriyalarPage() {
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Kateqoriyalar</h2>
        <Button size="sm" className="bg-admin-accent text-accent-foreground hover:bg-admin-accent/90"><Plus size={14} className="mr-1" /> Yeni kateqoriya</Button>
      </div>
      <div className="bg-card rounded-lg border border-border p-2">
        {categories.map((cat) => <TreeItem key={cat.slug} node={cat} />)}
      </div>
    </div>
  );
}
