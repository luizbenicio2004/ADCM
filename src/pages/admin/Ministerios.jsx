import { useState, useRef } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { useCollection } from "../../hooks/useCollection";
import { useStorage } from "../../hooks/useStorage";
import { isValidYoutubeUrl } from "../../utils/youtube";
import Field from "../../components/admin/Field";
import { Plus, Pencil, Trash2, X, Check, ImagePlus, Loader2 } from "lucide-react";
import OptimizedImage from "../../components/OptimizedImage";
import { useToast } from "../../hooks/useToast";
import { ToastContainer } from "../../components/Toast/Toast";
import ConfirmDialog from "../../components/ConfirmDialog/ConfirmDialog";

const VAZIO = {
  nome: "", descricao: "", responsavel: "", diaSemana: "", horario: "", ativo: true,
  historia: "", youtubeUrl: "", fotoUrl: "", fotos: [],
};

const DIAS = ["Segunda","Terça","Quarta","Quinta","Sexta","Sábado","Domingo"];

export default function AdminMinisterios() {
  const { data: ministerios, loading, adicionar, atualizar, remover } = useCollection("ministerios");
  const { upload, progress, uploading } = useStorage();
  const { toasts, addToast, removeToast } = useToast();

  const [form, setForm] = useState(VAZIO);
  const [editandoId, setEditandoId] = useState(null);
  const [salvando, setSalvando] = useState(false);
  const [confirm, setConfirm] = useState({ open: false, id: null });
  const [erro, setErro] = useState("");

  const fotoCapaRef = useRef();
  const galeriaRef = useRef();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleFotoCapa = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await upload(file, `ministerios/capas/${Date.now()}_${file.name}`);
      setForm((f) => ({ ...f, fotoUrl: url }));
    } catch (err) {
      addToast(err.message || "Não foi possível enviar a foto.", "error");
    }
  };

  const handleGaleria = async (e) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    try {
      const urls = await Promise.all(files.map((f) => upload(f, `ministerios/galeria/${Date.now()}_${f.name}`)));
      setForm((f) => ({ ...f, fotos: [...(f.fotos ?? []), ...urls] }));
      addToast(`${urls.length} foto(s) adicionada(s)!`);
    } catch (err) {
      addToast(err.message || "Não foi possível enviar as fotos.", "error");
    }
  };

  const handleRemoverFoto = (url) => setForm((f) => ({ ...f, fotos: f.fotos.filter((u) => u !== url) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nome || !form.descricao) { setErro("Preencha o nome e a descrição."); return; }
    if (form.youtubeUrl && !isValidYoutubeUrl(form.youtubeUrl)) {
      setErro("O link do YouTube não é válido. Use o formato: https://www.youtube.com/watch?v=...");
      return;
    }
    setErro(""); setSalvando(true);
    try {
      if (editandoId) { await atualizar(editandoId, form); addToast("Ministério atualizado!"); }
      else { await adicionar(form); addToast("Ministério criado com sucesso!"); }
      setForm(VAZIO); setEditandoId(null);
    } catch { addToast("Não foi possível salvar. Tente novamente.", "error"); }
    finally { setSalvando(false); }
  };

  const handleEditar = (m) => {
    setForm({ nome: m.nome ?? "", descricao: m.descricao ?? "", responsavel: m.responsavel ?? "",
      diaSemana: m.diaSemana ?? "", horario: m.horario ?? "", ativo: m.ativo ?? true,
      historia: m.historia ?? "", youtubeUrl: m.youtubeUrl ?? "", fotoUrl: m.fotoUrl ?? "", fotos: m.fotos ?? [] });
    setEditandoId(m.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelar = () => { setForm(VAZIO); setEditandoId(null); setErro(""); };

  const handleRemoverConfirmado = async () => {
    try { await remover(confirm.id); addToast("Ministério excluído."); }
    catch { addToast("Não foi possível excluir.", "error"); }
    finally { setConfirm({ open: false, id: null }); }
  };

  return (
    <AdminLayout
      title="Ministérios"
      subtitle="Gerencie os grupos e ministérios da igreja — fotos, vídeos e informações"
    >
      <div className="max-w-3xl flex flex-col gap-8">

        {/* Formulário */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-5">
          <h2 className="font-semibold text-gray-800">
            {editandoId ? "✏️ Editando ministério" : "➕ Adicionar novo ministério"}
          </h2>
          {erro && <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{erro}</div>}

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Nome do ministério *" name="nome" value={form.nome} onChange={handleChange} placeholder="Ex: Ministério de Louvor" />
            <Field label="Responsável" name="responsavel" value={form.responsavel} onChange={handleChange} placeholder="Ex: Pastor João" />
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Dia do encontro</label>
              <select name="diaSemana" value={form.diaSemana} onChange={handleChange}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/30">
                <option value="">Escolha o dia…</option>
                {DIAS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <Field label="Horário do encontro" name="horario" value={form.horario} onChange={handleChange} placeholder="Ex: 19h30" />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Descrição curta *</label>
            <p className="text-xs text-gray-400">Aparece no card da página inicial.</p>
            <textarea name="descricao" rows={2} value={form.descricao} onChange={handleChange}
              placeholder="Uma frase que resume o propósito deste ministério…"
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-900/30" />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">História completa</label>
            <p className="text-xs text-gray-400">Aparece na página interna do ministério.</p>
            <textarea name="historia" rows={5} value={form.historia} onChange={handleChange}
              placeholder="Conte a história, o propósito e as conquistas deste ministério…"
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-900/30" />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Link de vídeo do YouTube (opcional)</label>
            <input type="url" name="youtubeUrl" value={form.youtubeUrl} onChange={handleChange}
              placeholder="https://www.youtube.com/watch?v=..."
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/30" />
            {form.youtubeUrl && !isValidYoutubeUrl(form.youtubeUrl) && (
              <p className="text-xs text-red-500">Este link não é um link válido do YouTube.</p>
            )}
          </div>

          {/* Foto de capa */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Foto de capa</label>
            <p className="text-xs text-gray-400 -mt-1">Imagem principal que aparece no card do ministério.</p>
            {form.fotoUrl && (
              <div className="relative w-40 h-24 rounded-lg overflow-hidden border border-gray-200">
                <OptimizedImage src={form.fotoUrl} alt="capa" className="w-full h-full object-cover" />
                <button type="button" onClick={() => setForm((f) => ({ ...f, fotoUrl: "" }))}
                  className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 hover:bg-black transition">
                  <X size={12} />
                </button>
              </div>
            )}
            <button type="button" onClick={() => fotoCapaRef.current?.click()} disabled={uploading}
              className="flex items-center gap-2 text-sm text-blue-900 border border-blue-900/30 px-4 py-2 rounded-lg hover:bg-blue-50 transition w-fit disabled:opacity-60">
              {uploading ? <Loader2 size={14} className="animate-spin" /> : <ImagePlus size={14} />}
              {uploading ? `Enviando… ${progress}%` : "Escolher foto de capa"}
            </button>
            <input ref={fotoCapaRef} type="file" accept="image/*" className="hidden" onChange={handleFotoCapa} />
          </div>

          {/* Galeria */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Galeria de fotos (opcional)</label>
            <p className="text-xs text-gray-400 -mt-1">Fotos que aparecem na página interna do ministério.</p>
            {(form.fotos ?? []).length > 0 && (
              <div className="flex flex-wrap gap-2">
                {form.fotos.map((url) => (
                  <div key={url} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                    <OptimizedImage src={url} alt="" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => handleRemoverFoto(url)}
                      className="absolute top-0.5 right-0.5 bg-black/60 text-white rounded-full p-0.5 hover:bg-black transition">
                      <X size={11} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <button type="button" onClick={() => galeriaRef.current?.click()} disabled={uploading}
              className="flex items-center gap-2 text-sm text-gray-600 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition w-fit disabled:opacity-60">
              <Plus size={14} /> Adicionar fotos à galeria
            </button>
            <input ref={galeriaRef} type="file" accept="image/*" multiple className="hidden" onChange={handleGaleria} />
          </div>

          <label className="flex items-center gap-2 cursor-pointer w-fit">
            <input type="checkbox" name="ativo" checked={form.ativo} onChange={handleChange} id="ministerio-ativo" className="rounded" />
            <span className="text-sm text-gray-700">Publicar agora (aparece no site imediatamente)</span>
          </label>

          <div className="flex gap-3 pt-1">
            <button onClick={handleSubmit} disabled={salvando || uploading}
              className="flex items-center gap-2 bg-blue-900 text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-blue-800 transition disabled:opacity-60">
              <Check size={16} /> {salvando ? "Salvando…" : editandoId ? "Salvar alterações" : "Criar ministério"}
            </button>
            {editandoId && (
              <button onClick={handleCancelar}
                className="flex items-center gap-2 text-sm font-semibold text-gray-600 px-5 py-2.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition">
                <X size={16} /> Cancelar edição
              </button>
            )}
          </div>
        </div>

        {/* Lista */}
        <div className="flex flex-col gap-3">
          <h2 className="font-semibold text-gray-800">Ministérios cadastrados ({ministerios?.length ?? 0})</h2>
          {loading ? (
            Array(3).fill(0).map((_, i) => <div key={i} className="h-20 bg-white rounded-xl border border-gray-200 animate-pulse" />)
          ) : ministerios?.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">Nenhum ministério cadastrado ainda. Adicione o primeiro acima!</p>
          ) : (
            ministerios?.map((m) => (
              <div key={m.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-start gap-4">
                {m.fotoUrl && <OptimizedImage src={m.fotoUrl} alt={m.nome} className="w-16 h-16 object-cover rounded-lg flex-shrink-0" />}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${m.ativo ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {m.ativo ? "✅ Visível no site" : "🙈 Oculto"}
                    </span>
                    {m.youtubeUrl && <span className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full">▶ tem vídeo</span>}
                    {(m.fotos ?? []).length > 0 && <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">🖼 {m.fotos.length} fotos</span>}
                  </div>
                  <p className="font-semibold text-gray-900 text-sm">{m.nome}</p>
                  {m.responsavel && <p className="text-xs text-gray-400">Responsável: {m.responsavel}</p>}
                  <p className="text-xs text-gray-500 truncate mt-0.5">{m.descricao}</p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => handleEditar(m)} title="Editar"
                    className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition min-h-[44px] flex items-center justify-center">
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => setConfirm({ open: true, id: m.id })} title="Excluir"
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition min-h-[44px] flex items-center justify-center">
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
        title="Excluir este ministério?"
        message="Ele será removido permanentemente do site."
        onConfirm={handleRemoverConfirmado}
        onCancel={() => setConfirm({ open: false, id: null })}
      />
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </AdminLayout>
  );
}