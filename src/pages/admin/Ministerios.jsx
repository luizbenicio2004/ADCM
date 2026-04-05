// src/pages/admin/Ministerios.jsx
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "../../services/firebase";
import { useCollection } from "../../hooks/useCollection";
import { useStorage } from "../../hooks/useStorage";
import { ArrowLeft, Plus, Pencil, Trash2, X, Check, ImagePlus, Loader2 } from "lucide-react";

const VAZIO = {
  nome: "", descricao: "", responsavel: "", diaSemana: "", horario: "", ativo: true,
  historia: "", youtubeUrl: "", fotoUrl: "", fotos: [],
};
const DIAS = ["Segunda","Terça","Quarta","Quinta","Sexta","Sábado","Domingo"];

function Field({ label, name, value, onChange, placeholder }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{label}</label>
      <input type="text" name={name} value={value} onChange={onChange} placeholder={placeholder}
        className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/30" />
    </div>
  );
}

export default function AdminMinisterios() {
  const navigate = useNavigate();
  const { data: ministerios, loading } = useCollection("ministerios");
  const { upload, remove: removeFile, progress, uploading } = useStorage();

  const [form, setForm] = useState(VAZIO);
  const [editandoId, setEditandoId] = useState(null);
  const [salvando, setSalvando] = useState(false);
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
    } catch { setErro("Erro ao enviar foto de capa."); }
  };

  const handleGaleria = async (e) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    try {
      const urls = await Promise.all(files.map((f) => upload(f, `ministerios/galeria/${Date.now()}_${f.name}`)));
      setForm((f) => ({ ...f, fotos: [...(f.fotos ?? []), ...urls] }));
    } catch { setErro("Erro ao enviar fotos."); }
  };

  const handleRemoverFoto = async (url) => {
    try {
      await removeFile(url);
      setForm((f) => ({ ...f, fotos: f.fotos.filter((u) => u !== url) }));
    } catch { setErro("Erro ao remover foto."); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nome || !form.descricao) { setErro("Nome e descrição são obrigatórios."); return; }
    setErro("");
    setSalvando(true);
    try {
      if (editandoId) {
        await updateDoc(doc(db, "ministerios", editandoId), form);
      } else {
        await addDoc(collection(db, "ministerios"), { ...form, createdAt: serverTimestamp() });
      }
      setForm(VAZIO);
      setEditandoId(null);
    } catch { setErro("Erro ao salvar."); }
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

  const handleRemover = async (id) => {
    if (!window.confirm("Excluir este ministério?")) return;
    await deleteDoc(doc(db, "ministerios", id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4">
        <button onClick={() => navigate("/admin/dashboard")} className="text-gray-500 hover:text-gray-900 transition">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="font-bold text-gray-900">Gerenciar Ministérios</h1>
          <p className="text-xs text-gray-500">Fotos, vídeos e história de cada ministério</p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10 flex flex-col gap-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-5">
          <h2 className="font-semibold text-gray-800">{editandoId ? "✏️ Editar Ministério" : "➕ Novo Ministério"}</h2>

          {erro && <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{erro}</div>}

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Nome *" name="nome" value={form.nome} onChange={handleChange} placeholder="Ex: Ministério de Louvor" />
            <Field label="Responsável" name="responsavel" value={form.responsavel} onChange={handleChange} placeholder="Ex: Pastor João" />
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Dia da semana</label>
              <select name="diaSemana" value={form.diaSemana} onChange={handleChange}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/30">
                <option value="">Selecione…</option>
                {DIAS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <Field label="Horário" name="horario" value={form.horario} onChange={handleChange} placeholder="Ex: 19h30" />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Descrição curta *</label>
            <textarea name="descricao" rows={2} value={form.descricao} onChange={handleChange}
              placeholder="Descrição exibida no card da home…"
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-900/30" />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">História do ministério</label>
            <textarea name="historia" rows={5} value={form.historia} onChange={handleChange}
              placeholder="Conte a história, propósito e conquistas do ministério…"
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-900/30" />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide flex items-center gap-1">
              ▶ URL do vídeo YouTube
            </label>
            <input type="text" name="youtubeUrl" value={form.youtubeUrl} onChange={handleChange}
              placeholder="https://www.youtube.com/watch?v=..."
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/30" />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Foto de capa</label>
            {form.fotoUrl && (
              <div className="relative w-40 h-24 rounded-lg overflow-hidden border border-gray-200">
                <img src={form.fotoUrl} alt="capa" className="w-full h-full object-cover" />
                <button type="button" onClick={() => setForm((f) => ({ ...f, fotoUrl: "" }))}
                  className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 hover:bg-black transition">
                  <X size={12} />
                </button>
              </div>
            )}
            <button type="button" onClick={() => fotoCapaRef.current?.click()} disabled={uploading}
              className="flex items-center gap-2 text-sm text-blue-900 border border-blue-900/30 px-4 py-2 rounded-lg hover:bg-blue-50 transition w-fit disabled:opacity-60">
              {uploading ? <Loader2 size={14} className="animate-spin" /> : <ImagePlus size={14} />}
              {uploading ? `Enviando… ${progress}%` : "Selecionar foto"}
            </button>
            <input ref={fotoCapaRef} type="file" accept="image/*" className="hidden" onChange={handleFotoCapa} />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Galeria de fotos</label>
            {(form.fotos ?? []).length > 0 && (
              <div className="flex flex-wrap gap-2">
                {form.fotos.map((url) => (
                  <div key={url} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                    <img src={url} alt="" className="w-full h-full object-cover" />
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
              <Plus size={14} /> Adicionar fotos
            </button>
            <input ref={galeriaRef} type="file" accept="image/*" multiple className="hidden" onChange={handleGaleria} />
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" name="ativo" checked={form.ativo} onChange={handleChange} id="ativo" className="rounded" />
            <label htmlFor="ativo" className="text-sm text-gray-700">Publicar (visível no site)</label>
          </div>

          <div className="flex gap-3 pt-1">
            <button onClick={handleSubmit} disabled={salvando || uploading}
              className="flex items-center gap-2 bg-blue-900 text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-blue-800 transition disabled:opacity-60">
              <Check size={16} /> {salvando ? "Salvando…" : editandoId ? "Salvar alterações" : "Criar ministério"}
            </button>
            {editandoId && (
              <button onClick={handleCancelar}
                className="flex items-center gap-2 text-sm font-semibold text-gray-600 px-5 py-2.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition">
                <X size={16} /> Cancelar
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="font-semibold text-gray-800">Ministérios cadastrados</h2>
          {loading ? (
            Array(3).fill(0).map((_, i) => <div key={i} className="h-20 bg-white rounded-xl border border-gray-200 animate-pulse" />)
          ) : ministerios.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">Nenhum ministério cadastrado.</p>
          ) : (
            ministerios.map((m) => (
              <div key={m.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-start gap-4">
                {m.fotoUrl && <img src={m.fotoUrl} alt={m.nome} className="w-16 h-16 object-cover rounded-lg flex-shrink-0" />}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${m.ativo ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {m.ativo ? "publicado" : "oculto"}
                    </span>
                    {m.youtubeUrl && <span className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full">▶ vídeo</span>}
                    {(m.fotos ?? []).length > 0 && <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">🖼 {m.fotos.length} fotos</span>}
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm">{m.nome}</h3>
                  <p className="text-xs text-gray-500 truncate">{m.descricao}</p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => handleEditar(m)} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"><Pencil size={15} /></button>
                  <button onClick={() => handleRemover(m.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"><Trash2 size={15} /></button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}