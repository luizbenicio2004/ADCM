// src/hooks/useReveal.js
import { useEffect, useRef, useState } from "react";

export function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(true); // 👈 começa visível (ESSENCIAL)

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element);
        }
      },
      { threshold }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold]);

  return [ref, isVisible];
}

export function useRevealStagger(threshold = 0.15) {
  const ref = useRef(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const elements = container.querySelectorAll(".reveal");

    const activate = () => {
      elements.forEach((el, index) => {
        setTimeout(() => {
          el.classList.add("reveal--active");
        }, index * 120);
      });
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          activate();
          observer.unobserve(container);
        }
      },
      { threshold }
    );

    observer.observe(container);

    return () => observer.disconnect();
  }, [threshold]);

  return ref;
}

export default useReveal;