// Substitua as importações no topo do arquivo:
import { useReveal, useRevealStagger } from "../../hooks/useReveal";
import { CONTATOS, TEOLOGIA } from "../../data/igreja";

const PLATAFORMA_URL = TEOLOGIA.plataformaUrl;

const diferenciais = [
  {
    icone: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
    titulo: "Módulos estruturados",
    descricao: "Conteúdo organizado de forma progressiva, do básico ao avançado.",
  },
  {
    icone: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    ),
    titulo: "Aulas em vídeo",
    descricao: "Assista quando e onde quiser, sem horário fixo.",
  },
  {
    icone: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
    ),
    titulo: "Apostilas em PDF",
    descricao: "Material de apoio para leitura e estudo pessoal.",
  },
];

const passos = [
  { num: "1", titulo: "Interesse", descricao: "Entre em contato com a igreja" },
  { num: "2", titulo: "Aprovação", descricao: "A liderança confirma sua matrícula" },
  { num: "3", titulo: "Código", descricao: "Você recebe seu código de acesso" },
  { num: "4", titulo: "Acesso", descricao: "Cadastre-se e comece a estudar" },
];

export default function Teologia() {
  const [refTopo, visivelTopo] = useReveal();
  const refCards = useRevealStagger();
  const [refPassos, visivelPassos] = useReveal();

  return (
    <section id="teologia" className="py-20 px-6 bg-bg-dark">
      <div className="max-w-container mx-auto">

        {/* TOPO */}
        <div
          ref={refTopo}
          className={`text-center mb-14 transition-all duration-700 ${
            visivelTopo ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <span className="inline-block mb-4 text-[11px] font-bold tracking-[2px] uppercase text-accent border border-accent/30 bg-accent/10 px-4 py-1 rounded-full">
            Formação Teológica
          </span>

          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
            Escola de Teologia ADCM Poa
          </h2>

          <p className="text-white/60 text-base max-w-[520px] mx-auto leading-relaxed">
            Aprofunde seu conhecimento bíblico com uma formação estruturada, acessível
            de onde você estiver — com aulas em vídeo, apostilas e orientação pastoral.
          </p>
        </div>

        {/* CARDS DE DIFERENCIAIS */}
        <div
          ref={refCards}
          className="grid md:grid-cols-3 gap-5 mb-14"
        >
          {diferenciais.map((item) => (
            <div
              key={item.titulo}
              className="bg-white/5 border border-white/10 rounded-lg p-6 hover:bg-white/8 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-10 h-10 flex items-center justify-center rounded-md bg-accent/15 text-accent mb-4">
                {item.icone}
              </div>
              <h3 className="text-sm font-bold text-white mb-2">{item.titulo}</h3>
              <p className="text-xs text-white/50 leading-relaxed">{item.descricao}</p>
            </div>
          ))}
        </div>

        {/* DIVISOR */}
        <hr className="border-white/10 mb-12" />

        {/* FLUXO DE INSCRIÇÃO */}
        <div
          ref={refPassos}
          className={`mb-12 transition-all duration-700 delay-200 ${
            visivelPassos ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <p className="text-center text-xs font-bold uppercase tracking-widest text-white/40 mb-8">
            Como funciona o acesso
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {passos.map((passo, i) => (
              <div key={passo.num} className="flex flex-col items-center text-center relative">
                {/* Linha conectora (desktop) */}
                {i < passos.length - 1 && (
                  <div className="hidden md:block absolute top-4 left-[calc(50%+20px)] right-[calc(-50%+20px)] h-px bg-white/10" />
                )}
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary border border-primary-light text-primary-light text-sm font-bold mb-3 relative z-10">
                  {passo.num}
                </div>
                <h4 className="text-sm font-bold text-white mb-1">{passo.titulo}</h4>
                <p className="text-xs text-white/40 leading-relaxed px-1">{passo.descricao}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={`https://wa.me/${CONTATOS.whatsapp}?text=Ol%C3%A1!%20Tenho%20interesse%20na%20Escola%20de%20Teologia.`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-secondary text-white font-bold text-sm px-8 py-3 rounded-sm hover:bg-secondary-hover hover:-translate-y-px transition-all duration-300"
          >
            Quero me inscrever
          </a>

          <a
            href={PLATAFORMA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 text-white/60 font-semibold text-sm px-8 py-3 rounded-sm border border-white/15 hover:text-white hover:border-white/30 transition-all duration-300"
          >
            Já tenho acesso →
          </a>
        </div>

      </div>
    </section>
  );
}
