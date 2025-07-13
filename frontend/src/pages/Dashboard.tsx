import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  Wrench,
  CheckCircle,
  Clock,
  AlertTriangle,
  Building2,
  Users,
  Calendar,
  FileText,
  AlertCircle as AlertErrorIcon,
  PlusCircle,
  ListTodo,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { api, Report, Machine } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

// --- TYPES ---
type DashboardData = {
  stats: {
    interventionsToday: number;
    operationalMachinesPercentage: number;
    avgResolutionTime: string;
    urgentInterventions: number;
  };
  recentInterventions: Report[];
  upcomingMaintenance: Machine[];
};

// --- FONCTION D'APPEL API (ROBUSTE) ---
const getDashboardData = async (): Promise<DashboardData> => {
  let recentInterventions: Report[] = [];
  let upcomingMaintenance: Machine[] = [];
  let allMachines: Machine[] = [];

  try {
    const [interventionsResponse, upcomingMaintResponse, allMachinesResponse] =
      await Promise.all([
        api.get<any>("reports?limit=3&sortBy=createdAt:desc").catch(() => null),
        api
          .get<any>(
            "machines?limit=3&sortBy=nextMaintenanceDate:asc&status=operational"
          )
          .catch(() => null),
        api.get<any>("machines").catch(() => null),
      ]);

    if (interventionsResponse)
      recentInterventions = Array.isArray(interventionsResponse)
        ? interventionsResponse
        : interventionsResponse?.reports || [];
    if (upcomingMaintResponse)
      upcomingMaintenance = Array.isArray(upcomingMaintResponse)
        ? upcomingMaintResponse
        : upcomingMaintResponse?.machines || [];
    if (allMachinesResponse)
      allMachines = Array.isArray(allMachinesResponse)
        ? allMachinesResponse
        : allMachinesResponse?.machines || [];
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des données du dashboard:",
      error
    );
  }

  const totalMachines = allMachines.length;
  const operationalMachines = allMachines.filter(
    (m) => m.status === "operational"
  ).length;
  const operationalMachinesPercentage =
    totalMachines > 0
      ? Math.round((operationalMachines / totalMachines) * 100)
      : 100;

  const stats = {
    interventionsToday: recentInterventions.length,
    operationalMachinesPercentage: operationalMachinesPercentage,
    avgResolutionTime: "N/A",
    urgentInterventions: recentInterventions.filter(
      (r) => r.priority === "critical"
    ).length,
  };

  return { stats, recentInterventions, upcomingMaintenance };
};

// --- COMPOSANT PRINCIPAL ---
const Dashboard = () => {
  const { user, isLoading: isAuthLoading } = useAuth();
  const navigate = useNavigate();

  const {
    data,
    isLoading: isDashboardLoading,
    error,
  } = useQuery({
    queryKey: ["dashboardData"],
    queryFn: getDashboardData,
    enabled: !!user,
  });

  // --- AMÉLIORATION : Fonction pour la salutation dynamique ---
  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) return "Bonjour";
    if (currentHour < 18) return "Bon après-midi";
    return "Bonsoir";
  };

  const isLoading = isAuthLoading || isDashboardLoading;

  if (isLoading) {
    return (
      <div className="space-y-8">
        <HeaderSkeleton />
        <DashboardSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertErrorIcon className="h-4 w-4" />
        <AlertTitle>Erreur de chargement</AlertTitle>
        <AlertDescription>
          Impossible de charger les données. {(error as Error).message}
        </AlertDescription>
      </Alert>
    );
  }

  const safeData = data || {
    stats: {
      interventionsToday: 0,
      operationalMachinesPercentage: 100,
      avgResolutionTime: "N/A",
      urgentInterventions: 0,
    },
    recentInterventions: [],
    upcomingMaintenance: [],
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          {/* --- AMÉLIORATION : Utilisation de la salutation et du nom complet --- */}
          <h1 className="text-3xl font-bold text-gray-900">
            {getGreeting()}, {user?.firstName } 👋
          </h1>
          <p className="text-gray-500 mt-1">
            Voici un aperçu de votre activité maintenance.
          </p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => navigate("/planning")}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Planifier
          </Button>
          <Button
            className="w-full sm:w-auto"
            onClick={() => navigate("/reports/new")}
          >
            <Wrench className="h-4 w-4 mr-2" />
            Nouv. Intervention
          </Button>
        </div>
      </header>

      <StatsSection stats={safeData.stats} />
      <MainContentSection
        recentInterventions={safeData.recentInterventions}
        upcomingMaintenance={safeData.upcomingMaintenance}
      />
      <QuickActionsSection />
    </div>
  );
};

// --- SOUS-COMPOSANTS (inchangés, ils sont déjà robustes) ---

const StatsSection = ({ stats }: { stats: DashboardData["stats"] }) => (
  <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    <StatCard
      title="Interventions récentes"
      value={stats.interventionsToday}
      icon={<Wrench className="h-6 w-6 text-blue-600" />}
    />
    <StatCard
      title="Machines opérationnelles"
      value={`${stats.operationalMachinesPercentage}%`}
      icon={<CheckCircle className="h-6 w-6 text-green-600" />}
    />
    <StatCard
      title="Temps moyen de résolution"
      value={stats.avgResolutionTime}
      icon={<Clock className="h-6 w-6 text-orange-600" />}
    />
    <StatCard
      title="Interventions urgentes"
      value={stats.urgentInterventions}
      icon={<AlertTriangle className="h-6 w-6 text-red-600" />}
    />
  </section>
);

const MainContentSection = ({
  recentInterventions,
  upcomingMaintenance,
}: {
  recentInterventions: Report[];
  upcomingMaintenance: Machine[];
}) => (
  <section className="grid grid-cols-1 xl:grid-cols-2 gap-8">
    <RecentInterventionsCard interventions={recentInterventions} />
    <UpcomingMaintenanceCard maintenances={upcomingMaintenance} />
  </section>
);

const QuickActionsSection = () => {
  const navigate = useNavigate();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Actions rapides</CardTitle>
        <CardDescription>
          Accès direct aux fonctionnalités principales.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuickActionButton
            onClick={() => navigate("/reports/new")}
            icon={<Wrench className="h-7 w-7 text-blue-600" />}
            label="Nouv. Intervention"
          />
          <QuickActionButton
            onClick={() => navigate("/machines")}
            icon={<Building2 className="h-7 w-7 text-green-600" />}
            label="Gérer les Machines"
          />
          <QuickActionButton
            onClick={() => navigate("/users")}
            icon={<Users className="h-7 w-7 text-purple-600" />}
            label="Gérer l'Équipe"
          />
          <QuickActionButton
            onClick={() => navigate("/reports")}
            icon={<FileText className="h-7 w-7 text-orange-600" />}
            label="Voir les Rapports"
          />
        </div>
      </CardContent>
    </Card>
  );
};

const StatCard = ({
  title,
  value,
  icon,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className="bg-slate-100 p-3 rounded-lg">{icon}</div>
      </div>
    </CardContent>
  </Card>
);

const RecentInterventionsCard = ({
  interventions,
}: {
  interventions: Report[];
}) => {
  const navigate = useNavigate();
  const getStatusLabel = (s: string) =>
    ({ pending: "En attente", in_progress: "En cours", completed: "Terminé" }[
      s
    ] || s);
  const getStatusColor = (s: string) =>
    ({
      pending: "bg-yellow-100 text-yellow-800",
      in_progress: "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
    }[s] || "bg-gray-100");
  const getPriorityColor = (p: string) =>
    ({
      low: "text-green-800",
      medium: "text-yellow-800",
      high: "text-orange-800",
      critical: "text-red-800",
    }[p] || "text-gray-800");
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wrench className="h-5 w-5 text-blue-600" />
          Interventions récentes
        </CardTitle>
        <CardDescription>Dernières activités de maintenance.</CardDescription>
      </CardHeader>
      <CardContent>
        {interventions.length > 0 ? (
          <div className="space-y-3">
            {interventions.map((i) => (
              <div
                key={i.id}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 truncate">
                    {i.title}
                  </p>
                  <div className="flex items-center gap-x-4 mt-1 text-xs text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <Building2 className="h-3 w-3" />
                      {i.machine?.name || "N/A"}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Users className="h-3 w-3" />
                      {i.technician?.firstName || "N/A"}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 ml-4">
                  <Badge
                    variant="secondary"
                    className={`capitalize ${getPriorityColor(
                      i.priority
                    )} bg-opacity-20`}
                  >
                    {i.priority}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className={getStatusColor(i.status)}
                  >
                    {getStatusLabel(i.status)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <ListTodo className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Aucune intervention récente
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Créez une nouvelle intervention pour commencer.
            </p>
          </div>
        )}
        <Button
          variant="outline"
          className="w-full mt-4"
          onClick={() => navigate("/reports")}
        >
          Voir toutes les interventions
        </Button>
      </CardContent>
    </Card>
  );
};

const UpcomingMaintenanceCard = ({
  maintenances,
}: {
  maintenances: Machine[];
}) => {
  const navigate = useNavigate();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-green-600" />
          Maintenance à venir
        </CardTitle>
        <CardDescription>Prochaines interventions planifiées.</CardDescription>
      </CardHeader>
      <CardContent>
        {maintenances.length > 0 ? (
          <div className="space-y-3">
            {maintenances.map((m) => (
              <div
                key={m.id}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-800">{m.name}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Réf: {m.reference}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {m.nextMaintenanceDate
                      ? new Date(m.nextMaintenanceDate).toLocaleDateString()
                      : "N/A"}
                  </p>
                  <Badge variant="outline" className="mt-1">
                    Programmé
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <PlusCircle className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Aucune maintenance programmée
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Planifiez une nouvelle maintenance.
            </p>
          </div>
        )}
        <Button
          variant="outline"
          className="w-full mt-4"
          onClick={() => navigate("/planning")}
        >
          Voir le planning complet
        </Button>
      </CardContent>
    </Card>
  );
};

const QuickActionButton = ({
  onClick,
  icon,
  label,
}: {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) => (
  <Button variant="outline" className="h-28 flex-col gap-2" onClick={onClick}>
    {icon}
    <span className="text-sm font-medium text-center">{label}</span>
  </Button>
);
const HeaderSkeleton = () => (
  <header className="flex justify-between items-center">
    <div className="space-y-2">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-5 w-72" />
    </div>
    <div className="flex gap-3">
      <Skeleton className="h-10 w-28" />
      <Skeleton className="h-10 w-44" />
    </div>
  </header>
);
const DashboardSkeleton = () => (
  <div className="space-y-8 animate-pulse">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <Skeleton className="h-24" />
      <Skeleton className="h-24" />
      <Skeleton className="h-24" />
      <Skeleton className="h-24" />
    </div>
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
      <Skeleton className="h-80" />
      <Skeleton className="h-80" />
    </div>
    <Skeleton className="h-48" />
  </div>
);

export default Dashboard;
