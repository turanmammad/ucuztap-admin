import { Bell, Moon, Sun, ChevronRight, Menu, LogOut, User, Settings } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  "/sistem": "Sistem Vəziyyəti",
  "/reklamlar": "Reklamlar",
  "/tenzimlemer": "Tənzimləmələr",
};

const notifications = [
  { id: 1, text: "Yeni 12 elan təsdiq gözləyir", time: "2 dəq əvvəl", unread: true },
  { id: 2, text: "Email server yavaşlama aşkarlandı", time: "14 dəq əvvəl", unread: true },
  { id: 3, text: "3 yeni şikayət daxil olub", time: "1 saat əvvəl", unread: true },
  { id: 4, text: "Günlük backup tamamlandı", time: "3 saat əvvəl", unread: false },
  { id: 5, text: "SSL sertifikat 30 gün sonra bitir", time: "Dünən", unread: false },
];

interface AdminTopbarProps {
  onMenuToggle?: () => void;
}

export function AdminTopbar({ onMenuToggle }: AdminTopbarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [dark, setDark] = useState(false);
  const pageLabel = pathLabels[location.pathname] || "Admin";
  const unreadCount = notifications.filter(n => n.unread).length;

  const toggleDark = () => {
    setDark(!dark);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30">
      {/* Left: Mobile menu + Breadcrumb */}
      <div className="flex items-center gap-2">
        {onMenuToggle && (
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuToggle}>
            <Menu size={18} />
          </Button>
        )}
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <span className="hidden sm:inline">Admin</span>
          <ChevronRight size={14} className="hidden sm:block" />
          <span className="text-foreground font-medium">{pageLabel}</span>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1">
        {/* Notifications dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 min-w-[16px] h-4 rounded-full bg-admin-danger text-[10px] text-white flex items-center justify-center px-1 font-medium">
                  {unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="px-3 py-2 border-b border-border">
              <p className="text-sm font-semibold">Bildirişlər</p>
            </div>
            {notifications.map((n) => (
              <DropdownMenuItem key={n.id} className="flex items-start gap-2 px-3 py-2.5 cursor-pointer">
                {n.unread && <span className="w-2 h-2 rounded-full bg-admin-info mt-1.5 shrink-0" />}
                {!n.unread && <span className="w-2 h-2 shrink-0" />}
                <div className="min-w-0">
                  <p className={`text-sm ${n.unread ? "font-medium" : "text-muted-foreground"}`}>{n.text}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{n.time}</p>
                </div>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center text-xs text-muted-foreground cursor-pointer">
              Bütün bildirişlər
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" size="icon" onClick={toggleDark}>
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </Button>

        {/* Admin avatar dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-8 h-8 rounded-full bg-admin-accent flex items-center justify-center text-sm font-bold ml-1 hover:ring-2 hover:ring-admin-accent/50 transition-shadow">
              A
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <div className="px-3 py-2 border-b border-border">
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs text-muted-foreground">admin@ucuztap.az</p>
            </div>
            <DropdownMenuItem onClick={() => navigate("/tenzimlemer")} className="cursor-pointer">
              <Settings size={14} className="mr-2" /> Tənzimləmələr
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/audit-log")} className="cursor-pointer">
              <User size={14} className="mr-2" /> Audit Log
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-admin-danger cursor-pointer">
              <LogOut size={14} className="mr-2" /> Çıxış
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
