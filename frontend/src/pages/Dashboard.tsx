
import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Wrench,
  Building2,
  Users,
  Calendar
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Données de démonstration
  const stats = [
    {
      title: "Interventions aujourd'hui",
      value: "12",
      change: "+2",
      trend: "up",
      icon: <Wrench className="h-5 w-5 text-blue-600" />,
      color: "blue"
    },
    {
      title: "Machines opérationnelles",
      value: "87%",
      change: "+5%",
      trend: "up",
      icon: <CheckCircle className="h-5 w-5 text-green-600" />,
      color: "green"
    },
    {
      title: "Temps moyen de résolution",
      value: "2.3h",
      change: "-0.5h",
      trend: "down",
      icon: <Clock className="h-5 w-5 text-orange-600" />,
      color: "orange"
    },
    {
      title: "Interventions urgentes",
      value: "3",
      change: "-1",
      trend: "down",
      icon: <AlertTriangle className="h-5 w-5 text-red-600" />,
      color: "red"
    }
  ];

  const recentInterventions = [
    {
      id: 1,
      title: "Maintenance préventive - Compresseur A1",
      machine: "Compresseur A1",
      technician: "Marie Dubois",
      status: "in_progress",
      priority: "medium",
      time: "10:30"
    },
    {
      id: 2,
      title: "Réparation pompe hydraulique",
      machine: "Pompe B2",
      technician: "Jean Martin",
      status: "completed",
      priority: "high",
      time: "09:15"
    },
    {
      id: 3,
      title: "Diagnostic moteur principal",
      machine: "Moteur C3",
      technician: "Pierre Leroy",
      status: "pending",
      priority: "critical",
      time: "08:45"
    }
  ];

  const upcomingMaintenance = [
    { machine: "Turbine T1", date: "2024-01-15", type: "Préventive" },
    { machine: "Générateur G2", date: "2024-01-16", type: "Inspection" },
    { machine: "Compresseur A3", date: "2024-01-17", type: "Révision" }
  ];

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'in_progress': return 'En cours';
      case 'completed': return 'Terminé';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Bonjour, {user.firstName} 👋
          </h1>
          <p className="text-gray-600 mt-1">
            Voici un aperçu de votre activité maintenance aujourd'hui
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>Planifier</span>
          </Button>
          <Button className="btn-primary flex items-center space-x-2">
            <Wrench className="h-4 w-4" />
            <span>Nouvelle intervention</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="maintenance-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    {stat.trend === 'up' ? (
                      <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                    )}
                    <span className={`text-sm font-medium ${
                      stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">vs hier</span>
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  {stat.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Interventions */}
        <Card className="maintenance-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Wrench className="h-5 w-5 text-blue-600" />
              <span>Interventions récentes</span>
            </CardTitle>
            <CardDescription>
              Dernières activités de maintenance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentInterventions.map((intervention) => (
                <div key={intervention.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{intervention.title}</h4>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                      <span className="flex items-center">
                        <Building2 className="h-4 w-4 mr-1" />
                        {intervention.machine}
                      </span>
                      <span className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {intervention.technician}
                      </span>
                      <span>{intervention.time}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
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
            <Button variant="outline" className="w-full mt-4">
              Voir toutes les interventions
            </Button>
          </CardContent>
        </Card>

        {/* Upcoming Maintenance */}
        <Card className="maintenance-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-green-600" />
              <span>Maintenance programmée</span>
            </CardTitle>
            <CardDescription>
              Prochaines interventions planifiées
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingMaintenance.map((maintenance, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{maintenance.machine}</h4>
                    <p className="text-sm text-gray-600 mt-1">{maintenance.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{maintenance.date}</p>
                    <Badge variant="outline" className="mt-1">
                      Programmé
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              Voir le planning complet
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="maintenance-card">
        <CardHeader>
          <CardTitle>Actions rapides</CardTitle>
          <CardDescription>
            Accès rapide aux fonctionnalités principales
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <Wrench className="h-6 w-6 text-blue-600" />
              <span className="text-sm">Nouvelle intervention</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <Building2 className="h-6 w-6 text-green-600" />
              <span className="text-sm">Ajouter machine</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <Users className="h-6 w-6 text-purple-600" />
              <span className="text-sm">Gérer équipe</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <TrendingUp className="h-6 w-6 text-orange-600" />
              <span className="text-sm">Voir rapports</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
