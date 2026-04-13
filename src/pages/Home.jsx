import Header from "../components/Header/Header";
import Hero from "../components/Hero/Hero";
import Sobre from "../components/Sobre/Sobre";
import Cultos from "../components/Cultos/Cultos";
import Ministerios from "../components/Ministerios/Ministerios";
import Eventos from "../components/Eventos/Eventos";
import Reciclagem from "../components/Reciclagem/Reciclagem";
import Avisos from "../components/Avisos/Avisos";
import Teologia from "../components/Teologia/Teologia";
import Localizacao from "../components/Localizacao/Localizacao";
import Footer from "../components/Footer/Footer";
import WhatsAppButton from "../components/WhatsApp/WhatsAppButton";
import BackToTop from "../components/BackToTop/BackToTop";
import Live from "../components/Live/Live";
import { useSEO } from "../hooks/useSEO";

export default function Home() {
  useSEO({
    title: "Início",
    description:
      "Igreja Assembleia de Deus em Poá, SP. Cultos, eventos, ministérios e comunhão. Venha fazer parte desta família!",
  });

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Live />
        <Sobre />
        <Cultos />
        <Ministerios />
        <Eventos />
        <Reciclagem />
        <Avisos />
        <Teologia />
        <Localizacao />
      </main>
      <Footer />
      <WhatsAppButton />
      <BackToTop />
    </>
  );
}
