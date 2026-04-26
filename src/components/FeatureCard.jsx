import React from "react";
import { Link } from "react-router-dom";

export default function FeatureCard({ icon: Icon, title, description, link }) {
  return (
    <Link
      to={link}
      className="block rounded-[28px] border border-[#dce8ce] bg-white p-7 shadow-[0_16px_40px_rgba(59,89,34,0.08)] transition hover:-translate-y-0.5 hover:border-[#c7dcb0] hover:shadow-[0_18px_44px_rgba(59,89,34,0.12)]"
    >
      {Icon && (
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f1f7e7]">
          <Icon className="h-7 w-7 text-[#66a939]" />
        </div>
      )}

      <h2 className="mt-5 text-xl font-semibold text-[#29401a]">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
      <span className="mt-5 inline-flex text-sm font-semibold text-[#5a9732]">
        Explorar sección
      </span>
    </Link>
  );
}
