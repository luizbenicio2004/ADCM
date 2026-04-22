import { useState, useEffect, useRef } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../services/firebase";
import { useCollection } from "../../hooks/useCollection";
import { useDoc } from "../../hooks/useDoc";
import { useStorage } from "../../hooks/useStorage";
import AdminLayout from "../../components/admin/AdminLayout";
import { ImagePlus, Loader2, X, Save } from "lucide-react";
import OptimizedImage from "../../components/OptimizedImage";

function Cartao({ titulo, descricao, children }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-4">
      <div>
        <h2 className="font-semibold text-gray-800">{titulo}</h2>
        {descricao && <p className="text-xs text-gray-400 mt-1">{descricao}</p>}
      </div>
      {children}
    </div>
  );
}

export default function AdminCultosGaleria() {
  const { data: cultosConfig } = useDoc("config", "cultos");
  const { upload, remove: removeFile, progress, uploading } = useStorage();

  const [fotos, setFotos] = useState([]);
  const [salvando, setSalvando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState("");
  const fotoRef = useRef();

  useEffect(() => {
    if (cultosConfig?.fotos) setFotos(cultosConfig.fotos);
  }, [cultosConfig]);

  const handleFotos = async (e) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setErro("");
    try {
      const urls = await Promise.all(
        files.map((f) => upload(f, `cultos/galeria/${Date.now()}_${f.name}`))
      );
      setFotos((prev) => [...prev, ...urls]);
    } catch {
      setErro("Não foi possível enviar as fotos.");
    }
  };

  const removeFoto = async (url) => {
    try {
      await removeFile(url);
      setFotos((prev) => prev.filter((u) => u !== url));
    } catch {
      setErro("Não foi possível remover a foto.");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setErro("");
    setSalvando(true);
    try {
      await setDoc(doc(db, "config", "cultos"), { fotos }, { merge: true });
      setSucesso(true);
      setTimeout(() => setSucesso(false), 3000);
    } catch {
      setErro("Não foi possível salvar. Tente novamente.");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <AdminLayout
      title="Cultos"
      subtitle="Gerencie os horários de culto e a galeria de fotos"
    >
      <div className="max-w-2xl flex flex-col gap-6">
        {erro && (
          <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            {erro}
          </div>
        )}
        {sucesso && (
          <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
            ✅ Salvo com sucesso!
          </div>
        )}

        <Cartao
          titulo="📋 Horários dos cultos"
          descricao="Os horários são gerenciados na seção de cultos abaixo. Aqui você gerencia apenas a galeria de fotos."
        >
          <p className="text-sm text-gray-500">
            Para adicionar, editar ou remover horários de culto, acesse a seção
            <strong className="text-blue-900"> Cultos</strong> no menu lateral.
          </p>
        </Cartao>

        <form onSubmit={handleSave} className="flex flex-col gap-6">
          <Cartao
            titulo="📷 Galeria de fotos"
            descricao="Fotos que aparecem na página de Cultos."
          >
            {fotos.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {fotos.map((url) => (
                  <div
                    key={url}
                    className="relative aspect-square rounded-lg overflow-hidden border border-gray-200"
                  >
                    <OptimizedImage
                      src={url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeFoto(url)}
                      className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 hover:bg-black transition"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={() => fotoRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-2 text-sm text-gray-600 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition w-fit disabled:opacity-60"
            >
              {uploading ? (
                <><Loader2 size={14} className="animate-spin" /> Enviando… {progress}%</>
              ) : (
                <><ImagePlus size={14} /> Adicionar fotos</>
              )}
            </button>
            <input
              ref={fotoRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFotos}
            />
          </Cartao>

          <button
            type="submit"
            disabled={salvando}
            className="flex items-center gap-2 bg-blue-900 text-white text-sm font-semibold px-6 py-2.5 rounded-lg hover:bg-blue-800 transition disabled:opacity-60 self-start"
          >
            <Save size={16} /> {salvando ? "Salvando…" : "Salvar galeria"}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}
