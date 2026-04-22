import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { ArrowLeft, Calendar, MapPin, Share2 } from "lucide-react";

import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import OptimizedImage from "../components/OptimizedImage";
import Lightbox from "../components/Lightbox/Lightbox";
import { useLightbox } from "../hooks/useLightbox";
import { useSEO } from "../hooks/useSEO";

function formatarData(data) {
  if (!data) return "";
  try {
    const [ano, mes, dia] = data.split("-");
    return new Date(ano, mes - 1, dia).toLocaleDateString("pt-BR", {
      day: "2-digit", month: "long", year: "numeric",
    });
  } catch { return data; }
}

export default function EventoPage() {
  const { id } = useParams();

  const [evento, setEvento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => { setTimeout(() => window.scrollTo(0, 0), 0); }, []);

  useSEO({
    title: evento?.titulo ?? "Evento",
    description: evento?.descricao,
    image: evento?.fotoUrl,
  });

  useEffect(() => {
    async function buscarEvento() {
      try {
        const snap = await getDoc(doc(db, "eventos", id));
        if (snap.exists()) {
          setEvento({ id: snap.id, ...snap.data() });
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error("Erro ao buscar evento:", error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    buscarEvento();
  }, [id]);

  const fotos = evento?.fotos ?? [];
  const { lightbox, abrirEm, fechar, anterior, proximo } = useLightbox(fotos);

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: evento?.titulo, url });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // usuário cancelou o share ou permissão negada
    }
  };

  return (
    <>
      <Header />

      <main className="min-h-screen bg-white pb-20">
        <div className="max-w-4xl mx-auto px-6 pt-24 flex flex-col gap-10">

          {/* Voltar */}
          <Link
            to="/eventos"
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-900 transition self-start"
          >
            <ArrowLeft size={16} /> Todos os eventos
          </Link>

          {/* Loading */}
          {loading && (
            <div className="flex flex-col gap-6 animate-pulse">
              <div className="aspect-[3/4] bg-gray-200 rounded-2xl" />
              <div className="h-8 bg-gray-200 rounded w-2/3" />
              <div className="h-4 bg-gray-200 rounded w-full" />
            </div>
          )}

          {/* Não encontrado */}
          {notFound && (
            <p className="text-gray-500 text-center py-20">Hmm, não encontramos esse evento. Ele pode ter sido removido ou o link está incorreto.</p>
          )}

          {/* Conteúdo */}
          {evento && !loading && (
            <div className="flex flex-col gap-8">

              {/* Foto principal — formato banner igual ao card */}
              {evento.fotoUrl && (
                <div className="w-full rounded-2xl overflow-hidden">
                  <OptimizedImage
                    src={evento.fotoUrl}
                    alt={evento.titulo}
                    className="w-full h-auto object-cover object-top"
                  />
                </div>
              )}

              <div className="flex flex-col gap-3">
                <div className="flex items-start justify-between gap-4">
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{evento.titulo}</h1>
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-2 text-sm text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition flex-shrink-0"
                  >
                    <Share2 size={14} />
                    {copied ? "Copiado!" : "Compartilhar"}
                  </button>
                </div>

                <div className="flex flex-wrap gap-4 text-sm">
                  {evento.data && (
                    <span className="flex items-center gap-1 text-blue-900 font-semibold">
                      <Calendar size={15} />
                      {formatarData(evento.data)}
                      {evento.horario && ` · ${evento.horario}`}
                    </span>
                  )}
                  {evento.local && (
                    <span className="flex items-center gap-1 text-gray-500">
                      <MapPin size={15} />
                      {evento.local}
                    </span>
                  )}
                </div>
              </div>

              {evento.descricao && (
                <p className="text-gray-600 leading-relaxed text-lg">{evento.descricao}</p>
              )}

              {/* Galeria */}
              {fotos.length > 0 && (
                <div className="flex flex-col gap-4">
                  <h2 className="text-xl font-bold text-gray-900">Galeria</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {fotos.map((url, i) => (
                      <button
                        key={url}
                        onClick={() => abrirEm(i)}
                        className="group aspect-[3/4] rounded-xl overflow-hidden hover:opacity-90 transition"
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
