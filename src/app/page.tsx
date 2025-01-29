import Hero from "@/components/home/Hero";
import About from "@/components/home/About";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <About />
      <Footer />
    </main>
  );
}
