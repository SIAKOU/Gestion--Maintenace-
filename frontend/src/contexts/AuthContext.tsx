// src/contexts/AuthContext.tsx

import React, {
  createContext,
  useContext,
  ReactNode,
  useCallback,
} from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api, User } from "@/lib/api";
import { Wrench } from "lucide-react";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ME_ENDPOINT = "auth/me";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();
  const token = localStorage.getItem("token");

  const {
    data: user,
    isLoading,
    isSuccess,
  } = useQuery<User>({
    queryKey: ["me"],
    queryFn: () => api.get(ME_ENDPOINT),
    enabled: !!token,
    retry: 1, // On ne réessaie qu'une fois
    staleTime: 30 * 60 * 1000, // 30 minutes
  });

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    queryClient.removeQueries({ queryKey: ["me"] }); // Supprime l'utilisateur du cache
    window.location.replace("/");
  }, [queryClient]);

  // Si un token existe mais que la requête est toujours en cours, c'est le chargement initial.
  const isAuthenticating = isLoading && !!token;

  // L'utilisateur est authentifié uniquement si la requête a réussi et a renvoyé un utilisateur.
  const isAuthenticated = isSuccess && !!user;

  return (
    <AuthContext.Provider
      value={{
        user: user || null,
        isAuthenticated,
        isLoading: isAuthenticating,
        logout,
      }}
    >
      {isAuthenticating ? <AuthLoader /> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

const AuthLoader = () => (
  <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
    <div className="flex flex-col items-center space-y-4">
      <div className="bg-blue-600 p-3 rounded-lg animate-pulse">
        <Wrench className="h-8 w-8 text-white" />
      </div>
      <p className="text-gray-600">Validation de la session...</p>
    </div>
  </div>
);
