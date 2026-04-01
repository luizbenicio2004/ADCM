import { Clock } from "lucide-react";
import { useRevealStagger } from "../../hooks/useReveal";
import { CULTOS } from "../../data/igreja";

export default function Cultos() {
  const gridRef = useRevealStagger();

  return (
    <section id="cultos" className="py-20 px-6 bg-gray-50">
      <div className="max-w-[1200px] mx-auto">

        <div className="text-center max-w-[600px] mx-auto mb-12">
          <div className="w-12 h-[2px] bg-blue-900 mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Nossos Cultos
          </h2>
          <p className="text-gray-600">
            Momentos de comunhão, ensino e adoração a Deus.
            Você é sempre bem-vindo!
          </p>
        </div>

        <div ref={gridRef} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CULTOS.map((culto) => (
            <div
              key={culto.id}
              className={`relative flex flex-col items-center text-center gap-3 p-8 rounded-xl border transition-all duration-300
                ${culto.destaque ? "border-blue-900 shadow-md" : "border-gray-200"}
                hover:-translate-y-1 hover:shadow-lg`}
            >
              <div className={`absolute top-0 left-0 right-0 h-[3px] rounded-t-xl
                ${culto.destaque ? "bg-gradient-to-r from-blue-900 to-blue-500" : "bg-gray-200"}`}
              />

              <div className={`w-11 h-11 flex items-center justify-center rounded-full border
                ${culto.destaque
                  ? "bg-blue-900/10 border-blue-900/20 text-blue-900"
                  : "bg-gray-100 border-gray-200 text-gray-400"}`}
              >
                <Clock size={20} />
              </div>

              <span className="text-xs font-bold tracking-widest uppercase text-gray-500">
                {culto.dia}
              </span>
              <strong className="text-3xl font-bold text-blue-900">
                {culto.horario}
              </strong>
              <h3 className="text-base font-bold text-gray-900">{culto.nome}</h3>
              <p className="text-sm text-gray-600">{culto.descricao}</p>

              {culto.destaque && (
                <span className="mt-2 px-3 py-1 text-xs font-bold uppercase tracking-wide text-blue-900 bg-blue-900/10 border border-blue-900/20 rounded-full">
                  Principal
                </span>
              )}
            </div>
          ))}
        </div>

        {CULTOS.filter((c) => c.obs).map((c) => (
          <p key={c.id} className="text-center text-xs text-gray-500 italic mt-8 max-w-[500px] mx-auto">
            * {c.obs}
          </p>
        ))}

      </div>
    </section>
  );
}