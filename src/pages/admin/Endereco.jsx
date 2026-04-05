import { useState, useEffect } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../services/firebase";
import { useConfig } from "../../context/ConfigContext";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, MapPin } from "lucide-react";

const FORM_VAZIO = { rua: "", bairro: "", cep: "", cidade: "", estado: "SP", mapsUrl: "", embedUrl: "" };

function Field({ label, name, value, onChange, placeholder }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{label}</label>
      <input type="text" name={name} value={value} onChange={onChange} placeholder={placeholder}
        className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/30" />
    </div>
  );
}

export default function AdminEndereco() {
  const navigate = useNavigate();
  const { config, loading } = useConfig();
  const [form, setForm] = useState(FORM_VAZIO);
  const [salvando, setSalvando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (config?.endereco) setForm({ ...FORM_VAZIO, ...config.endereco });
  }, [config]);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.rua || !form.cidade) { setErro("Rua e cidade são obrigatórios."); return; }
    setErro("");
    setSalvando(true);
    try {
      await setDoc(doc(db, "config", "site"), { endereco: form }, { merge: true });
      setSucesso(true);
      setTimeout(() => setSucesso(false), 3000);
    } catch { setErro("Erro ao salvar. Tente novamente."); }
    finally { setSalvando(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4">
        <button onClick={() => navigate("/admin/dashboard")} className="text-gray-500 hover:text-gray-900 transition">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="font-bold text-gray-900">Endereço da Igreja</h1>
          <p className="text-xs text-gray-500">Edite o endereço exibido no site</p>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-10">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-9 h-9 flex items-center justify-center bg-blue-900/10 rounded-lg text-blue-900">
              <MapPin size={18} />
            </div>
            <h2 className="font-semibold text-gray-800">Dados do endereço</h2>
          </div>

          {loading ? (
            <div className="flex flex-col gap-4">
              {Array(6).fill(0).map((_, i) => <div key={i} className="h-10 bg-gray-100 rounded-lg animate-pulse" />)}
            </div>
          ) : (
            <form onSubmit={handleSave} className="flex flex-col gap-4">
              {erro && <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{erro}</div>}
              {sucesso && <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3">✅ Salvo com sucesso!</div>}

              <Field label="Rua / Logradouro *" name="rua" value={form.rua} onChange={handleChange} placeholder="Ex: R. Mal. Deodoro, 100" />
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Bairro" name="bairro" value={form.bairro} onChange={handleChange} placeholder="Ex: Centro" />
                <Field label="CEP" name="cep" value={form.cep} onChange={handleChange} placeholder="Ex: 08565-520" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Cidade *" name="cidade" value={form.cidade} onChange={handleChange} placeholder="Ex: Poá" />
                <Field label="Estado" name="estado" value={form.estado} onChange={handleChange} placeholder="Ex: SP" />
              </div>
              <hr className="my-1 border-gray-100" />
              <p className="text-xs text-gray-500">Links do Google Maps</p>
              <Field label="URL para o botão 'Abrir no Maps'" name="mapsUrl" value={form.mapsUrl} onChange={handleChange} placeholder="https://www.google.com/maps?q=..." />
              <Field label="URL para o mapa embutido (embed)" name="embedUrl" value={form.embedUrl} onChange={handleChange} placeholder="https://www.google.com/maps?q=...&output=embed" />

              <div className="mt-2">
                <button type="submit" disabled={salvando}
                  className="flex items-center gap-2 bg-blue-900 text-white text-sm font-semibold px-6 py-2.5 rounded-lg hover:bg-blue-800 transition disabled:opacity-60">
                  <Save size={16} /> {salvando ? "Salvando…" : "Salvar endereço"}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}