// src/components/Sobre/Sobre.jsx
import { Target, Eye } from "lucide-react";
import { useReveal } from "../../hooks/useReveal";
import { useCounter } from "../../hooks/useCounter";
import { useConfig } from "../../context/ConfigContext";

function CardNumero({ valor, label }) {
  const [ref, exibido] = useCounter(valor);
  return (
    <div
      ref={ref}
      className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:-translate-y-1 hover:shadow-lg transition-all"
    >
      <strong className="block text-3xl font-bold text-blue-900">{exibido}</strong>
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</span>
    </div>
  );
}

export default function Sobre() {
  const [refTexto, visivelTexto] = useReveal();
  const { config, loading } = useConfig();

  const sobre = config?.sobre ?? {};
  const numeros = sobre.numeros ?? [];
  const missao = sobre.missao ?? "";
  const visao = sobre.visao ?? "";
  const historia = sobre.historia ?? "";
  const versiculo = sobre.versiculo ?? "";
  const referenciaVersiculo = sobre.referenciaVersiculo ?? "";

  return (
    <section id="sobre" className="py-20 px-6 bg-white">
      <div className="max-w-[1200px] mx-auto grid lg:grid-cols-2 gap-16 items-start">

        {/* ✅ opacity-100 por padrão — animação só se ainda não estiver visível */}
        <div
          ref={refTexto}
          className={`flex flex-col gap-6 transition-all duration-700 ${
            visivelTexto ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <div className="w-12 h-[2px] bg-blue-900" />
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Quem Somos</h2>

          {loading ? (
            <div className="flex flex-col gap-3">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-4/6" />
            </div>
          ) : historia ? (
            historia.split("\n\n").map((paragrafo, i) => (
              <p key={i} className="text-gray-600 leading-relaxed">{paragrafo}</p>
            ))
          ) : (
            <p className="text-gray-400 italic">Nenhuma história cadastrada ainda.</p>
          )}

          {versiculo && (
            <div className="relative bg-gray-50 border-l-4 border-blue-900 rounded-md p-6 pl-8">
              <span className="absolute -top-4 left-4 text-6xl text-blue-900/20 font-serif">"</span>
              <p className="font-serif italic text-lg text-gray-800">{versiculo}</p>
              {referenciaVersiculo && (
                <span className="block mt-3 text-sm font-bold text-blue-900">{referenciaVersiculo}</span>
              )}
            </div>
          )}

          <a href="#cultos" className="inline-flex items-center gap-2 text-sm font-bold text-blue-900 hover:gap-3 transition-all">
            Conheça nossos Cultos →
          </a>
        </div>

        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-4">
            {loading
              ? Array(4).fill(0).map((_, i) => (
                  <div key={i} className="bg-white border border-gray-200 rounded-xl p-6 text-center animate-pulse">
                    <div className="h-8 bg-gray-200 rounded mb-2 mx-auto w-16" />
                    <div className="h-3 bg-gray-200 rounded mx-auto w-24" />
                  </div>
                ))
              : numeros.map((item) => (
                  <CardNumero key={item.label} valor={item.valor} label={item.label} />
                ))
            }
          </div>

          <div className="flex gap-4 p-6 border border-gray-200 rounded-xl hover:shadow-md transition">
            <div className="w-10 h-10 flex items-center justify-center bg-blue-900/10 rounded-md text-blue-900 flex-shrink-0">
              <Target size={20} />
            </div>
            <div>
              <h3 className="font-bold text-sm uppercase text-gray-800 mb-1">Nossa Missão</h3>
              <p className="text-sm text-gray-600">
                {loading ? "…" : missao || "Não cadastrado."}
              </p>
            </div>
          </div>

          <div className="flex gap-4 p-6 border border-gray-200 rounded-xl hover:shadow-md transition">
            <div className="w-10 h-10 flex items-center justify-center bg-red-500/10 rounded-md text-red-500 flex-shrink-0">
              <Eye size={20} />
            </div>
            <div>
              <h3 className="font-bold text-sm uppercase text-gray-800 mb-1">Nossa Visão</h3>
              <p className="text-sm text-gray-600">
                {loading ? "…" : visao || "Não cadastrado."}
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}