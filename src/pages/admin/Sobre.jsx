import { useState, useEffect, useRef } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../services/firebase";
import { useConfig } from "../../context/ConfigContext";
import { useStorage } from "../../hooks/useStorage";
import AdminLayout from "../../components/admin/AdminLayout";
import { Save, Plus, Trash2, ImagePlus, Loader2, X } from "lucide-react";
import OptimizedImage from "../../components/OptimizedImage";

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

function Cartao({ titulo, children }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-4">
      <h2 className="font-semibold text-gray-800">{titulo}</h2>
      {children}
    </div>
  );
}

export default function AdminSobre() {
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
    setForm((prev) => { const n = [...prev.numeros]; n[i] = { ...n[i], [field]: value }; return { ...prev, numeros: n }; });
  const addNumero = () => setForm((prev) => ({ ...prev, numeros: [...prev.numeros, { valor: "", label: "" }] }));
  const removeNumero = (i) => setForm((prev) => ({ ...prev, numeros: prev.numeros.filter((_, idx) => idx !== i) }));

  // Pastores
  const addPastor = () => setForm((prev) => ({ ...prev, pastores: [...(prev.pastores ?? []), { nome: "", cargo: "", fotoUrl: "" }] }));
  const removePastor = async (i) => {
    const pastor = form.pastores[i];
    if (pastor.fotoUrl) { try { await removeFile(pastor.fotoUrl); } catch {} }
    setForm((prev) => ({ ...prev, pastores: prev.pastores.filter((_, idx) => idx !== i) }));
  };
  const handlePastor = (i, field, value) =>
    setForm((prev) => { const p = [...prev.pastores]; p[i] = { ...p[i], [field]: value }; return { ...prev, pastores: p }; });
  const handleFotoPastor = async (e, i) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await upload(file, `sobre/pastores/${Date.now()}_${file.name}`);
      handlePastor(i, "fotoUrl", url);
    } catch { setErro("Não foi possível enviar a foto do pastor."); }
  };

  // Fotos históricas
  const handleFotosHistoricas = async (e) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    try {
      const urls = await Promise.all(files.map((f) => upload(f, `sobre/historicas/${Date.now()}_${f.name}`)));
      setForm((prev) => ({ ...prev, fotosHistoricas: [...(prev.fotosHistoricas ?? []), ...urls] }));
    } catch { setErro("Não foi possível enviar as fotos."); }
  };
  const removeFotoHistorica = async (url) => {
    try {
      await removeFile(url);
      setForm((prev) => ({ ...prev, fotosHistoricas: prev.fotosHistoricas.filter((u) => u !== url) }));
    } catch { setErro("Não foi possível remover a foto."); }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.historia) { setErro("O texto da história não pode ficar em branco."); return; }
    setErro(""); setSalvando(true);
    try {
      await setDoc(doc(db, "config", "site"), { sobre: form }, { merge: true });
      setSucesso(true);
      setTimeout(() => setSucesso(false), 3000);
    } catch { setErro("Não foi possível salvar. Tente novamente."); }
    finally { setSalvando(false); }
  };

  return (
    <AdminLayout
      title="Sobre a Igreja"
      subtitle="Edite a história, missão, pastores e fotos que aparecem na página Sobre"
    >
      <div className="max-w-2xl">
        {loading ? (
          <div className="flex flex-col gap-4">{Array(4).fill(0).map((_, i) => <div key={i} className="h-10 bg-gray-200 rounded-lg animate-pulse" />)}</div>
        ) : (
          <form onSubmit={handleSave} className="flex flex-col gap-6">
            {erro && <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{erro}</div>}
            {sucesso && <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3">✅ Salvo com sucesso!</div>}

            {/* História */}
            <Cartao titulo="📖 História da Igreja">
              <p className="text-xs text-gray-400 -mt-2">Aparece na seção "Sobre" do site. Use uma linha em branco para separar parágrafos.</p>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Texto da história *</label>
                <textarea name="historia" rows={6} value={form.historia ?? ""} onChange={handleChange}
                  placeholder="Conte a história da igreja, quando foi fundada, quem foram os pioneiros…"
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-900/30" />
              </div>
            </Cartao>

            {/* Versículo */}
            <Cartao titulo="📜 Versículo em Destaque">
              <p className="text-xs text-gray-400 -mt-2">Aparece em destaque na página Sobre.</p>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Texto do versículo</label>
                <textarea name="versiculo" rows={3} value={form.versiculo ?? ""} onChange={handleChange}
                  placeholder="Ex: Porque Deus amou o mundo de tal maneira…"
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-900/30" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Referência bíblica</label>
                <input type="text" name="referenciaVersiculo" value={form.referenciaVersiculo ?? ""} onChange={handleChange}
                  placeholder="Ex: João 3:16"
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/30" />
              </div>
            </Cartao>

            {/* Missão e Visão */}
            <Cartao titulo="🎯 Missão e Visão">
              <p className="text-xs text-gray-400 -mt-2">Frases curtas que resumem o propósito e o objetivo da igreja.</p>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Nossa Missão</label>
                <input type="text" name="missao" value={form.missao ?? ""} onChange={handleChange}
                  placeholder="Ex: Proclamar o evangelho e fazer discípulos"
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/30" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Nossa Visão</label>
                <input type="text" name="visao" value={form.visao ?? ""} onChange={handleChange}
                  placeholder="Ex: Ser uma igreja que transforma a cidade"
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/30" />
              </div>
            </Cartao>

            {/* Números */}
            <Cartao titulo="📊 Números da Igreja">
              <p className="text-xs text-gray-400 -mt-2">Aparecem como destaques visuais na página Sobre. Ex: "200+ Famílias".</p>
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
                <button type="button" onClick={addNumero} className="flex items-center gap-2 text-sm text-blue-900 hover:underline w-fit">
                  <Plus size={15} /> Adicionar número
                </button>
              </div>
            </Cartao>

            {/* Pastores */}
            <Cartao titulo="👨‍💼 Pastores e Líderes">
              <p className="text-xs text-gray-400 -mt-2">Aparecem na seção de liderança da página Sobre.</p>
              <div className="flex flex-col gap-5">
                {(form.pastores ?? []).map((pastor, i) => (
                  <div key={i} className="flex gap-4 p-4 border border-gray-100 rounded-xl bg-gray-50">
                    <div className="flex flex-col items-center gap-2 flex-shrink-0">
                      {pastor.fotoUrl ? (
                        <div className="relative w-16 h-16 rounded-full overflow-hidden border border-gray-200">
                          <OptimizedImage src={pastor.fotoUrl} alt={pastor.nome} className="w-full h-full object-cover" />
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
                    <div className="flex flex-col gap-2 flex-1">
                      <input type="text" value={pastor.nome} onChange={(e) => handlePastor(i, "nome", e.target.value)}
                        placeholder="Nome completo"
                        className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/30" />
                      <input type="text" value={pastor.cargo} onChange={(e) => handlePastor(i, "cargo", e.target.value)}
                        placeholder="Cargo (ex: Pastor Titular, Diácono)"
                        className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/30" />
                    </div>
                    <button type="button" onClick={() => removePastor(i)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition self-start">
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
                <button type="button" onClick={addPastor} className="flex items-center gap-2 text-sm text-blue-900 hover:underline w-fit">
                  <Plus size={15} /> Adicionar pastor ou líder
                </button>
              </div>
            </Cartao>

            {/* Fotos históricas */}
            <Cartao titulo="📷 Fotos da Igreja">
              <p className="text-xs text-gray-400 -mt-2">Fotos históricas ou da comunidade que aparecem na galeria da página Sobre.</p>
              <div className="flex flex-col gap-3">
                {(form.fotosHistoricas ?? []).length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {form.fotosHistoricas.map((url) => (
                      <div key={url} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
                        <OptimizedImage src={url} alt="" className="w-full h-full object-cover" />
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
                  {uploading
                    ? <><Loader2 size={14} className="animate-spin" /> Enviando… {progress}%</>
                    : <><ImagePlus size={14} /> Adicionar fotos</>}
                </button>
                <input ref={fotoHistoricaRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFotosHistoricas} />
              </div>
            </Cartao>

            <button type="submit" disabled={salvando}
              className="flex items-center gap-2 bg-blue-900 text-white text-sm font-semibold px-6 py-2.5 rounded-lg hover:bg-blue-800 transition disabled:opacity-60 self-start">
              <Save size={16} /> {salvando ? "Salvando…" : "Salvar tudo"}
            </button>
          </form>
        )}
      </div>
    </AdminLayout>
  );
}