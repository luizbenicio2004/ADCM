import { FaInstagram, FaFacebook, FaWhatsapp, FaYoutube } from "react-icons/fa";
import { CONTATOS, ENDERECO, CULTOS } from "../../data/igreja";

export default function Footer() {
  const ano = new Date().getFullYear();

  return (
    <footer className="bg-gray-950 text-gray-400">

      <div className="py-16 border-b border-white/10">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">

            {/* COLUNA PRINCIPAL */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <img
                  src="/logo.png"
                  alt="Logo ADCM Poá"
                  loading="lazy"
                  width="48"
                  height="48"
                  className="w-12 h-12 object-contain rounded-full bg-white p-[3px]"
                />
                <div>
                  <span className="block text-white font-bold text-lg leading-tight">ADCM Poá</span>
                  <span className="text-xs uppercase tracking-widest text-gray-400">Assembleia de Deus</span>
                </div>
              </div>
              <p className="text-sm leading-relaxed mb-6 max-w-[280px]">
                Uma igreja comprometida com a Palavra de Deus,
                comunhão e amor ao próximo. Venha fazer parte desta família.
              </p>
              <div className="flex flex-col gap-2">
                {CONTATOS.instagram && (
                  <a href={CONTATOS.instagram} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 hover:text-white transition">
                    <span className="w-7 h-7 flex items-center justify-center rounded bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 text-white">
                      <FaInstagram size={14} />
                    </span>
                    Instagram
                  </a>
                )}
                {CONTATOS.facebook && (
                  <a href={CONTATOS.facebook} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 hover:text-white transition">
                    <span className="w-7 h-7 flex items-center justify-center rounded bg-blue-600 text-white">
                      <FaFacebook size={14} />
                    </span>
                    Facebook
                  </a>
                )}
                {CONTATOS.youtube && (
                  <a href={CONTATOS.youtube} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 hover:text-white transition">
                    <span className="w-7 h-7 flex items-center justify-center rounded bg-red-600 text-white">
                      <FaYoutube size={14} />
                    </span>
                    YouTube
                  </a>
                )}
                {CONTATOS.whatsapp && (
                  <a href={`https://wa.me/${CONTATOS.whatsapp}`} target="_blank" rel="noopener noreferrer"
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
                {["sobre", "cultos", "ministerios", "teologia", "localizacao"].map((item) => (
                  <li key={item}>
                    <a href={`#${item}`} className="flex items-center gap-2 text-sm hover:text-white hover:gap-3 transition-all capitalize">
                      <span className="text-blue-400 text-xs">→</span>
                      {item.charAt(0).toUpperCase() + item.slice(1)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* CULTOS */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-white mb-4">Cultos</h3>
              <ul className="flex flex-col gap-2">
                {CULTOS.map((culto) => (
                  <li key={culto.id} className="flex justify-between border-b border-white/10 pb-2 text-sm">
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
                {ENDERECO.rua}<br />
                {ENDERECO.bairro} — {ENDERECO.cidade}, {ENDERECO.estado}<br />
                CEP: {ENDERECO.cep}
              </address>
              {CONTATOS.whatsapp && (
                <a href={`https://wa.me/${CONTATOS.whatsapp}`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-green-400 font-bold hover:text-green-300 transition">
                  <FaWhatsapp size={16} />
                  Fale pelo WhatsApp
                </a>
              )}
            </div>

          </div>
        </div>
      </div>

      <div className="py-6">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500 text-center md:text-left">
          <p>{ano} ADCM Poá · Todos os direitos reservados</p>
          <p className="italic">O Senhor é o meu pastor e nada me faltará. — Salmos 23:1</p>
        </div>
      </div>

    </footer>
  );
}