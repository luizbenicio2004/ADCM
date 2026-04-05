import { signOut } from "firebase/auth";
import { auth } from "../../services/firebase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await signOut(auth);
    navigate("/admin/login");
  }

  const itens = [
    { label: "Banner Principal", icon: "🖼️", path: "/admin/hero" },
    { label: "Cultos",           icon: "⛪",  path: "/admin/cultos" },
    { label: "Eventos",          icon: "📅",  path: "/admin/eventos" },
    { label: "Avisos",           icon: "📢",  path: "/admin/avisos" },
    { label: "Ministérios",      icon: "🙌",  path: "/admin/ministerios" },
    { label: "Endereço",         icon: "📍",  path: "/admin/endereco" },
    { label: "Sobre",            icon: "✝️",   path: "/admin/sobre" },
    { label: "Reciclagem",       icon: "♻️",  path: "/admin/reciclagem" },
    { label: "Live",             icon: "🔴",  path: "/admin/live" },
    { label: "Configurações",    icon: "⚙️",  path: "/admin/config" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Logo" className="w-10 h-10 rounded-full" />
          <div>
            <h1 className="font-bold text-gray-900 text-sm">Painel Admin — ADCM Poá</h1>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="text-sm text-red-600 hover:underline">Sair</button>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Bem-vindo!</h2>
        <p className="text-gray-500 mb-8">O que você quer gerenciar hoje?</p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {itens.map((item) => (
            <button key={item.label} onClick={() => navigate(item.path)}
              className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:shadow-md hover:-translate-y-1 transition-all">
              <span className="text-3xl block mb-2">{item.icon}</span>
              <span className="font-semibold text-gray-800 text-sm">{item.label}</span>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
