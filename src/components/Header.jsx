// src/components/Header.jsx
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FiMap, FiCalendar, FiAlertCircle, FiBookOpen,
  FiUser, FiHome, FiLogIn, FiLogOut, FiMenu, FiX
} from "react-icons/fi";
import { useAuth } from "../state/auth";
import Logo from "../assets/ecorg-logo.png";

const linkClasses = ({ isActive }) =>
  `flex items-center gap-2 px-1.5 py-3 rounded-lg font-medium transition-colors
   ${isActive ? "text-[#2976A6]" : "text-gray-700 hover:text-[#2976A6]"}`;

export default function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/login");
  };

  const closeMobile = () => setOpen(false);

  return (
    <header className="backdrop-blur-md bg-transparent sticky top-0 z-50 shadow-md border-b border-white/30">
      <nav className="container mx-auto px-6 py-2 flex justify-between items-center">
        <NavLink to="/" className="flex items-center" onClick={closeMobile}>
          <img src={Logo} alt="EcoRG logo" className="h-16 w-auto" draggable="false" />
        </NavLink>

        {/* Botón hamburguesa (mobile) */}
        <button
          className="md:hidden inline-flex items-center justify-center p-2 rounded-lg text-gray-600 hover:text-[#2976A6]"
          aria-label="Abrir menú"
          onClick={() => setOpen(v => !v)}
        >
          {open ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
        </button>

        {/* Menú escritorio */}
        <ul className="hidden md:flex space-x-4">
          <NavLink to="/" className={linkClasses}><FiHome />Inicio</NavLink>
          <NavLink to="/mapa" className={linkClasses}><FiMap />Mapa</NavLink>
          <NavLink to="/calendario" className={linkClasses}><FiCalendar />Calendario</NavLink>
          <NavLink to="/reportes" className={linkClasses}><FiAlertCircle />Reportes</NavLink>
          <NavLink to="/educacion" className={linkClasses}><FiBookOpen />Educación</NavLink>

          {!user ? (
            // 🔹 Un solo botón corto
            <NavLink to="/login" className={linkClasses}><FiLogIn />Acceder</NavLink>
          ) : (
            <>
              <NavLink to="/perfil" className={linkClasses}>
                <FiUser />{user.nombre?.split(" ")[0] || "Perfil"}
              </NavLink>
              {user.role === "admin" && (
                <NavLink to="/admin" className={linkClasses}><FiBookOpen />Admin</NavLink>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-2 py-2 rounded-lg text-gray-400 hover:text-red-500 transition"
              >
                <FiLogOut /> <span>Salir</span>
              </button>
            </>
          )}
        </ul>
      </nav>

      {/* Menú móvil */}
      <div
        className={`md:hidden transition-all duration-200 overflow-hidden ${open ? "max-h-screen" : "max-h-0"}`}
      >
        <ul className="px-6 pb-4 pt-2 space-y-1 bg-white/70 backdrop-blur-md border-t border-white/30">
          <li><NavLink to="/" className={linkClasses} onClick={closeMobile}><FiHome />Inicio</NavLink></li>
          <li><NavLink to="/mapa" className={linkClasses} onClick={closeMobile}><FiMap />Mapa</NavLink></li>
          <li><NavLink to="/calendario" className={linkClasses} onClick={closeMobile}><FiCalendar />Calendario</NavLink></li>
          <li><NavLink to="/reportes" className={linkClasses} onClick={closeMobile}><FiAlertCircle />Reportes</NavLink></li>
          <li><NavLink to="/educacion" className={linkClasses} onClick={closeMobile}><FiBookOpen />Educación</NavLink></li>

          {!user ? (
            <li><NavLink to="/login" className={linkClasses} onClick={closeMobile}><FiLogIn />Acceder</NavLink></li>
          ) : (
            <>
              <li><NavLink to="/perfil" className={linkClasses} onClick={closeMobile}><FiUser />Perfil</NavLink></li>
              {user.role === "admin" && (
                <li><NavLink to="/admin" className={linkClasses} onClick={closeMobile}><FiBookOpen />Admin</NavLink></li>
              )}
              <li>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-1.5 py-3 rounded-lg font-medium text-gray-400 hover:text-red-500 transition"
                >
                  <FiLogOut /> <span>Salir</span>
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </header>
  );
}
