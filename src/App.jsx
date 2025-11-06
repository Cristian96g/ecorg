import { Suspense } from "react";
import AppRoutes from "./Router";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith("/admin");
  return (
    <div className="min-h-screen">
       {!isAdmin && <Header />}
      <main className=" mx-auto">
        <Suspense fallback={<div>Loading...</div>}>
          <AppRoutes />
        </Suspense>
      </main>
      {!isAdmin && <Footer />}
       {/* ✅ Contenedor global de notificaciones */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="colored"
       className="!py-0"
      />
    </div>
  );
}
export default App;