// src/main.tsx

import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import { TooltipProvider } from "./components/ui/tooltip.tsx";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";

// Configuration du client React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    {/* 1. Fournisseur pour React Query */}
    <QueryClientProvider client={queryClient}>
      {/* 2. Fournisseur pour l'authentification */}
      <AuthProvider>
        {/* 3. Fournisseur pour les tooltips de Shadcn/UI */}
        <TooltipProvider>
          <App />
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
