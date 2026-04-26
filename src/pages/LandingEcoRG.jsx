// src/pages/LandingEcoRG.jsx
// ✅ React version (JSX) del HTML que pasaste.
// Nota: para que los íconos Material Symbols se vean, agregá el <link> en tu index.html (te lo dejo al final).
import { FiCalendar, FiTrash2  } from 'react-icons/fi';
import { LuArchiveRestore } from "react-icons/lu";
import { MdOutlineWorkspacePremium } from "react-icons/md";
import { MdOpenInFull } from "react-icons/md";
import { IoArrowForward } from "react-icons/io5";

export default function LandingEcoRG() {
  return (
    <div className="bg-background-light  transition-colors duration-300 font-display">
      {/* TopNavBar */}
      <header className="sticky top-0 z-50 bg-white/80  backdrop-blur-md border-b border-solid border-[#f0f4f2]  px-6 lg:px-40 py-3">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="size-10 bg-primary flex items-center justify-center rounded-xl text-white">
                <span className="material-symbols-outlined">eco</span>
              </div>
              <h2 className="text-[#111813]  text-xl font-black leading-tight tracking-tight">
                EcoRG
              </h2>
            </div>

            <nav className="hidden md:flex items-center gap-8">
              <a
                className="text-[#111813]  text-sm font-medium hover:text-primary transition-colors"
                href="#"
              >
                Home
              </a>
              <a
                className="text-[#111813]  text-sm font-medium hover:text-primary transition-colors"
                href="#"
              >
                Map
              </a>
              <a
                className="text-[#111813]  text-sm font-medium hover:text-primary transition-colors"
                href="#"
              >
                Schedule
              </a>
              <a
                className="text-[#111813]  text-sm font-medium hover:text-primary transition-colors"
                href="#"
              >
                Guides
              </a>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <label className="hidden sm:flex min-w-40 h-10">
              <div className="flex w-full items-stretch rounded-full bg-[#f0f4f2]  px-4 overflow-hidden">
                <div className="flex items-center justify-center text-[#61896f] ">
                  <span className="material-symbols-outlined text-[20px]">
                    search
                  </span>
                </div>
                <input
                  className="w-full border-none bg-transparent focus:ring-0 text-sm placeholder:text-[#61896f]"
                  placeholder="Search city points..."
                />
              </div>
            </label>

            <button className="flex h-10 px-6 cursor-pointer items-center justify-center rounded-full bg-primary text-[#111813] text-sm font-bold hover:opacity-90 transition-all">
              Join Now
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-6 lg:px-10 pb-20">
        {/* HeroSection */}
        <section className="py-10">
          <div className="relative overflow-hidden rounded-xl">
            <div
              className="flex min-h-[520px] flex-col gap-6 bg-cover bg-center items-center justify-center p-8 text-center"
              aria-label="Modern green city with sustainable waste management"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(16, 34, 22, 0.7), rgba(16, 34, 22, 0.4)), url("https://lh3.googleusercontent.com/aida-public/AB6AXuDYpe8xb0qD_84reQQxfkwr-He0asdRprtxgKoF6m4IC_xYFWlFjXNsKJy0owaSN_NXkebkA5n2KFV091lvcpkvIBz7Wfw5SK0eD_e5pocmk26EidhUZ2RBrjjkMb2oSCm5h4K0Je_uN_OsxdhNOerBt2gWrQivrCuLJwmHm1WjsX1hYgpn5NrWusBxshWbY-Uq2vwBLgmy0xnxB6nuWv3I3B859AgElgYFVUerypkeIKQIrX_FzGj3NgeaKcg9JF9l_2X8SzMHhxo_")',
              }}
            >
              <div className="flex flex-col gap-4 max-w-2xl">
                <h1 className="text-white text-4xl md:text-6xl font-black leading-tight tracking-tight">
                  Transforming your waste into a greener future.
                </h1>
                <p className="text-white/90 text-lg md:text-xl font-light">
                  Recycle easily, find recycling points, learn how to recycle,
                  and help keep the city clean.
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-4 mt-4">
                <button className="flex h-12 px-8 cursor-pointer items-center justify-center rounded-full bg-primary text-[#111813] text-base font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
                  Find Nearest Point
                </button>
                <button className="flex h-12 px-8 cursor-pointer items-center justify-center rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20 text-base font-bold hover:bg-white/20 transition-all">
                  How it Works
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Map and Schedule Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 py-10">
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-2xl font-bold tracking-tight ">
                Recycling Points Near You
              </h2>
              <span className="text-primary text-sm font-bold flex items-center gap-1 cursor-pointer">
                Full Screen{" "}
                <span className="material-symbols-outlined text-sm">
                  <MdOpenInFull />
                </span>
              </span>
            </div>

            {/* Map */}
            <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-xl border-4 border-white ">
              <div
                className="absolute inset-0 bg-cover bg-center"
                aria-label="Interactive city map showing recycling centers"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB74VYDS3N87h6fbKoCf4nkfzTB5Mkd6bFn4toGOCx-gIfhnhlaq7xIK4B7XtxB-9f_8yRBh5vw4zJyx1ogdq25KUyWVXd2JQnHsMdTiK5Eg_zDFOBTnA2uzF7-_uRQpwgI_mYftRivH697HDSZpd49t5wqmLjpImEapZ-pFva4LJrx-xzwT7QgRc6_P-YCjWcPaq0O-DNwyr1BpPsKuHJ_iWI9r1UQvQHL0wgROjvEbe_iSy33zJ9wqn5KJH0YD2aSx_qq_K9ugK-c")',
                }}
              />

              {/* Markers Overlay */}
              <div className="absolute top-1/4 left-1/3 p-2 bg-primary text-white rounded-full shadow-lg cursor-pointer">
                <span className="material-symbols-outlined">recycling</span>
              </div>
              <div className="absolute bottom-1/3 right-1/4 p-2 bg-primary text-white rounded-full shadow-lg cursor-pointer">
                <span className="material-symbols-outlined">recycling</span>
              </div>
              <div className="absolute top-1/2 right-1/2 p-2 bg-primary text-white rounded-full shadow-lg animate-bounce cursor-pointer">
                <span className="material-symbols-outlined">recycling</span>
              </div>
            </div>
          </div>

          {/* Sidebar Widgets */}
          <div className="flex flex-col gap-8">
            {/* Collection Schedule Widget */}
            <div className="p-6 rounded-xl bg-white  shadow-sm border border-black/5 ">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-primary/20 rounded-lg text-primary">
                  <span className="material-symbols-outlined">
                    <FiCalendar size={24} color="blue" />
                  </span>
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#61896f] ">
                  Next Pickup
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-bold">Collection Schedule</h3>
                <p className="text-primary font-medium">Coming in 2 days</p>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 p-3 bg-background-light  rounded-lg border-l-4 border-primary">
                  <span className="material-symbols-outlined text-primary">
                    <FiTrash2 />
                  </span>
                  <div>
                    <p className="text-xs font-bold">General Waste</p>
                    <p className="text-sm opacity-70">Tuesday, Oct 24</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-background-light  rounded-lg border-l-4 border-blue-400">
                  <span className="material-symbols-outlined text-blue-400">
                    <LuArchiveRestore />
                  </span>
                  <div>
                    <p className="text-xs font-bold">Paper &amp; Plastic</p>
                    <p className="text-sm opacity-70">Thursday, Oct 26</p>
                  </div>
                </div>
              </div>

              <button className="w-full mt-6 py-3 rounded-full bg-[#f0f4f2]  text-sm font-bold hover:bg-primary hover:text-gray-900 transition-all">
                View Full Calendar
              </button>
            </div>

            {/* Eco-Points Dashboard */}
            <div className="p-6 rounded-xl bg-[#032103] text-white shadow-lg shadow-primary/20">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-lg">Your Impact</h3>
                <span className="material-symbols-outlined text-3xl">
                  <MdOutlineWorkspacePremium />
                </span>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1 font-bold">
                  <span>Leaf Tier</span>
                  <span>840 / 1000 pts</span>
                </div>
                <div className="w-full h-3 bg-black/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full"
                    style={{ width: "84%" }}
                  />
                </div>
              </div>

              <p className="text-sm font-medium opacity-80 mb-4">
                You've saved 12.4kg of CO2 this month! Keep it up, hero.
              </p>

              <button className="w-full py-2 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full text-xs font-black uppercase tracking-widest transition-all">
                Claim Rewards
              </button>
            </div>
          </div>
        </section>

        {/* Recycling Guides Section */}
        <section className="py-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="text-3xl font-black tracking-tight">
                Recycling Guides
              </h2>
              <p className="opacity-70 mt-2">
                Master the art of sustainability with our expert tips.
              </p>
            </div>

            <a className="text-primary font-bold hover:underline flex items-center gap-1" href="#">
              Explore all guides{" "}
              <span className="material-symbols-outlined"><IoArrowForward /></span>
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Guide Card 1 */}
            <div className="group cursor-pointer">
              <div
                className="h-64 rounded-xl bg-cover bg-center mb-4 transition-transform group-hover:-translate-y-2 duration-500 overflow-hidden relative"
                aria-label="Abstract composting illustration"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCttHX4wJ2N62uXxiUzBphXkreBQPmu-LzSOhZ8euU03SZzCnyXqJxwknPeDMGWiMuC0g1PP2tekDXoNbuFTBuLnOMRdF4bISE1YSI-smgj2teE9uHUL3BcSv0yCFiB1BkyWbFKpBRDcrGketw_UUe9kbljFpOmrWrO3Ft7WbEKp1RV2mKZCI07coieLWvyG5-vhbhI6CzZrNLOVEyDTqDEcJOrltX-aNWcHwpaxwJvjsHpuqObHTKizTvFmNBHS5sFsl6idGHIEgf8")',
                }}
              >
                <div className="absolute inset-0 bg-primary/20 group-hover:bg-primary/0 transition-colors" />
              </div>
              <h4 className="text-xl font-bold mb-2">Composting 101</h4>
              <p className="text-sm opacity-70">
                Turn your kitchen scraps into black gold for your garden.
              </p>
            </div>

            {/* Guide Card 2 */}
            <div className="group cursor-pointer">
              <div
                className="h-64 rounded-xl bg-cover bg-center mb-4 transition-transform group-hover:-translate-y-2 duration-500 overflow-hidden relative"
                aria-label="Sorting plastics into colorful bins"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAT6v0nVaKsJCKHmCowBQkl9BxVpoccyh6LcMlPJmtX2NQq73PKnKKsfqv8JVAs3tovtopWIzDMGO58XlMQvsPobXy3mtZ0gvIWFVmq3yOjNmMGlRTImjNq6ZNmUIEl5jhA6xMNk4_8de75SaO6TYdpsfoWDRW6VqudXRzmUtXhOK4B4WujwKBNhbN7qHycGacwjnkUKNTJtFtvBjS9ZOW8MMHq4cMlrQqKtzrnCx_zfOuF9OevtyrThi2ouMUPAa0SXGkfsdF02Opa")',
                }}
              >
                <div className="absolute inset-0 bg-blue-400/20 group-hover:bg-blue-400/0 transition-colors" />
              </div>
              <h4 className="text-xl font-bold mb-2">Plastic Hierarchy</h4>
              <p className="text-sm opacity-70">
                Learn which plastics are truly recyclable in your local area.
              </p>
            </div>

            {/* Guide Card 3 */}
            <div className="group cursor-pointer">
              <div
                className="h-64 rounded-xl bg-cover bg-center mb-4 transition-transform group-hover:-translate-y-2 duration-500 overflow-hidden relative"
                aria-label="Old electronic parts and circuits"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDioWIYAq7wAXeWfxSRv8hvG77bVqW7enIFdJVtSL_vQN59esWzoZsKEHLlvYvc_mU9gDnwrZhf2EMEarOnelFeidJlCq1y4_y13eh8G1iHUSpOgL14NeBIPxOcTxU8qvvd_1U7PRy-dLgXJv3ewbcuOhaOxRlp_NeCb3tk_1hgZY24wGYkt29vdahZaRy5l47kU3KgpckbmZT5Djuh6hmx3HFA6VTfmByFU68k-2etDfaLRCp42Ym4s6pDfqkXwV2PZFQ-JmtfNM4M")',
                }}
              >
                <div className="absolute inset-0 bg-yellow-400/20 group-hover:bg-yellow-400/0 transition-colors" />
              </div>
              <h4 className="text-xl font-bold mb-2">Electronic Waste</h4>
              <p className="text-sm opacity-70">
                Safely dispose of your old batteries and broken gadgets.
              </p>
            </div>
          </div>
        </section>

        {/* Report Issue Section */}
        <section className="py-10">
          <div className="bg-background-dark rounded-xl  text-white  bg-[#032103] p-8 md:p-12 relative overflow-hidden">
            {/* Organic shape decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 organic-shape -translate-y-1/2 translate-x-1/2" />

            <div className="relative z-10 max-w-3xl">
              <h2 className="text-3xl font-black mb-4">Report an Issue</h2>
              <p className="opacity-80 text-lg mb-8">
                Notice a full bin or trash accumulation? Let us know and we'll
                send a team to clean it up.
              </p>

              <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <label className="block">
                    <span className="text-xs font-bold uppercase tracking-widest opacity-60">
                      Location
                    </span>
                    <input
                      className="mt-1 block w-full rounded-full border-none bg-white/10  focus:ring-primary h-12 px-6"
                      placeholder="Street address or GPS"
                      type="text"
                    />
                  </label>

                  <label className="block">
                    <span className="text-xs font-bold uppercase tracking-widest opacity-60">
                      Issue Type
                    </span>
                    <select className="mt-1 block w-full rounded-full border-none bg-white/10  focus:ring-primary h-12 px-6">
                      <option>Full Recycling Bin</option>
                      <option>Illegal Dumping</option>
                      <option>Missed Collection</option>
                      <option>Other</option>
                    </select>
                  </label>
                </div>

                <div className="space-y-4">
                  <label className="block h-full">
                    <span className="text-xs font-bold uppercase tracking-widest opacity-60">
                      Details
                    </span>
                    <textarea
                      className="mt-1 block w-full rounded-xl border-none bg-white/10  focus:ring-primary h-28 px-6 py-4"
                      placeholder="Describe the situation..."
                    />
                  </label>
                </div>

                <div className="md:col-span-2 mt-4">
                  <button className="w-full md:w-auto h-12 px-12 rounded-full bg-[#ffffff] text-[#111813] font-bold hover:scale-105 transition-transform">
                    Submit Report
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white  border-[#f0f4f2]  py-12 px-6 lg:px-40">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="size-8 bg-primary flex items-center justify-center rounded-lg text-white">
                <span className="material-symbols-outlined text-sm">eco</span>
              </div>
              <h2 className="text-[#111813]  text-lg font-black tracking-tight">
                EcoRG
              </h2>
            </div>
            <p className="text-sm opacity-60 max-w-sm">
              Dedicated to making cities cleaner and more sustainable through
              community-driven data and smart recycling solutions.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="text-sm space-y-2 opacity-60">
              <li>
                <a className="hover:text-primary transition-colors" href="#">
                  Find Bins
                </a>
              </li>
              <li>
                <a className="hover:text-primary transition-colors" href="#">
                  Recycling Guides
                </a>
              </li>
              <li>
                <a className="hover:text-primary transition-colors" href="#">
                  Report Issue
                </a>
              </li>
              <li>
                <a className="hover:text-primary transition-colors" href="#">
                  Leaderboard
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Connect</h4>
            <ul className="text-sm space-y-2 opacity-60">
              <li>
                <a className="hover:text-primary transition-colors" href="#">
                  Twitter
                </a>
              </li>
              <li>
                <a className="hover:text-primary transition-colors" href="#">
                  Instagram
                </a>
              </li>
              <li>
                <a className="hover:text-primary transition-colors" href="#">
                  Contact Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-[1200px] mx-auto mt-12 pt-8 border-t border-[#f0f4f2] flex flex-col md:flex-row justify-between items-center gap-4 text-xs opacity-40 font-medium">
          <p>© 2024 EcoRG Project. Made for a cleaner tomorrow.</p>
          <div className="flex gap-6">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
