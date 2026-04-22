import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/admin/PrivateRoute";
import { ConfigProvider } from "./context/ConfigContext";

import { lazy, Suspense } from "react";

import "./styles/global.css";
import "./styles/animations.css";

// ================= LAZY LOADING =================

// Públicas
const Home           = lazy(() => import("./pages/Home"));
const SobrePage      = lazy(() => import("./pages/Sobre"));
const CultosPage     = lazy(() => import("./pages/Cultos"));
const Ministerio     = lazy(() => import("./pages/Ministerio"));
const EventosPage    = lazy(() => import("./pages/Eventos"));
const EventoPage     = lazy(() => import("./pages/Evento"));
const ReciclagemPage = lazy(() => import("./pages/Reciclagem"));

// Admin
const AdminConfig         = lazy(() => import("./pages/AdminConfig"));
const Login               = lazy(() => import("./pages/admin/Login"));
const Dashboard           = lazy(() => import("./pages/admin/Dashboard"));
const AdminEventos        = lazy(() => import("./pages/admin/Eventos"));
const AdminMinisterios    = lazy(() => import("./pages/admin/Ministerios"));
const AdminAvisos         = lazy(() => import("./pages/admin/Avisos"));
const AdminCultos         = lazy(() => import("./pages/admin/Cultos"));
const AdminCultosGaleria  = lazy(() => import("./pages/admin/AdminCultosGaleria"));
const AdminEndereco       = lazy(() => import("./pages/admin/Endereco"));
const AdminSobre          = lazy(() => import("./pages/admin/Sobre"));
const AdminReciclagem     = lazy(() => import("./pages/admin/Reciclagem"));
const AdminLive           = lazy(() => import("./pages/admin/Live"));
const AdminHero           = lazy(() => import("./pages/admin/Hero"));
const AdminOracao         = lazy(() => import("./pages/admin/Oracao"));
const AdminTestemunhos    = lazy(() => import("./pages/admin/Testemunhos"));

// ================= LOADING =================

function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-4 border-blue-900 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-500">Carregando…</p>
      </div>
    </div>
  );
}

// ================= 404 =================

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="text-center max-w-md">
        <p className="text-7xl font-bold text-blue-900 mb-4">404</p>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Página não encontrada</h2>
        <p className="text-gray-500 mb-8">
          O link que você acessou não existe ou foi removido.
        </p>
        <a
          href="/"
          className="inline-flex items-center gap-2 bg-blue-900 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-800 transition"
        >
          &larr; Voltar para o início
        </a>
      </div>
    </div>
  );
}

// ================= APP =================

export default function App() {
  return (
    <AuthProvider>
      <ConfigProvider>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <ScrollToTop />
          <Suspense fallback={<Loading />}>
            <Routes>

              {/* ================= PUBLIC ================= */}
              <Route path="/"                element={<Home />} />
              <Route path="/sobre"           element={<SobrePage />} />
              <Route path="/cultos"          element={<CultosPage />} />
              <Route path="/ministerio/:id"  element={<Ministerio />} />
              <Route path="/eventos"         element={<EventosPage />} />
              <Route path="/evento/:id"      element={<EventoPage />} />
              <Route path="/reciclagem"      element={<ReciclagemPage />} />

              {/* ================= ADMIN ================= */}
              <Route path="/admin"           element={<Navigate to="/admin/login" replace />} />
              <Route path="/admin/login"     element={<Login />} />

              <Route path="/admin/dashboard"        element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/admin/hero"             element={<PrivateRoute><AdminHero /></PrivateRoute>} />
              <Route path="/admin/cultos"           element={<PrivateRoute><AdminCultos /></PrivateRoute>} />
              <Route path="/admin/cultos/galeria"   element={<PrivateRoute><AdminCultosGaleria /></PrivateRoute>} />
              <Route path="/admin/eventos"          element={<PrivateRoute><AdminEventos /></PrivateRoute>} />
              <Route path="/admin/avisos"           element={<PrivateRoute><AdminAvisos /></PrivateRoute>} />
              <Route path="/admin/ministerios"      element={<PrivateRoute><AdminMinisterios /></PrivateRoute>} />
              <Route path="/admin/endereco"         element={<PrivateRoute><AdminEndereco /></PrivateRoute>} />
              <Route path="/admin/sobre"            element={<PrivateRoute><AdminSobre /></PrivateRoute>} />
              <Route path="/admin/reciclagem"       element={<PrivateRoute><AdminReciclagem /></PrivateRoute>} />
              <Route path="/admin/live"             element={<PrivateRoute><AdminLive /></PrivateRoute>} />
              <Route path="/admin/oracao"           element={<PrivateRoute><AdminOracao /></PrivateRoute>} />
              <Route path="/admin/testemunhos"      element={<PrivateRoute><AdminTestemunhos /></PrivateRoute>} />
              <Route path="/admin/config"           element={<PrivateRoute><AdminConfig /></PrivateRoute>} />

              {/* ================= 404 ================= */}
              <Route path="*" element={<NotFound />} />

            </Routes>
          </Suspense>
        </BrowserRouter>
      </ConfigProvider>
    </AuthProvider>
  );
}
