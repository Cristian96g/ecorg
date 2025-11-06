// src/pages/admin/AdminLayout.jsx
import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  FiMenu, FiX, FiGrid, FiMapPin, FiAlertCircle, FiUsers, FiSettings, FiLogOut
} from "react-icons/fi";
import { useAuth } from "../../state/auth";

const link = ({ isActive }) =>
  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[0.95rem] font-medium
   transition ${isActive
     ? "bg-emerald-100 text-emerald-700 shadow-sm"
     : "text-slate-600 hover:bg-slate-100"}`;

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex">
      {/* Sidebar */}
      <aside
        className={`fixed md:static z-40 h-full md:h-auto w-72 md:w-72
        bg-white/90 backdrop-blur border-r border-slate-100
        shadow-xl md:shadow-none transition-transform
        ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="px-5 py-5 border-b border-slate-100">
          <div className="text-lg font-semibold">EcoRG • Admin</div>
          <div className="mt-1 text-xs text-slate-500">
            {user?.email} <span className="ml-2 rounded-full bg-emerald-100 text-emerald-700 px-2 py-0.5">admin</span>
          </div>
        </div>

        <nav className="px-3 py-4 space-y-1">
          <NavLink end to="." className={link}><FiGrid /> Resumen</NavLink>
          <NavLink to="/admin/puntos" className={link}><FiMapPin /> Puntos</NavLink>
          <NavLink to="/admin/reportes" className={link}><FiAlertCircle /> Reportes</NavLink>
          <NavLink to="/admin/usuarios" className={link}><FiUsers /> Usuarios</NavLink>
          <NavLink to="/admin/ajustes" className={link}><FiSettings /> Ajustes</NavLink>

          <button
            onClick={handleLogout}
            className="mt-4 w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-600 hover:bg-red-50 hover:text-red-600 transition"
          >
            <FiLogOut /> Cerrar sesión
          </button>
        </nav>
      </aside>

      {/* Contenedor principal */}
      <section className="flex-1 min-w-0 md:ml-0">
        {/* Topbar */}
        <div className="sticky top-0 z-30 bg-white/70 backdrop-blur border-b border-slate-100">
          <div className="px-4 md:px-8 h-14 flex items-center justify-between">
            <button
              onClick={() => setOpen(v => !v)}
              className="md:hidden inline-flex items-center gap-2 text-slate-600"
            >
              {open ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
              <span className="font-medium">Menú</span>
            </button>

            <div className="hidden md:flex items-center gap-3 text-sm text-slate-500">
              <span>Panel de Administración</span>
            </div>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-4 md:p-8">
          <Outlet />
        </div>
      </section>
    </div>
  );
}
