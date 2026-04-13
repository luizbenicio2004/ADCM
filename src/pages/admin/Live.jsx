import { useState, useEffect } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../services/firebase";
import { useConfig } from "../../context/ConfigContext";
import AdminLayout from "../../components/admin/AdminLayout";
import { Save, Radio } from "lucide-react";

function toEmbedUrl(url) {
  if (!url) return null;
  const match = url.match(/(?:v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}

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
    setSalvando(true);
    try {
      await setDoc(doc(db, "config", "site"), { liveUrl, liveAtivo }, { merge: true });
      setSucesso(true);
      setTimeout(() => setSucesso(false), 3000);
    } catch { setErro("Erro ao salvar."); }
    finally { setSalvando(false); }
  };

  const embedUrl = toEmbedUrl(liveUrl);

  return (
    <AdminLayout title="Transmissão ao Vivo" subtitle="Ative e configure a live do YouTube no site">
      <div className="max-w-2xl ">
        {loading ? (
          <div className="flex flex-col gap-4">{Array(3).fill(0).map((_, i) => <div key={i} className="h-10 bg-gray-200 rounded-lg animate-pulse" />)}</div>
        ) : (
          <form onSubmit={handleSave} className="flex flex-col gap-6">
            {erro && <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{erro}</div>}
            {sucesso && <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3">✅ Salvo!</div>}

            <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-5">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 flex items-center justify-center bg-red-50 rounded-lg text-red-600">
                  <Radio size={18} />
                </div>
                <h2 className="font-semibold text-gray-800">Configuração da Live</h2>
              </div>

              {/* Toggle ativo */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div>
                  <p className="font-semibold text-gray-800 text-sm">Live ativa agora</p>
                  <p className="text-xs text-gray-500">Quando ativado, o banner e o player aparecem na home</p>
                </div>
                <button type="button" onClick={() => setLiveAtivo((v) => !v)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${liveAtivo ? "bg-red-500" : "bg-gray-300"}`}>
                  <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${liveAtivo ? "translate-x-7" : "translate-x-1"}`} />
                </button>
              </div>

              {liveAtivo && (
                <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 animate-pulse">
                  🔴 Live ativa — aparecendo no site agora
                </div>
              )}

              {/* URL */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">URL do YouTube Live</label>
                <input type="text" value={liveUrl} onChange={(e) => setLiveUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/30" />
              </div>

              {/* Preview */}
              {embedUrl && (
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Preview</label>
                  <div className="aspect-video rounded-xl overflow-hidden border border-gray-200">
                    <iframe src={embedUrl} title="Preview Live" allow="accelerometer; autoplay; encrypted-media" allowFullScreen className="w-full h-full border-0" />
                  </div>
                </div>
              )}

              <button type="submit" disabled={salvando}
                className="flex items-center gap-2 bg-red-600 text-white text-sm font-semibold px-6 py-2.5 rounded-lg hover:bg-red-700 transition disabled:opacity-60 self-start">
                <Save size={16} /> {salvando ? "Salvando…" : "Salvar configuração"}
              </button>
            </div>
          </form>
        )}
      </div>
    </AdminLayout>
  );
}