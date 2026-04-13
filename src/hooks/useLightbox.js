import { useState, useCallback } from "react";

/**
 * Hook para gerenciar estado do Lightbox de galeria.
 * Retorna { lightbox, abrirEm, fechar, anterior, proximo }
 */
export function useLightbox(fotos = []) {
  const [lightbox, setLightbox] = useState({ aberto: false, index: 0 });

  const abrirEm = useCallback((index) => setLightbox({ aberto: true, index }), []);
  const fechar  = useCallback(() => setLightbox({ aberto: false, index: 0 }), []);
  const anterior = useCallback(() =>
    setLightbox((l) => ({ ...l, index: (l.index - 1 + fotos.length) % fotos.length })),
  [fotos.length]);
  const proximo = useCallback(() =>
    setLightbox((l) => ({ ...l, index: (l.index + 1) % fotos.length })),
  [fotos.length]);

  return { lightbox, abrirEm, fechar, anterior, proximo };
}
