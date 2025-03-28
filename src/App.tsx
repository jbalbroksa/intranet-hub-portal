
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
import News from "./pages/News";
import Documents from "./pages/Documents";
import Settings from "./pages/Settings";
import Users from "./pages/Users";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
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
          <Route path="/noticias" element={<Layout><News /></Layout>} />
          <Route path="/documentos" element={<Layout><Documents /></Layout>} />
          <Route path="/configuracion" element={<Layout><Settings /></Layout>} />
          <Route path="/usuarios" element={<Layout><Users /></Layout>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
