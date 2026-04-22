// src/pages/Ministerio.jsx

import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { ArrowLeft } from "lucide-react";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import OptimizedImage from "../components/OptimizedImage";
import Lightbox from "../components/Lightbox/Lightbox";
import { useLightbox } from "../hooks/useLightbox";
import { toEmbedUrl } from "../utils/youtube";
import { useSEO } from "../hooks/useSEO";

export default function Ministerio() {
  const { id } = useParams();

  const [ministerio, setMinisterio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setTimeout(() => window.scrollTo(0, 0), 0);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDoc(doc(db, "ministerios", id));
        if (snap.exists()) {
          setMinisterio({ id: snap.id, ...snap.data() });
        } else {
          setNotFound(true);
        }
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // CORRIGIDO: SEO dinâmico com og:image
  useSEO({
    title: ministerio?.nome ?? "Ministério",
    description: ministerio?.descricao,
    image: ministerio?.fotoUrl,
  });

  const fotos = ministerio?.fotos ?? [];
  const embedUrl = toEmbedUrl(ministerio?.youtubeUrl);
  const { lightbox, abrirEm, fechar, anterior, proximo } = useLightbox(fotos);

  return (
    <>
      <Header />

      <main className="min-h-screen bg-white pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          {/* Voltar */}
          <a
            href="/#ministerios"
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-900 mb-8 transition"
          >
            <ArrowLeft size={16} /> Voltar
          </a>

          {/* Loading */}
          {loading && (
            <div className="flex flex-col gap-6 animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-48" />
              <div className="h-64 bg-gray-200 rounded-xl" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
            </div>
          )}

          {/* Not found */}
          {notFound && (
            <div className="text-center py-20">
              <p className="text-gray-500">
                Hmm, não encontramos esse ministério. Tente voltar e escolher outro.
              </p>
            </div>
          )}

          {/* Conteúdo */}
          {ministerio && !loading && (
            <div className="flex flex-col gap-10">
              {/* Hero */}
              <div className="flex flex-col gap-3">
                {ministerio.fotoUrl && (
                  <div className="w-full h-64 md:h-80 rounded-2xl overflow-hidden">
                    <OptimizedImage
                      src={ministerio.fotoUrl}
                      alt={ministerio.nome}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}

                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                    {ministerio.nome}
                  </h1>

                  {(ministerio.diaSemana || ministerio.horario) && (
                    <p className="text-sm text-blue-900 font-semibold mt-1">
                      📅 {ministerio.diaSemana}
                      {ministerio.horario && ` · ${ministerio.horario}`}
                    </p>
                  )}

                  {ministerio.responsavel && (
                    <p className="text-sm text-gray-500 mt-0.5">
                      Responsável: {ministerio.responsavel}
                    </p>
                  )}
                </div>
              </div>

              {/* Descrição */}
              {ministerio.descricao && (
                <p className="text-lg text-gray-600 leading-relaxed border-l-4 border-blue-900 pl-5">
                  {ministerio.descricao}
                </p>
              )}

              {/* História */}
              {ministerio.historia && (
                <div className="flex flex-col gap-3">
                  <h2 className="text-xl font-bold text-gray-900">Nossa História</h2>
                  {ministerio.historia.split("\n\n").map((p, i) => (
                    <p key={i} className="text-gray-600 leading-relaxed">
                      {p}
                    </p>
                  ))}
                </div>
              )}

              {/* Vídeo */}
              {embedUrl && (
                <div className="flex flex-col gap-3">
                  <h2 className="text-xl font-bold text-gray-900">
                    Conheça nosso Ministério
                  </h2>
                  <div className="aspect-video rounded-xl overflow-hidden shadow-md">
                    <iframe
                      src={embedUrl}
                      title={`Vídeo — ${ministerio.nome}`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full border-0"
                    />
                  </div>
                </div>
              )}

              {/* Galeria */}
              {fotos.length > 0 && (
                <div className="flex flex-col gap-4">
                  <h2 className="text-xl font-bold text-gray-900">Galeria de Fotos</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {fotos.map((url, i) => (
                      <button
                        key={url}
                        onClick={() => abrirEm(i)}
                        className="group aspect-[3/4] rounded-xl overflow-hidden hover:opacity-90 transition"
                        aria-label={`Abrir foto ${i + 1} de ${fotos.length}`}
                      >
                        <OptimizedImage
                          src={url}
                          alt={`Foto ${i + 1}`}
                          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
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
