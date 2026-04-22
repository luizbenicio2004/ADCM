import { useState } from "react";
import { useCollection } from "../../hooks/useCollection";
import { useToast } from "../../hooks/useToast";
import AdminLayout from "../../components/admin/AdminLayout";
import { ToastContainer } from "../../components/Toast/Toast";
import ConfirmDialog from "../../components/ConfirmDialog/ConfirmDialog";
import { Check, Pencil, Trash2, X, GripVertical } from "lucide-react";

const VAZIO = { titulo: "", mensagem: "", tipo: "aviso", ativo: true, ordem: "" };

const TIPO_ESTILO = {
  urgente: "bg-red-100 text-red-700",
  aviso:   "bg-yellow-100 text-yellow-700",
  info:    "bg-blue-100 text-blue-700",
};

const TIPO_LABEL = {
  urgente: "🚨 Urgente",
  aviso:   "📢 Aviso",
  info:    "ℹ️ Informação",
};

export default function AdminAvisos() {
  const { dados: avisos = [], loading, adicionar, atualizar, remover } = useCollection("avisos");
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
    if (!form.titulo || !form.mensagem) { setErro("Preencha o título e a mensagem."); return; }
    setErro("");
    setSalvando(true);
    try {
      editandoId ? await atualizar(editandoId, form) : await adicionar(form);
      setForm(VAZIO);
      setEditandoId(null);
      addToast(editandoId ? "Aviso atualizado!" : "Aviso publicado com sucesso!");
    } catch { addToast("Não foi possível salvar. Tente novamente.", "error"); }
    finally { setSalvando(false); }
  }

  function handleEditar(aviso) {
    setForm({ titulo: aviso.titulo ?? "", mensagem: aviso.mensagem ?? "", tipo: aviso.tipo ?? "aviso", ativo: aviso.ativo ?? true, ordem: aviso.ordem ?? "" });
    setEditandoId(aviso.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleCancelar() { setForm(VAZIO); setEditandoId(null); setErro(""); }

  async function handleRemover() {
    try {
      await remover(confirm.id);
      addToast("Aviso excluído.");
    } catch { addToast("Erro ao excluir.", "error"); }
    finally { setConfirm({ open: false, id: null }); }
  }

  async function handleToggleAtivo(aviso) {
    try {
      await atualizar(aviso.id, { ativo: !aviso.ativo });
      addToast(aviso.ativo ? "Aviso ocultado do site." : "Aviso publicado no site!");
    } catch {
      addToast("Não foi possível atualizar o aviso.", "error");
    }
  }

  return (
    <AdminLayout
      title="Avisos"
      subtitle="Publique recados, notícias e comunicados importantes para os visitantes"
    >
      <div className="flex flex-col gap-8">

        {/* Formulário */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-4">
          <h2 className="font-semibold text-gray-800">
            {editandoId ? "✏️ Editando aviso" : "➕ Criar novo aviso"}
          </h2>

          {erro && <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{erro}</div>}

          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Título *</label>
              <input name="titulo" value={form.titulo} onChange={handleChange}
                placeholder="Ex: Mudança de horário no domingo"
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/30" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Tipo de aviso</label>
              <select name="tipo" value={form.tipo} onChange={handleChange}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/30">
                <option value="aviso">📢 Aviso comum</option>
                <option value="urgente">🚨 Urgente (aparece em vermelho)</option>
                <option value="info">ℹ️ Informação</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Mensagem *</label>
            <textarea name="mensagem" value={form.mensagem} onChange={handleChange} rows={3}
              placeholder="Escreva aqui o conteúdo do aviso…"
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-900/30" />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Ordem de exibição</label>
            <input type="number" name="ordem" value={form.ordem} onChange={handleChange}
              placeholder="Ex: 1, 2, 3… (menor aparece primeiro)"
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/30 max-w-[200px]" />
          </div>

          <label className="flex items-center gap-2 cursor-pointer w-fit">
            <input type="checkbox" name="ativo" checked={form.ativo} onChange={handleChange} className="rounded" />
            <span className="text-sm text-gray-700">Publicar agora (aparece no site imediatamente)</span>
          </label>

          <div className="flex gap-3">
            <button onClick={handleSubmit} disabled={salvando}
              className="flex items-center gap-2 bg-blue-900 text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-blue-800 transition disabled:opacity-60">
              <Check size={16} /> {salvando ? "Salvando…" : editandoId ? "Salvar alterações" : "Publicar aviso"}
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
          <h2 className="font-semibold text-gray-800">Avisos cadastrados ({avisos.length})</h2>
          {loading ? (
            Array(3).fill(0).map((_, i) => <div key={i} className="h-20 bg-white rounded-xl border border-gray-200 animate-pulse" />)
          ) : avisos.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">Nenhum aviso ainda. Crie o primeiro acima!</p>
          ) : (
            avisos.sort((a, b) => (a.ordem ?? 999) - (b.ordem ?? 999)).map((a) => (
              <div key={a.id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-start justify-between gap-3">
                <div className="flex flex-col items-center gap-1 pt-1 flex-shrink-0">
                  <GripVertical size={16} className="text-gray-300" />
                  <span className="text-[10px] text-gray-300 font-mono">{a.ordem ?? "—"}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${TIPO_ESTILO[a.tipo] ?? TIPO_ESTILO.aviso}`}>
                      {TIPO_LABEL[a.tipo] ?? a.tipo}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${a.ativo ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {a.ativo ? "✅ Visível no site" : "🙈 Oculto"}
                    </span>
                  </div>
                  <p className="font-semibold text-gray-900 text-sm">{a.titulo}</p>
                  <p className="text-sm text-gray-600 mt-0.5 line-clamp-2">{a.mensagem}</p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => handleToggleAtivo(a)}
                    className={`text-xs px-3 py-1 rounded-lg transition border ${a.ativo ? "border-yellow-300 text-yellow-700 hover:bg-yellow-50" : "border-green-300 text-green-700 hover:bg-green-50"}`}>
                    {a.ativo ? "Ocultar" : "Publicar"}
                  </button>
                  <button onClick={() => handleEditar(a)} title="Editar" className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"><Pencil size={15} /></button>
                  <button onClick={() => setConfirm({ open: true, id: a.id })} title="Excluir" className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"><Trash2 size={15} /></button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirm.open}
        title="Excluir este aviso?"
        message="O aviso será removido permanentemente e não aparecerá mais no site."
        onConfirm={handleRemover}
        onCancel={() => setConfirm({ open: false, id: null })}
      />
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </AdminLayout>
  );
}