import { useEffect, useState, useRef } from "react";

// Gera partículas com posição e animação aleatórias
function gerarParticulas(qtd = 28) {
  return Array.from({ length: qtd }, (_, i) => ({
    id:       i,
    x:        Math.random() * 100,       // % horizontal
    y:        Math.random() * 100,       // % vertical
    tamanho:  Math.random() * 3 + 1,    // 1px a 4px
    duracao:  Math.random() * 4 + 3,    // 3s a 7s
    delay:    Math.random() * 5,         // 0s a 5s
    opacidade: Math.random() * 0.4 + 0.1, // 0.1 a 0.5
  }));
}

export default function Hero() {
  const [visivel, setVisivel] = useState(false);
  const particulas = useRef(gerarParticulas(28));

  useEffect(() => {
    const t = setTimeout(() => setVisivel(true), 80);
    return () => clearTimeout(t);
  }, []);

  function fadeUp(delay = "0ms") {
    return {
      transition: `opacity 0.7s ease ${delay}, transform 0.7s ease ${delay}`,
      opacity:    visivel ? 1 : 0,
      transform:  visivel ? "translateY(0)" : "translateY(28px)",
    };
  }

  return (
    <section
      id="hero"
      className="relative min-h-screen overflow-hidden flex items-center justify-center text-center pt-[120px] pb-20 px-6 text-white"
      style={{ background: "linear-gradient(135deg, #0a1f5e 0%, #1e3a8a 55%, #1d4ed8 100%)" }}
    >
      {/* Círculo decorativo 1 */}
      <div
        aria-hidden="true"
        className="absolute w-[500px] h-[500px] rounded-full pointer-events-none -top-[150px] -left-[100px]"
        style={{ background: "rgba(59,130,246,0.12)" }}
      />

      {/* Círculo decorativo 2 */}
      <div
        aria-hidden="true"
        className="absolute w-[300px] h-[300px] rounded-full pointer-events-none -bottom-[80px] right-[15%]"
        style={{ background: "rgba(255,255,255,0.04)" }}
      />

      {/* Partículas */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden">
        {particulas.current.map((p) => (
          <span
            key={p.id}
            className="absolute rounded-full bg-white"
            style={{
              left:      `${p.x}%`,
              top:       `${p.y}%`,
              width:     `${p.tamanho}px`,
              height:    `${p.tamanho}px`,
              opacity:   p.opacidade,
              animation: `particulaPulsar ${p.duracao}s ease-in-out ${p.delay}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Conteúdo */}
      <div className="relative z-10 max-w-[680px] w-full flex flex-col items-center gap-6">

        {/* Logo com flutuação */}
        <div style={{ ...fadeUp("0ms"), animation: visivel ? "heroFloat 4s ease-in-out infinite" : "none" }}>
          <img
            src="/logo.png"
            alt="Logo ADCM Poá"
            fetchPriority="high"
            loading="eager"
            width="96"
            height="96"
            className="w-24 h-24 rounded-full object-contain shadow-lg"
            style={{ background: "rgba(255,255,255,0.08)", padding: "6px" }}
          />
        </div>

        {/* Badge */}
        <span
          style={fadeUp("100ms")}
          className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-xs font-semibold tracking-[1.5px] uppercase text-white/90"
        >
          + Bem-vindo à nossa família
        </span>

        {/* Título */}
        <h1
          style={{
            ...fadeUp("200ms"),
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize:   "clamp(2rem, 6vw, 4rem)",
          }}
          className="font-bold leading-[1.15] text-white"
        >
          Bem-vindo à <br />
          <span className="text-[#fbbf24] block">Igreja ADCM Poá</span>
        </h1>

        {/* Subtítulo */}
        <p
          style={{ ...fadeUp("320ms"), fontSize: "clamp(1rem, 2vw, 1.125rem)" }}
          className="text-white/75 leading-[1.75] max-w-[480px]"
        >
          Um lugar de fé, amor e esperança para você e sua família.
          <br />
          Venha fazer parte desta comunidade.
        </p>

        {/* Botões */}
        <div style={fadeUp("440ms")} className="flex gap-4 flex-wrap justify-center">
          
          <a
            href="#cultos"
            className="inline-flex items-center gap-2 px-8 py-3 rounded bg-[#dc2626] text-white text-sm font-bold hover:bg-[#b91c1c] hover:-translate-y-[2px] transition-all duration-300"
          >
            Ver Cultos
          </a>
          <a  
            href="#localizacao"
            className="inline-flex items-center gap-2 px-8 py-3 rounded text-white text-sm font-bold border-2 border-white/35 hover:bg-white/15 hover:border-white/70 hover:-translate-y-[2px] transition-all duration-300"
          >
            Como Chegar →
          </a>
        </div>

        {/* Scroll indicator */}
        <div
          style={fadeUp("600ms")}
          className="hidden md:flex flex-col items-center gap-2 mt-4 text-xs tracking-[1.5px] uppercase text-white/40"
          aria-hidden="true"
        >
          <div
            className="w-px h-12"
            style={{
              background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.5))",
              animation:  "scrollLine 2s ease-in-out infinite",
            }}
          />
          <span>Role para baixo</span>
        </div>

      </div>

      <style>{`
        @keyframes heroFloat {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-10px); }
        }
        @keyframes scrollLine {
          0%, 100% { opacity: 0.3; transform: scaleY(0.8); }
          50%       { opacity: 1;   transform: scaleY(1); }
        }
        @keyframes particulaPulsar {
          0%, 100% { opacity: var(--op, 0.2); transform: scale(1); }
          50%       { opacity: calc(var(--op, 0.2) * 2.5); transform: scale(1.6); }
        }
      `}</style>
    </section>
  );
}