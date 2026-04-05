import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { ArrowLeft, X, ChevronLeft, ChevronRight } from "lucide-react";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

function Lightbox({ fotos, index, onClose, onPrev, onNext }) {
  useEffect(() => {
    const h = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose, onPrev, onNext]);

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center" onClick={onClose}>
      <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white transition"><X size={28} /></button>
      <button onClick={(e) => { e.stopPropagation(); onPrev(); }} className="absolute left-4 text-white/70 hover:text-white transition p-2"><ChevronLeft size={36} /></button>
      <img src={fotos[index]} alt="" onClick={(e) => e.stopPropagation()}
        className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg shadow-2xl" />
      <button onClick={(e) => { e.stopPropagation(); onNext(); }} className="absolute right-4 text-white/70 hover:text-white transition p-2"><ChevronRight size={36} /></button>
      <span className="absolute bottom-4 text-white/50 text-sm">{index + 1} / {fotos.length}</span>
    </div>
  );
}

function toEmbedUrl(url) {
  if (!url) return null;
  const match = url.match(/(?:v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}

export default function Ministerio() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ministerio, setMinisterio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [lightbox, setLightbox] = useState({ aberto: false, index: 0 });

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDoc(doc(db, "ministerios", id));
        snap.exists() ? setMinisterio({ id: snap.id, ...snap.data() }) : setNotFound(true);
      } catch { setNotFound(true); }
      finally { setLoading(false); }
    })();
  }, [id]);

  const fotos = ministerio?.fotos ?? [];
  const embedUrl = toEmbedUrl(ministerio?.youtubeUrl);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white pt-6 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          <button onClick={() => navigate("/#ministerios")}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-900 transition mb-8">
            <ArrowLeft size={16} /> Voltar para a home
          </button>

          {loading && (
            <div className="flex flex-col gap-6 animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-48" />
              <div className="h-64 bg-gray-200 rounded-xl" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
            </div>
          )}

          {notFound && <div className="text-center py-20"><p className="text-gray-500">Ministério não encontrado.</p></div>}

          {ministerio && !loading && (
            <div className="flex flex-col gap-10">
              {/* Hero */}
              <div className="flex flex-col gap-3">
                {ministerio.fotoUrl && (
                  <div className="w-full h-64 md:h-80 rounded-2xl overflow-hidden">
                    <img src={ministerio.fotoUrl} alt={ministerio.nome} className="w-full h-full object-cover" />
                  </div>
                )}
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{ministerio.nome}</h1>
                  {(ministerio.diaSemana || ministerio.horario) && (
                    <p className="text-sm text-blue-900 font-semibold mt-1">
                      📅 {ministerio.diaSemana}{ministerio.horario ? ` · ${ministerio.horario}` : ""}
                    </p>
                  )}
                  {ministerio.responsavel && <p className="text-sm text-gray-500 mt-0.5">Responsável: {ministerio.responsavel}</p>}
                </div>
              </div>

              {ministerio.descricao && (
                <p className="text-lg text-gray-600 leading-relaxed border-l-4 border-blue-900 pl-5">{ministerio.descricao}</p>
              )}

              {ministerio.historia && (
                <div className="flex flex-col gap-3">
                  <h2 className="text-xl font-bold text-gray-900">Nossa História</h2>
                  {ministerio.historia.split("\n\n").map((p, i) => (
                    <p key={i} className="text-gray-600 leading-relaxed">{p}</p>
                  ))}
                </div>
              )}

              {embedUrl && (
                <div className="flex flex-col gap-3">
                  <h2 className="text-xl font-bold text-gray-900">Conheça nosso Ministério</h2>
                  <div className="aspect-video rounded-xl overflow-hidden shadow-md">
                    <iframe src={embedUrl} title={`Vídeo — ${ministerio.nome}`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen className="w-full h-full border-0" />
                  </div>
                </div>
              )}

              {fotos.length > 0 && (
                <div className="flex flex-col gap-4">
                  <h2 className="text-xl font-bold text-gray-900">Galeria de Fotos</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {fotos.map((url, i) => (
                      <button key={url} onClick={() => setLightbox({ aberto: true, index: i })}
                        className="aspect-square rounded-xl overflow-hidden hover:opacity-90 transition">
                        <img src={url} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
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
        <Lightbox fotos={fotos} index={lightbox.index}
          onClose={() => setLightbox({ aberto: false, index: 0 })}
          onPrev={() => setLightbox((l) => ({ ...l, index: (l.index - 1 + fotos.length) % fotos.length }))}
          onNext={() => setLightbox((l) => ({ ...l, index: (l.index + 1) % fotos.length }))} />
      )}
    </>
  );
}