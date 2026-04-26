import React from "react";
import { FiCheckCircle, FiUsers } from "react-icons/fi";
import { LuRecycle } from "react-icons/lu";

export default function RadialStatsSegmented() {
  const items = [
    {
      value: "15.000+",
      label: "Usuarios activos",
      desc: "Personas que usan EcoRG para ubicar puntos verdes, aprender y participar.",
      icon: FiUsers,
    },
    {
      value: "500",
      label: "Toneladas recuperadas",
      desc: "Materiales registrados en campañas, puntos verdes y circuitos de reciclaje.",
      icon: LuRecycle,
    },
    {
      value: "3.500+",
      label: "Reportes resueltos",
      desc: "Problemas ambientales atendidos con información aportada por la comunidad.",
      icon: FiCheckCircle,
    },
  ];

  return (
    <section className="section mx-auto px-4 py-16 sm:max-w-xl md:max-w-full md:px-24 lg:max-w-screen-xl lg:px-8 lg:py-14">
      <div className="mx-auto max-w-3xl text-center">
        <span className="inline-flex rounded-full border border-[#d5e6c1] bg-[#f5faee] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#4f7a2f]">
          Impacto ciudadano
        </span>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#203014] sm:text-4xl">
          Indicadores que muestran el valor de una comunidad más informada
        </h2>
      </div>

      <div className="mt-12 grid gap-10 row-gap-8 lg:grid-cols-3">
        {items.map(({ value, label, desc, icon }, index) => (
          <div
            key={index}
            className="rounded-[28px] border border-[#dce8ce] bg-white p-7 shadow-[0_16px_38px_rgba(59,89,34,0.07)]"
          >
            <div className="flex items-center gap-3">
              <h3
                className="text-4xl font-bold md:text-5xl"
                style={{ color: "#2d3d33" }}
              >
                {value}
              </h3>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#66a93922]">
                {React.createElement(icon, {
                  className: "h-5 w-5 text-[#66a939]",
                })}
              </div>
            </div>

            <p className="mt-5 text-lg font-semibold text-[#243719]">{label}</p>
            <p className="mt-3 text-sm leading-6 text-slate-600">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
