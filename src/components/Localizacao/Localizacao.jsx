import { useState, useEffect } from "react";
import { MapPin, Clock, Copy, Check } from "lucide-react";
import { useConfig } from "../../context/ConfigContext";
import { useCollection } from "../../hooks/useCollection";
import { sortCultos } from "../../utils/sortCultos";

export default function Localizacao() {
  const { config, loading: loadingConfig } = useConfig();
  const { data: cultos = [], loading: loadingCultos } = useCollection("cultos");

  const endereco = config?.endereco ?? {};
  const loading = loadingConfig || loadingCultos;
  const cultosOrdenados = sortCultos(cultos);

  const [mostrarMapa, setMostrarMapa] = useState(false);
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    if (!loadingConfig && endereco.embedUrl) {
      const t = setTimeout(() => setMostrarMapa(true), 100);
      return () => clearTimeout(t);
    }
  }, [loadingConfig, endereco.embedUrl]);

  function copiarEndereco() {
    const partes = [
      endereco.rua,
      endereco.bairro && `${endereco.bairro} — ${endereco.cidade}, ${endereco.estado}`,
      endereco.cep && `CEP: ${endereco.cep}`,
    ].filter(Boolean).join(", ");
    navigator.clipboard.writeText(partes).then(() => {
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    });
  }

  return (
    <section id="localizacao" className="py-20 px-6 bg-gray-50">
      <div className="max-w-[1100px] mx-auto">

        <div className="text-center max-w-[600px] mx-auto mb-12">
          <div className="w-12 h-[2px] bg-blue-900 mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Como Chegar</h2>
          <p className="text-gray-600">
            A porta está aberta. Você não precisa de convite — só apareça.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-[1fr_1.4fr] items-start">

          {/* COLUNA ESQUERDA */}
          <div className="flex flex-col gap-4">
            <div className="flex gap-4 p-6 rounded-xl border border-gray-200 bg-white hover:shadow-md transition-all">
              <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-blue-900/10 border border-blue-900/20 text-blue-900 flex-shrink-0">
                <MapPin size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Endereço</h3>
                  {!loading && endereco.rua && (
                    <button
                      onClick={copiarEndereco}
                      title="Copiar endereço"
                      className="flex items-center gap-1 text-xs text-blue-900 hover:text-blue-700 border border-blue-900/20 px-2 py-1 rounded transition-all hover:bg-blue-50 flex-shrink-0"
                    >
                      {copiado ? <Check size={12} /> : <Copy size={12} />}
                      {copiado ? "Copiado!" : "Copiar"}
                    </button>
                  )}
                </div>
                {loading ? (
                  <div className="flex flex-col gap-2">
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-40" />
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-32" />
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-24" />
                  </div>
                ) : (
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {endereco.rua || "Endereço não informado"}
                    {endereco.bairro && <><br />{endereco.bairro} — {endereco.cidade}, {endereco.estado}</>}
                    {endereco.cep && <><br />CEP: {endereco.cep}</>}
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
                    {cultosOrdenados.map((culto, i) => (
                      <li
                        key={culto.id}
                        className={`flex justify-between pb-2 text-sm ${
                          i < cultosOrdenados.length - 1 ? "border-b border-gray-200" : ""
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

          {/* COLUNA DIREITA — mapa responsivo */}
          <div className="rounded-xl overflow-hidden border border-gray-200 shadow-md bg-gray-100" style={{ minHeight: "300px", height: "clamp(300px, 50vw, 420px)" }}>
            {mostrarMapa ? (
              <iframe
                title="Localização da Igreja ADCM Poá"
                src={endereco.embedUrl}
                loading="lazy"
                className="w-full h-full border-0"
                allowFullScreen
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                {loadingConfig ? "Carregando mapa..." : "Endereço ainda não configurado."}
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}

