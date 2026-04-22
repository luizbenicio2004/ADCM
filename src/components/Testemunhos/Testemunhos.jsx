import { useState, useEffect, useRef } from "react";
import { useCollection } from "../../hooks/useCollection";
import { useReveal } from "../../hooks/useReveal";
import OptimizedImage from "../OptimizedImage";

const TESTEMUNHOS_ESTATICOS = [
  {
    id: 1,
    nome: "Ana Paula S.",
    texto: "Cheguei na ADCM em um dos momentos mais difíceis da minha vida. Fui recebida com tanto amor que não consegui mais parar de voltar. Hoje tenho uma família aqui.",
    tempo: "Membro há 3 anos",
  },
  {
    id: 2,
    nome: "Ricardo M.",
    texto: "Nunca imaginei que uma igreja pudesse mudar tanto minha visão de vida. Os cultos de quinta me recarregam para toda semana. É imperdível.",
    tempo: "Membro há 5 anos",
  },
  {
    id: 3,
    nome: "Josiane L.",
    texto: "Meus filhos adoram o ministério infantil. Ver eles crescendo na fé com tanto cuidado é uma bênção que não tem preço. Obrigada, ADCM.",
    tempo: "Membro há 2 anos",
  },
];

export default function Testemunhos() {
  const [refTitulo, visivelTitulo] = useReveal();
  const { data: firestore = [], loading } = useCollection("testemunhos");

  const ativos = firestore.filter((t) => t.ativo !== false);
  const lista = !loading && ativos.length > 0 ? ativos : TESTEMUNHOS_ESTATICOS;

  const [atual, setAtual] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setAtual((a) => (a + 1) % lista.length);
    }, 5000);
    return () => clearInterval(intervalRef.current);
  }, [lista.length]);

  function irPara(i) {
    setAtual(i);
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setAtual((a) => (a + 1) % lista.length);
    }, 5000);
  }

  // Se todos os testemunhos têm foto, exibe em grid de cards; senão, exibe carrossel
  const temFotos = lista.every((t) => t.fotoUrl);
  const algumTemFoto = lista.some((t) => t.fotoUrl);

  if (algumTemFoto) {
    return (
      <section id="testemunhos" className="py-20 px-6 bg-blue-900 text-white overflow-hidden">
        <div className="max-w-[1100px] mx-auto">
          <div
            ref={refTitulo}
            className={`text-center mb-12 transition-all duration-700 ${
              visivelTitulo ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <div className="w-12 h-[2px] bg-[#fbbf24] mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Vidas Transformadas</h2>
            <p className="text-white/70 max-w-[440px] mx-auto">Nada fala mais alto do que a história de quem viveu.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {lista.map((t) => (
              <div
                key={t.id}
                className="group rounded-xl border border-white/20 bg-white/5 overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all duration-500"
              >
                {t.fotoUrl ? (
                  <div className="aspect-[3/4] overflow-hidden">
                    <OptimizedImage
                      src={t.fotoUrl}
                      alt={t.nome}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ) : (
                  <div className="h-44 bg-gradient-to-br from-blue-800 to-blue-600 flex items-center justify-center">
                    <span className="w-16 h-16 rounded-full bg-[#fbbf24]/20 border border-[#fbbf24]/40 flex items-center justify-center text-[#fbbf24] font-bold text-2xl">
                      {t.nome?.charAt(0) ?? "?"}
                    </span>
                  </div>
                )}
                <div className="p-4 flex flex-col gap-2">
                  <p className="text-white/85 text-sm leading-relaxed line-clamp-3">{t.texto}</p>
                  <div className="flex flex-col gap-0.5 pt-2 border-t border-white/10">
                    <strong className="text-white font-semibold text-sm">{t.nome}</strong>
                    {t.tempo && <span className="text-white/50 text-xs">{t.tempo}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <a
              href="#localizacao"
              className="inline-flex items-center gap-2 text-sm font-bold text-white border border-white/25 px-6 py-3 rounded hover:bg-white/10 transition"
            >
              Venha escrever a sua história →
            </a>
          </div>
        </div>
      </section>
    );
  }

  // Carrossel padrão (sem fotos)
  return (
    <section id="testemunhos" className="py-20 px-6 bg-blue-900 text-white overflow-hidden">
      <div className="max-w-[800px] mx-auto">
        <div
          ref={refTitulo}
          className={`text-center mb-12 transition-all duration-700 ${
            visivelTitulo ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <div className="w-12 h-[2px] bg-[#fbbf24] mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Vidas Transformadas</h2>
          <p className="text-white/70 max-w-[440px] mx-auto">Nada fala mais alto do que a história de quem viveu.</p>
        </div>

        <div className="relative">
          {lista.map((t, i) => (
            <div key={t.id} style={{ display: i === atual ? "block" : "none" }}>
              <div className="bg-white/10 border border-white/20 rounded-2xl p-8 md:p-10 text-center">
                <span className="text-5xl text-[#fbbf24]/40 font-serif leading-none block mb-4">"</span>
                <p className="text-white/90 text-lg md:text-xl leading-relaxed font-light mb-6">{t.texto}</p>
                <div className="flex flex-col items-center gap-1">
                  <span className="w-10 h-10 rounded-full bg-[#fbbf24]/20 border border-[#fbbf24]/40 flex items-center justify-center text-[#fbbf24] font-bold text-sm">
                    {t.nome?.charAt(0) ?? "?"}
                  </span>
                  <strong className="text-white font-semibold text-sm mt-1">{t.nome}</strong>
                  {t.tempo && <span className="text-white/50 text-xs">{t.tempo}</span>}
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-center gap-2 mt-6">
            {lista.map((_, i) => (
              <button
                key={i}
                onClick={() => irPara(i)}
                aria-label={`Ver testemunho ${i + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === atual ? "bg-[#fbbf24] w-6" : "bg-white/30 hover:bg-white/60 w-2"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="text-center mt-10">
          <a
            href="#localizacao"
            className="inline-flex items-center gap-2 text-sm font-bold text-white border border-white/25 px-6 py-3 rounded hover:bg-white/10 transition"
          >
            Venha escrever a sua história →
          </a>
        </div>
      </div>
    </section>
  );
}
