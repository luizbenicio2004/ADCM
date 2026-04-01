import Header     from "../components/Header/Header";
import Hero       from "../components/Hero/Hero";
import Sobre      from "../components/Sobre/Sobre";
import Cultos     from "../components/Cultos/Cultos";
import Ministerios from "../components/Ministerios/Ministerios";
import Avisos     from "../components/Avisos/Avisos";
import Teologia   from "../components/Teologia/Teologia";
import Localizacao from "../components/Localizacao/Localizacao";
import Footer     from "../components/Footer/Footer";
import WhatsAppButton from "../components/WhatsApp/WhatsAppButton";
import BackToTop  from "../components/BackToTop/BackToTop";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Sobre />
        <Cultos />
        <Ministerios />
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