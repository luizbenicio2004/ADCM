import { useState, useEffect } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 20);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function handleLinkClick() {
    setMenuOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const items = ["sobre", "cultos", "ministerios", "avisos", "teologia", "localizacao"];

  return (
    <header
      className={[
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "bg-white/95 backdrop-blur-md shadow-md" : "bg-transparent",
      ].join(" ")}
    >
      <div className="max-w-container mx-auto px-6 h-[72px] flex items-center justify-between">
        
        {/* Logo */}
        <a
          href="#hero"
          className="flex items-center gap-3 no-underline"
          onClick={handleLinkClick}
        >
          <img
            src="/logo.png"
            alt="Logo ADCM Poá"
            className="w-[60px] h-[60px] object-contain rounded-full"
          />
          <div>
            <span className="block font-display text-lg font-bold text-primary leading-tight">
              ADCM Poá
            </span>
            <span className="block text-xs text-text-muted tracking-widest uppercase leading-none">
              Assembleia de Deus
            </span>
          </div>
        </a>

        {/* Nav desktop */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Navegacao principal">
          {items.map((item) => (
            <a
              key={item}
              href={`#${item}`}
              className={[
                "relative text-sm font-semibold text-gray-800 pb-[3px] capitalize",
                "after:content-[''] after:absolute after:left-0 after:bottom-0",
                "after:w-0 after:h-[2px] after:bg-primary after:rounded-full",
                "after:transition-all after:duration-300",
                "hover:text-primary hover:after:w-full transition-colors duration-300",
              ].join(" ")}
            >
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </a>
          ))}

          <a
            href="#localizacao"
            className="text-sm font-bold text-white bg-secondary px-4 py-2 rounded-sm hover:bg-secondary-hover hover:-translate-y-px transition-all duration-300"
          >
            Venha nos Visitar
          </a>
        </nav>

        {/* Botão hamburguer */}
        <button
          className="flex md:hidden w-10 h-10 items-center justify-center rounded-sm hover:bg-bg-alt transition-colors duration-300"
          onClick={() => setMenuOpen(true)}
          aria-label="Abrir menu de navegacao"
          aria-expanded={menuOpen}
        >
          <span
            className={[
              "relative block w-[22px] h-[2px] bg-gray-800 rounded-full",
              "before:content-[''] before:absolute before:left-0 before:-top-[7px]",
              "before:w-full before:h-[2px] before:bg-gray-800 before:rounded-full",
              "after:content-[''] after:absolute after:left-0 after:top-[7px]",
              "after:w-full after:h-[2px] after:bg-gray-800 after:rounded-full",
            ].join(" ")}
            aria-hidden="true"
          />
        </button>
      </div>

      {/* Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-[51] bg-black/50 backdrop-blur-sm"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Menu mobile */}
      <div
        className={[
          "fixed top-0 right-0 bottom-0 z-[52] bg-white flex flex-col p-6",
          "w-[min(320px,85vw)] transition-transform duration-[350ms]",
          menuOpen ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
      >
        {/* Topo */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b">
          <a href="#hero" className="flex items-center gap-3" onClick={handleLinkClick}>
            <img src="/logo.png" alt="Logo" className="w-[60px] h-[60px]" />
            <span className="font-bold text-primary">ADCM Poá</span>
          </a>

          <button onClick={() => setMenuOpen(false)} aria-label="Fechar menu">
            ✕
          </button>
        </div>

        {/* Links mobile */}
        <nav className="flex flex-col gap-2">
          {items.map((item) => (
            <a
              key={item}
              href={`#${item}`}
              onClick={handleLinkClick}
              className="text-lg font-semibold text-gray-800 px-4 py-3 rounded-md hover:bg-bg-alt hover:text-primary capitalize"
            >
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </a>
          ))}

          <a
            href="#localizacao"
            className="mt-4 text-base font-bold text-white bg-secondary px-4 py-4 rounded-md text-center"
            onClick={handleLinkClick}
          >
            Venha nos Visitar
          </a>
        </nav>
      </div>
    </header>
  );
}