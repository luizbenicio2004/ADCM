import { useConfig } from "../../context/ConfigContext";

const PLATAFORMA_URL_FALLBACK = "https://escola.adcmpoa.com";

const diferenciais = [
  {
    icone: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
      </svg>
    ),
    titulo: "Módulos estruturados",
    descricao: "Conteúdo organizado de forma progressiva, do básico ao avançado.",
  },
  {
    icone: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" />
      </svg>
    ),
    titulo: "Aulas em vídeo",
    descricao: "Assista quando e onde quiser, no seu ritmo.",
  },
  {
    icone: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
      </svg>
    ),
    titulo: "Apostilas em PDF",
    descricao: "Material de apoio para leitura e estudo pessoal.",
  },
];

const passos = [
  { num: "1", titulo: "Interesse",  descricao: "Entre em contato com a igreja" },
  { num: "2", titulo: "Aprovação",  descricao: "A liderança confirma sua matrícula" },
  { num: "3", titulo: "Código",     descricao: "Você recebe seu código de acesso" },
  { num: "4", titulo: "Acesso",     descricao: "Cadastre-se e comece a estudar" },
];

export default function Teologia() {
  // Animações removidas — refs e flags fixos para evitar opacity-0 no carregamento
  const refTopo = null;
  const visivelTopo = true;
  const refCards = null;
  const cardsVisible = true;
  const refPassos = null;
  const visivelPassos = true;
  const { config } = useConfig();

  const whatsapp    = config?.whatsapp || "";
  const plataformaUrl = config?.teologia?.plataformaUrl || PLATAFORMA_URL_FALLBACK;
  const waLink = whatsapp
    ? `https://wa.me/${whatsapp}?text=Ol%C3%A1!%20Tenho%20interesse%20na%20Escola%20de%20Teologia.`
    : "#localizacao";

  return (
    <section id="teologia" className="py-20 px-6" style={{ backgroundColor: "#0d1b4b" }}>
      <div className="max-w-[1100px] mx-auto">

        {/* TOPO */}
        <div
          ref={refTopo}
          className={`text-center mb-14 transition-all duration-700 ${
            visivelTopo ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <span className="inline-block mb-4 text-[11px] font-bold tracking-[2px] uppercase px-4 py-1 rounded-full"
            style={{ color: "#fbbf24", border: "1px solid rgba(251,191,36,0.3)", backgroundColor: "rgba(251,191,36,0.1)" }}>
            Formação Teológica
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            Escola de Teologia ADCM Poá
          </h2>
          <p className="text-white/70 text-base max-w-[540px] mx-auto leading-relaxed">
            Aprofunde seu conhecimento bíblico com uma formação estruturada —
            acessível de onde você estiver, com aulas em vídeo, apostilas e orientação pastoral.
            <strong className="text-white/90 block mt-2">Você não precisa saber tudo para começar.</strong>
          </p>
        </div>

        {/* CARDS */}
        <div ref={refCards} className="grid md:grid-cols-3 gap-5 mb-14">
          {diferenciais.map((item, index) => (
            <div
              key={item.titulo}
              className={`border rounded-lg p-6 hover:-translate-y-1 transition-all duration-500 ${
                cardsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
              style={{
                backgroundColor: "rgba(255,255,255,0.05)",
                borderColor: "rgba(255,255,255,0.1)",
                transitionDelay: cardsVisible ? `${index * 100}ms` : "0ms",
              }}
            >
              <div className="w-10 h-10 flex items-center justify-center rounded-md mb-4"
                style={{ backgroundColor: "rgba(251,191,36,0.15)", color: "#fbbf24" }}>
                {item.icone}
              </div>
              <h3 className="text-sm font-bold text-white mb-2">{item.titulo}</h3>
              <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>{item.descricao}</p>
            </div>
          ))}
        </div>

        <hr className="mb-12" style={{ borderColor: "rgba(255,255,255,0.1)" }} />

        {/* PASSOS */}
        <div
          ref={refPassos}
          className={`mb-12 transition-all duration-700 ${
            visivelPassos ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <p className="text-center text-xs font-bold uppercase tracking-widest mb-8"
            style={{ color: "rgba(255,255,255,0.4)" }}>
            Como funciona o acesso
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {passos.map((passo, i) => (
              <div key={passo.num} className="flex flex-col items-center text-center relative">
                {i < passos.length - 1 && (
                  <div className="hidden md:block absolute top-4 left-[calc(50%+20px)] right-[calc(-50%+20px)] h-px"
                    style={{ backgroundColor: "rgba(255,255,255,0.1)" }} />
                )}
                <div className="w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold mb-3 relative z-10"
                  style={{ backgroundColor: "#1e3a8a", border: "1px solid #3b82f6", color: "#3b82f6" }}>
                  {passo.num}
                </div>
                <h4 className="text-sm font-bold text-white mb-1">{passo.titulo}</h4>
                <p className="text-xs leading-relaxed px-1" style={{ color: "rgba(255,255,255,0.4)" }}>{passo.descricao}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={waLink}
            target={whatsapp ? "_blank" : undefined}
            rel={whatsapp ? "noopener noreferrer" : undefined}
            className="inline-flex items-center justify-center gap-2 text-white font-bold text-sm px-8 py-3 rounded-sm hover:-translate-y-px transition-all duration-300"
            style={{ backgroundColor: "#dc2626" }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = "#b91c1c"}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = "#dc2626"}
          >
            Quero me inscrever
          </a>
          <a
            href={plataformaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 font-semibold text-sm px-8 py-3 rounded-sm transition-all duration-300 hover:text-white"
            style={{ color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.15)" }}
          >
            Já tenho acesso →
          </a>
        </div>

      </div>
    </section>
  );
}
