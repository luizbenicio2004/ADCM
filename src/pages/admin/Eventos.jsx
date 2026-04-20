import { useState, useRef } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { useCollection } from "../../hooks/useCollection";
import { useStorage } from "../../hooks/useStorage";
import { useToast } from "../../hooks/useToast";
import { ToastContainer } from "../../components/Toast/Toast";
import ConfirmDialog from "../../components/ConfirmDialog/ConfirmDialog";
import { Plus, Pencil, Trash2, X, Check, ImagePlus, Loader2, Calendar } from "lucide-react";
import OptimizedImage from "../../components/OptimizedImage";

const VAZIO = {
  titulo: "", descricao: "", data: "", horario: "", local: "",
  tipo: "evento", ativo: true, fotoUrl: "", fotos: [],
};

export default function AdminEventos() {
  const { dados: eventos = [], loading, adicionar, atualizar, remover } = useCollection("eventos");
  const { upload, progress, uploading } = useStorage();
  const { toasts, addToast, removeToast } = useToast();

  const [form, setForm] = useState(VAZIO);
  const [editandoId, setEditandoId] = useState(null);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [confirm, setConfirm] = useState({ open: false, id: null });

  const fotoCapaRef = useRef();
  const galeriaRef = useRef();

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  }

  const handleFotoCapa = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await upload(file, `eventos/capas/${Date.now()}_${file.name}`);
      setForm((f) => ({ ...f, fotoUrl: url }));
    } catch (err) {
      addToast(err.message || "Erro ao enviar foto de capa.", "error");
    }
  };

  const handleGaleria = async (e) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    try {
      const urls = await Promise.all(
        files.map((f) => upload(f, `eventos/galeria/${Date.now()}_${f.name}`))
      );
      setForm((f) => ({ ...f, fotos: [...(f.fotos ?? []), ...urls] }));
      addToast(`${urls.length} foto(s) adicionada(s)!`);
    } catch (err) {
      addToast(err.message || "Erro ao enviar fotos.", "error");
    }
  };

  const handleRemoverFoto = (url) => {
    setForm((f) => ({ ...f, fotos: f.fotos.filter((u) => u !== url) }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.titulo || !form.descricao) {
      setErro("Título e descrição são obrigatórios.");
      return;
    }
    setErro("");
    setSalvando(true);
    try {
      if (editandoId) {
        await atualizar(editandoId, form);
        addToast("Evento atualizado com sucesso!");
      } else {
        await adicionar(form);
        addToast("Evento criado com sucesso!");
      }
      setForm(VAZIO);
      setEditandoId(null);
    } catch {
      addToast("Erro ao salvar. Tente novamente.", "error");
    } finally {
      setSalvando(false);
    }
  }

  function handleEditar(evento) {
    setForm({
      titulo: evento.titulo ?? "",
      descricao: evento.descricao ?? "",
      data: evento.data ?? "",
      horario: evento.horario ?? "",
      local: evento.local ?? "",
      tipo: evento.tipo ?? "evento",
      ativo: evento.ativo ?? true,
      fotoUrl: evento.fotoUrl ?? "",
      fotos: evento.fotos ?? [],
    });
    setEditandoId(evento.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleCancelar() {
    setForm(VAZIO);
    setEditandoId(null);
    setErro("");
  }

  async function handleRemover() {
    try {
      await remover(confirm.id);
      addToast("Evento excluído.");
    } catch {
      addToast("Erro ao excluir.", "error");
    } finally {
      setConfirm({ open: false, id: null });
    }
  }

  return (
    <AdminLayout title="Gerenciar Eventos" subtitle="Crie e gerencie os eventos da igreja">
      <div className="max-w-3xl flex flex-col gap-8">

        <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-5">
          <h2 className="font-semibold text-gray-800">
            {editandoId ? "✏️ Editar Evento" : "➕ Novo Evento"}
          </h2>

          {erro && (
            <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              {erro}
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Título *
              </label>
              <input
                name="titulo"
                value={form.titulo}
                onChange={handleChange}
                placeholder="Ex: Culto de Aniversário"
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/30"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Tipo
              </label>
              <select
                name="tipo"
                value={form.tipo}
                onChange={handleChange}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/30"
              >
                <option value="evento">Evento</option>
                <option value="aviso">Aviso</option>
                <option value="urgente">Urgente</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
              Descrição *
            </label>
            <textarea
              name="descricao"
              rows={3}
              value={form.descricao}
              onChange={handleChange}
              placeholder="Descreva o evento..."
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-900/30"
            />
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Data
              </label>
              <input
                type="date"
                name="data"
                value={form.data}
                onChange={handleChange}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/30"
              />
              {/* CORRIGIDO: aviso quando evento não tem data */}
              {!form.data && (
                <p className="text-xs text-amber-600">
                  ⚠️ Sem data: o evento não aparecerá na seção de próximos eventos.
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Horário
              </label>
              <input
                name="horario"
                value={form.horario}
                onChange={handleChange}
                placeholder="Ex: 19h30"
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/30"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Local
              </label>
              <input
                name="local"
                value={form.local}
                onChange={handleChange}
                placeholder="Ex: Templo Principal"
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/30"
              />
            </div>
          </div>

          {/* Foto de capa */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
              Foto de capa
            </label>
            {form.fotoUrl && (
              <div className="relative w-40 h-24 rounded-lg overflow-hidden border border-gray-200">
                <OptimizedImage src={form.fotoUrl} alt="capa" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, fotoUrl: "" }))}
                  className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 hover:bg-black transition"
                >
                  <X size={12} />
                </button>
              </div>
            )}
            <button
              type="button"
              onClick={() => fotoCapaRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-2 text-sm text-blue-900 border border-blue-900/30 px-4 py-2 rounded-lg hover:bg-blue-50 transition w-fit disabled:opacity-60"
            >
              {uploading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <ImagePlus size={14} />
              )}
              {uploading ? `Enviando… ${progress}%` : "Selecionar foto de capa"}
            </button>
            <input
              ref={fotoCapaRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFotoCapa}
            />
          </div>

          {/* Galeria */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
              Galeria de fotos
            </label>
            {(form.fotos ?? []).length > 0 && (
              <div className="flex flex-wrap gap-2">
                {form.fotos.map((url) => (
                  <div key={url} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                    <OptimizedImage src={url} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoverFoto(url)}
                      className="absolute top-0.5 right-0.5 bg-black/60 text-white rounded-full p-0.5 hover:bg-black transition"
                    >
                      <X size={11} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <button
              type="button"
              onClick={() => galeriaRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-2 text-sm text-gray-600 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition w-fit disabled:opacity-60"
            >
              <Plus size={14} /> Adicionar fotos à galeria
            </button>
            <input
              ref={galeriaRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleGaleria}
            />
          </div>

          {/* CORRIGIDO: id único "evento-ativo" */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="ativo"
              checked={form.ativo}
              onChange={handleChange}
              id="evento-ativo"
              className="rounded"
            />
            <label htmlFor="evento-ativo" className="text-sm text-gray-700">
              Publicar (visível no site)
            </label>
          </div>

          <div className="flex gap-3 pt-1">
            <button
              onClick={handleSubmit}
              disabled={salvando || uploading}
              className="flex items-center gap-2 bg-blue-900 text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-blue-800 transition disabled:opacity-60"
            >
              <Check size={16} />{" "}
              {salvando ? "Salvando…" : editandoId ? "Salvar alterações" : "Criar evento"}
            </button>
            {editandoId && (
              <button
                onClick={handleCancelar}
                className="flex items-center gap-2 text-sm font-semibold text-gray-600 px-5 py-2.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition"
              >
                <X size={16} /> Cancelar
              </button>
            )}
          </div>
        </div>

        {/* Lista */}
        <div className="flex flex-col gap-3">
          <h2 className="font-semibold text-gray-800">Eventos publicados</h2>
          {loading ? (
            Array(3)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="h-20 bg-white rounded-xl border border-gray-200 animate-pulse" />
              ))
          ) : eventos.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">
              Nenhum evento por enquanto. Que tal adicionar o primeiro?
            </p>
          ) : (
            eventos.map((ev) => (
              <div key={ev.id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-start gap-4">
                {ev.fotoUrl ? (
                  <OptimizedImage
                    src={ev.fotoUrl}
                    alt={ev.titulo}
                    className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar size={20} className="text-gray-400" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        ev.tipo === "urgente"
                          ? "bg-red-100 text-red-700"
                          : ev.tipo === "aviso"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {ev.tipo}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        ev.ativo ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {ev.ativo ? "publicado" : "oculto"}
                    </span>
                    {!ev.data && (
                      <span className="text-xs bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full">
                        ⚠️ sem data
                      </span>
                    )}
                    {(ev.fotos ?? []).length > 0 && (
                      <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                        🖼 {ev.fotos.length} fotos
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm">{ev.titulo}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {ev.data} {ev.horario} {ev.local && `· ${ev.local}`}
                  </p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => handleEditar(ev)}
                    className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition min-w-[40px] min-h-[44px] flex items-center justify-center"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => setConfirm({ open: true, id: ev.id })}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition min-w-[40px] min-h-[44px] flex items-center justify-center"
                  >
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
        title="Excluir evento?"
        message="Esta ação não pode ser desfeita."
        onConfirm={handleRemover}
        onCancel={() => setConfirm({ open: false, id: null })}
      />
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </AdminLayout>
  );
}
