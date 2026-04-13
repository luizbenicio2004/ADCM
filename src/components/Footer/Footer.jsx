import { FaInstagram, FaFacebook, FaWhatsapp, FaYoutube } from "react-icons/fa";
import { CULTOS } from "../../data/igreja";
import { useConfig } from "../../context/ConfigContext";
import { useCollection } from "../../hooks/useCollection";
import { Link } from "react-router-dom";
import { sortCultos } from "../../utils/sortCultos";
import OptimizedImage from "../OptimizedImage";

export default function Footer() {
  const { loading, config } = useConfig();
  const { data: cultosFirestore = [], loading: cultosLoading } = useCollection("cultos");
  const ano = new Date().getFullYear();

  const cultos = cultosFirestore.length > 0 ? cultosFirestore : (cultosLoading ? [] : CULTOS);
  const cultosOrdenados = sortCultos(cultos);

  const instagram = config?.instagram;
  const facebook  = config?.facebook;
  const youtube   = config?.youtube;
  const whatsapp  = config?.whatsapp;

  // Versículo: prioriza o cadastrado no admin, fallback clássico
  const versiculoRodape = config?.sobre?.versiculoRodape
    || "O Senhor é o meu pastor e nada me faltará. — Salmos 23:1";

  return (
    <footer className="bg-gray-950 text-gray-400">

      <div className="py-16 border-b border-white/10">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">

            {/* COLUNA PRINCIPAL */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <OptimizedImage
                  src="/logo.webp"
                  alt="Logo ADCM Poá"
                  loading="lazy"
                  width="48"
                  height="48"
                  className="w-12 h-12 object-contain rounded-full bg-white p-[3px]"
                />
                <div>
                  <span className="block text-white font-bold text-lg leading-tight">
                    {loading ? "ADCM Poá" : config?.nome || "ADCM Poá"}
                  </span>
                  <span className="text-xs uppercase tracking-widest text-gray-400">Assembleia de Deus</span>
                </div>
              </div>
              <p className="text-sm leading-relaxed mb-6 max-w-[280px]">
                Uma comunidade comprometida com a Palavra de Deus,
                comunhão e amor ao próximo. Venha fazer parte desta família.
              </p>
              <div className="flex flex-col gap-2">
                {instagram && (
                  <a href={instagram} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 hover:text-white transition">
                    <span className="w-7 h-7 flex items-center justify-center rounded bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 text-white">
                      <FaInstagram size={14} />
                    </span>
                    Instagram
                  </a>
                )}
                {facebook && (
                  <a href={facebook} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 hover:text-white transition">
                    <span className="w-7 h-7 flex items-center justify-center rounded bg-blue-600 text-white">
                      <FaFacebook size={14} />
                    </span>
                    Facebook
                  </a>
                )}
                {youtube && (
                  <a href={youtube} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 hover:text-white transition">
                    <span className="w-7 h-7 flex items-center justify-center rounded bg-red-600 text-white">
                      <FaYoutube size={14} />
                    </span>
                    YouTube
                  </a>
                )}
                {whatsapp && (
                  <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 hover:text-white transition">
                    <span className="w-7 h-7 flex items-center justify-center rounded bg-green-500 text-white">
                      <FaWhatsapp size={14} />
                    </span>
                    WhatsApp
                  </a>
                )}
              </div>
            </div>

            {/* NAVEGAÇÃO */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-white mb-4">Navegação</h3>
              <ul className="flex flex-col gap-2">
                {[
                  { href: "/#sobre", label: "Quem Somos" },
                  { href: "/#cultos", label: "Cultos" },
                  { href: "/#ministerios", label: "Ministérios" },
                  { href: "/#teologia", label: "Teologia" },
                  { href: "/#eventos", label: "Eventos" },
                  { href: "/#localizacao", label: "Localização" },
                ].map(({ href, label }) => (
                  <li key={href}>
                    <a href={href} className="flex items-center gap-2 text-sm hover:text-white hover:gap-3 transition-all">
                      <span className="text-blue-400 text-xs">→</span>
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* CULTOS */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-white mb-4">Cultos</h3>
              <ul className="flex flex-col gap-2">
                {cultosOrdenados.map((culto) => (
                  <li key={culto.id ?? culto.nome} className="flex justify-between border-b border-white/10 pb-2 text-sm">
                    <span>{culto.dia}{culto.obs ? " *" : ""}</span>
                    <span className="font-bold text-blue-400">{culto.horario}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* ENDEREÇO */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-white mb-4">Endereço</h3>
              <address className="text-sm not-italic leading-relaxed mb-4">
                {config?.endereco?.rua ? (
                  <>
                    {config.endereco.rua}{config.endereco.bairro ? `, ${config.endereco.bairro}` : ""} <br />
                    {config.endereco.cidade} - {config.endereco.estado} <br />
                    {config.endereco.cep && <>CEP: {config.endereco.cep}</>}
                  </>
                ) : (
                  "Endereço ainda não configurado."
                )}
              </address>
              {whatsapp && (
                <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-green-400 font-bold hover:text-green-300 transition">
                  <FaWhatsapp size={16} />
                  Fale pelo WhatsApp
                </a>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Rodapé inferior */}
      <div className="py-6">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500 text-center md:text-left">
          <p>© {ano} {config?.nome || "ADCM Poá"} · Todos os direitos reservados</p>
          <p className="italic">{versiculoRodape}</p>
          <Link
            to="/admin/login"
            className="flex items-center gap-1 text-gray-600 hover:text-white transition-colors duration-300 text-xs border border-gray-700 hover:border-gray-400 px-3 py-1 rounded"
            title="Área do administrador"
          >
            ⚙️ Painel Admin
          </Link>
        </div>
      </div>

    </footer>
  );
}
