import { useState } from "react";
import { collection, addDoc, deleteDoc, doc, updateDoc, getDocs } from "firebase/firestore";
import { db } from "../../services/firebase";
import { useCollection } from "../../hooks/useCollection";
import { useToast } from "../../hooks/useToast";
import AdminLayout from "../../components/admin/AdminLayout";
import { ToastContainer } from "../../components/Toast/Toast";
import ConfirmDialog from "../../components/ConfirmDialog/ConfirmDialog";
import { Plus, Star, Pencil, Trash2, X, Check } from "lucide-react";

const DIAS = ["Segunda-feira","Terça-feira","Quarta-feira","Quinta-feira","Sexta-feira","Sábado","Domingo"];
const FORM_VAZIO = { dia: "", horario: "", nome: "", descricao: "", obs: "" };

export default function AdminCultos() {
  const { data: cultos, loading } = useCollection("cultos");
  const { toasts, addToast, removeToast } = useToast();

  const [form, setForm] = useState(FORM_VAZIO);
  const [editando, setEditando] = useState(null);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [confirm, setConfirm] = useState({ open: false, id: null });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validar = () => {
    if (!form.dia) return "Selecione o dia da semana.";
    if (!form.horario) return "Informe o horário.";
    if (!form.nome) return "Informe o nome do culto.";
    return "";
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const msg = validar();
    if (msg) { setErro(msg); return; }
    setErro("");
    setSalvando(true);
    try {
      await addDoc(collection(db, "cultos"), { ...form, destaque: false });
      setForm(FORM_VAZIO);
      addToast("Culto adicionado com sucesso!");
    } catch { addToast("Erro ao salvar. Tente novamente.", "error"); }
    finally { setSalvando(false); }
  };

  const iniciarEdicao = (culto) => {
    setEditando(culto.id);
    setForm({ dia: culto.dia, horario: culto.horario, nome: culto.nome ?? "", descricao: culto.descricao ?? "", obs: culto.obs ?? "" });
    setErro("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelarEdicao = () => { setEditando(null); setForm(FORM_VAZIO); setErro(""); };

  const salvarEdicao = async () => {
    const msg = validar();
    if (msg) { setErro(msg); return; }
    setErro("");
    setSalvando(true);
    try {
      await updateDoc(doc(db, "cultos", editando), { ...form });
      setEditando(null);
      setForm(FORM_VAZIO);
      addToast("Culto atualizado com sucesso!");
    } catch { addToast("Erro ao atualizar.", "error"); }
    finally { setSalvando(false); }
  };

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, "cultos", confirm.id));
      addToast("Culto excluído.");
    } catch { addToast("Erro ao excluir.", "error"); }
    finally { setConfirm({ open: false, id: null }); }
  };

  const tornarPrincipal = async (cultoId) => {
    const snapshot = await getDocs(collection(db, "cultos"));
    await Promise.all(snapshot.docs.map((d) =>
      updateDoc(doc(db, "cultos", d.id), { destaque: d.id === cultoId })
    ));
    addToast("Culto principal atualizado!");
  };

  return (
    <AdminLayout title="Gerenciar Cultos" subtitle="Adicione, edite ou remova os cultos da semana">
      <div className="max-w-3xl flex flex-col gap-8">

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-800 mb-4">
            {editando ? "✏️ Editar Culto" : "➕ Novo Culto"}
          </h2>

          {erro && (
            <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{erro}</div>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Dia da semana *</label>
              <select name="dia" value={form.dia} onChange={handleChange}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/30">
                <option value="">Selecione…</option>
                {DIAS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Horário *</label>
              <input type="text" name="horario" placeholder="Ex: 19h30" value={form.horario} onChange={handleChange}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/30" />
            </div>
            <div className="flex flex-col gap-1 sm:col-span-2">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Nome do culto *</label>
              <input type="text" name="nome" placeholder="Ex: Culto de Celebração" value={form.nome} onChange={handleChange}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/30" />
            </div>
            <div className="flex flex-col gap-1 sm:col-span-2">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Descrição</label>
              <textarea name="descricao" rows={2} placeholder="Breve descrição…" value={form.descricao} onChange={handleChange}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-900/30" />
            </div>
            <div className="flex flex-col gap-1 sm:col-span-2">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Observação</label>
              <input type="text" name="obs" placeholder="Ex: Quinzenal — confirme pelas redes sociais" value={form.obs} onChange={handleChange}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/30" />
            </div>
          </div>

          <div className="flex gap-3 mt-5">
            {editando ? (
              <>
                <button onClick={salvarEdicao} disabled={salvando}
                  className="flex items-center gap-2 bg-blue-900 text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-blue-800 transition disabled:opacity-60">
                  <Check size={16} /> Salvar alterações
                </button>
                <button onClick={cancelarEdicao}
                  className="flex items-center gap-2 text-sm font-semibold text-gray-600 px-5 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition">
                  <X size={16} /> Cancelar
                </button>
              </>
            ) : (
              <button onClick={handleAdd} disabled={salvando}
                className="flex items-center gap-2 bg-blue-900 text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-blue-800 transition disabled:opacity-60">
                <Plus size={16} /> Adicionar culto
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="font-semibold text-gray-800">Cultos configurados</h2>
          {loading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="h-20 bg-white rounded-xl border border-gray-200 animate-pulse" />
            ))
          ) : cultos.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">Nenhum culto adicionado ainda. Comece pelo botão acima!</p>
          ) : (
            cultos.map((culto) => (
              <div key={culto.id}
                className={`bg-white rounded-xl border p-5 flex items-start justify-between gap-4 ${
                  culto.destaque ? "border-blue-900/40 bg-blue-50/30" : "border-gray-200"
                }`}>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    {culto.destaque && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-900 bg-blue-900/10 px-2 py-0.5 rounded-full">
                        <Star size={11} fill="currentColor" /> Principal
                      </span>
                    )}
                    <span className="font-semibold text-gray-900 text-sm">{culto.nome || culto.dia}</span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {culto.dia} — <span className="font-bold text-blue-900">{culto.horario}</span>
                  </p>
                  {culto.descricao && <p className="text-xs text-gray-400 mt-0.5">{culto.descricao}</p>}
                  {culto.obs && <p className="text-xs text-amber-600 mt-0.5">⚠️ {culto.obs}</p>}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {!culto.destaque && (
                    <button onClick={() => tornarPrincipal(culto.id)} title="Tornar principal"
                      className="p-2 text-gray-400 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition">
                      <Star size={16} />
                    </button>
                  )}
                  <button onClick={() => iniciarEdicao(culto)}
                    className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition">
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => setConfirm({ open: true, id: culto.id })}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirm.open}
        title="Excluir culto?"
        message="Esta ação não pode ser desfeita."
        onConfirm={handleDelete}
        onCancel={() => setConfirm({ open: false, id: null })}
      />
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </AdminLayout>
  );
}
