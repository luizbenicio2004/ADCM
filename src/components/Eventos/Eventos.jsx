import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";
import { useCollection } from "../../hooks/useCollection";

import OptimizedImage from "../OptimizedImage";

function formatarData(data) {
  if (!data) return "";
  try {
    const [ano, mes, dia] = data.split("-");
    return new Date(ano, mes - 1, dia).toLocaleDateString("pt-BR", {
      day: "2-digit", month: "long", year: "numeric",
    });
  } catch { return data; }
}

export default function Eventos() {
  
  const { data: todos = [], loading } = useCollection("eventos");

  const hoje = new Date().toISOString().split("T")[0];
  const proximos = todos
    .filter((e) => e.ativo !== false && (e.data ?? "") >= hoje)
    .sort((a, b) => (a.data ?? "").localeCompare(b.data ?? ""))
    .slice(0, 4);

  return (
    <section id="eventos" className="py-20 px-6 bg-white">
      <div className="max-w-[1100px] mx-auto">
        <div className="text-center max-w-[600px] mx-auto mb-12">
          <div className="w-12 h-[2px] bg-blue-900 mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Próximos Eventos</h2>
          <p className="text-gray-600">
            Momentos especiais que você não vai querer perder. Marque no calendário e traga alguém.
          </p>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 gap-6">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="rounded-xl border border-gray-200 overflow-hidden animate-pulse">
                <div className="h-44 bg-gray-200" />
                <div className="p-4 flex flex-col gap-2">
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : proximos.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Calendar size={40} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">Nenhum evento programado por enquanto.</p>
            <p className="text-sm mt-1">Fique de olho — novidades chegam em breve! 🙌</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-6">
            {proximos.map((evento, index) => (
              <Link
                key={evento.id}
                to={`/evento/${evento.id}`}
                className={`group rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-500
                  `}
              >
                {evento.fotoUrl ? (
                  <div className="aspect-[3/4] overflow-hidden">
                    <OptimizedImage
                      src={evento.fotoUrl}
                      alt={evento.titulo}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ) : (
                  <div className="h-44 bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center">
                    <Calendar size={40} className="text-white/30" />
                  </div>
                )}
                <div className="p-4 flex flex-col gap-1.5">
                  {evento.data && (
                    <span className="text-xs font-bold text-blue-900 uppercase tracking-wide">
                      📅 {formatarData(evento.data)}{evento.horario ? ` · ${evento.horario}` : ""}
                    </span>
                  )}
                  <h3 className="font-bold text-gray-900 leading-tight">{evento.titulo}</h3>
                  {evento.local && <p className="text-xs text-gray-400">📍 {evento.local}</p>}
                  <span className="text-xs font-semibold text-blue-900 mt-1">Ver detalhes →</span>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <Link to="/eventos"
            className="inline-flex items-center gap-2 text-sm font-bold text-blue-900 border border-blue-900/30 px-6 py-2.5 rounded-lg hover:bg-blue-50 transition">
            Ver todos os eventos →
          </Link>
        </div>
      </div>
    </section>
  );
}
