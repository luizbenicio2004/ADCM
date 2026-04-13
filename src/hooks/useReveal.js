// src/hooks/useReveal.js
import { useEffect, useRef, useState, useCallback } from "react";

/**
 * useReveal — revela um único elemento ao entrar na viewport.
 *
 * CORREÇÃO: O hook precisa ser robusto a re-renders causados por dados
 * assíncronos (Firebase). A solução é usar um ref de callback em vez de
 * um ref de objeto: o callback é chamado SEMPRE que o elemento é montado
 * ou desmontado, garantindo que o Observer seja registrado no momento certo,
 * independente de quando os dados chegam.
 */
export function useReveal(threshold = 0.15) {
  const [isVisible, setIsVisible] = useState(false);
  const observerRef = useRef(null);

  const ref = useCallback(
    (node) => {
      // Limpa observer anterior se existir
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }

      if (!node) return;

      // Se já está visível na viewport, ativa imediatamente
      const rect = node.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        setIsVisible(true);
        return;
      }

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(node);
          }
        },
        { threshold }
      );
      observer.observe(node);
      observerRef.current = observer;
    },
    [threshold]
  );

  // Cleanup no unmount
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return [ref, isVisible];
}

/**
 * useRevealStagger — revela um container e aplica stagger nos filhos.
 *
 * MESMA CORREÇÃO: usa ref de callback para garantir que o Observer seja
 * registrado após os dados assíncronos chegarem e o DOM ser atualizado.
 */
export function useRevealStagger(threshold = 0.1) {
  const [visible, setVisible] = useState(false);
  const observerRef = useRef(null);

  const ref = useCallback(
    (node) => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }

      if (!node) return;

      // Se já está na viewport, ativa imediatamente
      const rect = node.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        setVisible(true);
        return;
      }

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(node);
          }
        },
        { threshold }
      );
      observer.observe(node);
      observerRef.current = observer;
    },
    [threshold]
  );

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return [ref, visible];
}

export default useReveal;
