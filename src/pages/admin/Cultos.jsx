import { useState, useRef } from "react";
import { collection, addDoc, deleteDoc, doc, updateDoc, writeBatch } from "firebase/firestore";
import { db } from "../../services/firebase";
import { useCollection } from "../../hooks/useCollection";
import { useStorage } from "../../hooks/useStorage";
import { useToast } from "../../hooks/useToast";
import AdminLayout from "../../components/admin/AdminLayout";
import { ToastContainer } from "../../components/Toast/Toast";
import ConfirmDialog from "../../components/ConfirmDialog/ConfirmDialog";
import OptimizedImage from "../../components/OptimizedImage";
import { Star, Pencil, Trash2, X, Check, Plus, ImagePlus, Loader2 } from "lucide-react";

const DIAS = ["Segunda-feira","Terça-feira","Quarta-feira","Quinta-feira","Sexta-feira","Sábado","Domingo"];
const FORM_VAZIO = { dia: "", horario: "", nome: "", descricao: "", obs: "", banner: "" };

function formatarHorario(hhmm) {
  if (!hhmm) return "";
  const [h, m] = hhmm.split(":");
  return m === "00" ? `${parseInt(h)}h` : `${parseInt(h)}h${m}`;
}

function Secao({ titulo, subtitulo, children }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-5">
      <div>
        <h2 className="font-semibold text-gray-800">{titulo}</h2>
        {subtitulo && <p className="text-xs text-gray-400 mt-1">{subtitulo}</p>}
      </div>
      {children}
    </div>
  );
}

export default function AdminCultos() {
  const { data: cultos, loading } = useCollection("cultos");
  const { upload, progress, uploading } = useStorage();
  const { toasts, addToast, removeToast } = useToast();

  const [form, setForm]         = useState(FORM_VAZIO);
  const [editando, setEditando] = useState(null);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro]         = useState("");
  const [confirm, setConfirm]   = useState({ open: false, id: null });
  const bannerRef = useRef();

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  /* upload do banner do culto */
  const handleBanner = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await upload(file, `cultos/banners/${Date.now()}_${file.name}`);
      setForm((prev) => ({ ...prev, banner: url }));
    } catch {
      setErro("Não foi possível enviar o banner. Tente novamente.");
    } finally {
      if (bannerRef.current) bannerRef.current.value = "";
    }
  };

  const validar = () => {
    if (!form.dia)     return "Escolha o dia da semana.";
    if (!form.horario) return "Informe o horário.";
    if (!form.nome)    return "Dê um nome para este culto.";
    return "";
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const msg = validar();
    if (msg) { setErro(msg); return; }
    setErro(""); setSalvando(true);
    try {
      await addDoc(collection(db, "cultos"), { ...form, destaque: false });
      setForm(FORM_VAZIO);
      addToast("Culto adicionado com sucesso!");
    } catch { addToast("Não foi possível salvar. Tente novamente.", "error"); }
    finally { setSalvando(false); }
  };

  const iniciarEdicao = (culto) => {
    setEditando(culto.id);
    setForm({
      dia: culto.dia,
      horario: culto.horario,
      nome: culto.nome ?? "",
      descricao: culto.descricao ?? "",
      obs: culto.obs ?? "",
      banner: culto.banner ?? "",
    });
    setErro("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelarEdicao = () => { setEditando(null); setForm(FORM_VAZIO); setErro(""); };

  const salvarEdicao = async () => {
    const msg = validar();
    if (msg) { setErro(msg); return; }
    setErro(""); setSalvando(true);
    try {
      await updateDoc(doc(db, "cultos", editando), { ...form });
      setEditando(null); setForm(FORM_VAZIO);
      addToast("Culto atualizado!");
    } catch { addToast("Não foi possível salvar.", "error"); }
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
    try {
      const batch = writeBatch(db);
      cultos.forEach((c) => batch.update(doc(db, "cultos", c.id), { destaque: c.id === cultoId }));
      await batch.commit();
      addToast("Culto principal atualizado!");
    } catch { addToast("Erro ao atualizar.", "error"); }
  };

  return (
    <AdminLayout title="Cultos" subtitle="Gerencie os horários de culto">
      <div className="max-w-3xl flex flex-col gap-8">

        {/* formulário */}
        <Secao titulo={editando ? "✏️ Editando culto" : "➕ Adicionar novo culto"}>
          {erro && (
            <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{erro}</div>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Dia da semana *</label>
              <select name="dia" value={form.dia} onChange={handleChange}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/30">
                <option value="">Escolha o dia…</option>
                {DIAS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Horário *</label>
              <input type="time" name="horario" value={form.horario} onChange={handleChange}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/30" />
            </div>

            <div className="flex flex-col gap-1 sm:col-span-2">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Nome do culto *</label>
              <input type="text" name="nome" placeholder="Ex: Culto de Celebração"
                value={form.nome} onChange={handleChange}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/30" />
            </div>

            <div className="flex flex-col gap-1 sm:col-span-2">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Descrição (opcional)</label>
              <textarea name="descricao" rows={2} placeholder="Uma frase curta sobre este culto…"
                value={form.descricao} onChange={handleChange}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-900/30" />
            </div>

            <div className="flex flex-col gap-1 sm:col-span-2">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Observação (opcional)</label>
              <input type="text" name="obs" placeholder="Ex: Quinzenal — confirme pelas redes sociais"
                value={form.obs} onChange={handleChange}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/30" />
              <p className="text-xs text-gray-400">Aparece em destaque como um alerta abaixo do culto.</p>
            </div>

            {/* banner do culto */}
            <div className="flex flex-col gap-2 sm:col-span-2">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Foto do culto (opcional)
              </label>

              {form.banner ? (
                <div className="relative w-full h-36 rounded-xl overflow-hidden border border-gray-200 group">
                  <OptimizedImage
                    src={form.banner}
                    alt="Banner do culto"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, banner: "" }))}
                      className="opacity-0 group-hover:opacity-100 transition bg-red-600 text-white rounded-full p-1.5 hover:bg-red-700 shadow-lg"
                      title="Remover foto"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => bannerRef.current?.click()}
                  disabled={uploading}
                  className="flex items-center justify-center gap-2 text-sm text-gray-500 border-2 border-dashed border-gray-200 rounded-xl px-4 py-6 hover:bg-gray-50 hover:border-gray-300 transition disabled:opacity-60 w-full"
                >
                  {uploading ? (
                    <><Loader2 size={16} className="animate-spin" /> Enviando… {progress}%</>
                  ) : (
                    <><ImagePlus size={16} /> Clique para adicionar uma foto</>
                  )}
                </button>
              )}

              <input
                ref={bannerRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleBanner}
              />
              <p className="text-xs text-gray-400">Aparece no topo do card de culto. JPG, PNG, WebP · Máx. 5 MB.</p>
            </div>
          </div>

          <div className="flex gap-3 flex-wrap">
            {editando ? (
              <>
                <button onClick={salvarEdicao} disabled={salvando || uploading}
                  className="flex items-center gap-2 bg-blue-900 text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-blue-800 transition disabled:opacity-60">
                  <Check size={16} /> Salvar alterações
                </button>
                <button onClick={cancelarEdicao}
                  className="flex items-center gap-2 text-sm font-semibold text-gray-600 px-5 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition">
                  <X size={16} /> Cancelar edição
                </button>
              </>
            ) : (
              <button onClick={handleAdd} disabled={salvando || uploading}
                className="flex items-center gap-2 bg-blue-900 text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-blue-800 transition disabled:opacity-60">
                <Plus size={16} /> Adicionar culto
              </button>
            )}
          </div>
        </Secao>

        {/* lista */}
        <div className="flex flex-col gap-3">
          <h2 className="font-semibold text-gray-800">Cultos cadastrados ({cultos?.length ?? 0})</h2>
          <p className="text-xs text-gray-400 -mt-2">A ⭐ marca o culto principal — ele aparece em destaque no site.</p>

          {loading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="h-20 bg-white rounded-xl border border-gray-200 animate-pulse" />
            ))
          ) : cultos?.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">Nenhum culto cadastrado ainda.</p>
          ) : (
            cultos?.map((culto) => (
              <div key={culto.id}
                className={`bg-white rounded-xl border overflow-hidden flex items-stretch justify-between gap-0
                  ${culto.destaque ? "border-blue-900/40" : "border-gray-200"}`}>

                {/* thumbnail do banner na lista */}
                {culto.banner && (
                  <div className="w-20 flex-shrink-0">
                    <OptimizedImage
                      src={culto.banner}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="flex flex-1 items-start justify-between gap-4 p-4 min-w-0">
                  <div className="flex flex-col gap-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      {culto.destaque && (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-900 bg-blue-900/10 px-2 py-0.5 rounded-full">
                          <Star size={11} fill="currentColor" /> Principal
                        </span>
                      )}
                      <span className="font-semibold text-gray-900 text-sm">{culto.nome || culto.dia}</span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {culto.dia} — <span className="font-bold text-blue-900">
                        {culto.horario?.includes(":") ? formatarHorario(culto.horario) : culto.horario}
                      </span>
                    </p>
                    {culto.descricao && <p className="text-xs text-gray-400 mt-0.5">{culto.descricao}</p>}
                    {culto.obs && <p className="text-xs text-amber-600 mt-0.5">⚠️ {culto.obs}</p>}
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    {!culto.destaque && (
                      <button onClick={() => tornarPrincipal(culto.id)} title="Marcar como principal"
                        className="p-2 text-gray-400 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition min-h-[44px] flex items-center justify-center">
                        <Star size={16} />
                      </button>
                    )}
                    <button onClick={() => iniciarEdicao(culto)} title="Editar"
                      className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition min-h-[44px] flex items-center justify-center">
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => setConfirm({ open: true, id: culto.id })} title="Excluir"
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition min-h-[44px] flex items-center justify-center">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>

      <ConfirmDialog
        isOpen={confirm.open}
        title="Excluir este culto?"
        message="Ele será removido permanentemente da lista."
        onConfirm={handleDelete}
        onCancel={() => setConfirm({ open: false, id: null })}
      />
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </AdminLayout>
  );
}