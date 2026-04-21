import { MessageCircle, LayoutDashboard } from "lucide-react";
import { Link } from "react-router-dom";

// Ícones de marcas customizados (lucide-react v1+ removeu ícones de marcas)
const FacebookIcon = ({ size = 14 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const InstagramIcon = ({ size = 14 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const YoutubeIcon = ({ size = 14 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.96-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white" />
  </svg>
);

import { CULTOS } from "../../data/igreja";
import { useConfig } from "../../context/ConfigContext";
import { useCollection } from "../../hooks/useCollection";
import { sortCultos } from "../../utils/sortCultos";
import OptimizedImage from "../OptimizedImage";

export default function Footer() {
  const { loading, config } = useConfig();
  const { data: cultosFirestore = [], loading: cultosLoading } = useCollection("cultos");
  const ano = new Date().getFullYear();

  const cultos = cultosFirestore.length > 0 ? cultosFirestore : cultosLoading ? [] : CULTOS;
  const cultosOrdenados = sortCultos(cultos);

  const instagram = config?.instagram;
  const facebook = config?.facebook;
  const youtube = config?.youtube;
  const whatsapp = config?.whatsapp;

  const versiculoRodape =
    config?.sobre?.versiculoRodape || "O Senhor é o meu pastor e nada me faltará. — Salmos 23:1";

  return (
    <footer className="bg-gray-950 text-gray-400">
      <div className="py-16 border-b border-white/10">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">

            {/* Coluna principal */}
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
                  <span className="text-xs uppercase tracking-widest text-gray-400">
                    Assembleia de Deus
                  </span>
                </div>
              </div>
              <p className="text-sm leading-relaxed mb-6 max-w-[280px]">
                Uma comunidade comprometida com a Palavra de Deus, comunhão e amor ao próximo.
                Venha fazer parte desta família.
              </p>
              <div className="flex flex-col gap-2">
                {instagram && (
                  <a href={instagram} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 hover:text-white transition">
                    <span className="w-7 h-7 flex items-center justify-center rounded bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 text-white">
                      <InstagramIcon size={14} />
                    </span>
                    Instagram
                  </a>
                )}
                {facebook && (
                  <a href={facebook} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 hover:text-white transition">
                    <span className="w-7 h-7 flex items-center justify-center rounded bg-blue-600 text-white">
                      <FacebookIcon size={14} />
                    </span>
                    Facebook
                  </a>
                )}
                {youtube && (
                  <a href={youtube} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 hover:text-white transition">
                    <span className="w-7 h-7 flex items-center justify-center rounded bg-red-600 text-white">
                      <YoutubeIcon size={14} />
                    </span>
                    YouTube
                  </a>
                )}
                {whatsapp && (
                  <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 hover:text-white transition">
                    <span className="w-7 h-7 flex items-center justify-center rounded bg-green-500 text-white">
                      <MessageCircle size={14} />
                    </span>
                    WhatsApp
                  </a>
                )}
              </div>
            </div>

            {/* Navegação — dinâmica conforme seções ativas */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-white mb-4">Navegação</h3>
              <ul className="flex flex-col gap-2">
                {[
                  { href: "/#sobre",       label: "Quem Somos",   secao: "secaoSobre" },
                  { href: "/#cultos",      label: "Cultos",       secao: "secaoCultos" },
                  { href: "/#ministerios", label: "Ministérios", secao: "secaoMinisterios" },
                  { href: "/#eventos",     label: "Eventos",      secao: "secaoEventos" },
                  { href: "/#reciclagem",  label: "Reciclagem",   secao: "secaoReciclagem" },
                  { href: "/#avisos",      label: "Avisos",       secao: "secaoAvisos" },
                  { href: "/#oracao",      label: "Oração",       secao: "secaoOracao" },
                  { href: "/#localizacao", label: "Localização",  secao: "secaoLocalizacao" },
                ]
                  .filter(({ secao }) => !config || config[secao] !== false)
                  .map(({ href, label }) => (
                    <li key={href}>
                      <a href={href} className="flex items-center gap-2 text-sm hover:text-white hover:gap-3 transition-all">
                        <span className="text-blue-400 text-xs">→</span>
                        {label}
                      </a>
                    </li>
                  ))}
              </ul>
            </div>

            {/* Cultos — só exibe se a seção estiver ativa */}
            {(!config || config.secaoCultos !== false) && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-white mb-4">Cultos</h3>
              <ul className="flex flex-col gap-2">
                {cultosOrdenados.map((culto) => (
                  <li key={culto.id ?? culto.nome}
                    className="flex justify-between border-b border-white/10 pb-2 text-sm">
                    <span>{culto.dia}{culto.obs ? " *" : ""}</span>
                    <span className="font-bold text-blue-400">{culto.horario}</span>
                  </li>
                ))}
              </ul>
            </div>
            )}

            {/* Endereço */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-white mb-4">Endereço</h3>
              <address className="text-sm not-italic leading-relaxed mb-4">
                {config?.endereco?.rua ? (
                  <>
                    {config.endereco.rua}
                    {config.endereco.bairro ? `, ${config.endereco.bairro}` : ""} <br />
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
                  <MessageCircle size={16} />
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
          <div className="flex items-center gap-2">
            <p
              onClick={() => {
                if (!window._footerClicks) window._footerClicks = 0;
                window._footerClicks += 1;
                clearTimeout(window._footerTimer);
                window._footerTimer = setTimeout(() => { window._footerClicks = 0; }, 1500);
                if (window._footerClicks >= 3) {
                  window._footerClicks = 0;
                  window.dispatchEvent(new Event("adcm:secret-footer"));
                }
              }}
              className="cursor-default select-none"
            >
              © {ano} {config?.nome || "ADCM Poá"} · Todos os direitos reservados
            </p>
            {/* Ícone admin discreto no footer */}
            <Link
              to="/admin/login"
              className="opacity-20 hover:opacity-50 transition-opacity"
              title="Admin"
            >
              <LayoutDashboard size={12} />
            </Link>
          </div>
          <p className="italic">{versiculoRodape}</p>
        </div>
      </div>
    </footer>
  );
}