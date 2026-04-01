// src/hooks/useCounter.js
// Anima um número do zero até o valor final quando o elemento
// entra na viewport. Suporta valores como "200+" e "10+".

import { useEffect, useRef, useState } from "react";

export function useCounter(valorFinal, duracao = 1800) {
  const [exibido, setExibido] = useState("0");
  const ref = useRef(null);
  const animou = useRef(false);

  // Separa a parte numérica do sufixo ("200+" → 200, "+")
  const numero = parseInt(valorFinal, 10);
  const sufixo = valorFinal.replace(String(numero), "");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animou.current) {
          animou.current = true;
          const inicio = performance.now();

          function tick(agora) {
            const progresso = Math.min((agora - inicio) / duracao, 1);
            // easeOutQuart — começa rápido, desacelera no final
            const ease = 1 - Math.pow(1 - progresso, 4);
            const atual = Math.round(ease * numero);
            setExibido(atual + sufixo);
            if (progresso < 1) requestAnimationFrame(tick);
          }

          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [numero, sufixo, duracao]);

  return [ref, exibido];
}