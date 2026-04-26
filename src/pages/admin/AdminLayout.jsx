import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  FiAlertCircle,
  FiAward,
  FiGrid,
  FiLogOut,
  FiMapPin,
  FiMenu,
  FiSettings,
  FiUsers,
  FiX,
} from "react-icons/fi";
import { useAuth } from "../../state/auth";
import Logo from "../../assets/ecorg-logo.png";

const link = ({ isActive }) =>
  `flex items-center gap-3 rounded-2xl px-3.5 py-3 text-[0.95rem] font-medium transition ${
    isActive
      ? "bg-[#66a939] text-white shadow-[0_14px_30px_rgba(76,126,40,0.22)]"
      : "text-slate-600 hover:bg-[#f3f8ed] hover:text-[#3c6724]"
  }`;

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/login", { replace: true });
  };

  const handleNavClick = () => {
    setOpen(false);
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f7fbf2_0%,#ffffff_22%)] text-slate-800 md:flex">
      <aside
        className={`fixed inset-y-0 left-0 z-40 h-full w-72 border-r border-[#e4edd8] bg-white/95 backdrop-blur shadow-2xl transition-transform md:static md:h-auto md:shadow-none ${
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="border-b border-[#edf3e6] px-5 py-5">
          <div className="text-lg font-semibold">
            <img
              src={Logo}
              alt="EcoRG logo"
              className="h-16 w-auto"
              draggable="false"
            />
          </div>
          <div className="mt-4 rounded-2xl border border-[#e4edd8] bg-[#f8fbf4] px-3 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#5d8a38]">
              Panel admin
            </p>
            <p className="mt-2 text-sm font-medium text-[#24341a]">
              {user?.nombre || "Administrador"}
            </p>
            <div className="mt-1 text-xs text-slate-500">
              {user?.email}
              <span className="ml-2 rounded-full bg-[#66a939] px-2 py-0.5 text-white">
                admin
              </span>
            </div>
          </div>
        </div>

        <nav className="space-y-1 px-3 py-4">
          <NavLink end to="." className={link} onClick={handleNavClick}>
            <FiGrid /> Resumen
          </NavLink>
          <NavLink to="/admin/puntos" className={link} onClick={handleNavClick}>
            <FiMapPin /> Puntos
          </NavLink>
          <NavLink to="/admin/barrios" className={link} onClick={handleNavClick}>
            <FiMapPin /> Barrios
          </NavLink>
          <NavLink to="/admin/reportes" className={link} onClick={handleNavClick}>
            <FiAlertCircle /> Reportes
          </NavLink>
          <NavLink
            to="/admin/gamificacion"
            className={link}
            onClick={handleNavClick}
          >
            <FiAward /> Acciones Eco
          </NavLink>
          <NavLink to="/admin/usuarios" className={link} onClick={handleNavClick}>
            <FiUsers /> Usuarios
          </NavLink>
          <NavLink to="/admin/ajustes" className={link} onClick={handleNavClick}>
            <FiSettings /> Ajustes
          </NavLink>

          <button
            onClick={handleLogout}
            className="mt-4 flex w-full items-center gap-3 rounded-2xl px-3.5 py-3 text-slate-600 transition hover:bg-red-50 hover:text-red-600"
          >
            <FiLogOut /> Cerrar sesión
          </button>
        </nav>
      </aside>

      {open ? (
        <button
          type="button"
          aria-label="Cerrar menú"
          className="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm md:hidden"
          onClick={() => setOpen(false)}
        />
      ) : null}

      <section className="min-w-0 flex-1">
        <div className="sticky top-0 z-20 border-b border-[#edf3e6] bg-white/80 backdrop-blur">
          <div className="flex h-16 items-center justify-between px-4 md:px-8">
            <button
              onClick={() => setOpen((value) => !value)}
              className="inline-flex items-center gap-2 rounded-2xl border border-[#d7e5c5] bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm md:hidden"
            >
              {open ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
              <span>Menú</span>
            </button>

            <div className="hidden items-center gap-3 md:flex">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#eef7e9] text-[#4d7e28]">
                <FiGrid className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#5d8a38]">
                  EcoRG
                </p>
                <span className="text-lg font-semibold text-[#24341a]">
                  Panel de administración
                </span>
              </div>
            </div>

            <div className="hidden md:block">
              <span className="rounded-full bg-[#eef6e4] px-3 py-1 text-xs font-semibold text-[#4d7e28]">
                Gestión interna
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 md:p-8">
          <Outlet />
        </div>
      </section>
    </div>
  );
}
