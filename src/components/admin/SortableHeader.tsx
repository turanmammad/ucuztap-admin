import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SortDir } from "@/lib/table-utils";

interface SortableHeaderProps {
  label: string;
  sortKey: string;
  currentSort: string | null;
  currentDir: SortDir;
  onSort: (key: string) => void;
  className?: string;
}

export function SortableHeader({ label, sortKey, currentSort, currentDir, onSort, className }: SortableHeaderProps) {
  const isActive = currentSort === sortKey;

  return (
    <th
      className={cn("p-3 font-medium cursor-pointer select-none hover:text-foreground transition-colors", className)}
      onClick={() => onSort(sortKey)}
    >
      <div className="flex items-center gap-1">
        {label}
        {isActive && currentDir === "asc" ? (
          <ArrowUp size={12} className="text-foreground" />
        ) : isActive && currentDir === "desc" ? (
          <ArrowDown size={12} className="text-foreground" />
        ) : (
          <ArrowUpDown size={10} className="text-muted-foreground/50" />
        )}
      </div>
    </th>
  );
}
