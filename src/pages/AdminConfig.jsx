// src/pages/AdminConfig.jsx
import { useState, useEffect } from "react";
import { useDoc } from "../hooks/useDoc";
import { Save, Settings } from "lucide-react";
import AdminLayout from "../components/admin/AdminLayout";

// ✅ Field FORA do componente pai — evita perda de foco ao digitar
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

export default function AdminConfig() {
  const { data, loading, save } = useDoc("config", "site");

  const [form, setForm] = useState({
    nome: "", telefone: "", whatsapp: "", email: "",
    instagram: "", youtube: "", facebook: "",
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
      });
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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
    <AdminLayout title="Configurações do Site" subtitle="Nome da igreja, contatos e redes sociais">
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

            <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-4">
              <h2 className="font-semibold text-gray-800">🌐 Redes Sociais</h2>
              <Field label="Instagram (URL)" name="instagram" value={form.instagram} onChange={handleChange} placeholder="https://www.instagram.com/adcmpoa" />
              <Field label="YouTube (URL)" name="youtube" value={form.youtube} onChange={handleChange} placeholder="https://www.youtube.com/@adcmpoa" />
              <Field label="Facebook (URL)" name="facebook" value={form.facebook} onChange={handleChange} placeholder="https://www.facebook.com/adcmpoa" />
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
