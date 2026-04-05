import { useState, useEffect, useRef } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../services/firebase";
import { useConfig } from "../../context/ConfigContext";
import { useStorage } from "../../hooks/useStorage";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Plus, Trash2, BookOpen, ImagePlus, Loader2, X } from "lucide-react";

const FORM_VAZIO = {
  historia: "", versiculo: "", referenciaVersiculo: "", missao: "", visao: "",
  numeros: [
    { valor: "10+", label: "Anos de História" },
    { valor: "200+", label: "Famílias" },
    { valor: "4", label: "Ministérios" },
    { valor: "3", label: "Cultos por Semana" },
  ],
  pastores: [],
  fotosHistoricas: [],
};

function Card({ title, icon, children }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-4">
      <div className="flex items-center gap-2">
        {icon && <div className="w-8 h-8 flex items-center justify-center bg-blue-900/10 rounded-lg text-blue-900">{icon}</div>}
        <h2 className="font-semibold text-gray-800 text-sm">{title}</h2>
      </div>
      {children}
    </div>
  );
}

export default function AdminSobre() {
  const navigate = useNavigate();
  const { config, loading } = useConfig();
  const { upload, remove: removeFile, progress, uploading } = useStorage();

  const [form, setForm] = useState(FORM_VAZIO);
  const [salvando, setSalvando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState("");

  const fotoHistoricaRef = useRef();
  const pastorFotoRefs = useRef({});

  useEffect(() => {
    if (config?.sobre) setForm({ ...FORM_VAZIO, ...config.sobre });
  }, [config]);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // Números
  const handleNumero = (i, field, value) =>
    setForm((prev) => {
      const numeros = [...prev.numeros];
      numeros[i] = { ...numeros[i], [field]: value };
      return { ...prev, numeros };
    });
  const addNumero = () => setForm((prev) => ({ ...prev, numeros: [...prev.numeros, { valor: "", label: "" }] }));
  const removeNumero = (i) => setForm((prev) => ({ ...prev, numeros: prev.numeros.filter((_, idx) => idx !== i) }));

  // Pastores
  const addPastor = () =>
    setForm((prev) => ({ ...prev, pastores: [...(prev.pastores ?? []), { nome: "", cargo: "", fotoUrl: "" }] }));
  const removePastor = async (i) => {
    const pastor = form.pastores[i];
    if (pastor.fotoUrl) {
      try { await removeFile(pastor.fotoUrl); } catch {}
    }
    setForm((prev) => ({ ...prev, pastores: prev.pastores.filter((_, idx) => idx !== i) }));
  };
  const handlePastor = (i, field, value) =>
    setForm((prev) => {
      const pastores = [...prev.pastores];
      pastores[i] = { ...pastores[i], [field]: value };
      return { ...prev, pastores };
    });
  const handleFotoPastor = async (e, i) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await upload(file, `sobre/pastores/${Date.now()}_${file.name}`);
      handlePastor(i, "fotoUrl", url);
    } catch { setErro("Erro ao enviar foto do pastor."); }
  };

  // Fotos históricas
  const handleFotosHistoricas = async (e) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    try {
      const urls = await Promise.all(files.map((f) => upload(f, `sobre/historicas/${Date.now()}_${f.name}`)));
      setForm((prev) => ({ ...prev, fotosHistoricas: [...(prev.fotosHistoricas ?? []), ...urls] }));
    } catch { setErro("Erro ao enviar fotos."); }
  };
  const removeFotoHistorica = async (url) => {
    try {
      await removeFile(url);
      setForm((prev) => ({ ...prev, fotosHistoricas: prev.fotosHistoricas.filter((u) => u !== url) }));
    } catch { setErro("Erro ao remover foto."); }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.historia) { setErro("O texto da história é obrigatório."); return; }
    setErro("");
    setSalvando(true);
    try {
      await setDoc(doc(db, "config", "site"), { sobre: form }, { merge: true });
      setSucesso(true);
      setTimeout(() => setSucesso(false), 3000);
    } catch { setErro("Erro ao salvar. Tente novamente."); }
    finally { setSalvando(false); }
  };

  const inp = (name, placeholder) => (
    <input type="text" name={name} value={form[name] ?? ""} onChange={handleChange} placeholder={placeholder}
      className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/30" />
  );
  const ta = (name, rows, placeholder) => (
    <textarea name={name} rows={rows} value={form[name] ?? ""} onChange={handleChange} placeholder={placeholder}
      className="border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-900/30" />
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4">
        <button onClick={() => navigate("/admin/dashboard")} className="text-gray-500 hover:text-gray-900 transition">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="font-bold text-gray-900">Seção Sobre</h1>
          <p className="text-xs text-gray-500">História, missão, visão, pastores e galeria</p>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-10">
        {loading ? (
          <div className="flex flex-col gap-4">{Array(4).fill(0).map((_, i) => <div key={i} className="h-10 bg-gray-200 rounded-lg animate-pulse" />)}</div>
        ) : (
          <form onSubmit={handleSave} className="flex flex-col gap-6">
            {erro && <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{erro}</div>}
            {sucesso && <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3">✅ Salvo com sucesso!</div>}

            {/* História */}
            <Card title="História da Igreja" icon={<BookOpen size={18} />}>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Texto *</label>
                {ta("historia", 6, "Conte a história da igreja…")}
                <p className="text-xs text-gray-400">Use linha em branco para separar parágrafos.</p>
              </div>
            </Card>

            {/* Versículo */}
            <Card title="Versículo em Destaque">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Versículo</label>
                {ta("versiculo", 3, "Ex: Porque Deus amou o mundo…")}
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Referência</label>
                {inp("referenciaVersiculo", "Ex: João 3:16")}
              </div>
            </Card>

            {/* Missão e Visão */}
            <Card title="Missão e Visão">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Nossa Missão</label>
                {inp("missao", "Ex: Proclamar o evangelho…")}
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Nossa Visão</label>
                {inp("visao", "Ex: Ser uma igreja relevante…")}
              </div>
            </Card>

            {/* Números */}
            <Card title="Números / Estatísticas">
              <div className="flex flex-col gap-3">
                {form.numeros.map((num, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <input type="text" value={num.valor} onChange={(e) => handleNumero(i, "valor", e.target.value)}
                      placeholder="Ex: 200+" className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-24 focus:outline-none focus:ring-2 focus:ring-blue-900/30" />
                    <input type="text" value={num.label} onChange={(e) => handleNumero(i, "label", e.target.value)}
                      placeholder="Ex: Famílias" className="border border-gray-200 rounded-lg px-3 py-2 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-blue-900/30" />
                    <button type="button" onClick={() => removeNumero(i)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
                <button type="button" onClick={addNumero} className="flex items-center gap-2 text-sm text-blue-900 hover:underline">
                  <Plus size={15} /> Adicionar número
                </button>
              </div>
            </Card>

            {/* Pastores */}
            <Card title="👨‍💼 Pastores">
              <div className="flex flex-col gap-5">
                {(form.pastores ?? []).map((pastor, i) => (
                  <div key={i} className="flex gap-4 p-4 border border-gray-100 rounded-xl bg-gray-50">
                    {/* Foto */}
                    <div className="flex flex-col items-center gap-2 flex-shrink-0">
                      {pastor.fotoUrl ? (
                        <div className="relative w-16 h-16 rounded-full overflow-hidden border border-gray-200">
                          <img src={pastor.fotoUrl} alt={pastor.nome} className="w-full h-full object-cover" />
                          <button type="button" onClick={() => handlePastor(i, "fotoUrl", "")}
                            className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition">
                            <X size={14} className="text-white" />
                          </button>
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-2xl">👤</div>
                      )}
                      <button type="button"
                        onClick={() => {
                          if (!pastorFotoRefs.current[i]) pastorFotoRefs.current[i] = document.createElement("input");
                          const inp = pastorFotoRefs.current[i];
                          inp.type = "file"; inp.accept = "image/*";
                          inp.onchange = (e) => handleFotoPastor(e, i);
                          inp.click();
                        }}
                        disabled={uploading}
                        className="text-xs text-blue-900 hover:underline flex items-center gap-1 disabled:opacity-60">
                        {uploading ? <Loader2 size={11} className="animate-spin" /> : <ImagePlus size={11} />}
                        foto
                      </button>
                    </div>

                    {/* Dados */}
                    <div className="flex flex-col gap-2 flex-1">
                      <input type="text" value={pastor.nome} onChange={(e) => handlePastor(i, "nome", e.target.value)}
                        placeholder="Nome completo" className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/30" />
                      <input type="text" value={pastor.cargo} onChange={(e) => handlePastor(i, "cargo", e.target.value)}
                        placeholder="Cargo (ex: Pastor Titular)" className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/30" />
                    </div>

                    <button type="button" onClick={() => removePastor(i)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition self-start">
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
                <button type="button" onClick={addPastor}
                  className="flex items-center gap-2 text-sm text-blue-900 hover:underline">
                  <Plus size={15} /> Adicionar pastor
                </button>
              </div>
            </Card>

            {/* Fotos históricas */}
            <Card title="📷 Fotos Históricas da Igreja">
              <div className="flex flex-col gap-3">
                {(form.fotosHistoricas ?? []).length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {form.fotosHistoricas.map((url) => (
                      <div key={url} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
                        <img src={url} alt="" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => removeFotoHistorica(url)}
                          className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 hover:bg-black transition">
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <button type="button" onClick={() => fotoHistoricaRef.current?.click()} disabled={uploading}
                  className="flex items-center gap-2 text-sm text-gray-600 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition w-fit disabled:opacity-60">
                  {uploading ? <><Loader2 size={14} className="animate-spin" /> Enviando… {progress}%</> : <><ImagePlus size={14} /> Adicionar fotos</>}
                </button>
                <input ref={fotoHistoricaRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFotosHistoricas} />
              </div>
            </Card>

            <button type="submit" disabled={salvando}
              className="flex items-center gap-2 bg-blue-900 text-white text-sm font-semibold px-6 py-2.5 rounded-lg hover:bg-blue-800 transition disabled:opacity-60 self-start">
              <Save size={16} /> {salvando ? "Salvando…" : "Salvar tudo"}
            </button>
          </form>
        )}
      </main>
    </div>
  );
}