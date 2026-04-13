import { useState, useEffect } from "react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../../services/firebase";
import AdminLayout from "../../components/admin/AdminLayout";
import { Save, Plus, Trash2 } from "lucide-react";
import { useToast } from "../../hooks/useToast";
import { ToastContainer } from "../../components/Toast/Toast";

const FORM_VAZIO = {
  descricao: "",
  versiculo: "",
  referenciaVersiculo: "",
  materiais: [],
  metaReais: 0,
  arrecadadoReais: 0 };

export default function AdminReciclagem() {
  const [form, setForm] = useState(FORM_VAZIO);
  const [novoMaterial, setNovoMaterial] = useState("");
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const { toasts, addToast, removeToast } = useToast();

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDoc(doc(db, "config", "reciclagem"));
        if (snap.exists()) setForm({ ...FORM_VAZIO, ...snap.data() });
      } finally { setLoading(false); }
    })();
  }, []);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "number" ? Number(value) : value }));
  };

  const addMaterial = () => {
    if (!novoMaterial.trim()) return;
    setForm((prev) => ({ ...prev, materiais: [...prev.materiais, novoMaterial.trim()] }));
    setNovoMaterial("");
  };
  const removeMaterial = (i) => setForm((prev) => ({ ...prev, materiais: prev.materiais.filter((_, idx) => idx !== i) }));

  const handleSave = async (e) => {
    e.preventDefault();
    setErro("");
    setSalvando(true);
    try {
      await setDoc(doc(db, "config", "reciclagem"), form, { merge: true });
      addToast("Configurações salvas com sucesso!");
    } catch { addToast("Erro ao salvar.", "error"); }
    finally { setSalvando(false); }
  };

  return (
    <AdminLayout title="Projeto Reciclagem" subtitle="Gerencie a seção de reciclagem do site">
      <div className="max-w-2xl ">
        {loading ? (
          <div className="flex flex-col gap-4">{Array(5).fill(0).map((_, i) => <div key={i} className="h-10 bg-gray-200 rounded-lg animate-pulse" />)}</div>
        ) : (
          <form onSubmit={handleSave} className="flex flex-col gap-6">
            {erro && <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{erro}</div>}
{/* Descrição */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-4">
              <h2 className="font-semibold text-gray-800">Descrição</h2>
              <textarea name="descricao" rows={3} value={form.descricao} onChange={handleChange}
                placeholder="Descreva o projeto de reciclagem…"
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-600/30" />
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Versículo motivacional</label>
                <textarea name="versiculo" rows={2} value={form.versiculo} onChange={handleChange}
                  placeholder="Ex: A terra é do Senhor…"
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-600/30" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Referência</label>
                <input type="text" name="referenciaVersiculo" value={form.referenciaVersiculo} onChange={handleChange}
                  placeholder="Ex: Salmos 24:1"
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600/30" />
              </div>
            </div>

            {/* Materiais */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-4">
              <h2 className="font-semibold text-gray-800">Materiais Aceitos</h2>
              <div className="flex gap-2">
                <input type="text" value={novoMaterial} onChange={(e) => setNovoMaterial(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addMaterial())}
                  placeholder="Ex: Garrafas PET"
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-green-600/30" />
                <button type="button" onClick={addMaterial}
                  className="flex items-center gap-1 text-sm bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition">
                  <Plus size={15} /> Add
                </button>
              </div>
              <ul className="flex flex-col gap-2">
                {form.materiais.map((m, i) => (
                  <li key={i} className="flex items-center justify-between text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded-lg">
                    <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500" /> {m}</span>
                    <button type="button" onClick={() => removeMaterial(i)} className="text-gray-400 hover:text-red-600 transition"><Trash2 size={14} /></button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Meta */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-4">
              <h2 className="font-semibold text-gray-800">Meta do Terreno</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Meta (R$)</label>
                  <input type="number" name="metaReais" value={form.metaReais} onChange={handleChange} min={0}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600/30" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Arrecadado (R$)</label>
                  <input type="number" name="arrecadadoReais" value={form.arrecadadoReais} onChange={handleChange} min={0}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600/30" />
                </div>
              </div>
              {form.metaReais > 0 && (
                <div>
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Progresso</span>
                    <span className="font-bold text-green-700">{Math.min(100, Math.round((form.arrecadadoReais / form.metaReais) * 100))}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3">
                    <div className="bg-green-600 h-3 rounded-full transition-all"
                      style={{ width: `${Math.min(100, Math.round((form.arrecadadoReais / form.metaReais) * 100))}%` }} />
                  </div>
                </div>
              )}
            </div>

            <button type="submit" disabled={salvando}
              className="flex items-center gap-2 bg-green-700 text-white text-sm font-semibold px-6 py-2.5 rounded-lg hover:bg-green-600 transition disabled:opacity-60 self-start">
              <Save size={16} /> {salvando ? "Salvando…" : "Salvar"}
            </button>
          </form>
        )}
      </div>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </AdminLayout>
  );
}