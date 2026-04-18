import { useState, useEffect, useCallback } from "react";
import { useConfig } from "../../context/ConfigContext";
import { Link, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import OptimizedImage from "../OptimizedImage";

export default function Header() {
  const { config, loading } = useConfig();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";
  const solidBg = !isHome || scrolled;

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 20);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const handleLinkClick = useCallback(() => setMenuOpen(false), []);
  const navHref = (id) => isHome ? `#${id}` : `/#${id}`;

  const items = ["sobre", "cultos", "ministerios", "eventos", "reciclagem", "avisos", "teologia"];
  const labelMap = {
    sobre: "Sobre", cultos: "Cultos", ministerios: "Ministérios",
    eventos: "Eventos", reciclagem: "Reciclagem", avisos: "Avisos", teologia: "Teologia",
  };

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={solidBg
          ? { background: "rgba(255,255,255,0.95)", backdropFilter: "blur(12px)", boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }
          : { background: "transparent" }
        }
      >
        <div className="max-w-[1100px] mx-auto px-6 h-[72px] flex items-center justify-between">

          <a href="/" className="flex items-center gap-3 no-underline" onClick={handleLinkClick}>
            <OptimizedImage src="/logo.webp" alt="Logo ADCM Poá" className="w-[60px] h-[60px] object-contain rounded-full" />
            <div>
              <span
                className="block text-lg font-bold leading-tight transition-colors duration-300"
                style={{ fontFamily: "'Playfair Display', Georgia, serif", color: solidBg ? "#1e3a8a" : "white" }}
              >
                {loading ? "ADCM Poá" : config?.nome || "ADCM Poá"}
              </span>
              <span
                className="block text-xs tracking-widest uppercase leading-none transition-colors duration-300"
                style={{ color: solidBg ? "#6b7280" : "rgba(255,255,255,0.7)" }}
              >
                Assembleia de Deus
              </span>
            </div>
          </a>

          {/* Nav desktop */}
          <nav className="hidden md:flex items-center gap-5" aria-label="Navegação principal">
            {items.map((item) => (
              <a
                key={item}
                href={navHref(item)}
                onClick={handleLinkClick}
                className="relative text-sm font-semibold pb-[3px] after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-blue-900 after:rounded-full after:transition-all after:duration-300 hover:after:w-full transition-colors duration-300"
                style={{ color: solidBg ? "#1f2937" : "rgba(255,255,255,0.9)" }}
              >
                {labelMap[item]}
              </a>
            ))}
            <a
              href={navHref("localizacao")}
              onClick={handleLinkClick}
              className="text-sm font-bold text-white bg-red-600 px-4 py-2 rounded-sm hover:bg-red-700 hover:-translate-y-px transition-all duration-300"
            >
              Venha nos Visitar
            </a>
            <Link
              to="/admin/login"
              onClick={handleLinkClick}
              title="Área do Administrador"
              className="text-sm font-semibold px-3 py-2 rounded-md border transition-all duration-300"
              style={{
                color: solidBg ? "#6b7280" : "rgba(255,255,255,0.7)",
                borderColor: solidBg ? "#e5e7eb" : "rgba(255,255,255,0.3)",
              }}
            >
              ⚙️ Admin
            </Link>
          </nav>

          {/* Hamburguer */}
          <button
            className="flex md:hidden w-10 h-10 items-center justify-center rounded-lg transition-colors duration-300"
            style={{ color: solidBg ? "#1e3a8a" : "white" }}
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir menu"
            aria-expanded={menuOpen}
          >
            <Menu size={26} />
          </button>
        </div>
      </header>

      {/* Overlay mobile */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-[51] bg-black/50 backdrop-blur-sm"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Menu mobile drawer */}
      <div
        className={[
          "fixed top-0 right-0 bottom-0 z-[52] bg-white flex flex-col p-6",
          "w-[min(320px,85vw)] transition-transform duration-[350ms] shadow-2xl",
          menuOpen ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
      >
        <div className="flex items-center justify-between mb-8 pb-6 border-b">
          <a href="/" className="flex items-center gap-3" onClick={handleLinkClick}>
            <OptimizedImage src="/logo.webp" alt="Logo" className="w-[48px] h-[48px] rounded-full" />
            <span className="font-bold text-blue-900">{config?.nome || "ADCM Poá"}</span>
          </a>
          <button
            onClick={() => setMenuOpen(false)}
            aria-label="Fechar menu"
            className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-900 text-xl transition-colors"
          >
            ✕
          </button>
        </div>

        <nav className="flex flex-col gap-2 flex-1 overflow-y-auto">
          {items.map((item) => (
            <a
              key={item}
              href={navHref(item)}
              onClick={handleLinkClick}
              className="text-lg font-semibold text-gray-800 px-4 py-3 rounded-md hover:bg-gray-50 hover:text-blue-900 transition-colors"
            >
              {labelMap[item]}
            </a>
          ))}
          <a
            href={navHref("localizacao")}
            onClick={handleLinkClick}
            className="mt-4 text-base font-bold text-white bg-red-600 px-4 py-4 rounded-md text-center hover:bg-red-700 transition-colors"
          >
            Venha nos Visitar
          </a>
        </nav>

        <div className="mt-6 pt-4 border-t border-gray-100">
          <Link
            to="/admin/login"
            onClick={handleLinkClick}
            className="flex items-center gap-2 text-xs text-gray-400 hover:text-blue-900 transition-colors px-4 py-2 rounded-md hover:bg-gray-50"
          >
            ⚙️ Área do Administrador
          </Link>
        </div>
      </div>
    </>
  );
}