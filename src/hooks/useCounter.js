// src/hooks/useCounter.js
// Anima um número do zero até o valor final quando o elemento
// entra na viewport. Suporta valores como "200+" e "10+".
// CORRIGIDO: lida com valorFinal assíncrono (chega do Firebase depois da montagem)

import { useEffect, useRef, useState } from "react";

export function useCounter(valorFinal, duracao = 1800) {
  const nodeRef = useRef(null);
  const animou = useRef(false);

  // Separa a parte numérica do sufixo ("200+" → 200, "+")
  const numero = parseInt(valorFinal, 10);
  const sufixo = isNaN(numero) ? "" : String(valorFinal).replace(String(numero), "");

  // Mostra o valor bruto enquanto não há número válido
  const [exibido, setExibido] = useState(valorFinal ?? "0");

  function animar(num, suf) {
    animou.current = true;
    const inicio = performance.now();
    function tick(agora) {
      const progresso = Math.min((agora - inicio) / duracao, 1);
      const ease = 1 - Math.pow(1 - progresso, 4);
      setExibido(Math.round(ease * num) + suf);
      if (progresso < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  // Quando o valor vem do Firebase (muda de undefined/NaN para número real),
  // reseta o flag e anima — independente se o elemento está na tela ou não.
  useEffect(() => {
    if (isNaN(numero)) return;
    animou.current = false; // permite animar com o valor real
    const node = nodeRef.current;
    if (!node) return;

    const rect = node.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      // Elemento já visível → anima imediatamente
      animar(numero, sufixo);
    } else {
      // Ainda fora da viewport → aguarda com observer
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !animou.current) {
            animar(numero, sufixo);
            observer.disconnect();
          }
        },
        { threshold: 0.3 }
      );
      observer.observe(node);
      return () => observer.disconnect();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numero, sufixo]);

  // ref de objeto simples — o nó nunca desmonta entre renders do Firebase
  const ref = (node) => { nodeRef.current = node; };

  return [ref, exibido];
}
