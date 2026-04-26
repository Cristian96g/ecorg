import React from "react";
import { useLocation } from "react-router-dom";
import LoginForm from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";
import Logo from "../assets/ecorg-logo.png";

const BRAND = { primary: "#66a939", dark: "#2d3d33" };

export default function AuthPage({ mode = "login" }) {
  const location = useLocation();
  const initial = location.pathname.includes("registr") ? "register" : mode;
  const search = location.search || "";
  const [tab, setTab] = React.useState(initial);

  return (
    <div className="min-h-screen bg-white lg:grid lg:grid-cols-[1.05fr_0.95fr]">
      <aside className="relative hidden overflow-hidden bg-[linear-gradient(145deg,#f6faef_0%,#ebf5df_48%,#f8fbf4_100%)] p-12 lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -right-10 -top-16 h-80 w-80 rounded-full bg-[#66a939]/18" />
        <div className="absolute -bottom-20 -left-16 h-72 w-72 rounded-full bg-[#66a939]/14" />

        <div className="relative z-10">
          <img src={Logo} alt="EcoRG logo" className="h-20 w-auto" draggable="false" />
          <span className="mt-8 inline-flex rounded-full border border-[#d5e6c1] bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#4f7a2f]">
            Cuenta EcoRG
          </span>
          <h1 className="mt-4 max-w-md text-4xl font-semibold leading-tight text-[#203014]">
            AccedÃ© a una experiencia ciudadana mÃ¡s Ãºtil y participativa
          </h1>
          <p className="mt-4 max-w-lg text-base leading-7 text-slate-600">
            IniciÃ¡ sesiÃ³n o creÃ¡ tu cuenta para reportar problemas ambientales,
            guardar tus datos y usar EcoRG como una herramienta cotidiana en RÃ­o Gallegos.
          </p>
        </div>

        <div className="relative z-10 grid gap-4">
          <div className="rounded-[26px] border border-[#dce8ce] bg-white/90 p-5 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-[#4f7a2f]">
              QuÃ© podÃ©s hacer
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Crear reportes, consultar el mapa de puntos verdes y mantener tu perfil actualizado.
            </p>
          </div>
          <div className="rounded-[26px] border border-[#dce8ce] bg-white/90 p-5 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-[#4f7a2f]">
              Pensado para la ciudad
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              EcoRG acompaÃ±a acciones ambientales concretas con una interfaz simple y accesible.
            </p>
          </div>
        </div>
      </aside>

      <main className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <div className="rounded-[28px] border border-[#dce8ce] bg-white p-2 shadow-[0_16px_36px_rgba(59,89,34,0.08)]">
            <div className="mb-5 flex rounded-2xl bg-[#f5faee] p-1">
              <button
                onClick={() => setTab("login")}
                className={`flex-1 rounded-2xl py-3 text-sm font-semibold transition ${
                  tab === "login"
                    ? "bg-[#66a939] text-white shadow-sm"
                    : "text-[#2d3d33] hover:bg-white"
                }`}
              >
                Iniciar sesiÃ³n
              </button>
              <button
                onClick={() => setTab("register")}
                className={`flex-1 rounded-2xl py-3 text-sm font-semibold transition ${
                  tab === "register"
                    ? "bg-[#66a939] text-white shadow-sm"
                    : "text-[#2d3d33] hover:bg-white"
                }`}
              >
                Crear cuenta
              </button>
            </div>

            <div className="rounded-[24px] border border-[#edf4e4] bg-white p-6 sm:p-7">
              {tab === "login" ? (
                <LoginForm key={`login-${search}`} />
              ) : (
                <RegisterForm key={`register-${search}`} />
              )}
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-[#2d3d33]/70">
            {tab === "login" ? (
              <>
                Â¿No tenÃ©s cuenta?{" "}
                <button
                  className="font-semibold text-[#4f7a2f] hover:underline"
                  onClick={() => setTab("register")}
                >
                  Registrate
                </button>
              </>
            ) : (
              <>
                Â¿Ya tenÃ©s cuenta?{" "}
                <button
                  className="font-semibold text-[#4f7a2f] hover:underline"
                  onClick={() => setTab("login")}
                >
                  IniciÃ¡ sesiÃ³n
                </button>
              </>
            )}
          </p>
        </div>
      </main>
    </div>
  );
}

