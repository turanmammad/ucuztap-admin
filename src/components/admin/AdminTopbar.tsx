import { Bell, Moon, Sun, ChevronRight } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const pathLabels: Record<string, string> = {
  "/": "Dashboard",
  "/elanlar": "Elanlar",
  "/magazalar": "Mağazalar",
  "/istifadeciler": "İstifadəçilər",
  "/kateqoriyalar": "Kateqoriyalar",
  "/lokasiyalar": "Lokasiyalar",
  "/odenisler": "Ödənişlər",
  "/sikayetler": "Şikayətlər",
  "/hesabatlar": "Hesabatlar",
  "/ai": "AI Alətlər",
  "/email-sms": "Email/SMS/Push",
  "/audit-log": "Audit Log",
  "/tenzimlemer": "Tənzimləmələr",
};

export function AdminTopbar() {
  const location = useLocation();
  const [dark, setDark] = useState(false);
  const pageLabel = pathLabels[location.pathname] || "Admin";

  const toggleDark = () => {
    setDark(!dark);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <header className="h-14 border-b border-border bg-card flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <span>Admin</span>
        <ChevronRight size={14} />
        <span className="text-foreground font-medium">{pageLabel}</span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-admin-danger" />
        </Button>
        <Button variant="ghost" size="icon" onClick={toggleDark}>
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </Button>
        <div className="w-8 h-8 rounded-full bg-admin-accent flex items-center justify-center text-sm font-bold ml-2">
          A
        </div>
      </div>
    </header>
  );
}
