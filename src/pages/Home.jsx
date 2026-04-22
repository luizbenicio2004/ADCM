import Header from "../components/Header/Header";
import Hero from "../components/Hero/Hero";
import Sobre from "../components/Sobre/Sobre";
import Cultos from "../components/Cultos/Cultos";
import Ministerios from "../components/Ministerios/Ministerios";
import Eventos from "../components/Eventos/Eventos";
import Reciclagem from "../components/Reciclagem/Reciclagem";
import Avisos from "../components/Avisos/Avisos";
import Oracao from "../components/Oracao/Oracao";
import Localizacao from "../components/Localizacao/Localizacao";
import Footer from "../components/Footer/Footer";
import WhatsAppButton from "../components/WhatsApp/WhatsAppButton";
import BackToTop from "../components/BackToTop/BackToTop";
import Live from "../components/Live/Live";
import Testemunhos from "../components/Testemunhos/Testemunhos";
import { useSEO } from "../hooks/useSEO";
import { useConfig } from "../context/ConfigContext";

// Retorna true se a seção está ativada (padrão = true quando não configurado)
function isAtiva(config, chave) {
  if (!config) return true;
  return config[chave] !== false;
}

export default function Home() {
  useSEO({
    title: "Início",
    description:
      "Igreja Assembleia de Deus em Poá, SP. Cultos, eventos, ministérios e comunhão. Venha fazer parte desta família!",
  });

  const { config } = useConfig();

  return (
    <>
      <Header />
      <main>
        <Hero />
        {isAtiva(config, "secaoLive")        && <Live />}
        {isAtiva(config, "secaoSobre")       && <Sobre />}
        {isAtiva(config, "secaoCultos")      && <Cultos />}
        {isAtiva(config, "secaoMinisterios") && <Ministerios />}
        {isAtiva(config, "secaoEventos")     && <Eventos />}
        {isAtiva(config, "secaoReciclagem")  && <Reciclagem />}
        {isAtiva(config, "secaoAvisos")       && <Avisos />}
        {isAtiva(config, "secaoTestemunhos")  && <Testemunhos />}
        {isAtiva(config, "secaoOracao")       && <Oracao />}
        {isAtiva(config, "secaoLocalizacao")  && <Localizacao />}
      </main>
      <Footer />
      <WhatsAppButton />
      <BackToTop />
    </>
  );
}
