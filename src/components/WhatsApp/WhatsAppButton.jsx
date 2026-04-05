import { useConfig } from "../../context/ConfigContext";

export default function WhatsAppButton() {
  const { config } = useConfig();

  // Prioriza o campo whatsapp; fallback para telefone
  const numero = config?.whatsapp || config?.telefone;

  const mensagem = "Olá! Vim pelo site e gostaria de saber mais sobre a Igreja.";
  const url = numero && `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;

  if (!numero) return null;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Fale conosco pelo WhatsApp"
      className="fixed bottom-7 right-7 z-[900]
                 w-14 h-14 flex items-center justify-center
                 rounded-full bg-green-500
                 shadow-[0_4px_20px_rgba(37,211,102,0.45)]
                 transition-all duration-300
                 hover:scale-110 hover:-translate-y-1
                 hover:shadow-[0_8px_30px_rgba(37,211,102,0.6)]
                 group"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        className="w-7 h-7 fill-white"
      >
        <path d="M16 0C7.164 0 0 7.163 0 16c0 2.822.736 5.463 2.028 7.761L0 32l8.472-2.203A15.934 15.934 0 0016 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.333a13.27 13.27 0 01-6.79-1.862l-.487-.29-5.027 1.308 1.34-4.893-.317-.502A13.235 13.235 0 012.667 16C2.667 8.636 8.636 2.667 16 2.667S29.333 8.636 29.333 16 23.364 29.333 16 29.333zm7.27-9.778c-.398-.199-2.354-1.16-2.718-1.293-.364-.132-.63-.199-.896.2-.265.398-1.028 1.292-1.26 1.558-.232.265-.464.298-.862.1-.398-.2-1.682-.62-3.204-1.977-1.184-1.056-1.983-2.36-2.215-2.758-.232-.398-.025-.613.174-.811.179-.178.398-.464.597-.696.199-.232.265-.398.398-.663.132-.265.066-.497-.033-.696-.1-.199-.896-2.16-1.228-2.957-.323-.776-.65-.671-.896-.683l-.763-.013c-.265 0-.696.1-1.061.497-.364.398-1.393 1.36-1.393 3.32s1.426 3.85 1.625 4.116c.199.265 2.808 4.285 6.803 6.01.951.41 1.694.656 2.272.84.954.304 1.823.261 2.51.158.765-.114 2.354-.962 2.686-1.89.332-.929.332-1.725.232-1.89-.099-.166-.364-.265-.762-.464z" />
      </svg>

      <span
        className="absolute right-full mr-3 top-1/2 -translate-y-1/2
                   bg-gray-900 text-white text-xs font-semibold
                   px-3 py-1 rounded
                   opacity-0 translate-x-2
                   transition-all duration-300
                   group-hover:opacity-100 group-hover:translate-x-0
                   hidden sm:block"
      >
        Fale conosco!
      </span>
    </a>
  );
}
