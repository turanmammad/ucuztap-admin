import { cn } from "@/lib/utils";

type Status = "aktiv" | "gozlemede" | "redd" | "silinmis" | "vip" | "bloklanmis" | "odenlib" | "gozleyir" | "legv" | "qaytarilib" | "yeni" | "arasdirili" | "hell";

const statusConfig: Record<Status, { label: string; className: string }> = {
  aktiv: { label: "Aktiv", className: "bg-admin-success/10 text-admin-success" },
  gozlemede: { label: "Gözləmədə", className: "bg-admin-warning/10 text-admin-warning" },
  redd: { label: "Rədd", className: "bg-admin-danger/10 text-admin-danger" },
  silinmis: { label: "Silinmiş", className: "bg-muted text-muted-foreground" },
  vip: { label: "VIP", className: "bg-admin-accent/20 text-admin-accent" },
  bloklanmis: { label: "Bloklanmış", className: "bg-admin-danger/10 text-admin-danger" },
  odenlib: { label: "Ödənilib", className: "bg-admin-success/10 text-admin-success" },
  gozleyir: { label: "Gözləyir", className: "bg-admin-warning/10 text-admin-warning" },
  legv: { label: "Ləğv", className: "bg-admin-danger/10 text-admin-danger" },
  qaytarilib: { label: "Qaytarılıb", className: "bg-admin-info/10 text-admin-info" },
  yeni: { label: "Yeni", className: "bg-admin-danger/10 text-admin-danger" },
  arasdirili: { label: "Araşdırılır", className: "bg-admin-warning/10 text-admin-warning" },
  hell: { label: "Həll olunub", className: "bg-admin-success/10 text-admin-success" },
};

export function StatusBadge({ status }: { status: Status }) {
  const config = statusConfig[status] || { label: status, className: "bg-muted text-muted-foreground" };
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded text-xs font-medium", config.className)}>
      {config.label}
    </span>
  );
}
