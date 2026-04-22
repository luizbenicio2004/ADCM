import { useConfig } from "../context/ConfigContext";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import OptimizedImage from "../components/OptimizedImage";
import Lightbox from "../components/Lightbox/Lightbox";
import { useLightbox } from "../hooks/useLightbox";

export default function SobrePage() {
  const { config, loading } = useConfig();

  const sobre = config?.sobre ?? {};
  const historia = sobre.historia ?? "";
  const versiculo = sobre.versiculo ?? "";
  const referenciaVersiculo = sobre.referenciaVersiculo ?? "";
  const missao = sobre.missao ?? "";
  const visao = sobre.visao ?? "";
  const numeros = sobre.numeros ?? [];
  const pastores = sobre.pastores ?? [];
  const fotosHistoricas = sobre.fotosHistoricas ?? [];

  const { lightbox, abrirEm, fechar, anterior, proximo } = useLightbox(fotosHistoricas);

  return (
    <>
      <Header />

      <main className="min-h-screen bg-white pb-20">
        {/* HERO */}
        <div className="bg-blue-900 text-white py-20 px-6 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="w-12 h-[2px] bg-white/40 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Quem Somos</h1>
            <p className="text-blue-200 text-lg">Conheça a história e a missão da Igreja ADCM Poá</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-16 flex flex-col gap-16">
          {/* VOLTAR */}
          <Link
            to="/#sobre"
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-900 transition -mt-6 self-start"
          >
            <ArrowLeft size={16} /> Voltar
          </Link>

          {/* NÚMEROS */}
          {numeros.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {numeros.map((n) => (
                <div
                  key={n.label}
                  className="text-center p-6 rounded-xl border border-gray-200 hover:shadow-md transition"
                >
                  <strong className="block text-3xl font-bold text-blue-900">{n.valor}</strong>
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{n.label}</span>
                </div>
              ))}
            </div>
          )}

          {/* HISTÓRIA */}
          {loading ? (
            <div className="flex flex-col gap-3">
              {Array(4).fill(0).map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded animate-pulse" />
              ))}
            </div>
          ) : (
            historia && (
              <div className="flex flex-col gap-6">
                <div>
                  <div className="w-12 h-[2px] bg-blue-900 mb-4" />
                  <h2 className="text-3xl font-bold text-gray-900">Nossa História</h2>
                </div>
                {historia.split("\n\n").map((p, i) => (
                  <p key={i} className="text-gray-600 leading-relaxed text-lg">{p}</p>
                ))}
              </div>
            )
          )}

          {/* VERSÍCULO */}
          {versiculo && (
            <div className="relative bg-blue-900 text-white rounded-2xl p-10 text-center">
              <span className="absolute -top-5 left-8 text-8xl text-white/10 font-serif">"</span>
              <p className="font-serif italic text-xl md:text-2xl leading-relaxed">{versiculo}</p>
              {referenciaVersiculo && (
                <span className="block mt-4 text-sm font-bold text-blue-200">{referenciaVersiculo}</span>
              )}
            </div>
          )}

          {/* MISSÃO E VISÃO */}
          {(missao || visao) && (
            <div className="grid md:grid-cols-2 gap-6">
              {missao && (
                <div className="p-6 rounded-xl border border-gray-200 hover:shadow-md transition">
                  <h3 className="font-bold text-gray-900 mb-2 uppercase text-sm tracking-wide">🎯 Nossa Missão</h3>
                  <p className="text-gray-600">{missao}</p>
                </div>
              )}
              {visao && (
                <div className="p-6 rounded-xl border border-gray-200 hover:shadow-md transition">
                  <h3 className="font-bold text-gray-900 mb-2 uppercase text-sm tracking-wide">👁 Nossa Visão</h3>
                  <p className="text-gray-600">{visao}</p>
                </div>
              )}
            </div>
          )}

          {/* PASTORES */}
          {pastores.length > 0 && (
            <div className="flex flex-col gap-8">
              <div>
                <div className="w-12 h-[2px] bg-blue-900 mb-4" />
                <h2 className="text-3xl font-bold text-gray-900">Nossa Liderança</h2>
              </div>

              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                {pastores.map((pastor, i) => (
                  <div
                    key={i}
                    className="group rounded-xl border border-gray-200 overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all duration-500"
                  >
                    {pastor.fotoUrl ? (
                      <div className="aspect-[3/4] overflow-hidden">
                        <OptimizedImage
                          src={pastor.fotoUrl}
                          alt={pastor.nome}
                          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    ) : (
                      <div className="h-44 bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center">
                        <span className="text-5xl">👤</span>
                      </div>
                    )}
                    <div className="p-4 text-center">
                      <h3 className="font-bold text-gray-900">{pastor.nome}</h3>
                      {pastor.cargo && (
                        <p className="text-sm text-blue-900 font-semibold mt-1">{pastor.cargo}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* GALERIA */}
          {fotosHistoricas.length > 0 && (
            <div className="flex flex-col gap-6">
              <div>
                <div className="w-12 h-[2px] bg-blue-900 mb-4" />
                <h2 className="text-3xl font-bold text-gray-900">Galeria Histórica</h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {fotosHistoricas.map((url, i) => (
                  <button
                    key={url}
                    onClick={() => abrirEm(i)}
                    className="group aspect-[3/4] rounded-xl overflow-hidden hover:opacity-90 transition"
                  >
                    <OptimizedImage
                      src={url}
                      alt={`Foto histórica ${i + 1}`}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />

      {lightbox.aberto && (
        <Lightbox
          fotos={fotosHistoricas}
          index={lightbox.index}
          onClose={fechar}
          onPrev={anterior}
          onNext={proximo}
        />
      )}
    </>
  );
}
