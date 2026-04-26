import { Suspense } from "react";
import { useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AppRoutes from "./Router";
import Footer from "./components/Footer";
import Header from "./components/Header";
import LoadingState from "./components/ui/LoadingState";

function App() {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <div className="min-h-screen">
      {!isAdmin && <Header />}

      <main className="mx-auto">
        <Suspense
          fallback={
            <div className="mx-auto max-w-7xl px-6 py-10 md:px-8">
              <LoadingState
                title="Cargando sección"
                description="Esperá un momento mientras preparamos esta vista de EcoRG."
              />
            </div>
          }
        >
          <AppRoutes />
        </Suspense>
      </main>

      {!isAdmin && <Footer />}

      <ToastContainer
        position="top-right"
        autoClose={3200}
        hideProgressBar
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="light"
        toastClassName={() =>
          "!min-h-0 !rounded-2xl !border !border-[#d8e7c5] !bg-white !px-3 !py-3 !text-sm !text-slate-700 !shadow-[0_18px_40px_rgba(59,89,34,0.14)]"
        }
        bodyClassName={() => "!m-0 !p-0 !font-medium"}
        className="!py-2"
      />
    </div>
  );
}

export default App;
