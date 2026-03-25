import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Download, CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface DateRangeFilterProps {
  dateFrom: Date | undefined;
  dateTo: Date | undefined;
  onDateFromChange: (d: Date | undefined) => void;
  onDateToChange: (d: Date | undefined) => void;
}

export function DateRangeFilter({ dateFrom, dateTo, onDateFromChange, onDateToChange }: DateRangeFilterProps) {
  return (
    <div className="flex gap-1.5 items-center">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className={cn("h-9 text-xs gap-1.5 w-[130px] justify-start", !dateFrom && "text-muted-foreground")}>
            <CalendarIcon size={12} />
            {dateFrom ? format(dateFrom, "dd.MM.yyyy") : "Başlanğıc"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar mode="single" selected={dateFrom} onSelect={onDateFromChange} initialFocus className={cn("p-3 pointer-events-auto")} />
        </PopoverContent>
      </Popover>
      <span className="text-muted-foreground text-xs">—</span>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className={cn("h-9 text-xs gap-1.5 w-[130px] justify-start", !dateTo && "text-muted-foreground")}>
            <CalendarIcon size={12} />
            {dateTo ? format(dateTo, "dd.MM.yyyy") : "Son"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar mode="single" selected={dateTo} onSelect={onDateToChange} initialFocus className={cn("p-3 pointer-events-auto")} />
        </PopoverContent>
      </Popover>
      {(dateFrom || dateTo) && (
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { onDateFromChange(undefined); onDateToChange(undefined); }}>
          <X size={12} />
        </Button>
      )}
    </div>
  );
}

interface ExcelExportButtonProps {
  onClick: () => void;
}

export function ExcelExportButton({ onClick }: ExcelExportButtonProps) {
  return (
    <Button size="sm" variant="outline" className="h-9 text-xs gap-1.5" onClick={onClick}>
      <Download size={12} /> Excel
    </Button>
  );
}
