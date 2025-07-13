import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Plus,
  Search,
  Filter,
  FileText,
  Calendar,
  Clock,
  User,
  Terminal,
  Download,
  X as CloseIcon,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useDebounce } from "@/hooks/useDebounce";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { api, Report as ApiReport, Machine as ApiMachine } from "@/lib/api";
import Papa from "papaparse";
import jsPDF from "jspdf";
import "jspdf-autotable";

// --- TYPES & SCHÉMAS ---
type Report = ApiReport;
type ReportsApiResponse = { reports: Report[] } | Report[];
type MachinesResponse = { machines: ApiMachine[] };
const createReportSchema = z.object({
  title: z.string().min(3, "Le titre doit faire au moins 3 caractères."),
  machineId: z.string().min(1, "Veuillez sélectionner une machine."),
  workDate: z.string().min(1, "La date est requise."),
  workType: z.string().min(1, "Le type de travail est requis."),
  priority: z.string().min(1, "La priorité est requise."),
  problemDescription: z
    .string()
    .min(10, "Veuillez décrire le problème (10 caractères min)."),
  actionsTaken: z
    .string()
    .min(10, "Veuillez décrire les actions (10 caractères min)."),
});
type CreateReportFormData = z.infer<typeof createReportSchema>;

// --- COMPOSANT PRINCIPAL ---
const Reports = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedReports, setSelectedReports] = useState<Set<number>>(
    new Set()
  );
  const { toast } = useToast();

  const { data, isLoading, error } = useQuery<ReportsApiResponse>({
    queryKey: ["reports", filterStatus, debouncedSearchTerm],
    queryFn: () => {
      const params = new URLSearchParams();
      if (filterStatus !== "all") params.append("status", filterStatus);
      if (debouncedSearchTerm) params.append("search", debouncedSearchTerm);
      return api.get(`reports?${params.toString()}`);
    },
  });

  const reports = Array.isArray(data) ? data : data?.reports || [];
  const isAllSelected =
    reports.length > 0 && selectedReports.size === reports.length;

  const handleSelectReport = (id: number, checked: boolean) => {
    setSelectedReports((prev) => {
      const newSet = new Set(prev);
      if (checked) newSet.add(id);
      else newSet.delete(id);
      return newSet;
    });
  };
  const handleSelectAll = (checked: boolean) => {
    if (checked) setSelectedReports(new Set(reports.map((r) => r.id)));
    else setSelectedReports(new Set());
  };

  const handleExport = (format: "csv" | "json" | "pdf") => {
    const dataToExport = reports.filter((r) => selectedReports.has(r.id));
    if (dataToExport.length === 0) {
      toast({ title: "Aucune sélection", variant: "destructive" });
      return;
    }
    toast({ title: "Exportation en cours..." });
    if (format === "json") {
      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(dataToExport, null, 2)
      )}`;
      const link = document.createElement("a");
      link.href = jsonString;
      link.download = "rapports.json";
      link.click();
    } else if (format === "csv") {
      const csv = Papa.unparse(dataToExport);
      const blob = new Blob(["\uFEFF" + csv], {
        type: "text/csv;charset=utf-8;",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.setAttribute("download", "rapports.csv");
      link.click();
    } else if (format === "pdf") {
      const doc = new jsPDF();
      doc.text("Rapports de Maintenance", 14, 16);
      (doc as any).autoTable({
        head: [["ID", "Titre", "Machine", "Date"]],
        body: dataToExport.map((item) => [
          item.id,
          item.title,
          item.machine?.name || "N/A",
          new Date(item.workDate).toLocaleDateString(),
        ]),
      });
      doc.save("rapports.pdf");
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Rapports d'Intervention
          </h1>
          <p className="text-gray-600 mt-1">
            Consultez, gérez et créez les rapports de maintenance.
          </p>
        </div>
        <CreateReportModal />
      </header>

      <Card>
        <CardContent className="p-4 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Rechercher par titre, machine..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full sm:w-48">
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
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Checkbox
            id="selectAll"
            checked={isAllSelected}
            onCheckedChange={(checked) => handleSelectAll(!!checked)}
          />
          <Label htmlFor="selectAll" className="text-sm font-medium">
            Tout sélectionner ({reports.length})
          </Label>
        </div>
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <ReportCardSkeleton key={i} />
          ))
        ) : error ? (
          <Alert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Erreur</AlertTitle>
            <AlertDescription>
              Impossible de charger les rapports.
            </AlertDescription>
          </Alert>
        ) : reports.length > 0 ? (
          reports.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              isSelected={selectedReports.has(report.id)}
              onSelect={handleSelectReport}
            />
          ))
        ) : (
          <EmptyState />
        )}
      </div>

      {selectedReports.size > 0 && (
        <ActionBar
          selectedCount={selectedReports.size}
          onExport={handleExport}
          onClear={() => setSelectedReports(new Set())}
        />
      )}
    </div>
  );
};

// --- SOUS-COMPOSANTS ---

const CreateReportModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const form = useForm<CreateReportFormData>({
    resolver: zodResolver(createReportSchema),
    defaultValues: {
      title: "",
      machineId: "",
      workDate: new Date().toISOString().split("T")[0],
      workType: "maintenance",
      priority: "medium",
      problemDescription: "",
      actionsTaken: "",
    },
  });

  const { data: machinesData, isLoading: isLoadingMachines } =
    useQuery<MachinesResponse>({
      queryKey: ["machinesList"],
      queryFn: () => api.get("machines"),
    });
  const machines = machinesData?.machines || [];

  const createReportMutation = useMutation({
    mutationFn: (newReport: CreateReportFormData) =>
      api.post("reports", newReport),
    onSuccess: () => {
      toast({
        title: "Rapport créé",
        description: "Le nouveau rapport a été ajouté avec succès.",
      });
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      setIsOpen(false);
      form.reset();
    },
    onError: (err: any) =>
      toast({
        title: "Erreur",
        description: err.message,
        variant: "destructive",
      }),
  });

  const onSubmit: SubmitHandler<CreateReportFormData> = (data) =>
    createReportMutation.mutate(data);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau rapport
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Créer un nouveau rapport</DialogTitle>
          <DialogDescription>
            Remplissez les détails de l'intervention ci-dessous.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 pt-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Titre du rapport</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: Maintenance préventive..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="machineId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Machine</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      {isLoadingMachines ? (
                        <Input
                          disabled
                          placeholder="Chargement des machines..."
                        />
                      ) : (
                        <>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner une machine" />
                          </SelectTrigger>
                          <SelectContent>
                            {machines.map((m) => (
                              <SelectItem key={m.id} value={m.id.toString()}>
                                {m.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </>
                      )}
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="workDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date de travail</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="workType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type de travail</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="repair">Réparation</SelectItem>
                        <SelectItem value="inspection">Inspection</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priorité</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Faible</SelectItem>
                        <SelectItem value="medium">Moyenne</SelectItem>
                        <SelectItem value="high">Élevée</SelectItem>
                        <SelectItem value="critical">Critique</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="problemDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description du problème</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={3}
                      placeholder="Décrivez le problème rencontré..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="actionsTaken"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Actions effectuées</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={3}
                      placeholder="Décrivez les actions prises..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Annuler
                </Button>
              </DialogClose>
              <Button type="submit" disabled={createReportMutation.isPending}>
                {createReportMutation.isPending
                  ? "Création..."
                  : "Créer le rapport"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

const ReportCard = ({
  report,
  isSelected,
  onSelect,
}: {
  report: Report;
  isSelected: boolean;
  onSelect: (id: number, checked: boolean) => void;
}) => {
  const getStatusLabel = (s: string) =>
    ({
      draft: "Brouillon",
      submitted: "Soumis",
      reviewed: "Révisé",
      approved: "Approuvé",
    }[s] || s);
  const getStatusColor = (s: string) =>
    ({
      draft: "bg-gray-100 text-gray-800",
      submitted: "bg-blue-100 text-blue-800",
      reviewed: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
    }[s] || "bg-gray-100");
  const getPriorityColor = (p: string) =>
    ({
      low: "bg-green-100 text-green-800",
      medium: "bg-yellow-100 text-yellow-800",
      high: "bg-orange-100 text-orange-800",
      critical: "bg-red-100 text-red-800",
    }[p] || "bg-gray-100");
  return (
    <Card
      className={`transition-all ${
        isSelected ? "border-blue-500 shadow-md bg-blue-50/50" : ""
      }`}
    >
      <CardHeader className="flex flex-row items-start gap-4 space-y-0 p-4">
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) => onSelect(report.id, !!checked)}
          className="mt-1"
        />
        <div className="flex-1">
          <CardTitle>{report.title}</CardTitle>
          <CardDescription>
            Machine: {report.machine.name} | Technicien:{" "}
            {report.technician.firstName} {report.technician.lastName}
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={getPriorityColor(report.priority)}>
            {report.priority}
          </Badge>
          <Badge className={getStatusColor(report.status)}>
            {getStatusLabel(report.status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="border-t pt-3 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span>{new Date(report.workDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-400" />
            <span>{report.duration} min</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-gray-400" />
            <span>{report.workType}</span>
          </div>
          <div className="flex justify-end">
            <Button variant="outline" size="sm">
              Voir détails
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ActionBar = ({
  selectedCount,
  onExport,
  onClear,
}: {
  selectedCount: number;
  onExport: (format: "csv" | "json" | "pdf") => void;
  onClear: () => void;
}) => (
  <div className="sticky bottom-6 z-10 w-full">
    <Card className="max-w-2xl mx-auto bg-gray-900 text-white shadow-2xl animate-fade-in-up">
      <CardContent className="p-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClear}
            className="hover:bg-gray-700"
          >
            <CloseIcon className="h-5 w-5" />
          </Button>
          <p className="font-medium">
            {selectedCount} rapport(s) sélectionné(s)
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Exporter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => onExport("csv")}>
              Exporter en CSV
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onExport("json")}>
              Exporter en JSON
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onExport("pdf")}>
              Exporter en PDF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardContent>
    </Card>
  </div>
);
const ReportCardSkeleton = () => (
  <Card>
    <CardHeader className="flex flex-row items-center gap-4">
      <Skeleton className="h-5 w-5" />
      <div className="space-y-2">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
    </CardHeader>
    <CardContent className="pt-3">
      <div className="border-t pt-3 grid grid-cols-4 gap-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-8 w-24 ml-auto" />
      </div>
    </CardContent>
  </Card>
);
const EmptyState = () => (
  <Card>
    <CardContent className="text-center py-16">
      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900">
        Aucun rapport trouvé
      </h3>
      <p className="text-gray-600">
        Essayez d'ajuster vos filtres ou de créer un nouveau rapport.
      </p>
    </CardContent>
  </Card>
);

export default Reports;
