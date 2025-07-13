// src/App.tsx

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Reports from "./pages/Reports";
import Machines from "./pages/Machines";
import Users from "./pages/Users";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const ProtectedLayout = () => (
  <ProtectedRoute>
    <Layout>
      <Outlet />
    </Layout>
  </ProtectedRoute>
);

const AdminLayout = () => (
  <ProtectedRoute requiredRole="admin">
    <Layout>
      <Outlet />
    </Layout>
  </ProtectedRoute>
);

const App = () => {
  return (
    // --- CORRECTION : Ajout des deux drapeaux pour une compatibilité future complète ---
    <BrowserRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Navigate to="/" replace />} />

        <Route element={<ProtectedLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/machines" element={<Machines />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        <Route element={<AdminLayout />}>
          <Route path="/users" element={<Users />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
