import { Clock } from "lucide-react";
import { useRevealStagger } from "../../hooks/useReveal";
import { useCollection } from "../../hooks/useCollection";

export default function Cultos() {
  const { data: cultos = [], loading } = useCollection("cultos");
  const gridRef = useRevealStagger();

  // 🧠 Ordem dos dias
  const ordemDias = {
    domingo: 0,
    segunda: 1,
    terça: 2,
    terca: 2,
    quarta: 3,
    quinta: 4,
    sexta: 5,
    sábado: 6,
    sabado: 6,
  };

  // 🔧 Normalizar texto
  const normalizar = (texto = "") =>
    texto
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  // 🔥 Ordenação
  const cultosOrdenados = [...cultos].sort((a, b) => {
    const diaA = ordemDias[normalizar(a?.dia)] ?? 99;
    const diaB = ordemDias[normalizar(b?.dia)] ?? 99;

    if (diaA !== diaB) return diaA - diaB;

    return (a?.horario || "").localeCompare(b?.horario || "");
  });

  // 🔄 Loading
  if (loading) {
    return (
      <section id="cultos" className="py-20 px-6 bg-gray-50 text-center">
        <p className="text-gray-500">Carregando cultos...</p>
      </section>
    );
  }

  return (
    <section id="cultos" className="py-20 px-6 bg-gray-50">
      <div className="max-w-[1200px] mx-auto">

        {/* HEADER */}
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

        {/* EMPTY */}
        {cultosOrdenados.length === 0 && (
          <p className="text-center text-gray-500">
            Nenhum culto cadastrado ainda.
          </p>
        )}

        {/* GRID */}
        <div
          ref={gridRef}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {cultosOrdenados.map((culto) => (
            <div
              key={culto.id}
              className={`relative flex flex-col items-center text-center gap-3 p-8 rounded-xl border transition-all duration-300
                ${culto.destaque ? "border-blue-900 shadow-md" : "border-gray-200"}
                hover:-translate-y-1 hover:shadow-lg`}
            >
              {/* Barra topo */}
              <div
                className={`absolute top-0 left-0 right-0 h-[3px] rounded-t-xl
                ${
                  culto.destaque
                    ? "bg-gradient-to-r from-blue-900 to-blue-500"
                    : "bg-gray-200"
                }`}
              />

              {/* Ícone */}
              <div
                className={`w-11 h-11 flex items-center justify-center rounded-full border
                ${
                  culto.destaque
                    ? "bg-blue-900/10 border-blue-900/20 text-blue-900"
                    : "bg-gray-100 border-gray-200 text-gray-400"
                }`}
              >
                <Clock size={20} />
              </div>

              {/* DIA */}
              <span className="text-xs font-bold tracking-widest uppercase text-gray-500">
                {culto.dia || "Dia não informado"}
              </span>

              {/* HORÁRIO */}
              <strong className="text-3xl font-bold text-blue-900">
                {culto.horario || "--:--"}
              </strong>

              {/* OBS */}
              {culto.obs && (
                <p className="text-sm text-gray-600">{culto.obs}</p>
              )}

              {/* BADGE */}
              {culto.destaque && (
                <span className="mt-2 px-3 py-1 text-xs font-bold uppercase tracking-wide text-blue-900 bg-blue-900/10 border border-blue-900/20 rounded-full">
                  Principal
                </span>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}