import { Link } from "react-router-dom";
import { ArrowLeft, Clock, BookOpen, Music } from "lucide-react";
import { useCollection } from "../hooks/useCollection";
import { useDoc } from "../hooks/useDoc";
import { useLightbox } from "../hooks/useLightbox";
import { sortCultos } from "../utils/sortCultos";
import { CULTOS as CULTOS_ESTATICOS } from "../data/igreja";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import OptimizedImage from "../components/OptimizedImage";
import Lightbox from "../components/Lightbox/Lightbox";

function getIcone(nome = "") {
  const lower = nome.toLowerCase();
  if (lower.includes("celebr")) return <Music size={20} />;
  if (lower.includes("palavra") || lower.includes("teolog")) return <BookOpen size={20} />;
  return <Clock size={20} />;
}

export default function CultosPage() {
  const { data: cultos = [], loading } = useCollection("cultos");
  const { data: cultosConfig } = useDoc("config", "cultos");

  const lista = !loading && cultos.length === 0 ? CULTOS_ESTATICOS : cultos;
  const cultosOrdenados = sortCultos(lista);

  const fotos = cultosConfig?.fotos ?? [];
  const { lightbox, abrirEm, fechar, anterior, proximo } = useLightbox(fotos);

  return (
    <>
      <Header />

      <main className="min-h-screen bg-white pb-20">
        {/* HERO */}
        <div className="bg-blue-900 text-white py-20 px-6 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="w-12 h-[2px] bg-white/40 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Nossos Cultos</h1>
            <p className="text-blue-200 text-lg">
              Venha nos visitar. Você é bem-vindo em qualquer um de nossos cultos.
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-16 flex flex-col gap-16">
          {/* VOLTAR */}
          <Link
            to="/#cultos"
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-900 transition -mt-6 self-start"
          >
            <ArrowLeft size={16} /> Voltar
          </Link>

          {/* CARDS DE CULTOS */}
          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="rounded-xl border border-gray-200 bg-white p-8 animate-pulse">
                  <div className="w-11 h-11 bg-gray-200 rounded-full mx-auto mb-4" />
                  <div className="h-4 bg-gray-200 rounded w-24 mx-auto mb-3" />
                  <div className="h-8 bg-gray-200 rounded w-20 mx-auto" />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-8">
              <div>
                <div className="w-12 h-[2px] bg-blue-900 mb-4" />
                <h2 className="text-3xl font-bold text-gray-900">Horários</h2>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {cultosOrdenados.map((culto) => (
                  <div
                    key={culto.id}
                    className={`relative flex flex-col items-center text-center gap-3 p-8 rounded-xl border bg-white transition-all duration-300
                      ${culto.destaque ? "border-blue-900 shadow-md" : "border-gray-200"}
                      hover:-translate-y-1 hover:shadow-lg`}
                  >
                    <div className={`absolute top-0 left-0 right-0 h-[3px] rounded-t-xl
                      ${culto.destaque ? "bg-gradient-to-r from-blue-900 to-blue-500" : "bg-gray-200"}`}
                    />
                    <div className={`w-11 h-11 flex items-center justify-center rounded-full border
                      ${culto.destaque ? "bg-blue-900/10 border-blue-900/20 text-blue-900" : "bg-gray-100 border-gray-200 text-gray-400"}`}>
                      {getIcone(culto.nome)}
                    </div>
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
                      <span className="mt-2 px-3 py-1 text-xs font-bold uppercase tracking-wide text-blue-900 bg-blue-900/10 border border-blue-900/20 rounded-full">
                        Principal
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* GALERIA DE FOTOS */}
          {fotos.length > 0 && (
            <div className="flex flex-col gap-6">
              <div>
                <div className="w-12 h-[2px] bg-blue-900 mb-4" />
                <h2 className="text-3xl font-bold text-gray-900">Galeria</h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {fotos.map((url, i) => (
                  <button
                    key={url}
                    onClick={() => abrirEm(i)}
                    className="aspect-square rounded-xl overflow-hidden hover:opacity-90 transition"
                  >
                    <OptimizedImage
                      src={url}
                      alt={`Foto do culto ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="bg-blue-900 text-white rounded-2xl p-10 text-center flex flex-col items-center gap-4">
            <h3 className="text-2xl font-bold">Venha nos visitar!</h3>
            <p className="text-blue-200">Abertos para todos, sem exceção.</p>
            <a
              href="/#localizacao"
              className="inline-flex items-center gap-2 text-sm font-bold bg-white text-blue-900 px-6 py-3 rounded-lg hover:bg-blue-50 transition"
            >
              Ver endereço →
            </a>
          </div>
        </div>
      </main>

      <Footer />

      {lightbox.aberto && (
        <Lightbox
          fotos={fotos}
          index={lightbox.index}
          onClose={fechar}
          onPrev={anterior}
          onNext={proximo}
        />
      )}
    </>
  );
}
