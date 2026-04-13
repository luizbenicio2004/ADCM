import { useState, useEffect } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../services/firebase";
import { useConfig } from "../../context/ConfigContext";
import AdminLayout from "../../components/admin/AdminLayout";
import { Save, Layout } from "lucide-react";

const FORM_VAZIO = {
  titulo: "Igreja ADCM Poá",
  subtitulo: "Um lugar de fé, amor e esperança para você e sua família. Venha fazer parte desta comunidade.",
  botaoPrimario: "Ver Cultos",
  botaoPrimarioLink: "#cultos",
  botaoSecundario: "Como Chegar →",
  botaoSecundarioLink: "#localizacao",
  badge: "Bem-vindo à nossa família",
  imagemFundo: "" };

function Field({ label, name, value, onChange, placeholder, hint }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{label}</label>
      <input type="text" name={name} value={value} onChange={onChange} placeholder={placeholder}
        className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/30" />
      {hint && <p className="text-xs text-gray-400">{hint}</p>}
    </div>
  );
}

export default function AdminHero() {
  const { config, loading } = useConfig();
  const [form, setForm] = useState(FORM_VAZIO);
  const [salvando, setSalvando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (config?.hero) setForm({ ...FORM_VAZIO, ...config.hero });
  }, [config]);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.titulo) { setErro("O título é obrigatório."); return; }
    setErro("");
    setSalvando(true);
    try {
      await setDoc(doc(db, "config", "site"), { hero: form }, { merge: true });
      setSucesso(true);
      setTimeout(() => setSucesso(false), 3000);
    } catch { setErro("Erro ao salvar. Tente novamente."); }
    finally { setSalvando(false); }
  };

  return (
    <AdminLayout title="Banner Principal (Hero)" subtitle="Título, subtítulo e botões da tela inicial">
      <div className="max-w-2xl flex flex-col gap-6">
        {loading ? (
          <div className="flex flex-col gap-4">{Array(6).fill(0).map((_, i) => <div key={i} className="h-10 bg-gray-200 rounded-lg animate-pulse" />)}</div>
        ) : (
          <form onSubmit={handleSave} className="flex flex-col gap-6">
            {erro && <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{erro}</div>}
            {sucesso && <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3">✅ Salvo com sucesso!</div>}

            <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 flex items-center justify-center bg-blue-900/10 rounded-lg text-blue-900">
                  <Layout size={18} />
                </div>
                <h2 className="font-semibold text-gray-800">Textos principais</h2>
              </div>

              <Field label="Badge (texto pequeno acima do título)"
                name="badge" value={form.badge} onChange={handleChange}
                placeholder="Ex: Bem-vindo à nossa família" />

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Título *</label>
                <input type="text" name="titulo" value={form.titulo} onChange={handleChange}
                  placeholder="Ex: Igreja ADCM Poá"
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/30" />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Subtítulo</label>
                <textarea name="subtitulo" rows={3} value={form.subtitulo} onChange={handleChange}
                  placeholder="Frase de boas-vindas exibida abaixo do título…"
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-900/30" />
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-4">
              <h2 className="font-semibold text-gray-800">🖼️ Imagem de fundo (opcional)</h2>
              <Field label="URL da imagem de fundo"
                name="imagemFundo" value={form.imagemFundo ?? ""} onChange={handleChange}
                placeholder="https://... (deixe vazio para usar o gradiente padrão)"
                hint="Use uma imagem de alta resolução. O gradiente azul será aplicado por cima." />
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-4">
              <h2 className="font-semibold text-gray-800">🔴 Botão primário (vermelho)</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Texto" name="botaoPrimario" value={form.botaoPrimario} onChange={handleChange} placeholder="Ex: Ver Cultos" />
                <Field label="Link (âncora ou URL)" name="botaoPrimarioLink" value={form.botaoPrimarioLink} onChange={handleChange}
                  placeholder="Ex: #cultos" hint="Use #secao para âncoras da página" />
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-4">
              <h2 className="font-semibold text-gray-800">⬜ Botão secundário (transparente)</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Texto" name="botaoSecundario" value={form.botaoSecundario} onChange={handleChange} placeholder="Ex: Como Chegar →" />
                <Field label="Link (âncora ou URL)" name="botaoSecundarioLink" value={form.botaoSecundarioLink} onChange={handleChange}
                  placeholder="Ex: #localizacao" hint="Use #secao para âncoras da página" />
              </div>
            </div>

            <button type="submit" disabled={salvando}
              className="flex items-center gap-2 bg-blue-900 text-white text-sm font-semibold px-6 py-2.5 rounded-lg hover:bg-blue-800 transition disabled:opacity-60 self-start">
              <Save size={16} /> {salvando ? "Salvando…" : "Salvar hero"}
            </button>
          </form>
        )}
      </div>
    </AdminLayout>
  );
}
