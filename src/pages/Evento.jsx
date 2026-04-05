import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { ArrowLeft, X, ChevronLeft, ChevronRight, Calendar, MapPin } from "lucide-react";
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
      <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white"><X size={28} /></button>
      <button onClick={(e) => { e.stopPropagation(); onPrev(); }} className="absolute left-4 text-white/70 hover:text-white p-2"><ChevronLeft size={36} /></button>
      <img src={fotos[index]} alt="" onClick={(e) => e.stopPropagation()}
        className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg shadow-2xl" />
      <button onClick={(e) => { e.stopPropagation(); onNext(); }} className="absolute right-4 text-white/70 hover:text-white p-2"><ChevronRight size={36} /></button>
      <span className="absolute bottom-4 text-white/50 text-sm">{index + 1} / {fotos.length}</span>
    </div>
  );
}

function formatarData(data) {
  if (!data) return "";
  const [ano, mes, dia] = data.split("-");
  return new Date(ano, mes - 1, dia).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
}

export default function EventoPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [evento, setEvento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [lightbox, setLightbox] = useState({ aberto: false, index: 0 });

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDoc(doc(db, "eventos", id));
        snap.exists() ? setEvento({ id: snap.id, ...snap.data() }) : setNotFound(true);
      } catch { setNotFound(true); }
      finally { setLoading(false); }
    })();
  }, [id]);

  const fotos = evento?.fotos ?? [];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white pb-20">
        <div className="max-w-4xl mx-auto px-6 pt-10 flex flex-col gap-10">
          <button onClick={() => navigate("/eventos")}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-900 transition self-start">
            <ArrowLeft size={16} /> Todos os eventos
          </button>

          {loading && (
            <div className="flex flex-col gap-6 animate-pulse">
              <div className="h-64 bg-gray-200 rounded-2xl" />
              <div className="h-8 bg-gray-200 rounded w-2/3" />
              <div className="h-4 bg-gray-200 rounded w-full" />
            </div>
          )}

          {notFound && <p className="text-gray-500 text-center py-20">Evento não encontrado.</p>}

          {evento && !loading && (
            <div className="flex flex-col gap-8">
              {evento.fotoUrl && (
                <div className="w-full h-64 md:h-96 rounded-2xl overflow-hidden">
                  <img src={evento.fotoUrl} alt={evento.titulo} className="w-full h-full object-cover" />
                </div>
              )}

              <div className="flex flex-col gap-3">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{evento.titulo}</h1>
                <div className="flex flex-wrap gap-4 text-sm">
                  {evento.data && (
                    <span className="flex items-center gap-1 text-blue-900 font-semibold">
                      <Calendar size={15} /> {formatarData(evento.data)}{evento.horario ? ` · ${evento.horario}` : ""}
                    </span>
                  )}
                  {evento.local && (
                    <span className="flex items-center gap-1 text-gray-500">
                      <MapPin size={15} /> {evento.local}
                    </span>
                  )}
                </div>
              </div>

              {evento.descricao && (
                <p className="text-gray-600 leading-relaxed text-lg">{evento.descricao}</p>
              )}

              {fotos.length > 0 && (
                <div className="flex flex-col gap-4">
                  <h2 className="text-xl font-bold text-gray-900">Galeria</h2>
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