import { Link } from "react-router-dom";
import recoleccion from "../assets/recoleccion.jpg";

function HighlightSection() {
  return (
    <section className="section py-14 lg:py-20">
      <div className="mx-auto flex flex-col items-center gap-8 overflow-hidden rounded-[32px] border border-[#dce8ce] bg-[linear-gradient(135deg,#f8fbf4_0%,#eef6e5_48%,#fbfdf8_100%)] px-6 py-8 shadow-[0_18px_45px_rgba(59,89,34,0.08)] md:flex-row md:px-8 lg:px-10">
        <div className="flex-1">
          <span className="inline-flex rounded-full border border-[#d5e6c1] bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#4f7a2f]">
            Organización diaria
          </span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#203014]">
            Consultá el calendario de recolección de tu barrio
          </h2>
          <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
            Planificá mejor la disposición de residuos y aprovechá los días de
            recolección diferenciada para separar materiales en el momento
            adecuado.
          </p>
          <Link
            to="/calendario"
            className="mt-6 inline-flex rounded-2xl bg-[#66a939] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5a9732]"
          >
            Ver calendario
          </Link>
        </div>

        <div className="flex-1">
          <img
            src={recoleccion}
            alt="Camión de recolección urbana"
            className="h-auto w-full rounded-[28px] object-cover shadow-md"
          />
        </div>
      </div>
    </section>
  );
}

export default HighlightSection;
