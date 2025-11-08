// import { lazy } from 'react'
// import { Route, Routes } from 'react-router-dom'

// const Home = lazy(() => import('./pages/Home'))
// const Mapa = lazy(() => import('./pages/Map'))
// const Calendario = lazy(() => import('./pages/Calendar'))
// const Gamificacion = lazy(() => import('./pages/Gamification'))
// const Reportes = lazy(() => import('./pages/Reports'))
// const Educacion = lazy(() => import('./pages/Education'))
// const Perfil = lazy(() => import('./pages/Profile'))
// const NotFound = lazy(() => import('./pages/NotFound'))
// const AuthPage = lazy(() => import('./pages/Auth'))
// const Admin = lazy(() => import('./pages/Admin'))
// import { AuthProvider, useAuth } from "./state/auth";

// function PrivateRoute({ children }) {
//   const { user, ready } = useAuth();
//   if (!ready) return null;            // o un spinner
//   return user ? children : <Navigate to="/login" replace />;
// }

// export default function AppRoutes() {
//     return (
//         <Routes>
//             <Route path="/" element={<Home />} />
//             <Route path="/mapa" element={<Mapa />} />
//             <Route path="/calendario" element={<Calendario />} />
//             <Route path="/gamificacion" element={<Gamificacion />} />
//             <Route path="/reportes" element={<Reportes />} />
//             <Route path="/educacion" element={<Educacion />} />
//             <Route path="/perfil" element={<Perfil />} />
//             <Route path="*" element={<NotFound />} />
//             <Route path="/login" element={<AuthPage mode="login" />} />
//             <Route path="/registrarse" element={<AuthPage mode="register" />} />

//             <Route path="/admin" element={<Admin />} />
//         </Routes>
//     )
// };

// src/Router.jsx
import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./state/auth.jsx";

// Páginas (lazy)
const Home = lazy(() => import("./pages/Home"));
const Mapa = lazy(() => import("./pages/Map"));
const Calendario = lazy(() => import("./pages/Calendar"));
const Gamificacion = lazy(() => import("./pages/Gamification"));
const Reportes = lazy(() => import("./pages/Reports"));
const Educacion = lazy(() => import("./pages/Education"));
const Perfil = lazy(() => import("./pages/Profile"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AuthPage = lazy(() => import("./pages/Auth"));
const AdminLayout     = lazy(() => import("./pages/admin/AdminLayout"));
const AdminDashboard  = lazy(() => import("./pages/admin/Dashboard"));
const AdminPoints     = lazy(() => import("./pages/admin/Points"));
const AdminReports    = lazy(() => import("./pages/admin/Reports"));
const AdminUsers      = lazy(() => import("./pages/admin/Users"));
const AdminSettings   = lazy(() => import("./pages/admin/Settings"));


// Protecciones
function PrivateRoute({ children }) {
  const { user, ready } = useAuth();
  if (!ready) return null; // opcional: spinner
  return user ? children : <Navigate to="/login" replace />;
}

function AdminRoute({ children }) {
  const { user, ready } = useAuth();
  if (!ready) return null;
  return user?.role === "admin" ? children : <Navigate to="/" replace />;
}

export default function AppRoutes() {
  return (

    <Suspense fallback={null /* o tu spinner */}>
      <Routes>
        {/* públicas */}
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<Mapa />} />
        <Route path="/calendario" element={<Calendario />} />
        <Route path="/gamificacion" element={<Gamificacion />} />
        <Route path="/reportes" element={<Reportes />} />
        <Route path="/educacion" element={<Educacion />} />
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/registrarse" element={<AuthPage mode="register" />} />

        {/* protegidas */}
        <Route
          path="/perfil"
          element={
            <PrivateRoute>
              <Perfil />
            </PrivateRoute>
          }
        />

        {/* solo admin (opcional) */}

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />   {/* 👈 layout propio del panel */}
            </AdminRoute>
          }
        >

          {/* index = /admin */}
          <Route index element={<AdminDashboard />} />

          {/* subrutas /admin/... */}
          <Route path="puntos" element={<AdminPoints />} />
          <Route path="reportes" element={<AdminReports />} />
          <Route path="usuarios" element={<AdminUsers />} />
          <Route path="ajustes" element={<AdminSettings />} />
        </Route>

        {/* 404 */}
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>

  );
}
