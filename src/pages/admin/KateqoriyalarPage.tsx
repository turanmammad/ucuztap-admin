import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronRight, ChevronDown, Edit, Plus, Trash2, FolderOpen } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

interface TreeNode {
  id: string;
  name: string;
  count: number;
  slug: string;
  children?: TreeNode[];
}

let idCounter = 100;
const genId = () => `cat-${idCounter++}`;

const initialCategories: TreeNode[] = [
  { id: genId(), name: "Nəqliyyat", count: 45230, slug: "neqliyyat", children: [
    { id: genId(), name: "Avtomobil", count: 25000, slug: "avtomobil", children: [
      { id: genId(), name: "Mercedes-Benz", count: 3400, slug: "mercedes-benz" },
      { id: genId(), name: "BMW", count: 2800, slug: "bmw" },
      { id: genId(), name: "Toyota", count: 2200, slug: "toyota" },
      { id: genId(), name: "Hyundai", count: 1800, slug: "hyundai" },
    ]},
    { id: genId(), name: "Motosiklet", count: 500, slug: "motosiklet" },
    { id: genId(), name: "Ehtiyat hissələr", count: 3200, slug: "ehtiyat-hisseleri" },
  ]},
  { id: genId(), name: "Daşınmaz əmlak", count: 32100, slug: "dasinmaz-emlak", children: [
    { id: genId(), name: "Mənzil", count: 18000, slug: "menzil" },
    { id: genId(), name: "Ev / Villa", count: 5600, slug: "ev-villa" },
    { id: genId(), name: "Torpaq", count: 3200, slug: "torpaq" },
    { id: genId(), name: "Ofis", count: 2100, slug: "ofis" },
  ]},
  { id: genId(), name: "Elektronika", count: 28400, slug: "elektronika", children: [
    { id: genId(), name: "Telefonlar", count: 15000, slug: "telefonlar" },
    { id: genId(), name: "Kompüterlər", count: 8200, slug: "komputerler" },
    { id: genId(), name: "TV & Audio", count: 3100, slug: "tv-audio" },
  ]},
  { id: genId(), name: "Xidmətlər", count: 12500, slug: "xidmetler" },
  { id: genId(), name: "Ev və bağ", count: 9800, slug: "ev-bag" },
];

function updateNode(nodes: TreeNode[], id: string, updater: (n: TreeNode) => TreeNode): TreeNode[] {
  return nodes.map((n) => {
    if (n.id === id) return updater(n);
    if (n.children) return { ...n, children: updateNode(n.children, id, updater) };
    return n;
  });
}

function addChild(nodes: TreeNode[], parentId: string, child: TreeNode): TreeNode[] {
  return nodes.map((n) => {
    if (n.id === parentId) return { ...n, children: [...(n.children || []), child] };
    if (n.children) return { ...n, children: addChild(n.children, parentId, child) };
    return n;
  });
}

function removeNode(nodes: TreeNode[], id: string): TreeNode[] {
  return nodes.filter((n) => n.id !== id).map((n) =>
    n.children ? { ...n, children: removeNode(n.children, id) } : n
  );
}

function TreeItem({ node, depth = 0, onEdit, onAdd, onDelete }: {
  node: TreeNode;
  depth?: number;
  onEdit: (node: TreeNode) => void;
  onAdd: (parentId: string) => void;
  onDelete: (id: string, name: string) => void;
}) {
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
        <FolderOpen size={16} className="text-admin-accent shrink-0" />
        <span className="text-sm font-medium flex-1">{node.name}</span>
        <span className="text-xs text-muted-foreground tabular-nums">{node.count.toLocaleString()}</span>
        <span className="text-xs text-muted-foreground font-mono">{node.slug}</span>
        <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onEdit(node)}><Edit size={12} /></Button>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onAdd(node.id)}><Plus size={12} /></Button>
          <Button variant="ghost" size="icon" className="h-6 w-6 text-admin-danger" onClick={() => onDelete(node.id, node.name)}><Trash2 size={12} /></Button>
        </div>
      </div>
      {hasChildren && open && node.children!.map((child) => (
        <TreeItem key={child.id} node={child} depth={depth + 1} onEdit={onEdit} onAdd={onAdd} onDelete={onDelete} />
      ))}
    </div>
  );
}

export default function KateqoriyalarPage() {
  const [categories, setCategories] = useState(initialCategories);
  const [editNode, setEditNode] = useState<TreeNode | null>(null);
  const [addParentId, setAddParentId] = useState<string | null>(null);
  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");

  const openEdit = (node: TreeNode) => {
    setEditNode(node);
    setFormName(node.name);
    setFormSlug(node.slug);
    setAddParentId(null);
  };

  const openAdd = (parentId: string) => {
    setAddParentId(parentId);
    setEditNode(null);
    setFormName("");
    setFormSlug("");
  };

  const openAddRoot = () => {
    setAddParentId("root");
    setEditNode(null);
    setFormName("");
    setFormSlug("");
  };

  const handleSave = () => {
    if (!formName.trim()) {
      toast({ title: "Xəta", description: "Ad tələb olunur", variant: "destructive" });
      return;
    }
    const slug = formSlug.trim() || formName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

    if (editNode) {
      setCategories((prev) => updateNode(prev, editNode.id, (n) => ({ ...n, name: formName, slug })));
      toast({ title: "✅ Kateqoriya yeniləndi", description: `"${formName}" uğurla yeniləndi` });
      setEditNode(null);
    } else if (addParentId) {
      const newNode: TreeNode = { id: genId(), name: formName, count: 0, slug };
      if (addParentId === "root") {
        setCategories((prev) => [...prev, newNode]);
      } else {
        setCategories((prev) => addChild(prev, addParentId, newNode));
      }
      toast({ title: "✅ Kateqoriya əlavə edildi", description: `"${formName}" uğurla yaradıldı` });
      setAddParentId(null);
    }
  };

  const handleDelete = (id: string, name: string) => {
    setCategories((prev) => removeNode(prev, id));
    toast({ title: "🗑️ Kateqoriya silindi", description: `"${name}" silindi` });
  };

  const isOpen = editNode !== null || addParentId !== null;

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Kateqoriyalar</h2>
        <Button size="sm" className="bg-admin-accent text-accent-foreground hover:bg-admin-accent/90" onClick={openAddRoot}>
          <Plus size={14} className="mr-1" /> Yeni kateqoriya
        </Button>
      </div>
      <div className="bg-card rounded-lg border border-border p-2">
        {categories.map((cat) => (
          <TreeItem key={cat.id} node={cat} onEdit={openEdit} onAdd={openAdd} onDelete={handleDelete} />
        ))}
      </div>

      {/* Edit/Add Dialog */}
      <Dialog open={isOpen} onOpenChange={() => { setEditNode(null); setAddParentId(null); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editNode ? "Kateqoriya redaktə et" : "Yeni kateqoriya əlavə et"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Ad</label>
              <Input value={formName} onChange={(e) => setFormName(e.target.value)} className="mt-1" placeholder="Kateqoriya adı" />
            </div>
            <div>
              <label className="text-sm font-medium">Slug</label>
              <Input value={formSlug} onChange={(e) => setFormSlug(e.target.value)} className="mt-1" placeholder="avtomatik yaradılacaq" />
              <p className="text-xs text-muted-foreground mt-1">Boş buraxsanız addan avtomatik yaradılacaq</p>
            </div>
            <Button className="bg-admin-accent text-accent-foreground hover:bg-admin-accent/90 w-full" onClick={handleSave}>
              {editNode ? "Yadda saxla" : "Əlavə et"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
