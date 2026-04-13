import { Music2, Star, Flame, Heart, Users, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import { useCollection } from "../../hooks/useCollection";
import { MINISTERIOS as MINISTERIOS_ESTATICOS } from "../../data/igreja";

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
          <div className="grid gap-4 md:grid-cols-2">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="flex items-start gap-4 p-6 rounded-xl border border-gray-200 animate-pulse">
                <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0" />
                <div className="flex-1 flex flex-col gap-2">
                  <div className="h-4 bg-gray-200 rounded w-32" />
                  <div className="h-3 bg-gray-200 rounded w-full" />
                  <div className="h-3 bg-gray-200 rounded w-4/5" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {lista.map((min, index) => {
              const inner = (
                <>
                  <div className={`w-12 h-12 flex items-center justify-center rounded-lg border flex-shrink-0 ${CORES[index % CORES.length]}`}>
                    {ICONES[index % ICONES.length]}
                  </div>
                  <div className="flex flex-col gap-1 flex-1">
                    <h3 className="text-base font-bold text-gray-900">{min.nome ?? min.titulo}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">{min.descricao}</p>
                    {min.responsavel && <p className="text-xs text-gray-400 mt-1">Responsável: {min.responsavel}</p>}
                    {(min.diaSemana || min.horario) && (
                      <p className="text-xs text-gray-400">{min.diaSemana} {min.horario && `· ${min.horario}`}</p>
                    )}
                    {usandoFirestore && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-900 mt-2">
                        Ver mais <ArrowRight size={12} />
                      </span>
                    )}
                  </div>
                </>
              );

              const animClass = `flex items-start gap-4 p-6 rounded-xl border border-gray-200 hover:-translate-y-1 hover:shadow-lg transition-all`;
              const animStyle = {};

              return usandoFirestore ? (
                <Link key={min.id} to={`/ministerio/${min.id}`}
                  className={animClass + " hover:border-blue-900/20"} style={animStyle}>{inner}</Link>
              ) : (
                <div key={min.id ?? index} className={animClass} style={animStyle}>{inner}</div>
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
