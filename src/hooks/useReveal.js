import { useEffect, useRef, useState } from "react";

/**
 * useReveal
 * Hook para animar um elemento quando ele entra na tela.
 *
 * Como funciona:
 * 1. Você passa a ref retornada para o elemento que quer animar.
 * 2. O hook observa quando esse elemento fica visível na tela.
 * 3. Quando visível, retorna isVisible = true (anima uma vez só).
 * 4. O observer se desconecta para economizar performance.
 *
 * @param {number} threshold - % do elemento visível para disparar (0 a 1)
 * @returns {[React.RefObject, boolean]} [ref, isVisible]
 *
 * Uso:
 *   const [ref, visible] = useReveal();
 *   <section ref={ref} className={`reveal ${visible ? "reveal--active" : ""}`}>
 */
export function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // anima só uma vez
        }
      },
      { threshold }
    );

    observer.observe(element);

    // Cleanup: caso o componente desmonte antes de animar
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, isVisible];
}

/**
 * useRevealStagger
 * Hook para animar um grid de cards com efeito escalonado (cascata).
 *
 * Como funciona:
 * 1. Você passa a ref retornada para o CONTAINER do grid.
 * 2. Quando o container entra na tela, o hook encontra todos
 *    os filhos com a classe .reveal e adiciona .reveal--active neles.
 * 3. O CSS de .reveal--stagger aplica transition-delay crescente
 *    em cada filho, criando o efeito cascata.
 *
 * @returns {React.RefObject} ref para o container
 *
 * Uso:
 *   const gridRef = useRevealStagger();
 *   <div ref={gridRef} className="meuGrid reveal--stagger">
 *     <div className="card reveal">Card 1</div>
 *     <div className="card reveal">Card 2</div>
 *   </div>
 */
export function useRevealStagger(threshold = 0.1) {
  const ref = useRef(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          container.querySelectorAll(".reveal").forEach((el) => {
            el.classList.add("reveal--active");
          });
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [threshold]);

  return ref;
}

// Exportação padrão aponta para useReveal
// (mantém compatibilidade se algo ainda importar o default)
export default useReveal;