import { useState } from "react";
import { useCollection } from "../../hooks/useCollection";
import { useToast } from "../../hooks/useToast";
import AdminLayout from "../../components/admin/AdminLayout";
import { ToastContainer } from "../../components/Toast/Toast";
import ConfirmDialog from "../../components/ConfirmDialog/ConfirmDialog";
import { Check, Pencil, Trash2, X } from "lucide-react";

const VAZIO = { nome: "", texto: "", tempo: "", ativo: true };

export default function AdminTestemunhos() {
  const { dados: testemunhos = [], loading, adicionar, atualizar, remover } = useCollection("testemunhos");
  const { toasts, addToast, removeToast } = useToast();
  const [form, setForm] = useState(VAZIO);
  const [editandoId, setEditandoId] = useState(null);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [confirm, setConfirm] = useState({ open: false, id: null });

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.nome || !form.texto) { setErro("Preencha o nome e o texto do testemunho."); return; }
    setErro("");
    setSalvando(true);
    try {
      editandoId ? await atualizar(editandoId, form) : await adicionar(form);
      setForm(VAZIO);
      setEditandoId(null);
      addToast(editandoId ? "Testemunho atualizado!" : "Testemunho publicado com sucesso!");
    } catch { addToast("Não foi possível salvar. Tente novamente.", "error"); }
    finally { setSalvando(false); }
  }

  function handleEditar(t) {
    setForm({ nome: t.nome ?? "", texto: t.texto ?? "", tempo: t.tempo ?? "", ativo: t.ativo ?? true });
    setEditandoId(t.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleCancelar() { setForm(VAZIO); setEditandoId(null); setErro(""); }

  async function handleRemover() {
    try { await remover(confirm.id); addToast("Testemunho excluído."); }
    catch { addToast("Erro ao excluir.", "error"); }
    finally { setConfirm({ open: false, id: null }); }
  }

  async function handleToggleAtivo(t) {
    try {
      await atualizar(t.id, { ativo: !t.ativo });
      addToast(t.ativo ? "Testemunho ocultado." : "Testemunho publicado!");
    } catch { addToast("Não foi possível atualizar.", "error"); }
  }

  return (
    <AdminLayout
      title="Testemunhos"
      subtitle="Gerencie os relatos de vidas transformadas exibidos na página inicial"
    >
      <div className="flex flex-col gap-8 max-w-3xl">

        {/* Formulário */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-4">
          <h2 className="font-semibold text-gray-800">
            {editandoId ? "✏️ Editando testemunho" : "➕ Adicionar testemunho"}
          </h2>
          {erro && <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{erro}</div>}

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Nome *</label>
              <input name="nome" value={form.nome} onChange={handleChange}
                placeholder="Ex: Ana Paula S."
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/30" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Tempo na igreja</label>
              <input name="tempo" value={form.tempo} onChange={handleChange}
                placeholder="Ex: Membro há 3 anos"
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/30" />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Texto do testemunho *</label>
            <textarea name="texto" value={form.texto} onChange={handleChange} rows={4}
              placeholder="Escreva o relato aqui…"
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-900/30" />
          </div>

          <label className="flex items-center gap-2 cursor-pointer w-fit">
            <input type="checkbox" name="ativo" checked={form.ativo} onChange={handleChange} className="rounded" />
            <span className="text-sm text-gray-700">Publicar agora (aparece no site imediatamente)</span>
          </label>

          <div className="flex gap-3">
            <button onClick={handleSubmit} disabled={salvando}
              className="flex items-center gap-2 bg-blue-900 text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-blue-800 transition disabled:opacity-60">
              <Check size={16} /> {salvando ? "Salvando…" : editandoId ? "Salvar alterações" : "Publicar testemunho"}
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
          <h2 className="font-semibold text-gray-800">Testemunhos cadastrados ({testemunhos.length})</h2>
          <p className="text-xs text-gray-400 -mt-2">
            Se nenhum estiver publicado, o site exibe testemunhos padrão automaticamente.
          </p>
          {loading ? (
            Array(3).fill(0).map((_, i) => <div key={i} className="h-20 bg-white rounded-xl border border-gray-200 animate-pulse" />)
          ) : testemunhos.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">Nenhum testemunho cadastrado. Adicione o primeiro acima!</p>
          ) : (
            testemunhos.map((t) => (
              <div key={t.id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${t.ativo ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {t.ativo ? "✅ Visível no site" : "🙈 Oculto"}
                    </span>
                  </div>
                  <p className="font-semibold text-gray-900 text-sm">{t.nome}</p>
                  {t.tempo && <p className="text-xs text-gray-400">{t.tempo}</p>}
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{t.texto}</p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => handleToggleAtivo(t)}
                    className={`text-xs px-3 py-1 rounded-lg transition border ${t.ativo ? "border-yellow-300 text-yellow-700 hover:bg-yellow-50" : "border-green-300 text-green-700 hover:bg-green-50"}`}>
                    {t.ativo ? "Ocultar" : "Publicar"}
                  </button>
                  <button onClick={() => handleEditar(t)} title="Editar" className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"><Pencil size={15} /></button>
                  <button onClick={() => setConfirm({ open: true, id: t.id })} title="Excluir" className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"><Trash2 size={15} /></button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirm.open}
        title="Excluir este testemunho?"
        message="Ele será removido permanentemente do site."
        onConfirm={handleRemover}
        onCancel={() => setConfirm({ open: false, id: null })}
      />
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </AdminLayout>
  );
}
