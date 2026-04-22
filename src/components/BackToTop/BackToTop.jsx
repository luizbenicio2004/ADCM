import { useState, useEffect } from "react";

export default function BackToTop() {
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setVisivel(window.scrollY > 400);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function voltarAoTopo() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <button
      onClick={voltarAoTopo}
      aria-label="Voltar ao topo da página"
      title="Voltar ao topo"
      className={
        "fixed bottom-36 right-8 md:bottom-24 z-50 w-12 h-12 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center shadow-lg hover:bg-[#3b82f6] hover:-translate-y-1 transition-all duration-300 " +
        (visivel ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none")
      }
    >
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <path d="M9 14V4M9 4L4 9M9 4L14 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  );
}