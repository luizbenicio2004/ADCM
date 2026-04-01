import { Target, Eye } from "lucide-react";
import { useReveal } from "../../hooks/useReveal";
import { useCounter } from "../../hooks/useCounter";
import { NUMEROS } from "../../data/igreja";

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

  return (
    <section id="sobre" className="py-20 px-6 bg-white">
      <div className="max-w-[1200px] mx-auto grid lg:grid-cols-2 gap-16 items-start">

        <div
          ref={refTexto}
          className={`flex flex-col gap-6 transition-all duration-700 ${
            visivelTexto ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <div className="w-12 h-[2px] bg-blue-900" />
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Quem Somos</h2>
          <p className="text-gray-600 leading-relaxed">
            A Igreja ADCM Poá é uma congregação da Assembleia de Deus,
            fundada com o propósito de levar o evangelho de Jesus Cristo
            à cidade de Poá e região. Somos uma família unida pela fé,
            pelo amor e pela Palavra de Deus.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Acreditamos que a igreja é o lugar onde vidas são transformadas.
            Aqui você encontra acolhimento, ensino bíblico sólido,
            comunhão genuína e oportunidades de servir ao próximo.
          </p>
          <div className="relative bg-gray-50 border-l-4 border-blue-900 rounded-md p-6 pl-8">
            <span className="absolute -top-4 left-4 text-6xl text-blue-900/20 font-serif">"</span>
            <p className="font-serif italic text-lg text-gray-800">
              Porque Deus amou o mundo de tal maneira que deu o seu
              Filho unigênito, para que todo aquele que nele crê
              não pereça, mas tenha a vida eterna.
            </p>
            <span className="block mt-3 text-sm font-bold text-blue-900">João 3:16</span>
          </div>
          <a href="#cultos" className="inline-flex items-center gap-2 text-sm font-bold text-blue-900 hover:gap-3 transition-all">
            Conheça nossos Cultos →
          </a>
        </div>

        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-4">
            {NUMEROS.map((item) => (
              <CardNumero key={item.label} valor={item.valor} label={item.label} />
            ))}
          </div>

          <div className="flex gap-4 p-6 border border-gray-200 rounded-xl hover:shadow-md transition">
            <div className="w-10 h-10 flex items-center justify-center bg-blue-900/10 rounded-md text-blue-900 flex-shrink-0">
              <Target size={20} />
            </div>
            <div>
              <h3 className="font-bold text-sm uppercase text-gray-800 mb-1">Nossa Missão</h3>
              <p className="text-sm text-gray-600">Proclamar o evangelho, discipular crentes e servir a comunidade.</p>
            </div>
          </div>

          <div className="flex gap-4 p-6 border border-gray-200 rounded-xl hover:shadow-md transition">
            <div className="w-10 h-10 flex items-center justify-center bg-red-500/10 rounded-md text-red-500 flex-shrink-0">
              <Eye size={20} />
            </div>
            <div>
              <h3 className="font-bold text-sm uppercase text-gray-800 mb-1">Nossa Visão</h3>
              <p className="text-sm text-gray-600">Ser uma igreja relevante que transforma vidas e a cidade.</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}