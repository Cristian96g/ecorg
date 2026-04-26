import React, { Suspense, lazy, useEffect } from "react";
import { Navigate, Routes, Route, useLocation } from "react-router-dom";
import LoadingState from "./components/ui/LoadingState";
import { useAuth } from "./state/auth.jsx";
import { notifyInfo, notifyWarning } from "./utils/feedback";

const TestGuided = lazy(() => import("./pages/TestGuided"));
const LandingEcoRG = lazy(() => import("./pages/LandingEcoRG"));
const Home = lazy(() => import("./pages/Home"));
const Mapa = lazy(() => import("./pages/Map"));
const Calendario = lazy(() => import("./pages/Calendar"));
const Gamificacion = lazy(() => import("./pages/Gamification"));
const Reportes = lazy(() => import("./pages/Reports"));
const Educacion = lazy(() => import("./pages/Education"));
const Perfil = lazy(() => import("./pages/Profile"));
const Notifications = lazy(() => import("./pages/Notifications"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AuthPage = lazy(() => import("./pages/Auth"));

const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminPoints = lazy(() => import("./pages/admin/Points"));
const AdminReports = lazy(() => import("./pages/admin/Reports"));
const AdminEcoActions = lazy(() => import("./pages/admin/EcoActions"));
const AdminUsers = lazy(() => import("./pages/admin/Users"));
const AdminSettings = lazy(() => import("./pages/admin/Settings"));
const AdminBarrios = lazy(() => import("./pages/admin/Barrios"));

function RouteGuardLoading() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-10 md:px-8">
      <LoadingState
        compact
        title="Validando sesiÃ³n"
        description="Estamos verificando tus permisos para acceder a esta secciÃ³n."
      />
    </div>
  );
}

function RedirectWithNotice({ to, message, type = "info" }) {
  useEffect(() => {
    if (!message) return;
    if (type === "warning") {
      notifyWarning(message);
      return;
    }
    notifyInfo(message);
  }, [message, type]);

  return <Navigate to={to} replace />;
}

function PrivateRoute({ children }) {
  const { user, ready } = useAuth();
  const location = useLocation();

  if (!ready) return <RouteGuardLoading />;

  if (!user) {
    const next = `${location.pathname}${location.search}`;
    return (
      <RedirectWithNotice
        to={`/login?next=${encodeURIComponent(next)}`}
        message="NecesitÃ¡s iniciar sesiÃ³n para continuar."
      />
    );
  }

  return children;
}

function AdminRoute({ children }) {
  const { user, ready } = useAuth();
  const location = useLocation();

  if (!ready) return <RouteGuardLoading />;

  if (!user) {
    const next = `${location.pathname}${location.search}`;
    return (
      <RedirectWithNotice
        to={`/login?next=${encodeURIComponent(next)}`}
        message="NecesitÃ¡s iniciar sesiÃ³n para acceder al panel admin."
      />
    );
  }

  if (user.role !== "admin") {
    return (
      <RedirectWithNotice
        to="/"
        message="No tenÃ©s permisos para acceder a esta secciÃ³n."
        type="warning"
      />
    );
  }

  return children;
}

export default function AppRoutes() {
  return (
    <Suspense
      fallback={(
        <div className="mx-auto max-w-7xl px-6 py-10 md:px-8">
          <LoadingState
            title="Cargando secciÃ³n"
            description="Estamos preparando esta vista de EcoRG."
          />
        </div>
      )}
    >
      <Routes>
        <Route path="/test-guided" element={<TestGuided />} />
        <Route path="/landing-eco-rg" element={<LandingEcoRG />} />
        <Route path="/" element={<Home />} />
        <Route path="/mapa" element={<Mapa />} />
        <Route path="/calendario" element={<Calendario />} />
        <Route path="/gamificacion" element={<Gamificacion />} />
        <Route path="/reportes" element={<Reportes />} />
        <Route path="/educacion" element={<Educacion />} />
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/registrarse" element={<AuthPage mode="register" />} />

        <Route
          path="/perfil"
          element={(
            <PrivateRoute>
              <Perfil />
            </PrivateRoute>
          )}
        />
        <Route
          path="/notificaciones"
          element={(
            <PrivateRoute>
              <Notifications />
            </PrivateRoute>
          )}
        />

        <Route
          path="/admin"
          element={(
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          )}
        >
          <Route index element={<AdminDashboard />} />
          <Route path="puntos" element={<AdminPoints />} />
          <Route path="barrios" element={<AdminBarrios />} />
          <Route path="reportes" element={<AdminReports />} />
          <Route path="gamificacion" element={<AdminEcoActions />} />
          <Route path="usuarios" element={<AdminUsers />} />
          <Route path="ajustes" element={<AdminSettings />} />
        </Route>

        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Suspense>
  );
}

