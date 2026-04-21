import { sortCultos } from "../../utils/sortCultos";
import { Clock, BookOpen, Music } from "lucide-react";
import { Link } from "react-router-dom";
import { useCollection } from "../../hooks/useCollection";
import { CULTOS as CULTOS_ESTATICOS } from "../../data/igreja";
import OptimizedImage from "../OptimizedImage";

function getIcone(nome = "") {
  const lower = nome.toLowerCase();
  if (lower.includes("celebr")) return <Music size={20} />;
  if (lower.includes("palavra") || lower.includes("teolog")) return <BookOpen size={20} />;
  return <Clock size={20} />;
}

export default function Cultos() {
  const { data: cultos = [], loading, error } = useCollection("cultos");

  const lista = !loading && cultos.length === 0 ? CULTOS_ESTATICOS : cultos;
  const cultosOrdenados = sortCultos(lista);

  if (loading) {
    return (
      <section id="cultos" className="py-20 px-6 bg-gray-50">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center max-w-[600px] mx-auto mb-12">
            <div className="w-12 h-[2px] bg-blue-900 mx-auto mb-4" />
            <div className="h-8 bg-gray-200 rounded animate-pulse w-48 mx-auto mb-4" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-72 mx-auto" />
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="rounded-xl border border-gray-200 bg-white p-8 animate-pulse">
                <div className="w-11 h-11 bg-gray-200 rounded-full mx-auto mb-4" />
                <div className="h-4 bg-gray-200 rounded w-24 mx-auto mb-3" />
                <div className="h-8 bg-gray-200 rounded w-20 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="cultos" className="py-20 px-6 bg-gray-50 text-center">
        <p className="text-gray-500">Não conseguimos carregar os cultos agora. Tente recarregar a página.</p>
      </section>
    );
  }

  return (
    <section id="cultos" className="py-20 px-6 bg-gray-50">
      <div className="max-w-[1200px] mx-auto flex flex-col gap-12">

        <div className="text-center max-w-[600px] mx-auto">
          <div className="w-12 h-[2px] bg-blue-900 mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Nossos Cultos</h2>
          <p className="text-gray-600">
            Sua semana começa e termina melhor aqui. Abertos para todos, sem exceção.
          </p>
        </div>

        {cultosOrdenados.length === 0 && (
          <p className="text-center text-gray-500">Os horários de culto estarão disponíveis em breve!</p>
        )}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cultosOrdenados.map((culto) => (
            <div
              key={culto.id}
              className={`relative flex flex-col rounded-xl border bg-white transition-all duration-500 overflow-hidden
                ${culto.destaque ? "border-blue-900 shadow-md" : "border-gray-200"}
                hover:-translate-y-1 hover:shadow-lg`}
            >
              {/* barra de destaque */}
              <div className={`absolute top-0 left-0 right-0 h-[3px] z-10
                ${culto.destaque ? "bg-gradient-to-r from-blue-900 to-blue-500" : "bg-gray-200"}`}
              />

              {/* foto de largura total — só aparece se tiver banner */}
              {culto.banner && (
                <div className="w-full aspect-[16/7] overflow-hidden flex-shrink-0">
                  <OptimizedImage
                    src={culto.banner}
                    alt={culto.nome || culto.dia}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* conteúdo centralizado */}
              <div className="flex flex-col items-center text-center gap-3 px-8 py-8">
                {/* ícone só aparece quando não tem foto */}
                {!culto.banner && (
                  <div className={`w-11 h-11 flex items-center justify-center rounded-full border
                    ${culto.destaque ? "bg-blue-900/10 border-blue-900/20 text-blue-900" : "bg-gray-100 border-gray-200 text-gray-400"}`}>
                    {getIcone(culto.nome)}
                  </div>
                )}

                <span className="text-xs font-bold tracking-widest uppercase text-gray-500">
                  {culto.dia || "Dia não informado"}
                </span>
                <strong className="text-3xl font-bold text-blue-900">
                  {culto.horario || "--:--"}
                </strong>
                {culto.nome && <p className="text-sm font-semibold text-gray-700">{culto.nome}</p>}
                {culto.descricao && <p className="text-sm text-gray-500 leading-relaxed">{culto.descricao}</p>}
                {culto.obs && <p className="text-xs text-gray-400 italic">{culto.obs}</p>}
                {culto.destaque && (
                  <span className="mt-1 px-3 py-1 text-xs font-bold uppercase tracking-wide text-blue-900 bg-blue-900/10 border border-blue-900/20 rounded-full">
                    Principal
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
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