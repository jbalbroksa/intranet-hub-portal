
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Index from "./pages/Index";
import Delegations from "./pages/Delegations";
import Companies from "./pages/Companies";
import Products from "./pages/Products";
import ProductCreate from "./pages/ProductCreate";
import News from "./pages/News";
import NewsCreate from "./pages/NewsCreate";
import NewsDetail from "./pages/NewsDetail";
import Documents from "./pages/Documents";
import Settings from "./pages/Settings";
import Users from "./pages/Users";
import Notifications from "./pages/Notifications";
import CalendarPage from "./pages/Calendar";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "./components/ui/theme-provider";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider defaultTheme="light" storageKey="intranet-theme">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout><Index /></Layout>} />
            <Route path="/delegaciones" element={<Layout><Delegations /></Layout>} />
            <Route path="/companias" element={<Layout><Companies /></Layout>} />
            <Route path="/productos" element={<Layout><Products /></Layout>} />
            <Route path="/productos/crear" element={<Layout><ProductCreate /></Layout>} />
            <Route path="/productos/:id" element={<Layout><ProductCreate /></Layout>} />
            <Route path="/noticias" element={<Layout><News /></Layout>} />
            <Route path="/noticias/crear" element={<Layout><NewsCreate /></Layout>} />
            <Route path="/noticias/:id" element={<Layout><NewsDetail /></Layout>} />
            <Route path="/documentos" element={<Layout><Documents /></Layout>} />
            <Route path="/notificaciones" element={<Layout><Notifications /></Layout>} />
            <Route path="/calendario" element={<Layout><CalendarPage /></Layout>} />
            <Route path="/configuracion" element={<Layout><Settings /></Layout>} />
            <Route path="/usuarios" element={<Layout><Users /></Layout>} />
            <Route path="/perfil" element={<Layout><Profile /></Layout>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
