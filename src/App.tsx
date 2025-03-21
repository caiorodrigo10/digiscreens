
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Terminais from "./pages/Terminais";
import Terminal from "./pages/Terminal";
import Screen from "./pages/Screen";
import Midias from "./pages/Midias";
import Grupos from "./pages/Grupos";
import Parcerias from "./pages/Parcerias";
import Biblioteca from "./pages/Biblioteca";
import Anunciantes from "./pages/Anunciantes";
import Relatorios from "./pages/Relatorios";
import NotFound from "./pages/NotFound";
import "./App.css";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/terminais" element={<Terminais />} />
          <Route path="/terminais/:id" element={<Terminal />} />
          <Route path="/terminais/:terminalId/screens/:screenId" element={<Screen />} />
          <Route path="/midias" element={<Midias />} />
          <Route path="/grupos" element={<Grupos />} />
          <Route path="/parcerias" element={<Parcerias />} />
          <Route path="/biblioteca" element={<Biblioteca />} />
          <Route path="/anunciantes" element={<Anunciantes />} />
          <Route path="/relatorios" element={<Relatorios />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
