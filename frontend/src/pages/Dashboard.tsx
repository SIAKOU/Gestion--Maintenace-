import React from "react";
import {
  TrendingUp,
  TrendingDown,
  Clock,
  AlertTriangle,
  CheckCircle,
  Wrench,
  Building2,
  Users,
  Calendar,
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

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Demo stats
  const stats = [
    {
      title: "Interventions aujourd'hui",
      value: "12",
      change: "+2",
      trend: "up",
      icon: <Wrench className="h-6 w-6 text-blue-600" />,
      color: "blue",
    },
    {
      title: "Machines opérationnelles",
      value: "87%",
      change: "+5%",
      trend: "up",
      icon: <CheckCircle className="h-6 w-6 text-green-600" />,
      color: "green",
    },
    {
      title: "Temps moyen de résolution",
      value: "2.3h",
      change: "-0.5h",
      trend: "down",
      icon: <Clock className="h-6 w-6 text-orange-600" />,
      color: "orange",
    },
    {
      title: "Interventions urgentes",
      value: "3",
      change: "-1",
      trend: "down",
      icon: <AlertTriangle className="h-6 w-6 text-red-600" />,
      color: "red",
    },
  ];

  const recentInterventions = [
    {
      id: 1,
      title: "Maintenance préventive - Compresseur A1",
      machine: "Compresseur A1",
      technician: "Marie Dubois",
      status: "in_progress",
      priority: "medium",
      time: "10:30",
    },
    {
      id: 2,
      title: "Réparation pompe hydraulique",
      machine: "Pompe B2",
      technician: "Jean Martin",
      status: "completed",
      priority: "high",
      time: "09:15",
    },
    {
      id: 3,
      title: "Diagnostic moteur principal",
      machine: "Moteur C3",
      technician: "Pierre Leroy",
      status: "pending",
      priority: "critical",
      time: "08:45",
    },
  ];

  const upcomingMaintenance = [
    { machine: "Turbine T1", date: "2024-01-15", type: "Préventive" },
    { machine: "Générateur G2", date: "2024-01-16", type: "Inspection" },
    { machine: "Compresseur A3", date: "2024-01-17", type: "Révision" },
  ];

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "En attente";
      case "in_progress":
        return "En cours";
      case "completed":
        return "Terminé";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "critical":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6 px-2 pb-10 md:px-6 lg:px-12 xl:px-32 max-w-screen-2xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Bonjour, <span className="uppercase">{user.firstName}</span> 👋
          </h1>
          <p className="text-gray-500 text-base md:text-lg">
            Voici un aperçu de votre activité maintenance aujourd'hui
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 md:gap-3 w-full md:w-auto">
          <Button
            variant="outline"
            className="w-full md:w-auto flex items-center space-x-2"
          >
            <Calendar className="h-5 w-5" />
            <span>Planifier</span>
          </Button>
          <Button className="btn-primary w-full md:w-auto flex items-center space-x-2">
            <Wrench className="h-5 w-5" />
            <span>Nouvelle intervention</span>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="maintenance-card shadow-none border border-gray-100"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {stat.value}
                  </p>
                  <div className="flex items-center mt-2">
                    {stat.trend === "up" ? (
                      <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                    )}
                    <span
                      className={`text-sm font-medium ${
                        stat.trend === "up" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {stat.change}
                    </span>
                    <span className="text-xs text-gray-400 ml-1">vs hier</span>
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl flex items-center justify-center">
                  {stat.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Interventions récentes */}
        <Card className="maintenance-card border border-gray-100 shadow-none">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-lg">
              <Wrench className="h-5 w-5 text-blue-600" />
              <span>Interventions récentes</span>
            </CardTitle>
            <CardDescription>
              Dernières activités de maintenance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentInterventions.map((intervention) => (
                <div
                  key={intervention.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg group hover:bg-blue-50 transition"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate">
                      {intervention.title}
                    </h4>
                    <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-600">
                      <span className="flex items-center">
                        <Building2 className="h-4 w-4 mr-1" />
                        <span className="truncate">{intervention.machine}</span>
                      </span>
                      <span className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{intervention.technician}</span>
                      </span>
                      <span>{intervention.time}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 ml-4 min-w-max">
                    <Badge className={getPriorityColor(intervention.priority)}>
                      {intervention.priority}
                    </Badge>
                    <Badge className={getStatusColor(intervention.status)}>
                      {getStatusLabel(intervention.status)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-5">
              Voir toutes les interventions
            </Button>
          </CardContent>
        </Card>

        {/* Maintenance programmée */}
        <Card className="maintenance-card border border-gray-100 shadow-none">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-lg">
              <Calendar className="h-5 w-5 text-green-600" />
              <span>Maintenance programmée</span>
            </CardTitle>
            <CardDescription>
              Prochaines interventions planifiées
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingMaintenance.map((maintenance, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg group hover:bg-green-50 transition"
                >
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {maintenance.machine}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {maintenance.type}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {maintenance.date}
                    </p>
                    <Badge variant="outline" className="mt-1">
                      Programmé
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-5">
              Voir le planning complet
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="maintenance-card border border-gray-100 shadow-none">
        <CardHeader>
          <CardTitle className="text-lg">Actions rapides</CardTitle>
          <CardDescription>
            Accès rapide aux fonctionnalités principales
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-24 flex flex-col items-center justify-center space-y-2 text-blue-700 border-blue-100 hover:border-blue-400"
            >
              <Wrench className="h-7 w-7 text-blue-600" />
              <span className="text-sm font-semibold">
                Nouvelle intervention
              </span>
            </Button>
            <Button
              variant="outline"
              className="h-24 flex flex-col items-center justify-center space-y-2 text-green-700 border-green-100 hover:border-green-400"
            >
              <Building2 className="h-7 w-7 text-green-600" />
              <span className="text-sm font-semibold">Ajouter machine</span>
            </Button>
            <Button
              variant="outline"
              className="h-24 flex flex-col items-center justify-center space-y-2 text-purple-700 border-purple-100 hover:border-purple-400"
            >
              <Users className="h-7 w-7 text-purple-600" />
              <span className="text-sm font-semibold">Gérer équipe</span>
            </Button>
            <Button
              variant="outline"
              className="h-24 flex flex-col items-center justify-center space-y-2 text-orange-700 border-orange-100 hover:border-orange-400"
            >
              <TrendingUp className="h-7 w-7 text-orange-600" />
              <span className="text-sm font-semibold">Voir rapports</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
