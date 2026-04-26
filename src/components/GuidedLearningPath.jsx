import "../guided-path.css";
import {
  motion,
  animate,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import { useEffect, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import {
  MdOpenInFull,
  MdWorkspacePremium,
  MdOutlineArrowForward,
  MdOutlineCalendarMonth,
  MdDelete,
  MdRestoreFromTrash,
  MdOutlineReport,
  MdVerifiedUser,
} from "react-icons/md";

// ✅ EcoRG Brand Tokens (centralizado)
const BRAND = {
  primary: "#66A939",  // verde del logo
  primaryHover: "#5A952F",
  dark: "#2D3D33",     // verde oscuro del logo
  mid: "#3E5E49",      // verde medio para texto secundario
  light: "#F6F8F6",
  light2: "#F0F4F2",
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.06 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" },
  },
};

const fade = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.45, ease: "easeOut" } },
};

const viewportOnce = { once: true, amount: 0.2 };

export default function EcoRGHome() {
  const shouldReduceMotion = useReducedMotion();

  const points = 840;
  const maxPoints = 1000;
  const progress = Math.round((points / maxPoints) * 100);

  const progressMV = useMotionValue(0);
  const progressSpring = useSpring(progressMV, {
    stiffness: 120,
    damping: 18,
    mass: 0.6,
  });
  const width = useTransform(progressSpring, (v) => `${v}%`);
  const progressText = useTransform(progressSpring, (v) => Math.round(v));

  const pointsMV = useMotionValue(0);
  const pointsSpring = useSpring(pointsMV, { stiffness: 120, damping: 18 });
  const pointsText = useTransform(pointsSpring, (v) => Math.round(v));

  useEffect(() => {
    if (shouldReduceMotion) {
      progressMV.set(progress);
      pointsMV.set(points);
      return;
    }

    progressMV.set(0);
    pointsMV.set(0);

    const controls1 = animate(progressMV, progress, {
      duration: 0.9,
      ease: "easeOut",
    });

    const controls2 = animate(pointsMV, points, {
      duration: 0.9,
      ease: "easeOut",
    });

    return () => {
      controls1.stop();
      controls2.stop();
    };
  }, [progress, points, progressMV, pointsMV, shouldReduceMotion]);

  const hoverLift = shouldReduceMotion
    ? {}
    : {
        whileHover: { y: -4, scale: 1.01 },
        whileTap: { scale: 0.98 },
        transition: { type: "spring", stiffness: 300, damping: 20 },
      };

  const heroRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.06]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "6%"]);

  const safeBgY = shouldReduceMotion ? 0 : bgY;
  const safeBgScale = shouldReduceMotion ? 1 : bgScale;
  const safeContentY = shouldReduceMotion ? 0 : contentY;

  return (
    <div className="bg-background-light text-[#111813] transition-colors duration-300 font-display">
      {/* TopNavBar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-solid border-[#f0f4f2] px-6 lg:px-40 py-3">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div
                className="size-10 flex items-center justify-center rounded-xl text-white"
                style={{ backgroundColor: BRAND.primary }}
              >
                <span className="material-symbols-outlined">eco</span>
              </div>
              <h2 className="text-[#111813] text-xl font-black leading-tight tracking-tight">
                EcoRG
              </h2>
            </div>

            <nav className="hidden md:flex items-center gap-8">
              <a
                className="text-[#111813] text-sm font-medium transition-colors"
                style={{}}
                onMouseEnter={(e) => (e.currentTarget.style.color = BRAND.primary)}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#111813")}
                href="#"
              >
                Inicio
              </a>
              <a
                className="text-[#111813] text-sm font-medium transition-colors"
                onMouseEnter={(e) => (e.currentTarget.style.color = BRAND.primary)}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#111813")}
                href="#"
              >
                Mapa
              </a>
              <a
                className="text-[#111813] text-sm font-medium transition-colors"
                onMouseEnter={(e) => (e.currentTarget.style.color = BRAND.primary)}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#111813")}
                href="#"
              >
                Recolección
              </a>
              <a
                className="text-[#111813] text-sm font-medium transition-colors"
                onMouseEnter={(e) => (e.currentTarget.style.color = BRAND.primary)}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#111813")}
                href="#"
              >
                Guías
              </a>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <label className="hidden sm:flex min-w-40 h-10">
              <div className="flex w-full items-stretch rounded-full px-4 overflow-hidden" style={{ backgroundColor: BRAND.light2 }}>
                <div className="flex items-center justify-center" style={{ color: BRAND.mid }}>
                  <span className="material-symbols-outlined text-[20px]">
                    <FaSearch />
                  </span>
                </div>
                <input
                  className="w-full border-none bg-transparent focus:ring-0 text-sm"
                  style={{ color: "#111813" }}
                  placeholder="Buscar puntos en la ciudad..."
                />
              </div>
            </label>

            <motion.button
              {...hoverLift}
              className="flex h-10 px-6 cursor-pointer items-center justify-center rounded-full text-sm font-bold"
              style={{ backgroundColor: BRAND.primary, color: "white" }}
            >
              Sumate
            </motion.button>
          </div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-6 lg:px-10 pb-20">
        {/* HeroSection (Parallax) */}
        <section className="py-10" ref={heroRef}>
          <motion.div
            className="relative overflow-hidden rounded-xl"
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
          >
            {/* Fondo parallax */}
            <motion.div
              className="absolute inset-0"
              style={{
                y: safeBgY,
                scale: safeBgScale,
                backgroundImage:
                  `linear-gradient(rgba(45, 61, 51, 0.78), rgba(45, 61, 51, 0.42)), url("https://lh3.googleusercontent.com/aida-public/AB6AXuDYpe8xb0qD_84reQQxfkwr-He0asdRprtxgKoF6m4IC_xYFWlFjXNsKJy0owaSN_NXkebkA5n2KFV091lvcpkvIBz7Wfw5SK0eD_e5pocmk26EidhUZ2RBrjjkMb2oSCm5h4K0Je_uN_OsxdhNOerBt2gWrQivrCuLJwmHm1WjsX1hYgpn5NrWusBxshWbY-Uq2vwBLgmy0xnxB6nuWv3I3B859AgElgYFVUerypkeIKQIrX_FzGj3NgeaKcg9JF9l_2X8SzMHhxo_")`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                willChange: "transform",
              }}
              aria-hidden="true"
            />

            <motion.div
              className="relative flex min-h-[520px] flex-col gap-6 items-center justify-center p-8 text-center"
              style={{ y: safeContentY }}
            >
              <motion.div
                className="flex flex-col gap-4 max-w-2xl"
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={viewportOnce}
              >
                <motion.h1
                  variants={fadeUp}
                  className="text-white text-4xl md:text-6xl font-black leading-tight tracking-tight"
                >
                  Transformá tus residuos en un futuro más verde.
                </motion.h1>

                <motion.p
                  variants={fadeUp}
                  className="text-white/90 text-lg md:text-xl font-light"
                >
                  Reciclá fácil, encontrá puntos verdes, aprendé a separar y ayudá
                  a mantener la ciudad limpia.
                </motion.p>

                <motion.div
                  variants={fadeUp}
                  className="flex flex-wrap justify-center gap-4 mt-4"
                >
                  <motion.button
                    {...hoverLift}
                    className="flex h-12 px-8 cursor-pointer items-center justify-center rounded-full text-base font-bold shadow-lg"
                    style={{
                      backgroundColor: BRAND.primary,
                      color: "white",
                      boxShadow: `0 12px 30px rgba(102, 169, 57, 0.20)`,
                    }}
                  >
                    Buscar punto más cercano
                  </motion.button>

                  <motion.button
                    whileHover={shouldReduceMotion ? undefined : { scale: 1.03 }}
                    whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                    className="flex h-12 px-8 cursor-pointer items-center justify-center rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20 text-base font-bold hover:bg-white/20 transition-all"
                  >
                    Cómo funciona
                  </motion.button>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </section>

        {/* Map and Schedule Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 py-10">
          {/* Map side */}
          <motion.div
            className="lg:col-span-2 flex flex-col gap-4"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
          >
            <motion.div
              variants={fadeUp}
              className="flex items-center justify-between px-2"
            >
              <h2 className="text-2xl font-bold tracking-tight">
                Puntos de reciclaje cerca tuyo
              </h2>
              <span className="text-sm font-bold flex items-center gap-1 cursor-pointer" style={{ color: BRAND.primary }}>
                Pantalla completa{" "}
                <span className="material-symbols-outlined text-sm">
                  <MdOpenInFull />
                </span>
              </span>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="relative w-full aspect-video rounded-xl overflow-hidden shadow-xl border-4 border-white"
              style={{ boxShadow: `0 10px 30px rgba(45,61,51,0.10)` }}
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB74VYDS3N87h6fbKoCf4nkfzTB5Mkd6bFn4toGOCx-gIfhnhlaq7xIK4B7XtxB-9f_8yRBh5vw4zJyx1ogdq25KUyWVXd2JQnHsMdTiK5Eg_zDFOBTnA2uzF7-_uRQpwgI_mYftRivH697HDSZpd49t5wqmLjpImEapZ-pFva4LJrx-xzwT7QgRc6_P-YCjWcPaq0O-DNwyr1BpPsKuHJ_iWI9r1UQvQHL0wgROjvEbe_iSy33zJ9wqn5KJH0YD2aSx_qq_K9ugK-c")',
                }}
                aria-label="Mapa interactivo de la ciudad con centros de reciclaje"
              />

              {/** Pins */}
              <motion.div
                className="absolute top-1/4 left-1/3 p-2 text-white rounded-full shadow-lg cursor-pointer"
                style={{ backgroundColor: BRAND.primary }}
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={viewportOnce}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <span className="material-symbols-outlined">recycling</span>
              </motion.div>

              <motion.div
                className="absolute bottom-1/3 right-1/4 p-2 text-white rounded-full shadow-lg cursor-pointer"
                style={{ backgroundColor: BRAND.primary }}
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={viewportOnce}
                transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
              >
                <span className="material-symbols-outlined">recycling</span>
              </motion.div>

              <motion.div
                className="absolute top-1/2 right-1/2 p-2 text-white rounded-full shadow-lg cursor-pointer"
                style={{ backgroundColor: BRAND.primary }}
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={viewportOnce}
                animate={
                  shouldReduceMotion
                    ? undefined
                    : { scale: [1, 1.12, 1], opacity: [1, 0.85, 1] }
                }
                transition={
                  shouldReduceMotion
                    ? { duration: 0.4 }
                    : { repeat: Infinity, duration: 2.2, ease: "easeInOut" }
                }
              >
                <span className="material-symbols-outlined">recycling</span>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Sidebar Widgets */}
          <motion.div
            className="flex flex-col gap-8"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
          >
            {/* Collection Schedule Widget */}
            <motion.div
              variants={fadeUp}
              {...hoverLift}
              className="p-6 rounded-xl bg-white shadow-sm border border-black/5"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg" style={{ backgroundColor: "rgba(102,169,57,0.18)", color: BRAND.primary }}>
                  <span className="material-symbols-outlined">
                    <MdOutlineCalendarMonth />
                  </span>
                </div>

                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: BRAND.mid }}>
                  Próxima recolección
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-bold">Calendario de recolección</h3>
                <p style={{ color: BRAND.primary }} className="font-medium">
                  En 2 días
                </p>
              </div>

              <div className="mt-6 space-y-3">
                <motion.div
                  whileHover={shouldReduceMotion ? undefined : { x: 4 }}
                  className="flex items-center gap-3 p-3 rounded-lg border-l-4"
                  style={{ backgroundColor: BRAND.light, borderLeftColor: BRAND.primary }}
                >
                  <span className="material-symbols-outlined" style={{ color: BRAND.primary }}>
                    <MdDelete />
                  </span>
                  <div>
                    <p className="text-xs font-bold">Residuos generales</p>
                    <p className="text-sm opacity-70">Martes, 24 de Oct</p>
                  </div>
                </motion.div>

                {/* Mantengo azul para diferenciar material */}
                <motion.div
                  whileHover={shouldReduceMotion ? undefined : { x: 4 }}
                  className="flex items-center gap-3 p-3 bg-[#f6f8f6] rounded-lg border-l-4 border-blue-400"
                >
                  <span className="material-symbols-outlined text-blue-400">
                    <MdRestoreFromTrash />
                  </span>
                  <div>
                    <p className="text-xs font-bold">Papel y plástico</p>
                    <p className="text-sm opacity-70">Jueves, 26 de Oct</p>
                  </div>
                </motion.div>
              </div>

              <motion.button
                whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                className="w-full mt-6 py-3 rounded-full text-sm font-bold transition-all"
                style={{ backgroundColor: BRAND.light2, color: BRAND.dark }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = BRAND.primary;
                  e.currentTarget.style.color = "white";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = BRAND.light2;
                  e.currentTarget.style.color = BRAND.dark;
                }}
              >
                Ver calendario completo
              </motion.button>
            </motion.div>

            {/* Eco-Points Dashboard */}
            <motion.div
              variants={fadeUp}
              whileHover={shouldReduceMotion ? undefined : { y: -4 }}
              className="p-6 rounded-xl text-white shadow-lg"
              style={{
                backgroundColor: BRAND.primary,
                boxShadow: `0 16px 40px rgba(102,169,57,0.25)`,
              }}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-lg">Tu impacto</h3>
                <span className="material-symbols-outlined text-3xl">
                  <MdWorkspacePremium />
                </span>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1 font-bold">
                  <span>Nivel Hoja</span>
                  <span>
                    <motion.span>{pointsText}</motion.span> / {maxPoints} pts
                  </span>
                </div>

                <div className="w-full h-3 bg-white/30 rounded-full overflow-hidden">
                  <motion.div className="h-full bg-white rounded-full" style={{ width }} />
                </div>

                <p className="mt-2 text-xs font-black uppercase tracking-widest opacity-90">
                  Progreso: <motion.span>{progressText}</motion.span>%
                </p>
              </div>

              <p className="text-sm font-medium opacity-90 mb-4">
                Este mes ahorraste <span className="font-bold">12,4 kg de CO₂</span>. ¡Seguí así!
              </p>

              <motion.button
                whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                className="w-full py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all"
                style={{ backgroundColor: "rgba(255,255,255,0.20)" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.35)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.20)")}
              >
                Canjear recompensas
              </motion.button>
            </motion.div>
          </motion.div>
        </section>

        {/* Recycling Guides Section */}
        <section className="py-16">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4"
          >
            <motion.div variants={fadeUp}>
              <h2 className="text-3xl font-black tracking-tight">Guías de reciclaje</h2>
              <p className="opacity-70 mt-2">
                Aprendé a reciclar mejor con consejos claros y prácticos.
              </p>
            </motion.div>

            <motion.a
              variants={fadeUp}
              className="font-bold hover:underline flex items-center gap-1"
              style={{ color: BRAND.primary }}
              href="#"
              whileHover={shouldReduceMotion ? undefined : { x: 3 }}
            >
              Explorar todas{" "}
              <span className="material-symbols-outlined">
                <MdOutlineArrowForward />
              </span>
            </motion.a>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <motion.div variants={fadeUp} {...hoverLift} className="group cursor-pointer">
              <div
                className="h-64 rounded-xl bg-cover bg-center mb-4 overflow-hidden relative"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCttHX4wJ2N62uXxiUzBphXkreBQPmu-LzSOhZ8euU03SZzCnyXqJxwknPeDMGWiMuC0g1PP2tekDXoNbuFTBuLnOMRdF4bISE1YSI-smgj2teE9uHUL3BcSv0yCFiB1BkyWbFKpBRDcrGketw_UUe9kbljFpOmrWrO3Ft7WbEKp1RV2mKZCI07coieLWvyG5-vhbhI6CzZrNLOVEyDTqDEcJOrltX-aNWcHwpaxwJvjsHpuqObHTKizTvFmNBHS5sFsl6idGHIEgf8")',
                }}
                aria-label="Ilustración de compostaje"
              >
                <div
                  className="absolute inset-0 group-hover:opacity-0 transition-opacity"
                  style={{ backgroundColor: "rgba(102,169,57,0.18)" }}
                />
              </div>
              <h4 className="text-xl font-bold mb-2">Compostaje 101</h4>
              <p className="text-sm opacity-70">Convertí restos orgánicos en abono para tus plantas.</p>
            </motion.div>

            <motion.div variants={fadeUp} {...hoverLift} className="group cursor-pointer">
              <div
                className="h-64 rounded-xl bg-cover bg-center mb-4 overflow-hidden relative"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAT6v0nVaKsJCKHmCowBQkl9BxVpoccyh6LcMlPJmtX2NQq73PKnKKsfqv8JVAs3tovtopWIzDMGO58XlMQvsPobXy3mtZ0gvIWFVmq3yOjNmMGlRTImjNq6ZNmUIEl5jhA6xMNk4_8de75SaO6TYdpsfoWDRW6VqudXRzmUtXhOK4B4WujwKBNhbN7qHycGacwjnkUKNTJtFtvBjS9ZOW8MMHq4cMlrQqKtzrnCx_zfOuF9OevtyrThi2ouMUPAa0SXGkfsdF02Opa")',
                }}
                aria-label="Separación de plásticos"
              >
                <div className="absolute inset-0 bg-blue-400/20 group-hover:bg-blue-400/0 transition-colors" />
              </div>
              <h4 className="text-xl font-bold mb-2">Plásticos: qué sí y qué no</h4>
              <p className="text-sm opacity-70">Aprendé qué tipos de plástico se pueden reciclar en tu zona.</p>
            </motion.div>

            <motion.div variants={fadeUp} {...hoverLift} className="group cursor-pointer">
              <div
                className="h-64 rounded-xl bg-cover bg-center mb-4 overflow-hidden relative"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDioWIYAq7wAXeWfxSRv8hvG77bVqW7enIFdJVtSL_vQN59esWzoZsKEHLlvYvc_mU9gDnwrZhf2EMEarOnelFeidJlCq1y4_y13eh8G1iHUSpOgL14NeBIPxOcTxU8qvvd_1U7PRy-dLgXJv3ewbcuOhaOxRlp_NeCb3tk_1hgZY24wGYkt29vdahZaRy5l47kU3KgpckbmZT5Djuh6hmx3HFA6VTfmByFU68k-2etDfaLRCp42Ym4s6pDfqkXwV2PZFQ-JmtfNM4M")',
                }}
                aria-label="Residuos electrónicos"
              >
                <div className="absolute inset-0 bg-yellow-400/20 group-hover:bg-yellow-400/0 transition-colors" />
              </div>
              <h4 className="text-xl font-bold mb-2">Residuos electrónicos</h4>
              <p className="text-sm opacity-70">Cómo desechar pilas, baterías y aparatos sin contaminar.</p>
            </motion.div>
          </motion.div>
        </section>

        {/* Report Issue Section */}
        <section className="py-10">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="text-white rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden shadow-2xl"
            style={{ backgroundColor: BRAND.dark }}
          >
            <motion.div
              className="absolute top-0 right-0 w-64 h-64 -translate-y-1/2 translate-x-1/2"
              style={{
                backgroundColor: "rgba(102,169,57,0.18)",
                borderRadius: "60% 40% 70% 30% / 40% 50% 60% 40%",
              }}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={viewportOnce}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-black mb-4">Sé los ojos de la comunidad</h2>

                <p className="opacity-80 text-lg mb-8">
                  ¿Viste un contenedor lleno o un basural? Reportalo al instante y ganá{" "}
                  <span style={{ color: BRAND.primary }} className="font-bold">
                    50 Eco-Puntos
                  </span>{" "}
                  cuando se verifique.
                </p>

                <motion.button
                  whileHover={shouldReduceMotion ? undefined : { scale: 1.04 }}
                  whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                  className="h-14 px-10 rounded-full font-bold flex items-center gap-2"
                  style={{ backgroundColor: BRAND.primary, color: "white" }}
                >
                  <span className="material-symbols-outlined">
                    <MdOutlineReport />
                  </span>
                  Enviar reporte rápido
                </motion.button>
              </div>

              <motion.div
                variants={fade}
                initial="hidden"
                whileInView="show"
                viewport={viewportOnce}
                className="hidden lg:block"
              >
                <div className="p-6 bg-white/10 rounded-3xl border border-white/10">
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className="size-12 rounded-2xl flex items-center justify-center"
                      style={{ backgroundColor: "rgba(102,169,57,0.18)", color: BRAND.primary }}
                    >
                      <span className="material-symbols-outlined">
                        <MdVerifiedUser />
                      </span>
                    </div>

                    <div>
                      <p className="font-bold">¡Reporte reciente solucionado!</p>
                      <p className="text-xs opacity-60">
                        Contenedor desbordado en calle Maple, limpio hace 2 h.
                      </p>
                    </div>
                  </div>

                  <div className="flex -space-x-3">
                    <div
                      className="size-8 rounded-full border-2 bg-cover"
                      style={{
                        borderColor: BRAND.dark,
                        backgroundImage:
                          "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDujJayuDcmSIIRCjBgP3-8w7s_g9ByXtyoLvXG7bKdstuyUuMp2HzkK0gwOSzZtZ4jNOYE6l_wNIunY0PMA2eyWbKvci7gqm7DWCRKnwN4QFqCv9cXs3e88LrIsHwGLnF4n7ZZM3dXJAK890j3aBqFgB6UvhikwSNXL8QWcucVpzit5wGWtDJLf21xqQXSRb95Xoeoie_JkMzoztBPqZdVqK3nbcJw8_nrZ3Yohhbepwm3F4ZSN7-ma5rmeCpnRejiUAAsEACl6y1P')",
                      }}
                    />
                    <div
                      className="size-8 rounded-full border-2 bg-cover"
                      style={{
                        borderColor: BRAND.dark,
                        backgroundImage:
                          "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDgbX9TlWynOH6ojsdVlYp7qMDVdi-meTLsNiTMRuLKpqpRrRAtRl87auq2z3qMlEVRBLpeqxiH3Ktl4Q6U91HjFTqBptoDnClxc0hs8SXfD9vQrbz5Y6A0QwTSZsxbxVTGkYWAG1nEsG-OyAuy60Xi8rSfiyTn5HbJw98mRiyL8z2ZektMHF4_YQFVgI4IJF8ho0in6pkFFLL78lZdos-L0gpJ8hDRgBgQd2clm3DpAm3JRZn-3kb4isSond12VfsG9Jo9Ap1H4TwF')",
                      }}
                    />
                    <div
                      className="size-8 rounded-full border-2 flex items-center justify-center text-[10px] font-bold"
                      style={{ borderColor: BRAND.dark, backgroundColor: BRAND.primary, color: "white" }}
                    >
                      +12
                    </div>
                  </div>

                  <p className="text-[10px] mt-2 opacity-50 uppercase font-black">
                    Vecinos contribuyeron a esta limpieza
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>
      </main>

      <style>{`
        .organic-shape { border-radius: 60% 40% 70% 30% / 40% 50% 60% 40%; }
      `}</style>
    </div>
  );
}
