import { Link } from "react-router-dom";
import recoleccion from "../assets/recoleccion.jpg";

function HighlightSection() {
  return (
    <section className=" md:py-14 lg:py-24">
      <div className="mx-auto flex flex-col md:flex-row items-center gap-8 pt-16 pb-8">
        {/* Texto */}
        <div className="flex-1">
          <h2 className="titlesecond">
            Consulta el Calendario de Recolección
          </h2>
          <p className="mt-3 text-gray-700">
            Enterate qué días y horarios pasa la recolección diferenciada en tu
            barrio y no pierdas la oportunidad de reciclar correctamente.
          </p>
          <Link
            to="/calendario"
            className="mt-5 inline-block rounded-md    font-medium buttonprimary"
          >
            Ver calendario
          </Link>
        </div>

        {/* Imagen/Ilustración */}
        <div className="flex-1">
          <img
            src={recoleccion}
            alt="Calendario recolección"
            className="w-full h-auto rounded-lg shadow-md"
          />
        </div>
      </div>
    </section>
  );
}

export default HighlightSection;
