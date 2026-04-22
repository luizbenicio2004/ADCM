// src/pages/Reciclagem.jsx
import { useDoc } from "../hooks/useDoc";
import { useCollection } from "../hooks/useCollection";
import { Recycle } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import OptimizedImage from "../components/OptimizedImage";
import { useSEO } from "../hooks/useSEO";

const RECICLAGEM_FALLBACK = {
  descricao: "",
  materiais: [],
  versiculo: "",
  referenciaVersiculo: "",
};

export default function ReciclagemPage() {
  useSEO({
    title: "Projeto Reciclagem",
    description: "Conheça o Projeto Reciclagem da ADCM Poá e saiba como participar.",
  });

  const { data, loading } = useDoc("config", "reciclagem");
  const { dados: banners = [], loading: loadingBanners } = useCollection("reciclagem_banners");

  const conteudo = data ?? RECICLAGEM_FALLBACK;
  const { descricao, materiais = [], versiculo, referenciaVersiculo } = conteudo;

  const bannersOrdenados = [...banners].sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0));

  return (
    <>
      <Header />
      <main className="min-h-screen bg-green-50">

        {/* Hero */}
        <section className="bg-green-700 text-white py-20 px-6">
          <div className="max-w-[900px] mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Recycle size={36} />
              <h1 className="text-4xl md:text-5xl font-bold">Projeto Reciclagem</h1>
            </div>
            {descricao && (
              <p className="text-green-100 text-lg max-w-[600px] mx-auto leading-relaxed">{descricao}</p>
            )}
          </div>
        </section>

        {/* Versículo + Materiais */}
        {(versiculo || materiais.length > 0) && (
          <section className="py-16 px-6">
            <div className="max-w-[900px] mx-auto grid md:grid-cols-2 gap-8 items-start">
              {versiculo && (
                <div className="relative bg-green-700 text-white rounded-2xl p-8">
                  <span className="absolute -top-4 left-6 text-7xl text-white/10 font-serif leading-none">"</span>
                  <p className="font-serif italic text-lg leading-relaxed">{versiculo}</p>
                  {referenciaVersiculo && (
                    <span className="block mt-3 text-sm font-bold text-green-200">{referenciaVersiculo}</span>
                  )}
                </div>
              )}
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
          </section>
        )}

        {/* Banners */}
        <section className="py-8 px-6 pb-20">
          <div className="max-w-[900px] mx-auto">
            {loadingBanners ? (
              <div className="grid sm:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="rounded-xl border border-green-200 overflow-hidden animate-pulse">
                    <div className="aspect-[3/4] bg-gray-200" />
                    <div className="p-4 flex flex-col gap-2">
                      <div className="h-4 bg-gray-200 rounded w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : bannersOrdenados.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-6">
                {bannersOrdenados.map((banner) => (
                  <div
                    key={banner.id}
                    className="group bg-white rounded-xl border border-green-200 overflow-hidden shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-500"
                  >
                    {banner.imagemUrl ? (
                      <div className="aspect-[3/4] overflow-hidden">
                        <OptimizedImage
                          src={banner.imagemUrl}
                          alt={banner.titulo || "Banner"}
                          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    ) : (
                      <div className="h-44 bg-gradient-to-br from-green-700 to-green-500 flex items-center justify-center">
                        <Recycle size={40} className="text-white/40" />
                      </div>
                    )}
                    {(banner.titulo || banner.descricao) && (
                      <div className="p-4">
                        {banner.titulo && (
                          <h3 className="font-bold text-gray-900 text-base mb-1">{banner.titulo}</h3>
                        )}
                        {banner.descricao && (
                          <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">{banner.descricao}</p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </section>

      </main>

      <div className="bg-green-50 pb-8 px-6 text-center">
        <Link
          to="/#reciclagem"
          className="inline-flex items-center gap-2 text-green-700 font-semibold hover:underline"
        >
          ← Voltar ao início
        </Link>
      </div>

      <Footer />
    </>
  );
}
