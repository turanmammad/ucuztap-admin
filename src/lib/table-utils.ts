import { toast } from "@/hooks/use-toast";

// Excel export utility - generates and downloads a .xls file
export function exportToExcel(
  data: Record<string, any>[],
  columns: { key: string; label: string }[],
  filename: string
) {
  const header = columns.map((c) => c.label).join("\t");
  const rows = data.map((row) =>
    columns.map((c) => {
      const val = row[c.key];
      return val !== undefined && val !== null ? String(val).replace(/\t/g, " ") : "";
    }).join("\t")
  );
  const tsv = [header, ...rows].join("\n");
  // BOM for proper Unicode in Excel
  const bom = "\uFEFF";
  const blob = new Blob([bom + tsv], { type: "application/vnd.ms-excel;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.xls`;
  a.click();
  URL.revokeObjectURL(url);
  toast({ title: "📥 Excel yükləndi", description: `${filename}.xls faylı uğurla yükləndi` });
}

// Date range filter helper
export function isInDateRange(dateStr: string, from: string, to: string): boolean {
  if (!from && !to) return true;
  const d = dateStr.slice(0, 10); // "YYYY-MM-DD"
  if (from && d < from) return false;
  if (to && d > to) return false;
  return true;
}

// Sort helper
export type SortDir = "asc" | "desc" | null;

export function sortData<T>(data: T[], key: keyof T, dir: SortDir): T[] {
  if (!dir) return data;
  return [...data].sort((a, b) => {
    const va = a[key];
    const vb = b[key];
    let cmp = 0;
    if (typeof va === "number" && typeof vb === "number") {
      cmp = va - vb;
    } else {
      cmp = String(va ?? "").localeCompare(String(vb ?? ""), "az");
    }
    return dir === "desc" ? -cmp : cmp;
  });
}

export function nextSortDir(current: SortDir): SortDir {
  if (!current) return "asc";
  if (current === "asc") return "desc";
  return null;
}
