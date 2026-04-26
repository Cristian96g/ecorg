import { useEffect, useMemo, useState } from "react";
import { FiEdit2, FiLoader, FiSave, FiUpload, FiUser, FiX } from "react-icons/fi";
import { getAssetUrl, getFriendlyApiError, UsersAPI } from "../api/api";
import SectionHero from "../components/ui/SectionHero";
import { useAuth } from "../state/auth";

const BARRIOS = [
  "Centro",
  "Belgrano",
  "San Benito",
  "Jardín Botánico",
  "YCF",
  "Evita",
];

function buildForm(user) {
  return {
    nombre: user?.nombre ?? "",
    email: user?.email ?? "",
    telefono: user?.telefono ?? "",
    direccion: user?.direccion ?? "",
    barrio: user?.barrio ?? "",
    avatarUrl: user?.avatarUrl ?? "",
    role: user?.role ?? "user",
    badges: Array.isArray(user?.badges) ? user.badges : [],
  };
}

export default function Profile() {
  const { user, ready, login } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      if (!ready) return;

      if (!user) {
        setLoading(false);
        setFeedback({
          type: "error",
          message: "No pudimos cargar tu perfil. Iniciá sesión nuevamente para continuar.",
        });
        return;
      }

      setLoading(true);
      setFeedback(null);

      if (!cancelled) {
        setForm(buildForm(user));
      }

      try {
        const me = await UsersAPI.getMe();
        if (!cancelled) {
          setForm(buildForm(me));
        }
      } catch (error) {
        if (!cancelled) {
          setFeedback({
            type: "error",
            message: getFriendlyApiError(
              error,
              "No pudimos cargar tus datos en este momento."
            ),
          });
          setForm(buildForm(user));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, [ready, user]);

  const avatarPreview = useMemo(() => {
    if (avatarFile) return URL.createObjectURL(avatarFile);
    return getAssetUrl(form?.avatarUrl);
  }, [avatarFile, form]);

  useEffect(() => {
    return () => {
      if (avatarFile) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarFile, avatarPreview]);

  const onChange = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
    setFeedback(null);
  };

  const handleCancel = () => {
    setEditing(false);
    setAvatarFile(null);
    setErrors({});
    setFeedback(null);
    setForm(buildForm(user));
  };

  function validateProfile(values) {
    const nextErrors = {};

    if (!values.nombre.trim()) {
      nextErrors.nombre = "Ingresá tu nombre.";
    }

    if (values.telefono && !/^[0-9+\-\s()]{6,20}$/.test(values.telefono.trim())) {
      nextErrors.telefono = "Ingresá un teléfono válido.";
    }

    if (values.direccion && values.direccion.trim().length < 4) {
      nextErrors.direccion = "Ingresá una dirección más completa.";
    }

    return nextErrors;
  }

  const onSave = async (event) => {
    event.preventDefault();

    const validationErrors = validateProfile(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setFeedback({
        type: "error",
        message: "Revisá los campos marcados antes de guardar.",
      });
      return;
    }

    setSaving(true);
    setFeedback(null);

    try {
      const payload = {
        nombre: form.nombre.trim(),
        telefono: form.telefono.trim(),
        direccion: form.direccion.trim(),
        barrio: form.barrio,
      };

      const updated = await UsersAPI.updateMe(payload, avatarFile);
      login(updated);
      setForm(buildForm(updated));
      setEditing(false);
      setAvatarFile(null);
      setFeedback({
        type: "success",
        message: "Tus datos se actualizaron correctamente.",
      });
    } catch (error) {
      console.error("PROFILE_UPDATE_ERROR", error);
      setFeedback({
        type: "error",
        message: getFriendlyApiError(
          error,
          "No pudimos guardar tus cambios. Probá nuevamente."
        ),
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading || !ready) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-10 md:px-8">
        <div className="animate-pulse rounded-[30px] border border-[#e4edd8] bg-white p-6 shadow-sm">
          <div className="h-8 w-40 rounded-full bg-[#edf5e1]" />
          <div className="mt-3 h-4 w-72 rounded-full bg-[#f2f6eb]" />
          <div className="mt-8 grid gap-6 md:grid-cols-[280px_1fr]">
            <div className="h-72 rounded-[28px] bg-[#f6faef]" />
            <div className="h-72 rounded-[28px] bg-[#fbfdf8]" />
          </div>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-10 md:px-8">
        <div className="rounded-[28px] border border-[#f0d7dc] bg-[#fff8f8] p-6 text-center">
          <h1 className="text-2xl font-semibold text-[#203014]">Perfil de usuario</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            No pudimos preparar tu perfil para esta sesión.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-10 md:px-8">
      <SectionHero
        eyebrow="Mi cuenta"
        title="Perfil de usuario"
        description="Gestioná tus datos personales y mantené actualizada tu información de contacto dentro de EcoRG."
        className="mb-6"
        actions={
          !editing ? (
            <button
              type="button"
              onClick={() => {
                setEditing(true);
                setFeedback(null);
              }}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-[#d9e7ca] bg-white px-4 py-3 text-sm font-semibold text-[#35561a] transition hover:border-[#66a939] hover:bg-[#f7fbf1] lg:w-auto"
            >
              <FiEdit2 className="h-4 w-4" />
              Editar perfil
            </button>
          ) : (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleCancel}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#d9e7ca] bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <FiX className="h-4 w-4" />
                Cancelar
              </button>
              <button
                type="submit"
                form="profile-form"
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#66a939] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#5a9732] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {saving ? <FiLoader className="h-4 w-4 animate-spin" /> : <FiSave className="h-4 w-4" />}
                {saving ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>
          )
        }
      />

      {feedback && (
        <div
          className={`mb-6 rounded-2xl border px-4 py-3 text-sm ${
            feedback.type === "success"
              ? "border-[#d5e6c1] bg-[#f5faee] text-[#35561a]"
              : "border-[#f0d7dc] bg-[#fff8f8] text-[#8a3445]"
          }`}
        >
          {feedback.message}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[300px_1fr]">
        <aside className="rounded-[28px] border border-[#e4edd8] bg-white p-6 shadow-sm">
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border border-[#dce8ce] bg-[#f5faee]">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar del usuario"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <FiUser className="h-12 w-12 text-[#7ca757]" />
                )}
              </div>

              {editing && (
                <label className="absolute -bottom-2 right-0 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[#d9e7ca] bg-white px-3 py-2 text-sm font-medium text-[#35561a] shadow-sm transition hover:border-[#66a939]">
                  <FiUpload className="h-4 w-4 text-[#66a939]" />
                  Cambiar
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => {
                      const file = event.target.files?.[0] || null;
                      setAvatarFile(file);
                    }}
                  />
                </label>
              )}
            </div>

            <h2 className="mt-5 text-xl font-semibold text-[#203014]">{form.nombre}</h2>
            <p className="mt-1 text-sm text-slate-500">{form.email}</p>
            <span className="mt-4 inline-flex rounded-full bg-[#eef6e4] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#4f7a2f]">
              {form.role === "admin" ? "Administrador" : "Cuenta ciudadana"}
            </span>
          </div>

          <div className="mt-6 rounded-2xl border border-[#dce8ce] bg-[#f7fbf1] p-4">
            <h3 className="text-sm font-semibold text-[#29401a]">Logros ambientales</h3>
            <p className="mt-2 text-2xl font-semibold text-[#203014]">
              {Array.isArray(form?.badges) ? form.badges.length : Array.isArray(user?.badges) ? user.badges.length : 0}
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Tus insignias se obtienen automaticamente cuando acciones reales son validadas en EcoRG.
            </p>
          </div>

          <div className="mt-6 rounded-2xl border border-[#e7efdb] bg-[#fbfdf8] p-4">
            <h3 className="text-sm font-semibold text-[#29401a]">Preferencias</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              La personalización de notificaciones y preferencias todavía no está disponible en esta versión de EcoRG.
            </p>
          </div>
        </aside>

        <section className="rounded-[28px] border border-[#e4edd8] bg-white p-6 shadow-sm">
          <form id="profile-form" onSubmit={onSave} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Nombre" error={errors.nombre}>
                <input
                  disabled={!editing}
                  value={form.nombre}
                  onChange={(event) => onChange("nombre", event.target.value)}
                  className={inputClasses(errors.nombre, !editing)}
                  placeholder="Tu nombre"
                />
              </Field>

              <Field label="Email">
                <input
                  disabled
                  value={form.email}
                  className={inputClasses("", true)}
                />
                <p className="mt-2 text-xs text-slate-500">
                  El email se mantiene protegido y no puede editarse desde este perfil.
                </p>
              </Field>

              <Field label="Teléfono" error={errors.telefono}>
                <input
                  disabled={!editing}
                  value={form.telefono}
                  onChange={(event) => onChange("telefono", event.target.value)}
                  className={inputClasses(errors.telefono, !editing)}
                  placeholder="Ejemplo: 2966 123456"
                />
              </Field>

              <Field label="Barrio">
                <select
                  disabled={!editing}
                  value={form.barrio}
                  onChange={(event) => onChange("barrio", event.target.value)}
                  className={inputClasses("", !editing)}
                >
                  <option value="">Seleccionar barrio</option>
                  {BARRIOS.map((barrio) => (
                    <option key={barrio} value={barrio}>
                      {barrio}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Dirección" error={errors.direccion} className="md:col-span-2">
                <input
                  disabled={!editing}
                  value={form.direccion}
                  onChange={(event) => onChange("direccion", event.target.value)}
                  className={inputClasses(errors.direccion, !editing)}
                  placeholder="Ingresá tu dirección"
                />
              </Field>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}

function Field({ label, error, className = "", children }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>
      {children}
      {error && <p className="mt-2 text-sm text-[#a53c53]">{error}</p>}
    </label>
  );
}

function inputClasses(error, disabled) {
  return `w-full rounded-2xl border px-4 py-3 text-sm outline-none transition ${
    disabled ? "bg-slate-50 text-slate-500" : "bg-[#fbfdf8] text-slate-700"
  } ${
    error
      ? "border-[#d98a9b] focus:border-[#c04b62] focus:ring-2 focus:ring-[#c04b62]/20"
      : "border-[#d9e7ca] focus:border-[#66a939] focus:ring-2 focus:ring-[#66a939]/20"
  }`;
}
