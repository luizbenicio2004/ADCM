import { Music2, Star, Flame, Heart, Users, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import { useCollection } from "../../hooks/useCollection";
import { MINISTERIOS as MINISTERIOS_ESTATICOS } from "../../data/igreja";
import OptimizedImage from "../OptimizedImage";

const ICONES = [<Music2 size={20} />, <Star size={20} />, <Flame size={20} />, <Heart size={20} />, <Users size={20} />];
const CORES = [
  "bg-blue-900/10 border-blue-900/20 text-blue-900",
  "bg-yellow-400/10 border-yellow-400/20 text-yellow-600",
  "bg-red-600/10 border-red-600/20 text-red-600",
  "bg-green-600/10 border-green-600/20 text-green-600",
  "bg-purple-600/10 border-purple-600/20 text-purple-600",
];

export default function Ministerios() {
  // ✅ CORRIGIDO: callback ref — observer registrado após dados chegarem
  
  const { data: ministerios = [], loading, error } = useCollection("ministerios");

  const ativos = ministerios.filter((m) => m.ativo !== false);
  const usandoFirestore = !loading && ministerios.length > 0;
  const lista = usandoFirestore ? ativos : MINISTERIOS_ESTATICOS;

  return (
    <section id="ministerios" className="py-20 px-6">
      <div className="max-w-[1000px] mx-auto">
        <div className="text-center max-w-[600px] mx-auto mb-12">
          <div className="w-12 h-[2px] bg-blue-900 mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Nossos Ministérios</h2>
          <p className="text-gray-600">
            Tem um dom que você ainda não descobriu. Nossos ministérios existem para isso.
          </p>
        </div>

        {error && <p className="text-center text-gray-400 mb-8">Não conseguimos carregar os ministérios agora. Tente recarregar a página.</p>}

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="rounded-xl border border-gray-200 overflow-hidden animate-pulse">
                <div className="aspect-[3/4] bg-gray-200" />
                <div className="p-4 flex flex-col gap-2">
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {lista.map((min, index) => {

              const cardClass = `group rounded-xl border border-gray-200 overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all duration-500`;

              const cardContent = (
                <>
                  {min.fotoUrl ? (
                    <div className="aspect-[3/4] overflow-hidden">
                      <OptimizedImage
                        src={min.fotoUrl}
                        alt={min.nome ?? min.titulo}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ) : (
                    <div className="h-44 bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center">
                      <div className={`w-14 h-14 flex items-center justify-center rounded-xl border ${CORES[index % CORES.length]}`}>
                        {ICONES[index % ICONES.length]}
                      </div>
                    </div>
                  )}
                  <div className="p-4 flex flex-col gap-1.5">
                    <h3 className="font-bold text-gray-900 leading-tight">{min.nome ?? min.titulo}</h3>
                    {min.responsavel && <p className="text-xs text-gray-400">👤 {min.responsavel}</p>}
                    {(min.diaSemana || min.horario) && (
                      <p className="text-xs text-gray-400">📅 {min.diaSemana}{min.horario && ` · ${min.horario}`}</p>
                    )}
                    <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 mt-0.5">{min.descricao}</p>
                    {usandoFirestore && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-900 mt-1">
                        Ver mais <ArrowRight size={12} />
                      </span>
                    )}
                  </div>
                </>
              );

              return usandoFirestore ? (
                <Link key={min.id} to={`/ministerio/${min.id}`} className={cardClass}>{cardContent}</Link>
              ) : (
                <div key={min.id ?? index} className={cardClass}>{cardContent}</div>
              );
            })}
          </div>
        )}

        <div className="text-center mt-12 flex flex-col items-center gap-3">
          <p className="text-sm text-gray-600">Quer fazer parte de um ministério?</p>
          <a href="#localizacao" className="text-sm font-bold text-blue-900 border-b-2 border-transparent hover:border-blue-900 transition-all">
            Venha nos visitar e conheça nossa equipe →
          </a>
        </div>
      </div>
    </section>
  );
}
