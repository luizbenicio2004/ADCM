import { useState, useEffect, useRef } from "react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../../services/firebase";
import AdminLayout from "../../components/admin/AdminLayout";
import { useCollection } from "../../hooks/useCollection";
import { useStorage } from "../../hooks/useStorage";
import { useToast } from "../../hooks/useToast";
import { ToastContainer } from "../../components/Toast/Toast";
import ConfirmDialog from "../../components/ConfirmDialog/ConfirmDialog";
import OptimizedImage from "../../components/OptimizedImage";
import {
  Save, Plus, Trash2, Pencil, X, Check, ImagePlus, Loader2, ArrowUp, ArrowDown,
} from "lucide-react";

// ─── Estado vazio do formulário de configurações gerais ───────────────────────
const CONFIG_VAZIO = {
  descricao: "",
  versiculo: "",
  referenciaVersiculo: "",
  materiais: [],
};

// ─── Estado vazio de um banner ────────────────────────────────────────────────
const BANNER_VAZIO = {
  titulo: "",
  descricao: "",
  imagemUrl: "",
  ordem: 0,
};

export default function AdminReciclagem() {
  // ── Configurações gerais (Firestore doc) ──────────────────────────────────
  const [config, setConfig] = useState(CONFIG_VAZIO);
  const [novoMaterial, setNovoMaterial] = useState("");
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [salvandoConfig, setSalvandoConfig] = useState(false);

  // ── Banners (Firestore collection) ────────────────────────────────────────
  const { dados: banners = [], loading: loadingBanners, adicionar, atualizar, remover } =
    useCollection("reciclagem_banners");
  const [formBanner, setFormBanner] = useState(BANNER_VAZIO);
  const [editandoId, setEditandoId] = useState(null);
  const [salvandoBanner, setSalvandoBanner] = useState(false);
  const [confirm, setConfirm] = useState({ open: false, id: null });

  // ── Shared ────────────────────────────────────────────────────────────────
  const { upload, progress, uploading } = useStorage();
  const { toasts, addToast, removeToast } = useToast();
  const [erro, setErro] = useState("");
  const imagemRef = useRef();

  const bannersOrdenados = [...banners].sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0));

  // ── Carrega configurações gerais ──────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const snap = await getDoc(doc(db, "config", "reciclagem"));
        if (snap.exists()) setConfig({ ...CONFIG_VAZIO, ...snap.data() });
      } finally {
        setLoadingConfig(false);
      }
    })();
  }, []);

  // ─────────────────────────────────────────────────────────────────────────
  // Handlers — Configurações gerais
  // ─────────────────────────────────────────────────────────────────────────
  const handleConfigChange = (e) => {
    const { name, value } = e.target;
    setConfig((prev) => ({ ...prev, [name]: value }));
  };

  const addMaterial = () => {
    if (!novoMaterial.trim()) return;
    setConfig((prev) => ({ ...prev, materiais: [...prev.materiais, novoMaterial.trim()] }));
    setNovoMaterial("");
  };

  const removeMaterial = (i) =>
    setConfig((prev) => ({ ...prev, materiais: prev.materiais.filter((_, idx) => idx !== i) }));

  const handleSaveConfig = async (e) => {
    e.preventDefault();
    setSalvandoConfig(true);
    try {
      await setDoc(doc(db, "config", "reciclagem"), config, { merge: true });
      addToast("Configurações salvas com sucesso!");
    } catch {
      addToast("Erro ao salvar.", "error");
    } finally {
      setSalvandoConfig(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Handlers — Banners
  // ─────────────────────────────────────────────────────────────────────────
  const handleBannerChange = (e) => {
    const { name, value } = e.target;
    setFormBanner((f) => ({ ...f, [name]: value }));
  };

  const handleImagem = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await upload(file, `reciclagem/banners/${Date.now()}_${file.name}`);
      setFormBanner((f) => ({ ...f, imagemUrl: url }));
    } catch (err) {
      addToast(err.message || "Erro ao enviar imagem.", "error");
    }
  };

  const handleSubmitBanner = async (e) => {
    e.preventDefault();
    setErro("");
    setSalvandoBanner(true);
    try {
      if (editandoId) {
        await atualizar(editandoId, formBanner);
        addToast("Banner atualizado!");
      } else {
        await adicionar({ ...formBanner, ordem: banners.length });
        addToast("Banner criado!");
      }
      setFormBanner(BANNER_VAZIO);
      setEditandoId(null);
    } catch {
      addToast("Erro ao salvar banner.", "error");
    } finally {
      setSalvandoBanner(false);
    }
  };

  const handleEditarBanner = (banner) => {
    setFormBanner({
      titulo: banner.titulo ?? "",
      descricao: banner.descricao ?? "",
      imagemUrl: banner.imagemUrl ?? "",
      ordem: banner.ordem ?? 0,
    });
    setEditandoId(banner.id);
    // scroll até o formulário de banners
    document.getElementById("form-banner")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleCancelarBanner = () => {
    setFormBanner(BANNER_VAZIO);
    setEditandoId(null);
    setErro("");
  };

  const handleMoverOrdem = async (banner, direcao) => {
    // Faz swap da ordem entre o banner atual e o vizinho
    const idx = bannersOrdenados.findIndex((b) => b.id === banner.id);
    const vizinho = bannersOrdenados[idx + direcao];
    if (!vizinho) return;
    try {
      await atualizar(banner.id, { ordem: vizinho.ordem ?? idx + direcao });
      await atualizar(vizinho.id, { ordem: banner.ordem ?? idx });
    } catch {
      addToast("Erro ao reordenar.", "error");
    }
  };

  const handleRemoverBanner = async () => {
    try {
      await remover(confirm.id);
      addToast("Banner excluído.");
    } catch {
      addToast("Erro ao excluir.", "error");
    } finally {
      setConfirm({ open: false, id: null });
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <AdminLayout title="Projeto Reciclagem" subtitle="Gerencie a seção de reciclagem e os banners da página">
      <div className="max-w-2xl flex flex-col gap-8">

        {/* ══════════════════════════════════════════════
            SEÇÃO 1 — Configurações gerais
        ══════════════════════════════════════════════ */}
        {loadingConfig ? (
          <div className="flex flex-col gap-4">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="h-10 bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <form onSubmit={handleSaveConfig} className="flex flex-col gap-6">

            {/* Descrição + Versículo */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-4">
              <h2 className="font-semibold text-gray-800">Informações gerais</h2>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Descrição</label>
                <textarea
                  name="descricao" rows={3} value={config.descricao} onChange={handleConfigChange}
                  placeholder="Descreva o projeto de reciclagem…"
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-600/30"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Versículo motivacional</label>
                <textarea
                  name="versiculo" rows={2} value={config.versiculo} onChange={handleConfigChange}
                  placeholder="Ex: A terra é do Senhor…"
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-600/30"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Referência</label>
                <input
                  type="text" name="referenciaVersiculo" value={config.referenciaVersiculo}
                  onChange={handleConfigChange} placeholder="Ex: Salmos 24:1"
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600/30"
                />
              </div>
            </div>

            {/* Materiais aceitos */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-4">
              <h2 className="font-semibold text-gray-800">Materiais Aceitos</h2>
              <div className="flex gap-2">
                <input
                  type="text" value={novoMaterial} onChange={(e) => setNovoMaterial(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addMaterial())}
                  placeholder="Ex: Garrafas PET"
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-green-600/30"
                />
                <button type="button" onClick={addMaterial}
                  className="flex items-center gap-1 text-sm bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition">
                  <Plus size={15} /> Add
                </button>
              </div>
              <ul className="flex flex-col gap-2">
                {config.materiais.map((m, i) => (
                  <li key={i} className="flex items-center justify-between text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded-lg">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500" /> {m}
                    </span>
                    <button type="button" onClick={() => removeMaterial(i)}
                      className="text-gray-400 hover:text-red-600 transition">
                      <Trash2 size={14} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <button type="submit" disabled={salvandoConfig}
              className="flex items-center gap-2 bg-green-700 text-white text-sm font-semibold px-6 py-2.5 rounded-lg hover:bg-green-600 transition disabled:opacity-60 self-start">
              <Save size={16} /> {salvandoConfig ? "Salvando…" : "Salvar configurações"}
            </button>
          </form>
        )}

        {/* Divisor */}
        <div className="border-t border-gray-200" />

        {/* ══════════════════════════════════════════════
            SEÇÃO 2 — Banners da página /reciclagem
        ══════════════════════════════════════════════ */}

        {/* Formulário de banner */}
        <div id="form-banner" className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-5">
          <h2 className="font-semibold text-gray-800">
            {editandoId ? "✏️ Editar Banner" : "➕ Novo Banner"}
          </h2>
          <p className="text-xs text-gray-500 -mt-3">
            Banners exibidos na página <span className="font-mono">/reciclagem</span> ao clicar na seção da home.
          </p>

          {erro && (
            <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{erro}</div>
          )}

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Título</label>
            <input
              name="titulo" value={formBanner.titulo} onChange={handleBannerChange}
              placeholder="Ex: Como participar"
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600/30"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Descrição</label>
            <textarea
              name="descricao" rows={3} value={formBanner.descricao} onChange={handleBannerChange}
              placeholder="Texto do banner…"
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-600/30"
            />
          </div>

          {/* Upload de imagem */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Imagem</label>
            {formBanner.imagemUrl && (
              <div className="relative w-40 h-28 rounded-lg overflow-hidden border border-gray-200">
                <OptimizedImage src={formBanner.imagemUrl} alt="banner" className="w-full h-full object-cover" />
                <button type="button" onClick={() => setFormBanner((f) => ({ ...f, imagemUrl: "" }))}
                  className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 hover:bg-black transition">
                  <X size={12} />
                </button>
              </div>
            )}
            <button type="button" onClick={() => imagemRef.current?.click()} disabled={uploading}
              className="flex items-center gap-2 text-sm text-green-700 border border-green-700/30 px-4 py-2 rounded-lg hover:bg-green-50 transition w-fit disabled:opacity-60">
              {uploading ? <Loader2 size={14} className="animate-spin" /> : <ImagePlus size={14} />}
              {uploading ? `Enviando… ${progress}%` : "Selecionar imagem"}
            </button>
            <input ref={imagemRef} type="file" accept="image/*" className="hidden" onChange={handleImagem} />
          </div>

          <div className="flex gap-3 pt-1">
            <button onClick={handleSubmitBanner} disabled={salvandoBanner || uploading}
              className="flex items-center gap-2 bg-green-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-green-600 transition disabled:opacity-60">
              <Check size={16} />
              {salvandoBanner ? "Salvando…" : editandoId ? "Salvar alterações" : "Criar banner"}
            </button>
            {editandoId && (
              <button onClick={handleCancelarBanner}
                className="flex items-center gap-2 text-sm font-semibold text-gray-600 px-5 py-2.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition">
                <X size={16} /> Cancelar
              </button>
            )}
          </div>
        </div>

        {/* Lista de banners */}
        <div className="flex flex-col gap-3">
          <h2 className="font-semibold text-gray-800">Banners publicados</h2>
          {loadingBanners ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="h-20 bg-white rounded-xl border border-gray-200 animate-pulse" />
            ))
          ) : bannersOrdenados.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">
              Nenhum banner ainda. Adicione o primeiro acima.
            </p>
          ) : (
            bannersOrdenados.map((banner, idx) => (
              <div key={banner.id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4">
                {banner.imagemUrl ? (
                  <OptimizedImage src={banner.imagemUrl} alt={banner.titulo}
                    className="w-16 h-16 object-cover rounded-lg flex-shrink-0" />
                ) : (
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 text-gray-300 text-xl">
                    🖼
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm">{banner.titulo || "Sem título"}</h3>
                  {banner.descricao && (
                    <p className="text-xs text-gray-500 mt-0.5 truncate">{banner.descricao}</p>
                  )}
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => handleMoverOrdem(banner, -1)} disabled={idx === 0}
                    className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition disabled:opacity-30" title="Mover para cima">
                    <ArrowUp size={15} />
                  </button>
                  <button onClick={() => handleMoverOrdem(banner, 1)} disabled={idx === bannersOrdenados.length - 1}
                    className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition disabled:opacity-30" title="Mover para baixo">
                    <ArrowDown size={15} />
                  </button>
                  <button onClick={() => handleEditarBanner(banner)}
                    className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition min-w-[40px] min-h-[44px] flex items-center justify-center">
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => setConfirm({ open: true, id: banner.id })}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition min-w-[40px] min-h-[44px] flex items-center justify-center">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>

      <ConfirmDialog
        isOpen={confirm.open}
        title="Excluir banner?"
        message="Esta ação não pode ser desfeita."
        onConfirm={handleRemoverBanner}
        onCancel={() => setConfirm({ open: false, id: null })}
      />
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </AdminLayout>
  );
}