
export interface Report {
  id: number;
  title: string;
  workDate: string;
  startTime: string;
  endTime: string;
  duration: number;
  machineId: number;
  technicianId: number;
  workType: 'maintenance' | 'repair' | 'inspection' | 'installation' | 'other';
  problemDescription: string;
  actionsTaken: string;
  partsUsed?: any[];
  toolsUsed?: string[];
  observations?: string;
  recommendations?: string;
  status: 'draft' | 'submitted' | 'reviewed' | 'approved';
  reviewedBy?: number;
  reviewedAt?: string;
  reviewNotes?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  createdAt: string;
  updatedAt: string;
  machine?: Machine;
  technician?: User;
}

export interface Machine {
  id: number;
  name: string;
  reference: string;
  brand?: string;
  model?: string;
  serialNumber?: string;
  location: string;
  department: string;
  description?: string;
  installationDate?: string;
  warrantyEndDate?: string;
  status: 'operational' | 'maintenance' | 'breakdown' | 'retired';
  priority: 'low' | 'medium' | 'high' | 'critical';
  maintenanceSchedule?: string;
  lastMaintenanceDate?: string;
  nextMaintenanceDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'technician' | 'administration';
  phone?: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  total: number;
  page: number;
  pages: number;
  limit: number;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Classe pour les erreurs API personnalisées
export class ApiError extends Error {
  public status: number;
  public details: unknown;

  constructor(message: string, status: number, details: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

// Fonction principale pour les appels API
async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('token');
  const headers = new Headers(options.headers || {});
  
  if (token) {
    headers.append('Authorization', `Bearer ${token}`);
  }

  if (options.body) {
    headers.append('Content-Type', 'application/json');
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  const response = await fetch(`${API_BASE_URL}/${endpoint}`, config);

  if (!response.ok) {
    let errorDetails: unknown;
    try {
      errorDetails = await response.json();
    } catch (e) {
      errorDetails = { message: response.statusText };
    }
    throw new ApiError(
      `Erreur API: ${response.status}`,
      response.status,
      errorDetails
    );
  }

  // Si la réponse n'a pas de contenu (ex: 204 No Content)
  if (response.status === 204) {
    return null as T;
  }

  return response.json() as Promise<T>;
}

// Fonctions d'aide pour les différentes méthodes HTTP
export const api = {
  get: <T>(endpoint: string, options?: RequestInit) =>
    apiFetch<T>(endpoint, { ...options, method: 'GET' }),
  
  post: <T, U>(endpoint: string, body: U, options?: RequestInit) =>
    apiFetch<T>(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),

  put: <T, U>(endpoint: string, body: U, options?: RequestInit) =>
    apiFetch<T>(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) }),

  patch: <T, U>(endpoint: string, body: U, options?: RequestInit) =>
    apiFetch<T>(endpoint, { ...options, method: 'PATCH', body: JSON.stringify(body) }),

  delete: <T>(endpoint: string, options?: RequestInit) =>
    apiFetch<T>(endpoint, { ...options, method: 'DELETE' }),
};
