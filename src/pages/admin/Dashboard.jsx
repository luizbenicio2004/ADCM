import { signOut } from "firebase/auth";
import { auth } from "../../services/firebase";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Home, LogOut } from "lucide-react";
import OptimizedImage from "../../components/OptimizedImage";

const SECOES = [
  {
    label: "Capa do Site",
    icon: "🖼️",
    path: "/admin/hero",
    descricao: "Mude o título, texto e foto de fundo da página inicial",
  },
  {
    label: "Horários de Culto",
    icon: "⛪",
    path: "/admin/cultos",
    descricao: "Adicione, edite ou remova os horários de culto",
  },
  {
    label: "Eventos",
    icon: "📅",
    path: "/admin/eventos",
    descricao: "Publique e gerencie os próximos eventos da igreja",
  },
  {
    label: "Avisos",
    icon: "📢",
    path: "/admin/avisos",
    descricao: "Comunique notícias, urgências e informações importantes",
  },
  {
    label: "Ministérios",
    icon: "🙌",
    path: "/admin/ministerios",
    descricao: "Gerencie os grupos e ministérios da igreja",
  },
  {
    label: "Endereço",
    icon: "📍",
    path: "/admin/endereco",
    descricao: "Atualize o endereço e o mapa exibidos no site",
  },
  {
    label: "Sobre a Igreja",
    icon: "✝️",
    path: "/admin/sobre",
    descricao: "Edite a história, missão, pastores e fotos da igreja",
  },
  {
    label: "Reciclagem",
    icon: "♻️",
    path: "/admin/reciclagem",
    descricao: "Atualize informações do programa de reciclagem",
  },
  {
    label: "Transmissão ao Vivo",
    icon: "🔴",
    path: "/admin/live",
    descricao: "Ative e coloque o link da live do YouTube no site",
  },
  {
    label: "Pedidos de Oração",
    icon: "🙏",
    path: "/admin/oracao",
    descricao: "Veja e gerencie os pedidos enviados pelos visitantes",
  },
  {
    label: "Configurações Gerais",
    icon: "⚙️",
    path: "/admin/config",
    descricao: "Nome da igreja, telefone, redes sociais e seções visíveis",
  },
];

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const primeiroNome = user?.email?.split("@")[0] ?? "pastor";

  async function handleLogout() {
    await signOut(auth);
    navigate("/admin/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <OptimizedImage src="/logo.webp" alt="Logo" className="w-10 h-10 rounded-full" />
          <div>
            <h1 className="font-bold text-gray-900 text-sm">Painel de Gerenciamento — ADCM Poá</h1>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-2 text-sm text-blue-900 border border-blue-900/30 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors font-medium"
          >
            <Home size={15} />
            Ver o site
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-sm text-red-600 hover:text-red-700 transition-colors"
          >
            <LogOut size={14} />
            Sair
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Olá, {primeiroNome}! 👋</h2>
        <p className="text-gray-500 mb-10">Escolha o que você quer atualizar no site:</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {SECOES.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="bg-white border border-gray-200 rounded-xl p-5 text-left hover:shadow-md hover:border-blue-200 hover:-translate-y-0.5 transition-all group"
            >
              <span className="text-3xl block mb-3">{item.icon}</span>
              <p className="font-semibold text-gray-900 text-sm mb-1 group-hover:text-blue-900 transition-colors">
                {item.label}
              </p>
              <p className="text-xs text-gray-400 leading-relaxed">{item.descricao}</p>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}