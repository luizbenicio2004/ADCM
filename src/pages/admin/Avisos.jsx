import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCollection } from "../../hooks/useCollection";

const VAZIO = {
  titulo: "",
  mensagem: "",
  tipo: "aviso",
  ativo: true,
};

const TIPO_ESTILO = {
  urgente: "bg-red-100 text-red-700",
  aviso:   "bg-yellow-100 text-yellow-700",
  info:    "bg-blue-100 text-blue-700",
};

export default function AdminAvisos() {
  const navigate = useNavigate();
  const { dados: avisos, loading, adicionar, atualizar, remover } = useCollection("avisos");
  const [form, setForm] = useState(VAZIO);
  const [editandoId, setEditandoId] = useState(null);
  const [salvando, setSalvando] = useState(false);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSalvando(true);
    try {
      if (editandoId) {
        await atualizar(editandoId, form);
      } else {
        await adicionar(form);
      }
      setForm(VAZIO);
      setEditandoId(null);
    } finally {
      setSalvando(false);
    }
  }

  function handleEditar(aviso) {
    setForm({
      titulo: aviso.titulo ?? "",
      mensagem: aviso.mensagem ?? "",
      tipo: aviso.tipo ?? "aviso",
      ativo: aviso.ativo ?? true,
    });
    setEditandoId(aviso.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleCancelar() {
    setForm(VAZIO);
    setEditandoId(null);
  }

  async function handleRemover(id) {
    if (confirm("Tem certeza que deseja excluir este aviso?")) {
      await remover(id);
    }
  }

  async function handleToggleAtivo(aviso) {
    await atualizar(aviso.id, { ativo: !aviso.ativo });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4">
        <button onClick={() => navigate("/admin/dashboard")} className="text-gray-500 hover:text-gray-800 text-sm">
          ← Voltar
        </button>
        <h1 className="font-bold text-gray-900">Gerenciar Avisos</h1>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 flex flex-col gap-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-bold text-gray-900 mb-4">
            {editandoId ? "✏️ Editando aviso" : "➕ Novo aviso"}
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
                <input
                  name="titulo" value={form.titulo} onChange={handleChange} required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                  placeholder="Ex: Atenção — mudança de horário"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                <select
                  name="tipo" value={form.tipo} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                >
                  <option value="aviso">Aviso</option>
                  <option value="urgente">Urgente</option>
                  <option value="info">Informação</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mensagem *</label>
              <textarea
                name="mensagem" value={form.mensagem} onChange={handleChange} required rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                placeholder="Escreva a mensagem do aviso..."
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox" name="ativo" checked={form.ativo} onChange={handleChange}
                id="ativo" className="rounded"
              />
              <label htmlFor="ativo" className="text-sm text-gray-700">
                Publicar aviso (visível no site)
              </label>
            </div>

            <div className="flex gap-3">
              <button
                type="submit" disabled={salvando}
                className="bg-blue-900 text-white font-bold px-6 py-2 rounded-lg hover:bg-blue-800 transition disabled:opacity-50 text-sm"
              >
                {salvando ? "Salvando..." : editandoId ? "Salvar alterações" : "Criar aviso"}
              </button>
              {editandoId && (
                <button type="button" onClick={handleCancelar}
                  className="border border-gray-300 text-gray-700 font-medium px-6 py-2 rounded-lg hover:bg-gray-50 transition text-sm">
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        <div>
          <h2 className="font-bold text-gray-900 mb-4">Avisos cadastrados</h2>
          {loading ? (
            <p className="text-gray-500 text-sm">Carregando...</p>
          ) : avisos.length === 0 ? (
            <p className="text-gray-500 text-sm">Nenhum aviso cadastrado ainda.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {avisos.map((a) => (
                <div key={a.id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${TIPO_ESTILO[a.tipo] ?? TIPO_ESTILO.aviso}`}>
                        {a.tipo}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        a.ativo ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                      }`}>
                        {a.ativo ? "publicado" : "oculto"}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm">{a.titulo}</h3>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{a.mensagem}</p>
                  </div>
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <button onClick={() => handleToggleAtivo(a)}
                      className={`text-xs px-3 py-1 rounded-lg transition border ${
                        a.ativo
                          ? "border-yellow-300 text-yellow-700 hover:bg-yellow-50"
                          : "border-green-300 text-green-700 hover:bg-green-50"
                      }`}>
                      {a.ativo ? "Ocultar" : "Publicar"}
                    </button>
                    <button onClick={() => handleEditar(a)}
                      className="text-xs border border-gray-300 px-3 py-1 rounded-lg hover:bg-gray-50 transition">
                      Editar
                    </button>
                    <button onClick={() => handleRemover(a.id)}
                      className="text-xs border border-red-200 text-red-600 px-3 py-1 rounded-lg hover:bg-red-50 transition">
                      Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}