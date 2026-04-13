import { useConfig } from "../../context/ConfigContext";

function toEmbedUrl(url) {
  if (!url) return null;
  const match = url.match(/(?:v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1` : null;
}

export default function Live() {
  const { config, loading } = useConfig();

  if (loading || !config?.liveAtivo || !config?.liveUrl) return null;

  const embedUrl = toEmbedUrl(config.liveUrl);
  if (!embedUrl) return null;

  return (
    <section id="live" className="py-12 px-6 bg-gray-900">
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-6">

        <div className="flex items-center gap-3">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
          </span>
          <span className="text-white font-bold text-lg tracking-wide uppercase">Ao Vivo Agora</span>
        </div>

        <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10">
          <iframe
            src={embedUrl}
            title="ADCM Poá — Transmissão ao Vivo"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full border-0"
          />
        </div>

        <p className="text-gray-400 text-sm text-center">
          Você está conectado com a gente — mesmo à distância, a Palavra alcança.
        </p>
      </div>
    </section>
  );
}
