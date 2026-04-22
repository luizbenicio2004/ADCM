import { useState, useEffect } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../services/firebase";
import { useConfig } from "../../context/ConfigContext";
import AdminLayout from "../../components/admin/AdminLayout";
import { Save } from "lucide-react";

const FORM_VAZIO = {
  titulo: "Igreja ADCM Poá",
  subtitulo: "Um lugar de fé, amor e esperança para você e sua família. Venha fazer parte desta comunidade.",
  badge: "Bem-vindo à nossa família",
};

function Campo({ label, name, value, onChange, placeholder, dica }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{label}</label>
      <input
        type="text" name={name} value={value} onChange={onChange} placeholder={placeholder}
        className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/30"
      />
      {dica && <p className="text-xs text-gray-400">{dica}</p>}
    </div>
  );
}

function HeroPreview({ form }) {
  return (
    <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-blue-900 relative min-h-[220px] flex items-center justify-center p-6">
      <div
        className="absolute inset-0 opacity-20"
        style={{ background: "radial-gradient(ellipse at top, #3b82f6 0%, #1e3a8a 60%, #0d1b4b 100%)" }}
      />
      <div className="relative z-10 text-center max-w-lg mx-auto flex flex-col items-center gap-3">
        {form.badge && (
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-yellow-400/20 text-yellow-300 border border-yellow-400/30">
            {form.badge}
          </span>
        )}
        <h1 className="text-white font-bold text-2xl leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
          {form.titulo || "Título da capa"}
        </h1>
        {form.subtitulo && (
          <p className="text-white/80 text-sm leading-relaxed">{form.subtitulo}</p>
        )}
      </div>
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
    if (!form.titulo) { setErro("O título não pode ficar em branco."); return; }
    setErro("");
    setSalvando(true);
    try {
      await setDoc(doc(db, "config", "site"), { hero: form }, { merge: true });
      setSucesso(true);
      setTimeout(() => setSucesso(false), 3000);
    } catch { setErro("Não foi possível salvar. Tente novamente."); }
    finally { setSalvando(false); }
  };

  return (
    <AdminLayout
      title="Capa do Site"
      subtitle="Edite o que aparece na primeira tela quando alguém abre o site"
    >
      <div className="flex flex-col gap-6 max-w-4xl">
        {loading ? (
          <div className="flex flex-col gap-4">
            {Array(6).fill(0).map((_, i) => <div key={i} className="h-10 bg-gray-200 rounded-lg animate-pulse" />)}
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-6 items-start">
            {/* Formulário */}
            <form onSubmit={handleSave} className="flex flex-col gap-6">
              {erro && <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{erro}</div>}
              {sucesso && <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3">✅ Salvo com sucesso!</div>}

              <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-4">
                <h2 className="font-semibold text-gray-800">✏️ Textos da capa</h2>
                <p className="text-xs text-gray-400 -mt-2">Esses textos aparecem no centro da tela inicial do site.</p>

                <Campo
                  label="Frase de destaque (pequena, acima do título)"
                  name="badge" value={form.badge} onChange={handleChange}
                  placeholder="Ex: Você é esperado aqui"
                />
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Título principal *</label>
                  <input type="text" name="titulo" value={form.titulo} onChange={handleChange}
                    placeholder="Ex: Igreja ADCM Poá"
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/30" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Texto abaixo do título</label>
                  <textarea name="subtitulo" rows={3} value={form.subtitulo} onChange={handleChange}
                    placeholder="Frase de boas-vindas exibida abaixo do título…"
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-900/30" />
                </div>
              </div>

              <button type="submit" disabled={salvando}
                className="flex items-center gap-2 bg-blue-900 text-white text-sm font-semibold px-6 py-2.5 rounded-lg hover:bg-blue-800 transition disabled:opacity-60 self-start">
                <Save size={16} /> {salvando ? "Salvando…" : "Salvar alterações"}
              </button>
            </form>

            {/* Preview ao vivo */}
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Preview ao vivo</p>
              <HeroPreview form={form} />
              <p className="text-xs text-gray-400">O preview reflete as alterações em tempo real antes de salvar.</p>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
