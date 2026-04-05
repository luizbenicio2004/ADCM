import { Megaphone } from "lucide-react";
import { useCollection } from "../../hooks/useCollection";
import { useRevealStagger } from "../../hooks/useReveal";

export default function Avisos() {
  const { data: todosAvisos = [], loading } = useCollection("avisos");
  const gridRef = useRevealStagger();

  // Filtra apenas os avisos ativos
  const avisos = todosAvisos.filter((a) => a.ativo !== false);

  if (loading) {
    return (
      <section id="avisos" className="py-20 px-6 bg-white text-center">
        <p className="text-gray-500">Carregando avisos...</p>
      </section>
    );
  }

  if (avisos.length === 0) return null;

  return (
    <section id="avisos" className="py-20 px-6 bg-white">
      <div className="max-w-[1200px] mx-auto">

        {/* HEADER */}
        <div className="text-center max-w-[600px] mx-auto mb-12">
          <div className="w-12 h-[2px] bg-blue-900 mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Avisos
          </h2>
          <p className="text-gray-600">
            Fique por dentro do que está acontecendo na igreja.
          </p>
        </div>

        {/* GRID */}
        <div
          ref={gridRef}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {avisos.map((aviso) => (
            <div
              key={aviso.id}
              className={`relative flex flex-col gap-4 p-6 rounded-xl border transition-all duration-300
                ${aviso.tipo === "urgente" ? "border-red-300" : aviso.tipo === "info" ? "border-blue-200" : "border-gray-200"}
                hover:-translate-y-1 hover:shadow-lg`}
            >
              {/* Barra topo */}
              <div
                className={`absolute top-0 left-0 right-0 h-[3px] rounded-t-xl
                ${aviso.tipo === "urgente"
                  ? "bg-gradient-to-r from-red-600 to-red-400"
                  : aviso.tipo === "info"
                  ? "bg-gradient-to-r from-blue-600 to-blue-400"
                  : "bg-gradient-to-r from-yellow-500 to-yellow-300"
                }`}
              />

              {/* Ícone + Badge tipo */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-full border
                  ${aviso.tipo === "urgente"
                    ? "bg-red-50 border-red-200 text-red-600"
                    : aviso.tipo === "info"
                    ? "bg-blue-50 border-blue-200 text-blue-600"
                    : "bg-yellow-50 border-yellow-200 text-yellow-600"
                  }`}
                >
                  <Megaphone size={18} />
                </div>
                <span className={`text-xs font-bold uppercase tracking-wide px-2 py-0.5 rounded-full
                  ${aviso.tipo === "urgente"
                    ? "bg-red-100 text-red-700"
                    : aviso.tipo === "info"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-yellow-100 text-yellow-700"
                  }`}>
                  {aviso.tipo ?? "aviso"}
                </span>
              </div>

              {/* TÍTULO */}
              <h3 className="text-lg font-bold text-gray-900">
                {aviso.titulo || "Sem título"}
              </h3>

              {/* MENSAGEM — campo correto do Firestore */}
              {aviso.mensagem && (
                <p className="text-sm text-gray-600">
                  {aviso.mensagem}
                </p>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
