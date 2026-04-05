import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/admin/PrivateRoute";
import { ConfigProvider } from "./context/ConfigContext";

import Home from "./pages/Home";
import SobrePage from "./pages/Sobre";
import Ministerio from "./pages/Ministerio";
import EventosPage from "./pages/Eventos";
import EventoPage from "./pages/Evento";

import AdminConfig from "./pages/AdminConfig";
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import AdminEventos from "./pages/admin/Eventos";
import AdminMinisterios from "./pages/admin/Ministerios";
import AdminAvisos from "./pages/admin/Avisos";
import AdminCultos from "./pages/admin/Cultos";
import AdminEndereco from "./pages/admin/Endereco";
import AdminSobre from "./pages/admin/Sobre";
import AdminReciclagem from "./pages/admin/Reciclagem";
import AdminLive from "./pages/admin/Live";
import AdminHero from "./pages/admin/Hero";

import "./styles/global.css";
import "./styles/animations.css";

export default function App() {
  return (
    <AuthProvider>
      <ConfigProvider>
        <BrowserRouter>
          <Routes>
            {/* Públicas */}
            <Route path="/" element={<Home />} />
            <Route path="/sobre" element={<SobrePage />} />
            <Route path="/ministerio/:id" element={<Ministerio />} />
            <Route path="/eventos" element={<EventosPage />} />
            <Route path="/evento/:id" element={<EventoPage />} />

            {/* Atalho fácil: /admin redireciona ao login */}
            <Route path="/admin" element={<Navigate to="/admin/login" replace />} />

            {/* Admin — autenticação */}
            <Route path="/admin/login" element={<Login />} />

            {/* Admin — painéis protegidos */}
            <Route path="/admin/dashboard"   element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/admin/hero"         element={<PrivateRoute><AdminHero /></PrivateRoute>} />
            <Route path="/admin/cultos"       element={<PrivateRoute><AdminCultos /></PrivateRoute>} />
            <Route path="/admin/eventos"      element={<PrivateRoute><AdminEventos /></PrivateRoute>} />
            <Route path="/admin/avisos"       element={<PrivateRoute><AdminAvisos /></PrivateRoute>} />
            <Route path="/admin/ministerios"  element={<PrivateRoute><AdminMinisterios /></PrivateRoute>} />
            <Route path="/admin/endereco"     element={<PrivateRoute><AdminEndereco /></PrivateRoute>} />
            <Route path="/admin/sobre"        element={<PrivateRoute><AdminSobre /></PrivateRoute>} />
            <Route path="/admin/reciclagem"   element={<PrivateRoute><AdminReciclagem /></PrivateRoute>} />
            <Route path="/admin/live"         element={<PrivateRoute><AdminLive /></PrivateRoute>} />
            <Route path="/admin/config"       element={<PrivateRoute><AdminConfig /></PrivateRoute>} />
          </Routes>
        </BrowserRouter>
      </ConfigProvider>
    </AuthProvider>
  );
}
