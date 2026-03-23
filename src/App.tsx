import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AdminLayout } from "@/components/admin/AdminLayout";
import DashboardPage from "@/pages/admin/DashboardPage";
import ElanlarPage from "@/pages/admin/ElanlarPage";
import MagazalarPage from "@/pages/admin/MagazalarPage";
import IstifadecilerPage from "@/pages/admin/IstifadecilerPage";
import KateqoriyalarPage from "@/pages/admin/KateqoriyalarPage";
import LokasiyalarPage from "@/pages/admin/LokasiyalarPage";
import OdenislerPage from "@/pages/admin/OdenislerPage";
import SikayetlerPage from "@/pages/admin/SikayetlerPage";
import HesabatlarPage from "@/pages/admin/HesabatlarPage";
import AiPage from "@/pages/admin/AiPage";
import EmailSmsPage from "@/pages/admin/EmailSmsPage";
import AuditLogPage from "@/pages/admin/AuditLogPage";
import TenzimlemelarPage from "@/pages/admin/TenzimlemelarPage";
import SystemStatusPage from "@/pages/admin/SystemStatusPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<AdminLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/elanlar" element={<ElanlarPage />} />
            <Route path="/magazalar" element={<MagazalarPage />} />
            <Route path="/istifadeciler" element={<IstifadecilerPage />} />
            <Route path="/kateqoriyalar" element={<KateqoriyalarPage />} />
            <Route path="/lokasiyalar" element={<LokasiyalarPage />} />
            <Route path="/odenisler" element={<OdenislerPage />} />
            <Route path="/sikayetler" element={<SikayetlerPage />} />
            <Route path="/hesabatlar" element={<HesabatlarPage />} />
            <Route path="/ai" element={<AiPage />} />
            <Route path="/email-sms" element={<EmailSmsPage />} />
            <Route path="/audit-log" element={<AuditLogPage />} />
            <Route path="/sistem" element={<SystemStatusPage />} />
            <Route path="/tenzimlemer" element={<TenzimlemelarPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
