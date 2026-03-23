import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronRight, ChevronDown, Edit, Plus, Trash2, MapPin } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

interface LocNode {
  id: string;
  name: string;
  count: number;
  children?: LocNode[];
}

let idCounter = 200;
const genId = () => `loc-${idCounter++}`;

const initialLocations: LocNode[] = [
  { id: genId(), name: "Bakı", count: 125000, children: [
    { id: genId(), name: "Nəsimi", count: 18000 },
    { id: genId(), name: "Yasamal", count: 15000 },
    { id: genId(), name: "Səbail", count: 12000 },
    { id: genId(), name: "Xətai", count: 14000 },
    { id: genId(), name: "Binəqədi", count: 11000 },
    { id: genId(), name: "Nizami", count: 9500 },
  ]},
  { id: genId(), name: "Sumqayıt", count: 8500 },
  { id: genId(), name: "Gəncə", count: 6200 },
  { id: genId(), name: "Lənkəran", count: 3100 },
  { id: genId(), name: "Mingəçevir", count: 2800 },
  { id: genId(), name: "Şəki", count: 2200 },
];

function updateNode(nodes: LocNode[], id: string, updater: (n: LocNode) => LocNode): LocNode[] {
  return nodes.map((n) => {
    if (n.id === id) return updater(n);
    if (n.children) return { ...n, children: updateNode(n.children, id, updater) };
    return n;
  });
}

function addChild(nodes: LocNode[], parentId: string, child: LocNode): LocNode[] {
  return nodes.map((n) => {
    if (n.id === parentId) return { ...n, children: [...(n.children || []), child] };
    if (n.children) return { ...n, children: addChild(n.children, parentId, child) };
    return n;
  });
}

function removeNode(nodes: LocNode[], id: string): LocNode[] {
  return nodes.filter((n) => n.id !== id).map((n) =>
    n.children ? { ...n, children: removeNode(n.children, id) } : n
  );
}

function LocItem({ node, depth = 0, onEdit, onAdd, onDelete }: {
  node: LocNode;
  depth?: number;
  onEdit: (node: LocNode) => void;
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
        <MapPin size={16} className="text-admin-info shrink-0" />
        <span className="text-sm font-medium flex-1">{node.name}</span>
        <span className="text-xs text-muted-foreground tabular-nums">{node.count.toLocaleString()}</span>
        <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onEdit(node)}><Edit size={12} /></Button>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onAdd(node.id)}><Plus size={12} /></Button>
          <Button variant="ghost" size="icon" className="h-6 w-6 text-admin-danger" onClick={() => onDelete(node.id, node.name)}><Trash2 size={12} /></Button>
        </div>
      </div>
      {hasChildren && open && node.children!.map((child) => (
        <LocItem key={child.id} node={child} depth={depth + 1} onEdit={onEdit} onAdd={onAdd} onDelete={onDelete} />
      ))}
    </div>
  );
}

export default function LokasiyalarPage() {
  const [locations, setLocations] = useState(initialLocations);
  const [editNode, setEditNode] = useState<LocNode | null>(null);
  const [addParentId, setAddParentId] = useState<string | null>(null);
  const [formName, setFormName] = useState("");

  const openEdit = (node: LocNode) => {
    setEditNode(node);
    setFormName(node.name);
    setAddParentId(null);
  };

  const openAdd = (parentId: string) => {
    setAddParentId(parentId);
    setEditNode(null);
    setFormName("");
  };

  const openAddRoot = () => {
    setAddParentId("root");
    setEditNode(null);
    setFormName("");
  };

  const handleSave = () => {
    if (!formName.trim()) {
      toast({ title: "Xəta", description: "Ad tələb olunur", variant: "destructive" });
      return;
    }

    if (editNode) {
      setLocations((prev) => updateNode(prev, editNode.id, (n) => ({ ...n, name: formName })));
      toast({ title: "✅ Lokasiya yeniləndi", description: `"${formName}" uğurla yeniləndi` });
      setEditNode(null);
    } else if (addParentId) {
      const newNode: LocNode = { id: genId(), name: formName, count: 0 };
      if (addParentId === "root") {
        setLocations((prev) => [...prev, newNode]);
      } else {
        setLocations((prev) => addChild(prev, addParentId, newNode));
      }
      toast({ title: "✅ Lokasiya əlavə edildi", description: `"${formName}" uğurla yaradıldı` });
      setAddParentId(null);
    }
  };

  const handleDelete = (id: string, name: string) => {
    setLocations((prev) => removeNode(prev, id));
    toast({ title: "🗑️ Lokasiya silindi", description: `"${name}" silindi` });
  };

  const isOpen = editNode !== null || addParentId !== null;

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Lokasiyalar</h2>
        <Button size="sm" className="bg-admin-accent text-accent-foreground hover:bg-admin-accent/90" onClick={openAddRoot}>
          <Plus size={14} className="mr-1" /> Yeni lokasiya
        </Button>
      </div>
      <div className="bg-card rounded-lg border border-border p-2">
        {locations.map((loc) => (
          <LocItem key={loc.id} node={loc} onEdit={openEdit} onAdd={openAdd} onDelete={handleDelete} />
        ))}
      </div>

      <Dialog open={isOpen} onOpenChange={() => { setEditNode(null); setAddParentId(null); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editNode ? "Lokasiya redaktə et" : "Yeni lokasiya əlavə et"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Ad</label>
              <Input value={formName} onChange={(e) => setFormName(e.target.value)} className="mt-1" placeholder="Lokasiya adı" />
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
