import { Music2, Star, Flame, Heart } from "lucide-react";
import { useRevealStagger } from "../../hooks/useReveal";
import { MINISTERIOS } from "../../data/igreja";

const ICONES = {
  blue:   <Music2 size={20} />,
  yellow: <Star   size={20} />,
  red:    <Flame  size={20} />,
  green:  <Heart  size={20} />,
};

const COR_CLASSES = {
  blue:   "bg-blue-900/10 border-blue-900/20 text-blue-900",
  yellow: "bg-yellow-400/10 border-yellow-400/20 text-yellow-600",
  red:    "bg-red-600/10 border-red-600/20 text-red-600",
  green:  "bg-green-600/10 border-green-600/20 text-green-600",
};

export default function Ministerios() {
  const gridRef = useRevealStagger();

  return (
    <section id="ministerios" className="py-20 px-6">
      <div className="max-w-[1000px] mx-auto">

        <div className="text-center max-w-[600px] mx-auto mb-12">
          <div className="w-12 h-[2px] bg-blue-900 mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Nossos Ministérios
          </h2>
          <p className="text-gray-600">
            Cada ministério é uma forma de servir a Deus e às pessoas.
            Encontre onde você pode se envolver.
          </p>
        </div>

        <div ref={gridRef} className="grid gap-4 md:grid-cols-2">
          {MINISTERIOS.map((min) => (
            <div
              key={min.id}
              className="flex items-start gap-4 p-6 rounded-xl border border-gray-200
                hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
            >
              <div className={`w-12 h-12 flex items-center justify-center rounded-lg border flex-shrink-0
                ${COR_CLASSES[min.cor] ?? COR_CLASSES.blue}`}>
                {ICONES[min.cor] ?? <Heart size={20} />}
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-base font-bold text-gray-900">{min.titulo}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{min.descricao}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12 flex flex-col items-center gap-3">
          <p className="text-sm text-gray-600">Quer fazer parte de um ministério?</p>
          <a  
            href="#localizacao"
            className="text-sm font-bold text-blue-900 border-b-2 border-transparent hover:border-blue-900 transition-all"
          >
            Venha nos visitar e conheça nossa equipe →
          </a>
        </div>

      </div>
    </section>
  );
}