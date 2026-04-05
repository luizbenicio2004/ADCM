import { MapPin, Clock } from "lucide-react";
import { useReveal } from "../../hooks/useReveal";
import { useConfig } from "../../context/ConfigContext";
import { useCollection } from "../../hooks/useCollection";

export default function Localizacao() {
  const [ref, visible] = useReveal();
  const [refMapa, mapaVisivel] = useReveal();
  const { config, loading: loadingConfig } = useConfig();
  const { data: cultos, loading: loadingCultos } = useCollection("cultos");

  const endereco = config?.endereco ?? {};
  const loading = loadingConfig || loadingCultos;

  return (
    <section
      id="localizacao"
      ref={ref}
      className={`py-20 px-6 bg-gray-50 transition-all duration-700 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      <div className="max-w-[1100px] mx-auto">

        <div className="text-center max-w-[600px] mx-auto mb-12">
          <div className="w-12 h-[2px] bg-blue-900 mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Como Chegar</h2>
          <p className="text-gray-600">Será uma alegria receber você e sua família. Venha nos visitar!</p>
        </div>

        <div className="grid gap-8 md:grid-cols-[1fr_1.4fr] items-start">

          <div className="flex flex-col gap-4">
            <div className="flex gap-4 p-6 rounded-xl border border-gray-200 bg-white hover:shadow-md transition-all">
              <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-blue-900/10 border border-blue-900/20 text-blue-900 flex-shrink-0">
                <MapPin size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">Endereço</h3>
                {loading ? (
                  <div className="flex flex-col gap-2">
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-40" />
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-32" />
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-24" />
                  </div>
                ) : (
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {endereco.rua}<br />
                    {endereco.bairro} — {endereco.cidade}, {endereco.estado}<br />
                    CEP: {endereco.cep}
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-4 p-6 rounded-xl border border-gray-200 bg-white hover:shadow-md transition-all">
              <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-blue-900/10 border border-blue-900/20 text-blue-900 flex-shrink-0">
                <Clock size={18} />
              </div>
              <div className="w-full">
                <h3 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">Horários dos Cultos</h3>
                {loading ? (
                  <div className="flex flex-col gap-2">
                    {Array(3).fill(0).map((_, i) => (
                      <div key={i} className="flex justify-between pb-2 border-b border-gray-200">
                        <div className="h-3 bg-gray-200 rounded animate-pulse w-24" />
                        <div className="h-3 bg-gray-200 rounded animate-pulse w-12" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <ul className="flex flex-col gap-2">
                    {cultos.map((culto, i) => (
                      <li
                        key={culto.id}
                        className={`flex justify-between pb-2 text-sm ${
                          i < cultos.length - 1 ? "border-b border-gray-200" : ""
                        }`}
                      >
                        <span className="text-gray-600">{culto.dia}{culto.obs ? " *" : ""}</span>
                        <span className="font-bold text-blue-900">{culto.horario}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {endereco.mapsUrl && (
              <a  
                href={endereco.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 flex items-center justify-center gap-2 px-6 py-4 rounded-lg
                  bg-blue-900 text-white text-sm font-bold
                  hover:bg-blue-800 hover:-translate-y-[2px] hover:shadow-lg transition-all"
              >
                <MapPin size={16} />
                Abrir no Google Maps
              </a>
            )}
          </div>

          <div
            ref={refMapa}
            className="rounded-xl overflow-hidden border border-gray-200 shadow-md h-[420px] bg-gray-100"
          >
            {mapaVisivel && endereco.embedUrl ? (
              <iframe
                title="Localização da Igreja ADCM Poá"
                src={endereco.embedUrl}
                loading="lazy"
                className="w-full h-full border-0"
                allowFullScreen
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                Carregando mapa…
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}