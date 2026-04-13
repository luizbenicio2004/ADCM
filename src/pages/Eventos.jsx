import { useEffect } from "react";
import { useCollection } from "../hooks/useCollection";
import { Link } from "react-router-dom";
import { ArrowLeft, Calendar } from "lucide-react";

import { useSEO } from "../hooks/useSEO";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import OptimizedImage from "../components/OptimizedImage";

// 🔥 Formatar data com segurança
function formatarData(data) {
  if (!data) return "";

  try {
    const [ano, mes, dia] = data.split("-");
    return new Date(ano, mes - 1, dia).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  } catch {
    return data;
  }
}

export default function EventosPage() {
  useSEO({ title: "Eventos", description: "Fique por dentro dos próximos eventos da ADCM Poá." });
  useEffect(() => { setTimeout(() => window.scrollTo(0, 0), 0); }, []);

  // 🔥 proteção caso venha undefined
  const { data = [], loading } = useCollection("eventos");

  // 🔥 filtrar + ordenar
  const hoje = new Date().toISOString().split("T")[0];
  const proximos = data.filter((e) => e.ativo !== false && (e.data ?? "") >= hoje)
    .sort((a, b) => (a.data ?? "").localeCompare(b.data ?? ""));
  const passados = data.filter((e) => e.ativo !== false && (e.data ?? "") < hoje)
    .sort((a, b) => (b.data ?? "").localeCompare(a.data ?? ""));
  const ativos = [...proximos, ...passados];

  return (
    <>
      <Header />

      <main className="min-h-screen bg-white pb-20">
        {/* 🔵 Hero */}
        <div className="bg-blue-900 text-white py-20 px-6 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="w-12 h-[2px] bg-white/40 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Eventos
            </h1>
            <p className="text-blue-200 text-lg">
              Fique por dentro do que está acontecendo na ADCM Poá
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-12 flex flex-col gap-8">

          {/* 🔙 Voltar */}
          <Link
            to="/#eventos"
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-900 transition self-start"
          >
            <ArrowLeft size={16} /> Voltar
          </Link>

          {/* ⏳ Loading */}
          {loading && (
            <div className="grid sm:grid-cols-2 gap-6">
              {Array(4)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-gray-200 overflow-hidden animate-pulse"
                  >
                    <div className="h-48 bg-gray-200" />
                    <div className="p-5 flex flex-col gap-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                ))}
            </div>
          )}

          {/* ❌ Vazio */}
          {!loading && ativos.length === 0 && (
            <p className="text-gray-500 text-center py-16">
              Nenhum evento por enquanto — fique de olho nas redes sociais! 🙏
            </p>
          )}

          {/* ✅ Lista */}
          {!loading && ativos.length > 0 && (
            <div className="grid sm:grid-cols-2 gap-6">
              {ativos.map((evento) => (
                <Link
                  key={evento.id}
                  to={`/evento/${evento.id}`}
                  className="group rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  {/* 📸 Imagem */}
                  {evento.fotoUrl ? (
                    <div className="aspect-[3/4] overflow-hidden">
                      <OptimizedImage
                        src={evento.fotoUrl}
                        alt={evento.titulo}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ) : (
                    <div className="h-48 bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center">
                      <Calendar size={48} className="text-white/30" />
                    </div>
                  )}

                  {/* 📄 Conteúdo */}
                  <div className="p-5 flex flex-col gap-2">
                    {evento.data && (
                      <span className="text-xs font-bold text-blue-900 uppercase tracking-wide">
                        📅 {formatarData(evento.data)}
                        {evento.horario && ` · ${evento.horario}`}
                      </span>
                    )}

                    <h3 className="font-bold text-gray-900 text-lg leading-tight">
                      {evento.titulo}
                    </h3>

                    {evento.descricao && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {evento.descricao}
                      </p>
                    )}

                    {evento.local && (
                      <p className="text-xs text-gray-400">
                        📍 {evento.local}
                      </p>
                    )}

                    <span className="text-xs font-semibold text-blue-900 mt-1">
                      Ver detalhes →
                    </span>
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