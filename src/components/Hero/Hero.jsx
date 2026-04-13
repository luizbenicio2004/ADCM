import { useEffect, useState, useRef } from "react";
import { useConfig } from "../../context/ConfigContext";
import OptimizedImage from "../OptimizedImage";

function gerarParticulas(qtd = 28) {
  return Array.from({ length: qtd }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    tamanho: Math.random() * 3 + 1,
    duracao: Math.random() * 4 + 3,
    delay: Math.random() * 5,
    opacidade: Math.random() * 0.4 + 0.1,
  }));
}

const DEFAULTS = {
  titulo: "Igreja ADCM Poá",
  subtitulo:
    "Aqui a vida muda. Encontre comunidade, propósito e fé genuína —\ntoda semana, em Poá.",
  botaoPrimario: "Ver Cultos",
  botaoPrimarioLink: "#cultos",
  botaoSecundario: "Como Chegar →",
  botaoSecundarioLink: "#localizacao",
  badge: "Você é esperado aqui",
  imagemFundo: "",
};

export default function Hero() {
  const [visivel, setVisivel] = useState(false);
  const particulas = useRef(gerarParticulas(28));
  const { config } = useConfig();

  const hero = { ...DEFAULTS, ...(config?.hero ?? {}) };

  useEffect(() => {
    const t = setTimeout(() => setVisivel(true), 80);
    return () => clearTimeout(t);
  }, []);

  function fadeUp(delay = "0ms") {
    return {
      transition: `opacity 0.7s ease ${delay}, transform 0.7s ease ${delay}`,
      opacity: visivel ? 1 : 0,
      transform: visivel ? "translateY(0)" : "translateY(28px)",
    };
  }

  const temImagem = Boolean(hero.imagemFundo);

  return (
    <section
      id="hero"
      className="relative min-h-screen overflow-hidden flex items-center justify-center text-center pt-[120px] pb-20 px-6 text-white"
      style={{
        background: temImagem
          ? undefined
          : "linear-gradient(135deg, #0a1f5e 0%, #1e3a8a 55%, #1d4ed8 100%)",
      }}
    >
      {temImagem && (
        <>
          <img
            src={hero.imagemFundo}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ zIndex: 0 }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, rgba(10,31,94,0.85) 0%, rgba(30,58,138,0.80) 55%, rgba(29,78,216,0.75) 100%)",
              zIndex: 1,
            }}
          />
        </>
      )}

      <div
        aria-hidden="true"
        className="absolute w-[500px] h-[500px] rounded-full pointer-events-none -top-[150px] -left-[100px]"
        style={{ background: "rgba(59,130,246,0.12)", zIndex: 2 }}
      />
      <div
        aria-hidden="true"
        className="absolute w-[300px] h-[300px] rounded-full pointer-events-none -bottom-[80px] right-[15%]"
        style={{ background: "rgba(255,255,255,0.04)", zIndex: 2 }}
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{ zIndex: 2 }}
      >
        {particulas.current.map((p) => (
          <span
            key={p.id}
            className="absolute rounded-full bg-white"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.tamanho}px`,
              height: `${p.tamanho}px`,
              opacity: p.opacidade,
              animation: `particulaPulsar ${p.duracao}s ease-in-out ${p.delay}s infinite`,
            }}
          />
        ))}
      </div>

      <div
        className="relative max-w-[680px] w-full flex flex-col items-center gap-6"
        style={{ zIndex: 3 }}
      >
        <div
          style={{
            ...fadeUp("0ms"),
            animation: visivel ? "heroFloat 4s ease-in-out infinite" : "none",
          }}
        >
          <OptimizedImage
            src="/logo.webp"
            alt="Logo ADCM Poá"
            fetchpriority="high"
            loading="eager"
            width="96"
            height="96"
            className="w-24 h-24 rounded-full object-contain shadow-lg"
            style={{ background: "rgba(255,255,255,0.08)", padding: "6px" }}
          />
        </div>

        {hero.badge && (
          <span
            style={fadeUp("100ms")}
            className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-xs font-semibold tracking-[1.5px] uppercase text-white/90"
          >
            ✦ {hero.badge}
          </span>
        )}

        <h1
          style={{
            ...fadeUp("200ms"),
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "clamp(2rem, 6vw, 4rem)",
          }}
          className="font-bold leading-[1.15] text-white"
        >
          Bem-vindo à <br />
          <span className="text-[#fbbf24] block">{hero.titulo}</span>
        </h1>

        <p
          style={{
            ...fadeUp("320ms"),
            fontSize: "clamp(1rem, 2vw, 1.125rem)",
          }}
          className="text-white/80 leading-[1.75] max-w-[500px]"
        >
          {hero.subtitulo}
        </p>

        <div
          style={fadeUp("440ms")}
          className="flex gap-4 flex-wrap justify-center"
        >
          {hero.botaoPrimario && (
            <a
              href={hero.botaoPrimarioLink}
              className="inline-flex items-center gap-2 px-8 py-3 rounded bg-[#dc2626] text-white text-sm font-bold hover:bg-[#b91c1c] hover:-translate-y-[2px] transition-all duration-300 shadow-lg"
            >
              {hero.botaoPrimario}
            </a>
          )}
          {hero.botaoSecundario && (
            <a
              href={hero.botaoSecundarioLink}
              className="inline-flex items-center gap-2 px-8 py-3 rounded text-white text-sm font-bold border-2 border-white/35 hover:bg-white/15 hover:border-white/70 hover:-translate-y-[2px] transition-all duration-300"
            >
              {hero.botaoSecundario}
            </a>
          )}
        </div>

        <div
          style={fadeUp("600ms")}
          className="hidden md:flex flex-col items-center gap-2 mt-4 text-xs tracking-[1.5px] uppercase text-white/40"
          aria-hidden="true"
        >
          <div
            className="w-px h-12"
            style={{
              background:
                "linear-gradient(to bottom, transparent, rgba(255,255,255,0.5))",
              animation: "scrollLine 2s ease-in-out infinite",
            }}
          />
          <span>Role para baixo</span>
        </div>
      </div>
    </section>
  );
}
