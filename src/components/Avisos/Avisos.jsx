import { useState } from "react";
import { Megaphone, Bell, AlertCircle, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { useCollection } from "../../hooks/useCollection";
import OptimizedImage from "../OptimizedImage";

const TIPO_CONFIG = {
  urgente: {
    border: "border-red-300",
    barra: "bg-gradient-to-r from-red-600 to-red-400",
    iconeBg: "bg-red-50 border-red-200 text-red-600",
    badge: "bg-red-100 text-red-700",
    icone: <AlertCircle size={18} />,
    label: "Urgente",
    fallbackBg: "from-red-700 to-red-500",
  },
  evento: {
    border: "border-blue-200",
    barra: "bg-gradient-to-r from-blue-700 to-blue-400",
    iconeBg: "bg-blue-50 border-blue-200 text-blue-700",
    badge: "bg-blue-100 text-blue-700",
    icone: <Calendar size={18} />,
    label: "Evento",
    fallbackBg: "from-blue-800 to-blue-600",
  },
  aviso: {
    border: "border-yellow-200",
    barra: "bg-gradient-to-r from-yellow-500 to-yellow-300",
    iconeBg: "bg-yellow-50 border-yellow-200 text-yellow-600",
    badge: "bg-yellow-100 text-yellow-700",
    icone: <Bell size={18} />,
    label: "Aviso",
    fallbackBg: "from-yellow-600 to-yellow-400",
  },
  info: {
    border: "border-blue-200",
    barra: "bg-gradient-to-r from-blue-600 to-blue-400",
    iconeBg: "bg-blue-50 border-blue-200 text-blue-600",
    badge: "bg-blue-100 text-blue-700",
    icone: <Megaphone size={18} />,
    label: "Informação",
    fallbackBg: "from-blue-700 to-blue-500",
  },
};

const DEFAULT_TIPO = TIPO_CONFIG.aviso;

export default function Avisos() {
  const { data: todosAvisos = [], loading } = useCollection("avisos");
  const avisos = todosAvisos.filter((a) => a.ativo !== false);
  const [filtroAtivo, setFiltroAtivo] = useState("todos");

  const FILTROS = [
    { key: "todos", label: "Todos" },
    { key: "urgente", label: "🚨 Urgente" },
    { key: "evento", label: "📅 Evento" },
    { key: "aviso", label: "📢 Aviso" },
    { key: "info", label: "ℹ️ Info" },
  ];

  if (loading) {
    return (
      <section id="avisos" className="py-20 px-6 bg-white">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center max-w-[600px] mx-auto mb-12">
            <div className="w-12 h-[2px] bg-blue-900 mx-auto mb-4" />
            <div className="h-8 bg-gray-200 rounded animate-pulse w-36 mx-auto mb-4" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-64 mx-auto" />
          </div>
          <div className="grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-3">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="rounded-xl border border-gray-200 overflow-hidden animate-pulse">
                <div className="aspect-[3/4] bg-gray-200" />
                <div className="p-4 flex flex-col gap-2">
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (avisos.length === 0) return null;

  return (
    <section id="avisos" className="py-20 px-6 bg-white">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center max-w-[600px] mx-auto mb-12">
          <div className="w-12 h-[2px] bg-blue-900 mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Avisos & Novidades</h2>
          <p className="text-gray-600">Fique por dentro do que está movendo a igreja nesta semana.</p>
        </div>

        {/* Pills de filtro */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {FILTROS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFiltroAtivo(f.key)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all duration-200 ${
                filtroAtivo === f.key
                  ? "bg-blue-900 text-white border-blue-900"
                  : "bg-white text-gray-600 border-gray-200 hover:border-blue-900/40 hover:text-blue-900"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-3">
          {avisos.filter((a) => filtroAtivo === "todos" || a.tipo === filtroAtivo).map((aviso) => {
            const cfg = TIPO_CONFIG[aviso.tipo] ?? DEFAULT_TIPO;
            return (
              <div
                key={aviso.id}
                className={`group relative flex flex-col rounded-xl border bg-white overflow-hidden
                  transition-all duration-500 ${cfg.border} hover:-translate-y-1 hover:shadow-lg`}
              >
                <div className={`absolute top-0 left-0 right-0 h-[3px] z-10 ${cfg.barra}`} />

                {/* foto ou fallback com gradiente */}
                {aviso.fotoUrl ? (
                  <div className="aspect-[3/4] overflow-hidden">
                    <OptimizedImage
                      src={aviso.fotoUrl}
                      alt={aviso.titulo || "Aviso"}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ) : (
                  <div className={`h-44 bg-gradient-to-br ${cfg.fallbackBg} flex items-center justify-center`}>
                    <div className={`w-14 h-14 flex items-center justify-center rounded-xl border ${cfg.iconeBg}`}>
                      {cfg.icone}
                    </div>
                  </div>
                )}

                <div className="p-4 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${cfg.badge}`}>
                      {cfg.label}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-gray-900 leading-tight">{aviso.titulo || "Sem título"}</h3>
                  {(aviso.mensagem || aviso.descricao) && (
                    <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">{aviso.mensagem || aviso.descricao}</p>
                  )}
                  {(aviso.data || aviso.horario || aviso.local) && (
                    <div className="flex flex-col gap-1 pt-2 border-t border-gray-100">
                      {aviso.data && (
                        <span className="text-xs text-gray-400">📅 {aviso.data}{aviso.horario ? ` · ${aviso.horario}` : ""}</span>
                      )}
                      {aviso.local && <span className="text-xs text-gray-400">📍 {aviso.local}</span>}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/cultos"
            className="inline-flex items-center gap-2 text-sm font-bold text-blue-900 border border-blue-900/30 px-6 py-2.5 rounded-lg hover:bg-blue-50 transition"
          >
            Ver todos os cultos →
          </Link>
        </div>
      </div>
    </section>
  );
}
