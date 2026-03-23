import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard, FileText, Users, FolderTree, MapPin,
  CreditCard, AlertTriangle, BarChart3, Bot, Mail,
  ClipboardList, Settings, ExternalLink, ChevronLeft, ChevronRight, Store,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/" },
  { label: "Elanlar", icon: FileText, path: "/elanlar" },
  { label: "Mağazalar", icon: Store, path: "/magazalar" },
  { label: "İstifadəçilər", icon: Users, path: "/istifadeciler" },
  { label: "Kateqoriyalar", icon: FolderTree, path: "/kateqoriyalar" },
  { label: "Lokasiyalar", icon: MapPin, path: "/lokasiyalar" },
  { label: "Ödənişlər", icon: CreditCard, path: "/odenisler" },
  { label: "Şikayətlər", icon: AlertTriangle, path: "/sikayetler" },
  { label: "Hesabatlar", icon: BarChart3, path: "/hesabatlar" },
  { label: "AI Alətlər", icon: Bot, path: "/ai" },
  { label: "Email/SMS/Push", icon: Mail, path: "/email-sms" },
  { label: "Audit Log", icon: ClipboardList, path: "/audit-log" },
  { label: "Tənzimləmələr", icon: Settings, path: "/tenzimlemer" },
];

export function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen flex flex-col bg-sidebar transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center px-4 border-b border-sidebar-border">
        {!collapsed ? (
          <span className="text-lg font-bold text-sidebar-foreground">
            ucuz<span className="text-sidebar-primary">tap</span>{" "}
            <span className="text-sm font-normal text-sidebar-foreground/60">ADMIN</span>
          </span>
        ) : (
          <span className="text-lg font-bold text-sidebar-primary mx-auto">U</span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              )}
            >
              <item.icon size={18} className={cn(isActive && "text-sidebar-primary")} />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          );
        })}

        {/* External link */}
        <a
          href="https://ucuztap.az"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-sidebar-foreground/50 hover:text-sidebar-foreground/70 transition-colors mt-2"
        >
          <ExternalLink size={18} />
          {!collapsed && <span>Sayta keç →</span>}
        </a>
      </nav>

      {/* Bottom: Admin info */}
      <div className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-sidebar-primary flex items-center justify-center text-sidebar-primary-foreground text-sm font-bold shrink-0">
            A
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">Admin User</p>
              <p className="text-xs text-sidebar-foreground/50">Super Admin</p>
            </div>
          )}
        </div>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-card border border-border shadow-sm flex items-center justify-center hover:bg-muted transition-colors"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  );
}
