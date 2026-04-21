import { useState, useEffect } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../services/firebase";
import { useConfig } from "../../context/ConfigContext";
import AdminLayout from "../../components/admin/AdminLayout";
import { Save } from "lucide-react";
import { toEmbedUrl, isValidYoutubeUrl } from "../../utils/youtube";

export default function AdminLive() {
  const { config, loading } = useConfig();
  const [liveUrl, setLiveUrl] = useState("");
  const [liveAtivo, setLiveAtivo] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (config) {
      setLiveUrl(config.liveUrl ?? "");
      setLiveAtivo(config.liveAtivo ?? false);
    }
  }, [config]);

  const handleSave = async (e) => {
    e.preventDefault();
    setErro("");
    if (liveUrl && !isValidYoutubeUrl(liveUrl)) {
      setErro("O link não parece ser do YouTube. Use um link como: https://www.youtube.com/watch?v=...");
      return;
    }
    setSalvando(true);
    try {
      await setDoc(doc(db, "config", "site"), { liveUrl, liveAtivo }, { merge: true });
      setSucesso(true);
      setTimeout(() => setSucesso(false), 3000);
    } catch {
      setErro("Não foi possível salvar. Tente novamente.");
    } finally {
      setSalvando(false);
    }
  };

  const embedPreview = toEmbedUrl(liveUrl);

  return (
    <AdminLayout
      title="Transmissão ao Vivo"
      subtitle="Ative a live e cole o link do YouTube — ela aparece automaticamente no site"
    >
      <div className="max-w-2xl">
        {loading ? (
          <div className="flex flex-col gap-4">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="h-10 bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <form onSubmit={handleSave} className="flex flex-col gap-6">
            {erro && <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{erro}</div>}
            {sucesso && <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3">✅ Salvo com sucesso!</div>}

            <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-5">

              {/* Liga/desliga */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div>
                  <p className="font-semibold text-gray-800 text-sm">Mostrar a live no site agora</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Ligue quando estiver transmitindo. Desligue quando acabar.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setLiveAtivo((v) => !v)}
                  aria-pressed={liveAtivo}
                  className={`relative w-12 h-6 rounded-full transition-colors ${liveAtivo ? "bg-red-500" : "bg-gray-300"}`}
                >
                  <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${liveAtivo ? "translate-x-7" : "translate-x-1"}`} />
                </button>
              </div>

              {liveAtivo && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                  🔴 A live está <strong>ativada</strong> — os visitantes estão vendo o player agora.
                </div>
              )}

              {/* Link do YouTube */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Link do vídeo no YouTube
                </label>
                <input
                  type="url"
                  value={liveUrl}
                  onChange={(e) => setLiveUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/30"
                />
                <p className="text-xs text-gray-400">Cole aqui o link da transmissão ao vivo do YouTube.</p>
                {liveUrl && !isValidYoutubeUrl(liveUrl) && (
                  <p className="text-xs text-red-500">Este link não é um link válido do YouTube.</p>
                )}
              </div>

              {/* Preview */}
              {embedPreview && (
                <div className="flex flex-col gap-2">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Visualização prévia
                  </p>
                  <div className="aspect-video rounded-xl overflow-hidden border border-gray-200">
                    <iframe
                      src={embedPreview}
                      title="Prévia da live"
                      allow="accelerometer; autoplay; encrypted-media"
                      allowFullScreen
                      className="w-full h-full border-0"
                    />
                  </div>
                </div>
              )}

              <button type="submit" disabled={salvando}
                className="flex items-center gap-2 bg-red-600 text-white text-sm font-semibold px-6 py-2.5 rounded-lg hover:bg-red-700 transition disabled:opacity-60 self-start">
                <Save size={16} /> {salvando ? "Salvando…" : "Salvar"}
              </button>
            </div>
          </form>
        )}
      </div>
    </AdminLayout>
  );
}