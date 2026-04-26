import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Modal from "../components/ui/Modal";
import LoadingState from "../components/ui/LoadingState";
import SectionHero from "../components/ui/SectionHero";
import {
  educationCategories,
  loadEducationContent,
} from "../constants/mockEducation";
import { notifyError } from "../utils/feedback";

function EducationCard({ item, onOpen }) {
  return (
    <article className="flex h-full flex-col rounded-[28px] border border-[#d8e7c5] bg-white p-5 shadow-[0_18px_45px_rgba(59,89,34,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_48px_rgba(59,89,34,0.12)]">
      <div className="flex items-start justify-between gap-3">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-2xl text-2xl"
          style={{ backgroundColor: item.accent }}
          aria-hidden="true"
        >
          {item.icon}
        </div>
        <span className="rounded-full border border-[#d8e7c5] bg-[#f5faee] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#4f7a2f]">
          {item.readingTime}
        </span>
      </div>

      <div className="mt-4 space-y-3">
        <span className="inline-flex rounded-full bg-[#eef6e4] px-3 py-1 text-xs font-medium text-[#4c7d26]">
          {item.categoryLabel}
        </span>
        <h2 className="text-xl font-semibold text-[#1e2b15]">{item.title}</h2>
        <p className="text-sm leading-6 text-slate-600">{item.description}</p>
      </div>

      <div className="mt-auto pt-5">
        <button
          type="button"
          onClick={() => onOpen(item)}
          className="inline-flex w-full items-center justify-center rounded-2xl bg-[#66a939] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#5a9732] focus:outline-none focus:ring-2 focus:ring-[#66a939] focus:ring-offset-2"
        >
          Leer más
        </button>
      </div>
    </article>
  );
}

function EducationDetailModal({ item, onClose }) {
  if (!item) return null;

  return (
    <Modal open={!!item} onClose={onClose} title={item.title} size="lg">
      <div className="grid gap-6 lg:grid-cols-[1.35fr_0.9fr]">
        <section className="space-y-6">
          <div
            className="rounded-3xl border border-[#e2ecd4] p-5"
            style={{ backgroundColor: item.accent }}
          >
            <div className="space-y-3">
              <span className="inline-flex rounded-full bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#4f7a2f]">
                {item.categoryLabel}
              </span>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">
                  {item.icon}
                </div>
                <p className="text-sm text-slate-600">
                  Lectura estimada: {item.readingTime}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-[#e6efdb] bg-[#fbfdf8] p-5">
            <h3 className="text-base font-semibold text-[#223117]">Resumen</h3>
            <p className="mt-3 text-sm leading-7 text-slate-700">{item.details}</p>
          </div>

          <div className="rounded-3xl border border-[#e6efdb] bg-white p-5">
            <h3 className="text-base font-semibold text-[#223117]">Pasos prácticos</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-700">
              {item.practicalSteps.map((step, index) => (
                <li key={step} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#66a939] text-xs font-semibold text-white">
                    {index + 1}
                  </span>
                  <span className="leading-6">{step}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <aside className="space-y-5">
          <div className="rounded-3xl border border-[#e6efdb] bg-[#f6faef] p-5">
            <h3 className="text-base font-semibold text-[#223117]">Consejos útiles</h3>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
              {item.usefulTips.map((tip) => (
                <li key={tip} className="flex items-start gap-3">
                  <span className="mt-1 text-[#66a939]">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-[#f1dddf] bg-[#fff8f8] p-5">
            <h3 className="text-base font-semibold text-[#6f2f3a]">Errores comunes</h3>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
              {item.commonMistakes.map((mistake) => (
                <li key={mistake} className="flex items-start gap-3">
                  <span className="mt-1 text-[#c04b62]">•</span>
                  <span>{mistake}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-[#d8e7c5] bg-white p-5 shadow-sm">
            <h3 className="text-base font-semibold text-[#223117]">Próximo paso</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Convertí esta información en una acción concreta dentro de EcoRG.
            </p>
            <Link
              to={item.cta.to}
              onClick={onClose}
              className="mt-4 inline-flex w-full items-center justify-center rounded-2xl bg-[#66a939] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#5a9732]"
            >
              {item.cta.label}
            </Link>
          </div>
        </aside>
      </div>
    </Modal>
  );
}

export default function Education() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState("todos");
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadItems() {
      setLoading(true);
      setError("");

      try {
        const data = await loadEducationContent();
        if (!cancelled) {
          setItems(data);
        }
      } catch (loadError) {
        console.error("EDUCATION_LOAD_ERROR", loadError);
        if (!cancelled) {
          setError("No pudimos cargar los contenidos educativos en este momento.");
          notifyError("No se pudo cargar Educación Ambiental.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadItems();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredItems = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return items.filter((item) => {
      const matchesCategory =
        activeCategory === "todos" || item.category === activeCategory;

      const haystack = [
        item.title,
        item.description,
        item.categoryLabel,
        item.details,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        normalizedSearch.length === 0 || haystack.includes(normalizedSearch);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, items, search]);

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <SectionHero
          eyebrow="Educación ambiental"
          title="Aprendé a reciclar mejor y a cuidar tu barrio con acciones simples"
          description="Encontrá guías cortas, consejos prácticos y recomendaciones pensadas para la vida cotidiana en Río Gallegos. La idea es que cada lectura te ayude a tomar una decisión concreta."
        />

        <section className="mt-8 rounded-[30px] border border-[#e1ecd2] bg-white p-4 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4">
            <div>
              <label
                htmlFor="education-search"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Buscar contenido
              </label>
              <input
                id="education-search"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Ejemplo: plástico, compostaje, pilas"
                className="w-full rounded-2xl border border-[#d9e7ca] bg-[#fbfdf8] px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#66a939] focus:ring-2 focus:ring-[#66a939]/20"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {educationCategories.map((category) => {
                const isActive = activeCategory === category.id;

                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setActiveCategory(category.id)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                      isActive
                        ? "bg-[#66a939] text-white shadow-sm"
                        : "border border-[#d8e7c5] bg-white text-slate-700 hover:border-[#66a939] hover:text-[#4c7d26]"
                    }`}
                  >
                    {category.label}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mt-8">
          {loading ? (
            <LoadingState
              title="Cargando Educación Ambiental"
              description="Estamos preparando las guías y recomendaciones para vos."
            />
          ) : error ? (
            <LoadingState
              title="No pudimos cargar esta sección"
              description={error}
            />
          ) : filteredItems.length === 0 ? (
            <div className="rounded-[30px] border border-dashed border-[#d7e5c5] bg-[#fbfdf8] px-6 py-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eef6e4] text-2xl">
                🌿
              </div>
              <h2 className="mt-4 text-xl font-semibold text-[#203014]">
                No encontramos contenidos con esos filtros
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600">
                Probá con otra palabra clave o cambiá la categoría para explorar
                más temas de reciclaje, residuos especiales y hábitos
                sustentables.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setActiveCategory("todos");
                }}
                className="mt-6 inline-flex items-center justify-center rounded-2xl border border-[#cfe1b7] bg-white px-4 py-3 text-sm font-semibold text-[#4c7d26] transition hover:border-[#66a939] hover:text-[#33561a]"
              >
                Limpiar filtros
              </button>
            </div>
          ) : (
            <>
              <div className="mb-5 flex items-center justify-between gap-4">
                <p className="text-sm text-slate-600">
                  {filteredItems.length} contenido
                  {filteredItems.length === 1 ? "" : "s"} disponible
                  {filteredItems.length === 1 ? "" : "s"} para leer.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {filteredItems.map((item) => (
                  <EducationCard
                    key={item._id}
                    item={item}
                    onOpen={setSelectedItem}
                  />
                ))}
              </div>
            </>
          )}
        </section>
      </div>

      <EducationDetailModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </>
  );
}
