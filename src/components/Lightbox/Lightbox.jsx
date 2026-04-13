import { useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import OptimizedImage from "../OptimizedImage";

export default function Lightbox({ fotos, index, onClose, onPrev, onNext }) {
  useEffect(() => {
    const h = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose, onPrev, onNext]);

  if (!fotos?.length) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center" onClick={onClose}>
      <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white">
        <X size={28} />
      </button>

      <button onClick={(e) => { e.stopPropagation(); onPrev(); }} className="absolute left-4 text-white/70 hover:text-white p-2">
        <ChevronLeft size={36} />
      </button>

      <OptimizedImage
        src={fotos[index]}
        alt=""
        onClick={(e) => e.stopPropagation()}
        className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
      />

      <button onClick={(e) => { e.stopPropagation(); onNext(); }} className="absolute right-4 text-white/70 hover:text-white p-2">
        <ChevronRight size={36} />
      </button>

      <span className="absolute bottom-4 text-white/50 text-sm">
        {index + 1} / {fotos.length}
      </span>
    </div>
  );
}