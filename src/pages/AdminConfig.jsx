// src/pages/AdminConfig.jsx
import { useState, useEffect } from "react";
import { useDoc } from "../hooks/useDoc";
import { Save, Settings, Eye } from "lucide-react";
import AdminLayout from "../components/admin/AdminLayout";

// Campo de texto reutilizável
function Field({ label, name, value, onChange, placeholder, type = "text" }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/30"
      />
    </div>
  );
}

// Toggle de seção
function SectionToggle({ label, name, checked, onChange, descricao }) {
  return (
    <label className="flex items-center justify-between gap-4 py-3 border-b border-gray-100 last:border-0 cursor-pointer group">
      <div>
        <p className="text-sm font-medium text-gray-800 group-hover:text-blue-900 transition">{label}</p>
        {descricao && <p className="text-xs text-gray-400">{descricao}</p>}
      </div>
      <div className="relative shrink-0">
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
          className="sr-only peer"
        />
        <div className="w-10 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-900 transition-colors" />
        <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4" />
      </div>
    </label>
  );
}

const SECOES_PADRAO = {
  secaoLive:        true,
  secaoSobre:       true,
  secaoCultos:      true,
  secaoMinisterios: true,
  secaoEventos:     true,
  secaoReciclagem:  true,
  secaoAvisos:      true,
  secaoOracao:      true,
  secaoLocalizacao: true,
};

const SECOES_CONFIG = [
  { name: "secaoLive",        label: "Live / Transmissão",  descricao: "Exibe link de transmissão ao vivo" },
  { name: "secaoSobre",       label: "Sobre a Igreja",       descricao: "Seção de apresentação e história" },
  { name: "secaoCultos",      label: "Cultos",               descricao: "Grade de horários de culto" },
  { name: "secaoMinisterios", label: "Ministérios",          descricao: "Lista de ministérios ativos" },
  { name: "secaoEventos",     label: "Eventos",              descricao: "Próximos eventos da igreja" },
  { name: "secaoReciclagem",  label: "Reciclagem",           descricao: "Programa de reciclagem da ADCM" },
  { name: "secaoAvisos",      label: "Avisos",               descricao: "Avisos e comunicados" },
  { name: "secaoOracao",      label: "Pedido de Oração",     descricao: "Formulário de envio de pedidos" },
  { name: "secaoLocalizacao", label: "Localização",          descricao: "Endereço e mapa da igreja" },
];

export default function AdminConfig() {
  const { data, loading, save } = useDoc("config", "site");

  const [form, setForm] = useState({
    nome: "", telefone: "", whatsapp: "", email: "",
    instagram: "", youtube: "", facebook: "",
    ...SECOES_PADRAO,
  });

  const [salvando, setSalvando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (data) {
      setForm({
        nome:      data.nome      ?? "",
        telefone:  data.telefone  ?? "",
        whatsapp:  data.whatsapp  ?? "",
        email:     data.email     ?? "",
        instagram: data.instagram ?? "",
        youtube:   data.youtube   ?? "",
        facebook:  data.facebook  ?? "",
        ...Object.fromEntries(
          Object.entries(SECOES_PADRAO).map(([k, def]) => [k, data[k] ?? def])
        ),
      });
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setSalvando(true);
    try {
      await save(form);
      setSucesso(true);
      setTimeout(() => setSucesso(false), 3000);
    } catch {
      setErro("Erro ao salvar. Tente novamente.");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <AdminLayout title="Configurações do Site" subtitle="Nome da igreja, contatos, redes sociais e seções visíveis">
      <div className="max-w-2xl mx-auto">
        {loading ? (
          <div className="flex flex-col gap-4">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="h-10 bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {erro && <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{erro}</div>}
            {sucesso && <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3">✅ Salvo com sucesso!</div>}

            {/* Informações da Igreja */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 flex items-center justify-center bg-blue-900/10 rounded-lg text-blue-900">
                  <Settings size={18} />
                </div>
                <h2 className="font-semibold text-gray-800">Informações da Igreja</h2>
              </div>
              <Field label="Nome da Igreja" name="nome" value={form.nome} onChange={handleChange} placeholder="Ex: Igreja ADCM Poá" />
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Telefone" name="telefone" value={form.telefone} onChange={handleChange} placeholder="Ex: (11) 1234-5678" />
                <Field label="WhatsApp" name="whatsapp" value={form.whatsapp} onChange={handleChange} placeholder="Ex: 5511912345678" />
              </div>
              <Field label="E-mail" name="email" type="email" value={form.email} onChange={handleChange} placeholder="Ex: contato@adcmpoa.com" />
            </div>

            {/* Redes Sociais */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-4">
              <h2 className="font-semibold text-gray-800">🌐 Redes Sociais</h2>
              <Field label="Instagram (URL)" name="instagram" value={form.instagram} onChange={handleChange} placeholder="https://www.instagram.com/adcmpoa" />
              <Field label="YouTube (URL)" name="youtube" value={form.youtube} onChange={handleChange} placeholder="https://www.youtube.com/@adcmpoa" />
              <Field label="Facebook (URL)" name="facebook" value={form.facebook} onChange={handleChange} placeholder="https://www.facebook.com/adcmpoa" />
            </div>

            {/* Seções visíveis */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 flex items-center justify-center bg-blue-900/10 rounded-lg text-blue-900">
                  <Eye size={18} />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-800">Seções do Site</h2>
                  <p className="text-xs text-gray-400">Ative ou desative seções da página inicial</p>
                </div>
              </div>
              {SECOES_CONFIG.map(({ name, label, descricao }) => (
                <SectionToggle
                  key={name}
                  name={name}
                  label={label}
                  descricao={descricao}
                  checked={Boolean(form[name])}
                  onChange={handleChange}
                />
              ))}
            </div>

            <button type="submit" disabled={salvando}
              className="flex items-center gap-2 bg-blue-900 text-white text-sm font-semibold px-6 py-2.5 rounded-lg hover:bg-blue-800 transition disabled:opacity-60 self-start">
              <Save size={16} />
              {salvando ? "Salvando…" : "Salvar configurações"}
            </button>
          </form>
        )}
      </div>
    </AdminLayout>
  );
}
