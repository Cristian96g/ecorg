export default function SectionHero({
  eyebrow,
  title,
  description,
  actions = null,
  children = null,
  className = "",
}) {
  return (
    <section
      className={`overflow-hidden rounded-3xl border border-[#d8e7c5] bg-[linear-gradient(135deg,#f7fbf1_0%,#eef7e2_45%,#f9fcf3_100%)] px-5 py-7 shadow-[0_24px_60px_rgba(73,110,33,0.10)] sm:px-8 sm:py-10 ${className}`.trim()}
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          {eyebrow ? (
            <span className="inline-flex rounded-full border border-[#cfe1b7] bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#4f7a2f]">
              {eyebrow}
            </span>
          ) : null}
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[#203014] sm:text-4xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              {description}
            </p>
          ) : null}
        </div>

        {actions ? <div className="w-full lg:w-auto lg:max-w-sm">{actions}</div> : null}
      </div>

      {children ? <div className="mt-6">{children}</div> : null}
    </section>
  );
}
