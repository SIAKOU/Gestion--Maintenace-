
import React, { useState } from 'react';
import { Plus, Search, Filter, Building2, MapPin, Calendar, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const Machines = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Données de démonstration
  const machines = [
    {
      id: 1,
      name: "Compresseur A1",
      reference: "COMP-A1-001",
      brand: "Atlas Copco",
      model: "GA 90",
      location: "Atelier Principal - Zone A",
      department: "Production",
      status: "operational",
      priority: "medium",
      lastMaintenance: "2024-01-05",
      nextMaintenance: "2024-02-05",
      interventionsCount: 3
    },
    {
      id: 2,
      name: "Pompe Hydraulique B2",
      reference: "PUMP-B2-002",
      brand: "Bosch Rexroth",
      model: "A10VSO 28",
      location: "Atelier Principal - Zone B",
      department: "Hydraulique",
      status: "maintenance",
      priority: "high",
      lastMaintenance: "2024-01-08",
      nextMaintenance: "2024-02-08",
      interventionsCount: 7
    },
    {
      id: 3,
      name: "Moteur Principal C3",
      reference: "MOT-C3-003",
      brand: "Siemens",
      model: "1LA7 113-4AA10",
      location: "Hall de Production",
      department: "Mécanique",
      status: "breakdown",
      priority: "critical",
      lastMaintenance: "2024-01-02",
      nextMaintenance: "2024-01-15",
      interventionsCount: 12
    },
    {
      id: 4,
      name: "Turbine T1",
      reference: "TURB-T1-004",
      brand: "GE",
      model: "Frame 6B",
      location: "Centrale Électrique",
      department: "Énergie",
      status: "operational",
      priority: "low",
      lastMaintenance: "2023-12-20",
      nextMaintenance: "2024-03-20",
      interventionsCount: 1
    }
  ];

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'operational': return 'Opérationnel';
      case 'maintenance': return 'En maintenance';
      case 'breakdown': return 'En panne';
      case 'retired': return 'Retiré';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'bg-green-100 text-green-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'breakdown': return 'bg-red-100 text-red-800';
      case 'retired': return 'bg-gray-100 text-gray-800';
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

  const filteredMachines = machines.filter(machine => {
    const matchesSearch = 
      machine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      machine.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      machine.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      machine.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || machine.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const statusCounts = {
    operational: machines.filter(m => m.status === 'operational').length,
    maintenance: machines.filter(m => m.status === 'maintenance').length,
    breakdown: machines.filter(m => m.status === 'breakdown').length,
    total: machines.length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Parc Machine</h1>
          <p className="text-gray-600 mt-1">
            Gestion et suivi de tous vos équipements industriels
          </p>
        </div>
        <Button className="btn-primary flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Nouvelle machine</span>
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total machines</p>
                <p className="text-2xl font-bold text-gray-900">{statusCounts.total}</p>
              </div>
              <Building2 className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Opérationnelles</p>
                <p className="text-2xl font-bold text-green-600">{statusCounts.operational}</p>
              </div>
              <div className="bg-green-100 p-2 rounded-lg">
                <Building2 className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">En maintenance</p>
                <p className="text-2xl font-bold text-yellow-600">{statusCounts.maintenance}</p>
              </div>
              <div className="bg-yellow-100 p-2 rounded-lg">
                <Calendar className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">En panne</p>
                <p className="text-2xl font-bold text-red-600">{statusCounts.breakdown}</p>
              </div>
              <div className="bg-red-100 p-2 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher une machine..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <select 
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tous les statuts</option>
                <option value="operational">Opérationnel</option>
                <option value="maintenance">En maintenance</option>
                <option value="breakdown">En panne</option>
                <option value="retired">Retiré</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Machines Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredMachines.map((machine) => (
          <Card key={machine.id} className="maintenance-card hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="flex items-center space-x-2">
                    <Building2 className="h-5 w-5 text-blue-600" />
                    <span>{machine.name}</span>
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {machine.reference} • {machine.brand} {machine.model}
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getPriorityColor(machine.priority)}>
                    {machine.priority}
                  </Badge>
                  <Badge className={getStatusColor(machine.status)}>
                    {getStatusLabel(machine.status)}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{machine.location}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Département:</span>
                    <p className="font-medium">{machine.department}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Interventions:</span>
                    <p className="font-medium">{machine.interventionsCount}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Dernière maintenance:</span>
                    <p className="font-medium">{machine.lastMaintenance}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Prochaine maintenance:</span>
                    <p className="font-medium">{machine.nextMaintenance}</p>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2 pt-2">
                  <Button variant="outline" size="sm">
                    Voir historique
                  </Button>
                  <Button size="sm" className="btn-primary">
                    Planifier maintenance
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMachines.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucune machine trouvée
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || filterStatus !== 'all' 
                ? "Aucune machine ne correspond à vos critères de recherche."
                : "Commencez par ajouter votre première machine."
              }
            </p>
            {!searchTerm && filterStatus === 'all' && (
              <Button className="btn-primary">
                Ajouter une machine
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Machines;
