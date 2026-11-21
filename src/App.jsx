import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Highlights from "./components/Highlights";
import About from "./components/About";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Experience from "./components/Experience";
import GithubSection from "./components/GithubSection";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import ConsentBanner from "./components/ConsentBanner";
import { initGA, trackPageView, getConsentStatus } from "./utils/analytics";

function App() {
  const [showPreferences, setShowPreferences] = useState(false);

  useEffect(() => {
    // Initialize GA4 only if consent was previously granted
    if (getConsentStatus() === "granted") {
      initGA();
    }

    // Initial page view tracking
    trackPageView(
      window.location.pathname + (window.location.hash || ""),
      document.title
    );

    // SPA hash navigation tracking
    const handleHashChange = () => {
      trackPageView(
        window.location.pathname + (window.location.hash || ""),
        document.title
      );
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return (
    <div className="min-h-screen selection:bg-accent selection:text-white">
      <Navbar />
      <main>
        <Hero />
        <Highlights />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <GithubSection />
        <Contact />
      </main>
      <Footer onOpenPreferences={() => setShowPreferences(true)} />
      <ConsentBanner
        isOpen={showPreferences}
        onClose={() => setShowPreferences(false)}
      />
    </div>
  );
}

export default App;
