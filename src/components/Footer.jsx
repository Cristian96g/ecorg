import React from "react";
import { NavLink } from "react-router-dom";
import { FiArrowUpRight, FiAward, FiBookOpen, FiCalendar, FiMap, FiUser } from "react-icons/fi";
import { useAuth } from "../state/auth";
import logo from "../assets/ecorg-logo.png";

const footerLinks = [
  { to: "/", label: "Inicio" },
  { to: "/mapa", label: "Mapa de puntos verdes" },
  { to: "/reportes", label: "Reportes comunitarios" },
  { to: "/calendario", label: "Calendario" },
  { to: "/educacion", label: "Educación ambiental" },
  { to: "/gamificacion", label: "Gamificación" },
];

const utilityLinks = [
  { to: "/mapa", label: "Ver puntos verdes", icon: FiMap },
  { to: "/calendario", label: "Consultar horarios", icon: FiCalendar },
  { to: "/educacion", label: "Aprender a reciclar", icon: FiBookOpen },
  { to: "/gamificacion", label: "Ver mis logros", icon: FiAward },
];

function FooterLink({ to, children }) {
  return (
    <NavLink
      to={to}
      className="inline-flex items-center gap-2 text-sm text-white/78 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
    >
      <span>{children}</span>
      <FiArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
    </NavLink>
  );
}

export default function Footer() {
  const { user } = useAuth();

  return (
    <footer className="mt-16 bg-[linear-gradient(180deg,#26401d_0%,#17331b_100%)] text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr_0.85fr]">
          <section>
            <img src={logo} alt="EcoRG" className="h-14 w-auto" />
            <p className="mt-5 max-w-md text-sm leading-7 text-white/78">
              EcoRG es una plataforma ciudadana para encontrar puntos verdes, reportar problemas ambientales y promover hábitos más sustentables en Río Gallegos.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <NavLink
                to="/reportes"
                className="inline-flex items-center justify-center rounded-2xl bg-[#66a939] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5a9732] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
              >
                Reportar ahora
              </NavLink>
              <NavLink
                to="/mapa"
                className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
              >
                Explorar mapa
              </NavLink>
            </div>
          </section>

          <section>
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-white/70">
              Navegación
            </h2>
            <div className="mt-5 grid gap-3">
              {footerLinks.map((link) => (
                <FooterLink key={link.to} to={link.to}>
                  {link.label}
                </FooterLink>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-white/70">
              Cuenta y comunidad
            </h2>
            <div className="mt-5 grid gap-3">
              {!user ? (
                <FooterLink to="/login">Acceder</FooterLink>
              ) : (
                <>
                  <FooterLink to="/perfil">Mi perfil</FooterLink>
                  {user.role === "admin" ? <FooterLink to="/admin">Panel admin</FooterLink> : null}
                </>
              )}

              {utilityLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className="inline-flex items-center gap-2 text-sm text-white/78 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    <span>{link.label}</span>
                  </NavLink>
                );
              })}

              <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/60">
                  Propósito
                </p>
                <p className="mt-3 text-sm leading-6 text-white/78">
                  Hecho en Río Gallegos para impulsar participación ciudadana, reciclaje y gestión ambiental con herramientas digitales accesibles.
                </p>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6">
          <div className="flex flex-col gap-3 text-sm text-white/65 md:flex-row md:items-center md:justify-between">
            <p>© {new Date().getFullYear()} EcoRG. Proyecto final de Diseño y Programación Web.</p>
            <p className="inline-flex items-center gap-2">
              <FiUser className="h-4 w-4" aria-hidden="true" />
              Hecho en Río Gallegos, Santa Cruz
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
