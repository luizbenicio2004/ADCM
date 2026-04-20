import { useState, useEffect, useCallback, useRef } from "react";
import { useConfig } from "../../context/ConfigContext";
import { useAuth } from "../../context/AuthContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, LayoutDashboard } from "lucide-react";
import OptimizedImage from "../OptimizedImage";

export default function Header() {
  const { config, loading } = useConfig();
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";
  const solidBg = !isHome || scrolled;

  // ── Contadores para acesso secreto ──────────────────────────────
  const logoClickCount = useRef(0);
  const logoClickTimer = useRef(null);

  // Opção 3 — 3 cliques no logo
  const handleLogoClick = useCallback((e) => {
    logoClickCount.current += 1;
    clearTimeout(logoClickTimer.current);
    logoClickTimer.current = setTimeout(() => {
      logoClickCount.current = 0;
    }, 1500);
    if (logoClickCount.current >= 3) {
      logoClickCount.current = 0;
      clearTimeout(logoClickTimer.current);
      e.preventDefault();
      navigate("/admin/login");
    }
  }, [navigate]);

  // Opção 1 — clique secreto no footer (Footer.jsx dispara o evento)
  useEffect(() => {
    const handler = () => navigate("/admin/login");
    window.addEventListener("adcm:secret-footer", handler);
    return () => window.removeEventListener("adcm:secret-footer", handler);
  }, [navigate]);

  // Opção 2 — atalho de teclado Ctrl + Shift + A
  useEffect(() => {
    const handler = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === "A") {
        e.preventDefault();
        navigate("/admin/login");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [navigate]);
  // ────────────────────────────────────────────────────────────────

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
  const navHref = (id) => (isHome ? `#${id}` : `/#${id}`);

  const items = ["sobre", "cultos", "ministerios", "eventos", "reciclagem", "avisos"];
  const labelMap = {
    sobre: "Sobre",
    cultos: "Cultos",
    ministerios: "Ministérios",
    eventos: "Eventos",
    reciclagem: "Reciclagem",
    avisos: "Avisos",
  };

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={
          solidBg
            ? {
                background: "rgba(255,255,255,0.95)",
                backdropFilter: "blur(12px)",
                boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
              }
            : { background: "transparent" }
        }
      >
        <div className="max-w-[1100px] mx-auto px-6 h-[72px] flex items-center justify-between">

          {/* Logo — 3 cliques = acesso admin */}
          <a
            href="/"
            className="flex items-center gap-3 no-underline"
            onClick={(e) => { handleLinkClick(); handleLogoClick(e); }}
          >
            <OptimizedImage
              src="/logo.webp"
              alt="Logo ADCM Poá"
              className="w-[60px] h-[60px] object-contain rounded-full"
            />
            <div>
              <span
                className="block text-lg font-bold leading-tight transition-colors duration-300"
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  color: solidBg ? "#1e3a8a" : "white",
                }}
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

            {/* Botão admin discreto — visível para todos */}
            <Link
              to="/admin/login"
              className="flex items-center justify-center w-8 h-8 rounded-lg opacity-30 hover:opacity-70 transition-all duration-300"
              style={{ color: solidBg ? "#1e3a8a" : "white" }}
              title="Admin"
            >
              <LayoutDashboard size={16} />
            </Link>

            {/* Botão admin completo — só quando logado */}
            {user && (
              <Link
                to="/admin/dashboard"
                className="flex items-center gap-1.5 text-sm font-semibold px-3 py-2 rounded-lg border transition-all duration-300"
                style={{
                  color: solidBg ? "#1e3a8a" : "white",
                  borderColor: solidBg ? "rgba(30,58,138,0.3)" : "rgba(255,255,255,0.4)",
                }}
              >
                <LayoutDashboard size={15} />
                Admin
              </Link>
            )}
          </nav>

          {/* Hamburguer */}
          <button
            className="flex md:hidden w-10 h-10 items-center justify-center rounded-lg transition-colors duration-300"
            style={{ color: solidBg ? "#1e3a8a" : "white" }}
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
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
          aria-hidden="true"
        />
      )}

      {/* Menu mobile drawer */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navegação"
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
            className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-900 text-xl transition-colors rounded-lg hover:bg-gray-100"
          >
            &#x2715;
          </button>
        </div>

        <nav className="flex flex-col gap-2 flex-1 overflow-y-auto">
          {items.map((item) => (
            <a
              key={item}
              href={navHref(item)}
              onClick={handleLinkClick}
              className="text-lg font-semibold text-gray-800 px-4 py-3 rounded-md hover:bg-gray-50 hover:text-blue-900 transition-colors min-h-[44px] flex items-center"
            >
              {labelMap[item]}
            </a>
          ))}
          <a
            href={navHref("localizacao")}
            onClick={handleLinkClick}
            className="mt-4 text-base font-bold text-white bg-red-600 px-4 py-4 rounded-md text-center hover:bg-red-700 transition-colors min-h-[44px] flex items-center justify-center"
          >
            Venha nos Visitar
          </a>

          {/* Botão admin discreto no mobile */}
          <Link
            to="/admin/login"
            onClick={handleLinkClick}
            className="mt-2 text-sm text-gray-400 px-4 py-3 rounded-md hover:bg-gray-50 transition-colors min-h-[44px] flex items-center gap-2 opacity-40 hover:opacity-70"
          >
            <LayoutDashboard size={14} />
            Admin
          </Link>

          {user && (
            <Link
              to="/admin/dashboard"
              onClick={handleLinkClick}
              className="text-base font-semibold text-blue-900 border border-blue-900/30 px-4 py-3 rounded-md text-center hover:bg-blue-50 transition-colors min-h-[44px] flex items-center justify-center gap-2"
            >
              <LayoutDashboard size={16} />
              Painel Admin
            </Link>
          )}
        </nav>
      </div>
    </>
  );
}