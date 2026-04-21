import { useState, useEffect } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../services/firebase";
import { useConfig } from "../../context/ConfigContext";
import AdminLayout from "../../components/admin/AdminLayout";
import { Save } from "lucide-react";

const FORM_VAZIO = { rua: "", bairro: "", cep: "", cidade: "", estado: "SP", mapsUrl: "", embedUrl: "" };

function Campo({ label, name, value, onChange, placeholder, dica }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{label}</label>
      <input type="text" name={name} value={value} onChange={onChange} placeholder={placeholder}
        className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/30" />
      {dica && <p className="text-xs text-gray-400">{dica}</p>}
    </div>
  );
}

export default function AdminEndereco() {
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
    if (!form.rua || !form.cidade) { setErro("Preencha pelo menos a rua e a cidade."); return; }
    setErro("");
    setSalvando(true);
    try {
      await setDoc(doc(db, "config", "site"), { endereco: form }, { merge: true });
      setSucesso(true);
      setTimeout(() => setSucesso(false), 3000);
    } catch { setErro("Não foi possível salvar. Tente novamente."); }
    finally { setSalvando(false); }
  };

  return (
    <AdminLayout
      title="Endereço da Igreja"
      subtitle="Essas informações aparecem no mapa e no rodapé do site"
    >
      <div className="max-w-2xl">
        {loading ? (
          <div className="flex flex-col gap-4">
            {Array(6).fill(0).map((_, i) => <div key={i} className="h-10 bg-gray-100 rounded-lg animate-pulse" />)}
          </div>
        ) : (
          <form onSubmit={handleSave} className="flex flex-col gap-6">
            {erro && <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{erro}</div>}
            {sucesso && <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3">✅ Salvo com sucesso!</div>}

            <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-4">
              <h2 className="font-semibold text-gray-800">📍 Endereço</h2>
              <Campo label="Rua e número *" name="rua" value={form.rua} onChange={handleChange} placeholder="Ex: R. Mal. Deodoro, 100" />
              <div className="grid sm:grid-cols-2 gap-4">
                <Campo label="Bairro" name="bairro" value={form.bairro} onChange={handleChange} placeholder="Ex: Centro" />
                <Campo label="CEP" name="cep" value={form.cep} onChange={handleChange} placeholder="Ex: 08565-520" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Campo label="Cidade *" name="cidade" value={form.cidade} onChange={handleChange} placeholder="Ex: Poá" />
                <Campo label="Estado" name="estado" value={form.estado} onChange={handleChange} placeholder="Ex: SP" />
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-4">
              <h2 className="font-semibold text-gray-800">🗺️ Links do Google Maps</h2>
              <p className="text-xs text-gray-400 -mt-2">
                Abra o Google Maps, encontre a igreja, clique em "Compartilhar" e copie os links abaixo.
              </p>
              <Campo
                label='Link para o botão "Como chegar"'
                name="mapsUrl" value={form.mapsUrl} onChange={handleChange}
                placeholder="https://www.google.com/maps?q=..."
                dica='Esse link abre o Google Maps quando o visitante clica em "Como chegar".'
              />
              <Campo
                label="Link do mapa embutido na página"
                name="embedUrl" value={form.embedUrl} onChange={handleChange}
                placeholder="https://www.google.com/maps?q=...&output=embed"
                dica='No Google Maps, clique em "Compartilhar" → "Incorporar um mapa" e copie o link do src="...".'
              />
            </div>

            <button type="submit" disabled={salvando}
              className="flex items-center gap-2 bg-blue-900 text-white text-sm font-semibold px-6 py-2.5 rounded-lg hover:bg-blue-800 transition disabled:opacity-60 self-start">
              <Save size={16} /> {salvando ? "Salvando…" : "Salvar endereço"}
            </button>
          </form>
        )}
      </div>
    </AdminLayout>
  );
}