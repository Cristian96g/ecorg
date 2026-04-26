import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthAPI, getFriendlyApiError, setToken } from "../../api/api";
import { useAuth } from "../../state/auth";
import { toast } from "react-toastify";

const schema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  email: z.string().min(1, "El email es obligatorio").email("Formato de email invÃ¡lido"),
  password: z.string().min(6, "La contraseÃ±a debe tener al menos 6 caracteres"),
  telefono: z.string().optional(),
  direccion: z.string().optional(),
  barrio: z.string().optional(),
});

export default function RegisterForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const next = params.get("next") || "/";
  const { login } = useAuth();
  const [serverError, setServerError] = React.useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema), mode: "onSubmit" });

  const onSubmit = async (data) => {
    try {
      setServerError("");
      const { token, user } = await AuthAPI.register(data);
      setToken(token);
      login(user);
      toast.success("Cuenta creada con Ã©xito");
      navigate(next, { replace: true });
    } catch (err) {
      const msg = getFriendlyApiError(err, "No pudimos crear tu cuenta. ProbÃ¡ nuevamente.");
      if (import.meta.env.DEV) {
        console.error("REGISTER_FORM_ERROR", err);
      }
      setServerError(msg);
      toast.error(msg);
    }
  };

  const [show, setShow] = React.useState(false);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold text-[#203014]">Crear cuenta</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Sumate a EcoRG en un minuto y empezÃ¡ a participar desde tu barrio.
        </p>
      </div>

      {serverError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {serverError}
        </div>
      )}

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-[#2d3d33]">Nombre y apellido</span>
        <input className="input-base" placeholder="MarÃ­a LÃ³pez" {...register("nombre")} />
        {errors.nombre && <p role="alert" className="mt-1 text-sm text-red-600">{errors.nombre.message}</p>}
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-[#2d3d33]">Email</span>
        <input type="email" className="input-base" placeholder="tu@correo.com" {...register("email")} />
        {errors.email && <p role="alert" className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-[#2d3d33]">ContraseÃ±a</span>
        <div className="relative">
          <input
            type={show ? "text" : "password"}
            className="input-base"
            placeholder="MÃ­nimo 6 caracteres"
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-[#2d3d33]/60 hover:text-[#2d3d33]"
            aria-label={show ? "Ocultar contraseÃ±a" : "Mostrar contraseÃ±a"}
          >
            {show ? eyeOff : eye}
          </button>
        </div>
        {errors.password && <p role="alert" className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-[#2d3d33]">TelÃ©fono (opcional)</span>
        <input className="input-base" placeholder="2966 123456" {...register("telefono")} />
      </label>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-[#2d3d33]">DirecciÃ³n</span>
          <input className="input-base" placeholder="Calle 123" {...register("direccion")} />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-[#2d3d33]">Barrio</span>
          <input className="input-base" placeholder="San Benito" {...register("barrio")} />
        </label>
      </div>

      <button type="submit" disabled={isSubmitting} className="buttonprimary w-full rounded-2xl px-6 py-3 font-medium shadow">
        {isSubmitting ? "Creando cuenta..." : "Registrarme"}
      </button>

      <p className="text-center text-xs text-[#2d3d33]/60">
        Al registrarte aceptÃ¡s los tÃ©rminos y condiciones de uso de EcoRG.
      </p>
    </form>
  );
}

const eye = (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const eyeOff = (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 3l18 18M10.6 10.6A3 3 0 0 0 12 15a3 3 0 0 0 3-3 3 3 0 0 0-.6-1.8M9.9 4.2A11.8 11.8 0 0 1 12 4c7 0 11 8 11 8a21 21 0 0 1-5.2 6.4M6.4 6.4A20.7 20.7 0 0 0 1 12s4 8 11 8c1.3 0 2.5-.2 3.6-.6" />
  </svg>
);

