import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
// Asegúrate de tener creado src/api/api.js con AuthAPI y setToken()
import { AuthAPI, setToken } from "../api/api";
import { useAuth } from "../state/auth"; 

/**
 * AuthPage: Login y Registro con el estilo EcoRG
 * - Usa Tailwind (arbitrary colors para mantener paleta)
 * - Responsive (mobile-first)
 * - Manejo de errores y loading
 * - Guarda JWT y redirige a "/"
 *
 * Colocar este archivo en: src/pages/Auth.jsx
 * Enrutado sugerido (ej.):
 * <Route path="/login" element={<AuthPage mode="login" />} />
 * <Route path="/registrarse" element={<AuthPage mode="register" />} />
 */

const BRAND = {
  primary: "#66a939", // EcoRG green
  dark: "#2d3d33",
};

export default function AuthPage({ mode = "login" }) {
  const location = useLocation();
  // Permite cambiar el modo vía ruta o prop
  const initialMode = location.pathname.includes("registr") ? "register" : mode;
  const [tab, setTab] = useState(initialMode);

  return (
    <div className="min-h-screen flex bg-white">
      {/* Lado gráfico / marca */}
      <aside className="hidden lg:flex w-2/5 xl:w-1/2 bg-[#ffffff] text-gray-900 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute -right-0 -top-28 w-96 h-96 rounded-full " style={{background: BRAND.primary}}/>
        <div className="absolute -left-52 -bottom-2 w-72 h-72 rounded-full " style={{background: BRAND.primary}}/>
        <div className="relative z-10 max-w-md">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl flex items-center justify-center" style={{background: BRAND.primary}}>
              {/* Ícono hoja simple */}
              <svg viewBox="0 0 24 24" className="h-6 w-6 text-white" fill="currentColor"><path d="M19 4c-7.5 1.1-12 5.6-12 12 0 2.2 1.8 4 4 4 6.4 0 10.9-4.4 12-12-.7 4.3-4.2 5.9-8 6-3.3.1-6.1 2.7-6.9 6 1.9-1.6 4.5-2.7 7.1-2.9C20.3 16.7 22 12.3 22 6c0-1.1-.9-2-2-2z"/></svg>
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">EcoRG</h1>
          </div>
          <p className="mt-6 text-gray-900 leading-relaxed">
            Plataforma para reciclar, donar y coordinar voluntariados en Río Gallegos.
            Sumate a la comunidad y ayudanos a mantener la ciudad más limpia.
          </p>
        </div>
      </aside>

      {/* Contenido */}
      <main className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          {/* Tabs */}
          <div className="flex rounded-xl p-1 bg-white shadow-sm border border-black/5">
            <button
              onClick={() => setTab("login")}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition ${
                tab === "login"
                  ? "bg-[#66a939] text-white shadow"
                  : "text-[#2d3d33] hover:bg-black/5"
              }`}
            >
              Iniciar sesión
            </button>
            <button
              onClick={() => setTab("register")}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition ${
                tab === "register"
                  ? "bg-[#66a939] text-white shadow"
                  : "text-[#2d3d33] hover:bg-black/5"
              }`}
            >
              Crear cuenta
            </button>
          </div>

          <div className="mt-6 bg-white rounded-2xl shadow-md border border-black/5 p-6 sm:p-7">
            {tab === "login" ? <LoginForm /> : <RegisterForm onSwitch={() => setTab("login")} />}
          </div>

          {/* Links secundarios */}
          <p className="mt-6 text-center text-sm text-[#2d3d33]/70">
            {tab === "login" ? (
              <>
                ¿No tenés cuenta?{" "}
                <button className="text-[#0f8237] hover:underline" onClick={() => setTab("register")}>Registrate</button>
              </>
            ) : (
              <>
                ¿Ya tenés cuenta?{" "}
                <button className="text-[#0f8237] hover:underline" onClick={() => setTab("login")}>Iniciá sesión</button>
              </>
            )}
          </p>
        </div>
      </main>
    </div>
  );
}

function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const { token, user } = await AuthAPI.login(form.email, form.password);
      setToken(token);
      login(user);
      // Podés guardar user en algún store si usás Zustand/Context
      navigate("/", { replace: true });
    } catch (err) {
      setError(err?.response?.data?.error || "No pudimos iniciar sesión. Verificá tus datos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="text-left">
        <h2 className="text-xl font-semibold text-[#2d3d33]">Bienvenido/a</h2>
        <p className="text-sm text-[#2d3d33]/70">Ingresá tus credenciales para continuar.</p>
      </div>

      {error && (
        <div className="text-sm rounded-lg p-3 border border-red-200 bg-red-50 text-red-700">{error}</div>
      )}

      <Field label="Email">
        <input
          type="email"
          required
          className="input"
          placeholder="tu@correo.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
      </Field>

      <Field label="Contraseña">
        <div className="relative">
          <input
            type={show ? "text" : "password"}
            required
            className="input pr-10"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <button type="button" onClick={() => setShow(!show)} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#2d3d33]/60 hover:text-[#2d3d33]">
            {show ? eyeOff : eye}
          </button>
        </div>
      </Field>

      <div className="flex items-center justify-between text-sm">
        <label className="inline-flex items-center gap-2 select-none text-[#2d3d33]/80">
          <input type="checkbox" className="accent-[#0f8237]" />
          Recordarme
        </label>
        <Link to="#" className="text-[#0f8237] hover:underline">¿Olvidaste tu contraseña?</Link>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full px-6 py-3 font-medium rounded-md shadow buttonprimary"
      >
        {loading ? "Ingresando..." : "Iniciar sesión"}
      </button>
    </form>
  );
}

function RegisterForm({ onSwitch }) {
  const navigate = useNavigate();
  const { login } = useAuth(); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
    telefono: "",
    direccion: "",
    barrio: "",
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const { token } = await AuthAPI.register(form);
      setToken(token);
      login(user); 
      navigate("/", { replace: true });
    } catch (err) {
      setError(err?.response?.data?.error || "No pudimos crear tu cuenta. Probá nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-[#2d3d33]">Crear cuenta</h2>
        <p className="text-sm text-[#2d3d33]/70">Sumate a EcoRG en un minuto.</p>
      </div>

      {error && (
        <div className="text-sm rounded-lg p-3 border border-red-200 bg-red-50 text-red-700">{error}</div>
      )}

      <Field label="Nombre y apellido">
        <input
          required
          className="input"
          placeholder="María López"
          value={form.nombre}
          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
        />
      </Field>

      <Field label="Email">
        <input
          type="email"
          required
          className="input"
          placeholder="tu@correo.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
      </Field>

      <Field label="Contraseña">
        <div className="relative">
          <input
            type={show ? "text" : "password"}
            required
            minLength={6}
            className="input pr-10"
            placeholder="Mínimo 6 caracteres"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <button type="button" onClick={() => setShow(!show)} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#2d3d33]/60 hover:text-[#2d3d33]">
            {show ? eyeOff : eye}
          </button>
        </div>
      </Field>

      <Field label="Teléfono (opcional)">
        <input
          className="input"
          placeholder="2966 123456"
          value={form.telefono}
          onChange={(e) => setForm({ ...form, telefono: e.target.value })}
        />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Dirección">
          <input
            className="input"
            placeholder="Calle 123"
            value={form.direccion}
            onChange={(e) => setForm({ ...form, direccion: e.target.value })}
          />
        </Field>
        <Field label="Barrio">
          <input
            className="input"
            placeholder="San Benito"
            value={form.barrio}
            onChange={(e) => setForm({ ...form, barrio: e.target.value })}
          />
        </Field>
      </div>

      <button type="submit" disabled={loading} className="w-full px-6 py-3 font-medium rounded-md shadow buttonprimary">
        {loading ? "Creando cuenta..." : "Registrarme"}
      </button>

      <p className="text-xs text-[#2d3d33]/60 text-center">
        Al registrarte aceptás nuestros Términos y Política de Privacidad.
      </p>

      <div className="text-center text-sm">
        <button type="button" onClick={onSwitch} className="text-[#0f8237] hover:underline">
          ¿Ya tenés cuenta? Iniciá sesión
        </button>
      </div>
    </form>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-[#2d3d33]">{label}</span>
      {children}
    </label>
  );
}

// Mini íconos (sin dependencias)
const eye = (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12Z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const eyeOff = (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 3l18 18M10.6 10.6A3 3 0 0 0 12 15a3 3 0 0 0 3-3 3 3 0 0 0-.6-1.8M9.9 4.2A11.8 11.8 0 0 1 12 4c7 0 11 8 11 8a21 21 0 0 1-5.2 6.4M6.4 6.4A20.7 20.7 0 0 0 1 12s4 8 11 8c1.3 0 2.5-.2 3.6-.6"/>
  </svg>
);


