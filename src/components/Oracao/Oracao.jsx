import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../services/firebase";
import { Heart, Send, CheckCircle } from "lucide-react";

const CATEGORIAS = ["Saúde", "Família", "Finanças", "Relacionamento", "Trabalho", "Outro"];

export default function Oracao() {
  const [form, setForm] = useState({ nome: "", categoria: "", pedido: "" });
  const [anonimo, setAnonimo] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.pedido.trim()) {
      setErro("Por favor, escreva seu pedido de oração.");
      return;
    }
    setErro("");
    setEnviando(true);
    try {
      await addDoc(collection(db, "pedidos_oracao"), {
        nome: anonimo ? "Anônimo" : (form.nome.trim() || "Anônimo"),
        categoria: form.categoria || "Outro",
        pedido: form.pedido.trim(),
        anonimo,
        criadoEm: serverTimestamp(),
        lido: false,
      });
      setEnviado(true);
      setForm({ nome: "", categoria: "", pedido: "" });
      setAnonimo(false);
    } catch {
      setErro("Não foi possível enviar. Tente novamente.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <section id="oracao" className="py-20 px-6 bg-gradient-to-br from-blue-950 to-blue-900 text-white">
      <div className="max-w-[700px] mx-auto">
        {/* Cabeçalho */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white/10 mb-4">
            <Heart size={26} className="text-yellow-400" />
          </div>
          <div className="w-12 h-[2px] bg-yellow-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-3" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            Pedido de Oração
          </h2>
          <p className="text-blue-200 text-sm leading-relaxed max-w-[480px] mx-auto">
            Compartilhe seu pedido conosco. Nossa equipe pastoral orará por você com cuidado e sigilo.
          </p>
        </div>

        {enviado ? (
          <div className="bg-white/10 border border-white/20 rounded-2xl p-10 text-center">
            <CheckCircle size={48} className="text-green-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Pedido enviado! 🙏</h3>
            <p className="text-blue-200 text-sm mb-6">
              Recebemos seu pedido e estaremos orando por você.
            </p>
            <button
              onClick={() => setEnviado(false)}
              className="text-sm bg-white/15 hover:bg-white/25 transition px-5 py-2 rounded-lg font-semibold"
            >
              Enviar outro pedido
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white/10 border border-white/20 rounded-2xl p-8 flex flex-col gap-5 backdrop-blur-sm">
            {erro && (
              <div className="text-sm bg-red-500/20 border border-red-400/40 text-red-200 rounded-lg px-4 py-3">
                {erro}
              </div>
            )}

            {/* Nome */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-widest text-blue-200">
                  Seu nome
                </label>
                <label className="flex items-center gap-1.5 text-xs text-blue-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={anonimo}
                    onChange={(e) => setAnonimo(e.target.checked)}
                    className="accent-yellow-400"
                  />
                  Enviar anônimo
                </label>
              </div>
              <input
                type="text"
                name="nome"
                value={form.nome}
                onChange={handleChange}
                disabled={anonimo}
                placeholder={anonimo ? "Anônimo" : "Ex: Maria Silva"}
                className="bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-sm text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 disabled:opacity-40 transition"
              />
            </div>

            {/* Categoria */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-widest text-blue-200">
                Categoria
              </label>
              <select
                name="categoria"
                value={form.categoria}
                onChange={handleChange}
                className="bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition appearance-none"
              >
                <option value="" className="text-gray-800">Selecione uma categoria…</option>
                {CATEGORIAS.map((c) => (
                  <option key={c} value={c} className="text-gray-800">{c}</option>
                ))}
              </select>
            </div>

            {/* Pedido */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-widest text-blue-200">
                Pedido de oração <span className="text-red-400">*</span>
              </label>
              <textarea
                name="pedido"
                value={form.pedido}
                onChange={handleChange}
                rows={5}
                placeholder="Escreva seu pedido aqui. Tudo que compartilhar conosco é tratado com respeito e sigilo."
                className="bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-sm text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 resize-none transition"
              />
            </div>

            <button
              type="submit"
              disabled={enviando}
              className="flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-blue-950 font-bold text-sm px-6 py-3 rounded-lg transition disabled:opacity-60 self-end"
            >
              <Send size={16} />
              {enviando ? "Enviando…" : "Enviar pedido"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
