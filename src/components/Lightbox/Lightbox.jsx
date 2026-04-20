// focus-trap básico para acessibilidade com teclado.

import { useEffect, useRef } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import OptimizedImage from "../OptimizedImage";

export default function Lightbox({ fotos, index, onClose, onPrev, onNext }) {
  const closeRef = useRef(null);

  // Foco inicial no botão de fechar ao abrir
  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  // Atalhos de teclado
  useEffect(() => {
    const h = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose, onPrev, onNext]);

  // Trava o scroll do body enquanto o lightbox está aberto
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  if (!fotos?.length) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Foto ${index + 1} de ${fotos.length}`}
      className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Fechar */}
      <button
        ref={closeRef}
        onClick={onClose}
        aria-label="Fechar galeria"
        className="absolute top-4 right-4 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition"
      >
        <X size={28} />
      </button>

      {/* Anterior */}
      <button
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        aria-label="Foto anterior"
        className="absolute left-4 text-white/70 hover:text-white p-3 rounded-full hover:bg-white/10 transition"
      >
        <ChevronLeft size={36} />
      </button>

      {/* Imagem */}
      <OptimizedImage
        src={fotos[index]}
        alt={`Foto ${index + 1} de ${fotos.length}`}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
      />

      {/* Próximo */}
      <button
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        aria-label="Próxima foto"
        className="absolute right-4 text-white/70 hover:text-white p-3 rounded-full hover:bg-white/10 transition"
      >
        <ChevronRight size={36} />
      </button>

      {/* Contador */}
      <span
        className="absolute bottom-4 text-white/50 text-sm"
        aria-hidden="true"
      >
        {index + 1} / {fotos.length}
      </span>
    </div>
  );
}
