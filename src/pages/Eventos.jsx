import { useCollection } from "../hooks/useCollection";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar } from "lucide-react";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

function formatarData(data) {
  if (!data) return "";
  const [ano, mes, dia] = data.split("-");
  return new Date(ano, mes - 1, dia).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
}

export default function EventosPage() {
  const navigate = useNavigate();
  const { data: eventos, loading } = useCollection("eventos");

  const ativos = eventos.filter((e) => e.ativo !== false).sort((a, b) => (b.data ?? "").localeCompare(a.data ?? ""));

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white pb-20">
        <div className="bg-blue-900 text-white py-20 px-6 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="w-12 h-[2px] bg-white/40 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Eventos</h1>
            <p className="text-blue-200 text-lg">Fique por dentro do que está acontecendo na ADCM Poá</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-12 flex flex-col gap-8">
          <button onClick={() => navigate("/")}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-900 transition self-start">
            <ArrowLeft size={16} /> Voltar para a home
          </button>

          {loading ? (
            <div className="grid sm:grid-cols-2 gap-6">
              {Array(4).fill(0).map((_, i) => (
                <div key={i} className="rounded-xl border border-gray-200 overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-200" />
                  <div className="p-5 flex flex-col gap-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : ativos.length === 0 ? (
            <p className="text-gray-500 text-center py-16">Nenhum evento cadastrado ainda.</p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-6">
              {ativos.map((evento) => (
                <Link key={evento.id} to={`/evento/${evento.id}`}
                  className="group rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  {evento.fotoUrl ? (
                    <div className="h-48 overflow-hidden">
                      <img src={evento.fotoUrl} alt={evento.titulo}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  ) : (
                    <div className="h-48 bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center">
                      <Calendar size={48} className="text-white/30" />
                    </div>
                  )}
                  <div className="p-5 flex flex-col gap-2">
                    {evento.data && (
                      <span className="text-xs font-bold text-blue-900 uppercase tracking-wide">
                        📅 {formatarData(evento.data)}{evento.horario ? ` · ${evento.horario}` : ""}
                      </span>
                    )}
                    <h3 className="font-bold text-gray-900 text-lg leading-tight">{evento.titulo}</h3>
                    {evento.descricao && <p className="text-sm text-gray-600 line-clamp-2">{evento.descricao}</p>}
                    {evento.local && <p className="text-xs text-gray-400">📍 {evento.local}</p>}
                    <span className="text-xs font-semibold text-blue-900 mt-1">Ver detalhes →</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}