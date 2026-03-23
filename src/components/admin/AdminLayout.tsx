import { Outlet, useLocation } from "react-router-dom";
import { AdminSidebar } from "./AdminSidebar";
import { AdminTopbar } from "./AdminTopbar";
import { useEffect, useState } from "react";

export function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;

    const elementId = location.hash.slice(1);
    requestAnimationFrame(() => {
      document.getElementById(elementId)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [location.pathname, location.hash]);

  return (
    <div className="min-h-screen flex">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <AdminSidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="flex-1 lg:ml-64 flex flex-col transition-all duration-300" id="admin-main">
        <AdminTopbar onMenuToggle={() => setMobileOpen(prev => !prev)} />
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
