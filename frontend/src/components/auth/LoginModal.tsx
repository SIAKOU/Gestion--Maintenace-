import React, { useState } from "react";
import { Eye, EyeOff, Wrench, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { api, ApiError } from "@/lib/api";

interface LoginResponse {
  token: string;
  user: {
    firstName: string;
    lastName: string;
    [key: string]: any;
  };
}

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  // Login states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Forgot password states
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  // Submit login
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = (await api.post("auth/login", {
        email,
        password,
      })) as LoginResponse;

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      toast({
        title: "Connexion réussie",
        description: `Bienvenue ${data.user.firstName} ${data.user.lastName}`,
      });

      onLoginSuccess();
    } catch (error) {
      let description = "Impossible de se connecter au serveur";
      if (
        error instanceof ApiError &&
        error.details &&
        typeof error.details === "object" &&
        "error" in error.details
      ) {
        description =
          (error.details as any).error || "Email ou mot de passe incorrect";
      }

      toast({
        title: "Erreur de connexion",
        description,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Submit forgot password
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSendingEmail(true);

    try {
      await api.post("auth/forgot-password", { email: forgotEmail });
      toast({
        title: "Email envoyé",
        description:
          "Vérifiez votre boîte mail pour le lien de réinitialisation.",
      });
      setShowForgotPassword(false);
      setForgotEmail("");
    } catch (error) {
      let description = "Impossible d'envoyer l'email";
      if (
        error instanceof ApiError &&
        error.details &&
        typeof error.details === "object" &&
        "error" in error.details
      ) {
        description =
          (error.details as any).error || "Email ou mot de passe incorrect";
      }
      toast({
        title: "Erreur",
        description,
        variant: "destructive",
      });
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Wrench className="h-6 w-6 text-white" />
            </div>
            <span>Connexion à MaintenancePro</span>
          </DialogTitle>
        </DialogHeader>

        {/* Login form */}
        {!showForgotPassword ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="username"
                className="form-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Votre mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="form-input pr-10"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  aria-label={
                    showPassword
                      ? "Masquer le mot de passe"
                      : "Afficher le mot de passe"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full btn-primary"
              disabled={isLoading}
            >
              {isLoading ? "Connexion..." : "Se connecter"}
            </Button>

            <div className="text-center pt-2">
              <button
                type="button"
                className="text-xs text-blue-600 hover:underline"
                onClick={() => setShowForgotPassword(true)}
              >
                Mot de passe oublié ?
              </button>
            </div>
          </form>
        ) : (
          // Forgot password form
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div className="flex flex-col items-center mb-2">
              <Mail className="h-8 w-8 text-blue-600 mb-2" />
              <h2 className="text-lg font-bold text-gray-900 text-center">
                Réinitialisation du mot de passe
              </h2>
              <p className="text-sm text-gray-600 text-center mt-1">
                Entrez votre adresse email, vous recevrez un lien pour
                réinitialiser votre mot de passe.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="forgot-password-email">Email</Label>
              <Input
                id="forgot-password-email"
                type="email"
                placeholder="votre@email.com"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                required
                autoComplete="username"
                className="form-input"
              />
            </div>
            <Button
              type="submit"
              className="w-full btn-primary"
              disabled={isSendingEmail}
            >
              {isSendingEmail ? "Envoi en cours..." : "Envoyer le lien"}
            </Button>
            <div className="text-center pt-2">
              <button
                type="button"
                className="text-xs text-gray-600 hover:underline"
                onClick={() => setShowForgotPassword(false)}
              >
                Retour à la connexion
              </button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
