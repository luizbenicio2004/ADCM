// src/components/Reciclagem/Reciclagem.jsx
import { useDoc } from "../../hooks/useDoc";
import { useNavigate } from "react-router-dom";
import { Recycle } from "lucide-react";

const RECICLAGEM_FALLBACK = {
  descricao: "Contribua com o meio ambiente e com o crescimento da nossa igreja. Trazendo materiais recicláveis, você ajuda a custear o terreno para nossa nova sede.",
  materiais: ["Papel e papelão", "Plástico", "Metal e latas", "Vidro", "Eletrônicos"],
  metaReais: 0,
  arrecadadoReais: 0,
  versiculo: "A terra é do Senhor e tudo o que nela existe.",
  referenciaVersiculo: "Salmos 24:1",
};

export default function Reciclagem() {
  const { data, loading } = useDoc("config", "reciclagem");
  const navigate = useNavigate();

  if (loading) return (
    <section className="py-20 px-6 bg-green-50">
      <div className="max-w-[1000px] mx-auto animate-pulse">
        <div className="h-8 bg-green-200 rounded w-64 mx-auto mb-4" />
        <div className="h-4 bg-green-100 rounded w-96 mx-auto mb-12" />
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-green-200 rounded-2xl h-48" />
          <div className="flex flex-col gap-4">
            <div className="bg-gray-200 rounded-xl h-32" />
          </div>
        </div>
      </div>
    </section>
  );

  const conteudo = data ?? RECICLAGEM_FALLBACK;
  const { descricao, materiais = [], versiculo, referenciaVersiculo } = conteudo;

  return (
    <section
      id="reciclagem"
      className="py-20 px-6 bg-green-50 cursor-pointer group"
      onClick={() => navigate("/reciclagem")}
      title="Ver mais informações sobre o Projeto Reciclagem"
    >
      <div className="max-w-[1000px] mx-auto">
        <div className="text-center max-w-[600px] mx-auto mb-12">
          <div className="w-12 h-[2px] bg-green-700 mx-auto mb-4" />
          <div className="flex items-center justify-center gap-2 mb-3">
            <Recycle size={28} className="text-green-700" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Projeto Reciclagem</h2>
          </div>
          {descricao && <p className="text-gray-600">{descricao}</p>}
          <p className="mt-4 text-sm text-green-700 font-semibold group-hover:underline">
            Saiba mais →
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {versiculo && (
            <div className="relative bg-green-700 text-white rounded-2xl p-8">
              <span className="absolute -top-4 left-6 text-7xl text-white/10 font-serif leading-none">"</span>
              <p className="font-serif italic text-lg leading-relaxed">{versiculo}</p>
              {referenciaVersiculo && (
                <span className="block mt-3 text-sm font-bold text-green-200">{referenciaVersiculo}</span>
              )}
            </div>
          )}

          <div className="flex flex-col gap-6">
            {materiais.length > 0 && (
              <div className="bg-white rounded-xl border border-green-200 p-6">
                <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide mb-3">
                  ♻️ Materiais aceitos
                </h3>
                <ul className="flex flex-col gap-2">
                  {materiais.map((m, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                      {m}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}