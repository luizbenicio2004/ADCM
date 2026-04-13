import { Megaphone, Bell, AlertCircle, Calendar } from "lucide-react";
import { useCollection } from "../../hooks/useCollection";


const TIPO_CONFIG = {
  urgente: {
    border: "border-red-300",
    barra: "bg-gradient-to-r from-red-600 to-red-400",
    iconeBg: "bg-red-50 border-red-200 text-red-600",
    badge: "bg-red-100 text-red-700",
    icone: <AlertCircle size={18} />,
    label: "Urgente",
  },
  evento: {
    border: "border-blue-200",
    barra: "bg-gradient-to-r from-blue-700 to-blue-400",
    iconeBg: "bg-blue-50 border-blue-200 text-blue-700",
    badge: "bg-blue-100 text-blue-700",
    icone: <Calendar size={18} />,
    label: "Evento",
  },
  aviso: {
    border: "border-yellow-200",
    barra: "bg-gradient-to-r from-yellow-500 to-yellow-300",
    iconeBg: "bg-yellow-50 border-yellow-200 text-yellow-600",
    badge: "bg-yellow-100 text-yellow-700",
    icone: <Bell size={18} />,
    label: "Aviso",
  },
  info: {
    border: "border-blue-200",
    barra: "bg-gradient-to-r from-blue-600 to-blue-400",
    iconeBg: "bg-blue-50 border-blue-200 text-blue-600",
    badge: "bg-blue-100 text-blue-700",
    icone: <Megaphone size={18} />,
    label: "Informação",
  },
};

const DEFAULT_TIPO = TIPO_CONFIG.aviso;

export default function Avisos() {
  const { data: todosAvisos = [], loading } = useCollection("avisos");
  // ✅ CORRIGIDO: callback ref — observer registrado após dados chegarem
  

  const avisos = todosAvisos.filter((a) => a.ativo !== false);

  if (loading) {
    return (
      <section id="avisos" className="py-20 px-6 bg-white">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center max-w-[600px] mx-auto mb-12">
            <div className="w-12 h-[2px] bg-blue-900 mx-auto mb-4" />
            <div className="h-8 bg-gray-200 rounded animate-pulse w-36 mx-auto mb-4" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-64 mx-auto" />
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="rounded-xl border border-gray-200 p-6 animate-pulse">
                <div className="flex gap-3 mb-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full" />
                  <div className="h-5 bg-gray-200 rounded w-16 self-center" />
                </div>
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-full" />
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

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {avisos.map((aviso, index) => {
            const cfg = TIPO_CONFIG[aviso.tipo] ?? DEFAULT_TIPO;
            return (
              <div
                key={aviso.id}
                className={`relative flex flex-col gap-4 p-6 rounded-xl border bg-white transition-all duration-500
                  ${cfg.border} hover:-translate-y-1 hover:shadow-lg
                  `}
              >
                <div className={`absolute top-0 left-0 right-0 h-[3px] rounded-t-xl ${cfg.barra}`} />
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 flex items-center justify-center rounded-full border ${cfg.iconeBg}`}>
                    {cfg.icone}
                  </div>
                  <span className={`text-xs font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${cfg.badge}`}>
                    {cfg.label}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900">{aviso.titulo || "Sem título"}</h3>
                {(aviso.mensagem || aviso.descricao) && (
                  <p className="text-sm text-gray-600 leading-relaxed">{aviso.mensagem || aviso.descricao}</p>
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
            );
          })}
        </div>
      </div>
    </section>
  );
}
