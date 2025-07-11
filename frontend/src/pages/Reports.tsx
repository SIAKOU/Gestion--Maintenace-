import React, { useState } from 'react';
import { Plus, Search, Filter, FileText, Calendar, Clock, User, Terminal } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useDebounce } from '@/hooks/useDebounce';
import { Textarea } from '@/components/ui/textarea';

// Types pour les réponses API
type Report = {
  id: number;
  title: string;
  machine: { id: number; name: string };
  technician: { firstName: string; lastName: string };
  priority: string;
  status: string;
  workDate: string;
  duration: number;
  workType: string;
  // Autres champs si nécessaires
};

type ReportsResponse = { reports: Report[] };

type Machine = { id: number; name: string };
type MachinesResponse = { machines: Machine[] };

const Reports = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [filterStatus, setFilterStatus] = useState('all');
  const [showNewReportModal, setShowNewReportModal] = useState(false);

  const queryClient = useQueryClient();

  // Correction : typage de la query
  const { data, isLoading, error } = useQuery<ReportsResponse>({
    queryKey: ['reports', filterStatus, debouncedSearchTerm],
    queryFn: () => {
      const params = new URLSearchParams();
      if (filterStatus !== 'all') {
        params.append('status', filterStatus);
      }
      if (debouncedSearchTerm) {
        params.append('search', debouncedSearchTerm);
      }
      return api.get(`reports?${params.toString()}`);
    }
  });

  // Correction : typage de la mutation
  const createReportMutation = useMutation({
    mutationFn: (newReport: Record<string, FormDataEntryValue>) => api.post('reports', newReport),
    onSuccess: () => {
      // Correction : utilisation de l'objet pour invalidateQueries
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      setShowNewReportModal(false);
    },
  });

  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const newReport = Object.fromEntries(formData.entries());
    createReportMutation.mutate(newReport);
  };

  // Correction : typage du retour de la query
  const reports = data?.reports || [];

  // Correction : typage de la query machines
  const { data: machinesData } = useQuery<MachinesResponse>({
    queryKey: ['machines'],
    queryFn: () => api.get('machines')
  });
  const machines = machinesData?.machines || [];

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'draft': return 'Brouillon';
      case 'submitted': return 'Soumis';
      case 'reviewed': return 'Révisé';
      case 'approved': return 'Approuvé';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'reviewed': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
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

  const getWorkTypeLabel = (type: string) => {
    switch (type) {
      case 'maintenance': return 'Maintenance';
      case 'repair': return 'Réparation';
      case 'inspection': return 'Inspection';
      case 'installation': return 'Installation';
      case 'other': return 'Autre';
      default: return type;
    }
  };

  const filteredReports = reports;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Rapports de Dépannage</h1>
          <p className="text-gray-600 mt-1">
            Gestion des rapports d'intervention des techniciens
          </p>
        </div>
        <Dialog open={showNewReportModal} onOpenChange={setShowNewReportModal}>
          <DialogTrigger asChild>
            <Button className="btn-primary flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Nouveau rapport</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Créer un nouveau rapport</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateReport} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Titre du rapport</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Ex: Maintenance préventive..."
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="machineId">Machine</Label>
                  <Select name="machineId" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une machine" />
                    </SelectTrigger>
                    <SelectContent>
                      {machines.map((machine) => (
                        <SelectItem key={machine.id} value={machine.id.toString()}>
                          {machine.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="workDate">Date de travail</Label>
                  <Input
                    id="workDate"
                    name="workDate"
                    type="date"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startTime">Heure de début</Label>
                  <Input
                    id="startTime"
                    name="startTime"
                    type="time"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">Heure de fin</Label>
                  <Input
                    id="endTime"
                    name="endTime"
                    type="time"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="workType">Type de travail</Label>
                  <Select name="workType" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner le type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="repair">Réparation</SelectItem>
                      <SelectItem value="inspection">Inspection</SelectItem>
                      <SelectItem value="installation">Installation</SelectItem>
                      <SelectItem value="other">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priorité</Label>
                  <Select name="priority" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner la priorité" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Faible</SelectItem>
                      <SelectItem value="medium">Moyenne</SelectItem>
                      <SelectItem value="high">Élevée</SelectItem>
                      <SelectItem value="critical">Critique</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="problemDescription">Description du problème</Label>
                <Textarea
                  id="problemDescription"
                  name="problemDescription"
                  placeholder="Décrivez le problème rencontré..."
                  required
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="actionsTaken">Actions effectuées</Label>
                <Textarea
                  id="actionsTaken"
                  name="actionsTaken"
                  placeholder="Décrivez les actions prises pour résoudre le problème..."
                  required
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="observations">Observations</Label>
                <Textarea
                  id="observations"
                  name="observations"
                  placeholder="Observations additionnelles..."
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="recommendations">Recommandations</Label>
                <Textarea
                  id="recommendations"
                  name="recommendations"
                  placeholder="Recommandations pour éviter le problème..."
                  rows={2}
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setShowNewReportModal(false)}>
                  Annuler
                </Button>
                <Button type="submit" className="btn-primary">
                  Créer le rapport
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher un rapport..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="draft">Brouillon</SelectItem>
                  <SelectItem value="submitted">Soumis</SelectItem>
                  <SelectItem value="reviewed">Révisé</SelectItem>
                  <SelectItem value="approved">Approuvé</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      <div className="grid grid-cols-1 gap-6">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2 mt-2" />
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-sm">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : error ? (
          <Alert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Erreur</AlertTitle>
            <AlertDescription>
              Impossible de charger les rapports. Veuillez réessayer plus tard.
            </AlertDescription>
          </Alert>
        ) : filteredReports.length > 0 ? (
          filteredReports.map((report) => (
            <Card key={report.id} className="maintenance-card">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="flex items-center space-x-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <span>{report.title}</span>
                    </CardTitle>
                    <CardDescription className="mt-2">
                      Machine: {report.machine.name} • Technicien: {report.technician.firstName} {report.technician.lastName}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getPriorityColor(report.priority)}>
                      {report.priority}
                    </Badge>
                    <Badge className={getStatusColor(report.status)}>
                      {getStatusLabel(report.status)}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>{new Date(report.workDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span>{report.duration}min</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span>{getWorkTypeLabel(report.workType)}</span>
                  </div>
                  <div className="flex justify-end">
                    <Button variant="outline" size="sm">
                      Voir détails
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucun rapport trouvé
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || filterStatus !== 'all' 
                  ? "Aucun rapport ne correspond à vos critères de recherche."
                  : "Commencez par créer votre premier rapport de dépannage."
                }
              </p>
              {!searchTerm && filterStatus === 'all' && (
                <Button onClick={() => setShowNewReportModal(true)} className="btn-primary">
                  Créer un rapport
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Reports;