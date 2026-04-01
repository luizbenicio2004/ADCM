import { CalendarDays, Megaphone, BellRing, Calendar, Clock, MapPin } from "lucide-react";
import { useRevealStagger } from "../../hooks/useReveal";
import { AVISOS } from "../../data/igreja";

const TIPO_CONFIG = {
  evento: {
    label:  "Evento",
    barra:  "bg-blue-900",
    badge:  "bg-blue-900/10 text-blue-900 border-blue-900/20",
    Icone:  CalendarDays,
  },
  aviso: {
    label:  "Aviso",
    barra:  "bg-yellow-500",
    badge:  "bg-yellow-500/10 text-yellow-700 border-yellow-500/20",
    Icone:  Megaphone,
  },
  urgente: {
    label:  "Urgente",
    barra:  "bg-red-600",
    badge:  "bg-red-600/10 text-red-700 border-red-600/20",
    Icone:  BellRing,
  },
};

function formatarData(dataStr) {
  if (!dataStr) return null;
  const [ano, mes, dia] = dataStr.split("-").map(Number);
  return new Date(ano, mes - 1, dia).toLocaleDateString("pt-BR", {
    day:   "numeric",
    month: "long",
    year:  "numeric",
  });
}

export default function Avisos() {
  const gridRef = useRevealStagger();
  const ativos = AVISOS.filter((a) => a.ativo);
  if (ativos.length === 0) return null;

  return (
    <section id="avisos" className="py-20 px-6 bg-white">
      <div className="max-w-[1100px] mx-auto">

        <div className="text-center max-w-[600px] mx-auto mb-12">
          <div className="w-12 h-[2px] bg-blue-900 mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Avisos e Eventos
          </h2>
          <p className="text-gray-600">
            Fique por dentro do que está acontecendo na nossa comunidade.
          </p>
        </div>

        <div ref={gridRef} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ativos.map((aviso) => {
            const config = TIPO_CONFIG[aviso.tipo] ?? TIPO_CONFIG.aviso;
            const { Icone } = config;
            const dataFormatada = formatarData(aviso.data);

            return (
              <div
                key={aviso.id}
                className="relative flex flex-col gap-3 p-6 rounded-xl border border-gray-200 bg-white
                  hover:-translate-y-1 hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                <div className={`absolute top-0 left-0 right-0 h-[3px] ${config.barra}`} />

                <span className={`self-start inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${config.badge}`}>
                  <Icone size={12} />
                  {config.label}
                </span>

                <h3 className="text-base font-bold text-gray-900 leading-snug">
                  {aviso.titulo}
                </h3>

                <p className="text-sm text-gray-600 leading-relaxed flex-1">
                  {aviso.descricao}
                </p>

                {(dataFormatada || aviso.horario || aviso.local) && (
                  <div className="flex flex-col gap-1 pt-3 border-t border-gray-100 mt-auto">
                    {dataFormatada && (
                      <span className="flex items-center gap-2 text-xs text-gray-500">
                        <Calendar size={12} className="flex-shrink-0" /> {dataFormatada}
                      </span>
                    )}
                    {aviso.horario && (
                      <span className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock size={12} className="flex-shrink-0" /> {aviso.horario}
                      </span>
                    )}
                    {aviso.local && (
                      <span className="flex items-center gap-2 text-xs text-gray-500">
                        <MapPin size={12} className="flex-shrink-0" /> {aviso.local}
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <p className="text-center text-xs text-gray-400 mt-10">
          Acompanhe nossas redes sociais para mais informações e atualizações.
        </p>

      </div>
    </section>
  );
}