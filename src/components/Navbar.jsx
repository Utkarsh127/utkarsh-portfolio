import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../utils/cn";
import { CONTACT_INFO } from "../data/socialLinks";
import { trackEvent } from "../utils/analytics";

const navLinks = [
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Experience", href: "#experience" },
  { name: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock background body scroll when mobile menu is open to prevent overlapping scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleNavClick = (e, href) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const targetId = href.substring(1);

      if (isOpen) {
        setIsOpen(false);
        // Small timeout allows the mobile menu animation to cleanly finish before scrolling
        setTimeout(() => {
          const el = targetId ? document.getElementById(targetId) : null;
          if (el) {
            el.scrollIntoView({ behavior: "smooth" });
          } else {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
          window.history.pushState(null, "", href);
        }, 150);
      } else {
        const el = targetId ? document.getElementById(targetId) : null;
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
        window.history.pushState(null, "", href);
      }
    } else {
      setIsOpen(false);
    }
  };

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300 border-b",
        scrolled || isOpen
          ? "bg-background/95 backdrop-blur-md border-border py-3 shadow-sm"
          : "bg-transparent border-transparent py-5"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <a
            href="#"
            onClick={(e) => handleNavClick(e, "#")}
            className="text-xl font-bold tracking-tight hover:text-accent transition-colors"
          >
            Utkarsh Pachauri
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <div className="flex gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="text-sm font-medium text-text-secondary hover:text-white transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-4 border-l border-border pl-6">
              <a
                href={CONTACT_INFO.github}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("github_click", { link_location: "navbar" })}
                className="text-text-secondary hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <FaGithub className="w-5 h-5" />
              </a>
              <a
                href={CONTACT_INFO.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("linkedin_click", { link_location: "navbar" })}
                className="text-text-secondary hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="w-5 h-5" />
              </a>
              <a
                href="#projects"
                onClick={(e) => handleNavClick(e, "#projects")}
                className="bg-accent hover:bg-accent-hover text-white text-sm font-semibold px-4 py-2 rounded-md transition-colors"
              >
                View Projects
              </a>
            </div>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 -mr-2 text-text-secondary hover:text-white focus:outline-none focus:ring-2 focus:ring-accent rounded-lg"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-surface border-t border-border mt-3 shadow-2xl max-h-[calc(100dvh-4.5rem)] overflow-y-auto"
          >
            <div className="px-4 pt-3 pb-6 flex flex-col gap-3">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-base font-medium text-text-secondary hover:text-white py-2.5 px-3 rounded-lg hover:bg-surface-hover transition-colors block"
                  onClick={(e) => handleNavClick(e, link.href)}
                >
                  {link.name}
                </a>
              ))}
              <div className="flex items-center gap-4 pt-3 pb-1 border-t border-border px-3">
                <a
                  href={CONTACT_INFO.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent("github_click", { link_location: "navbar_mobile" })}
                  className="p-2 text-text-secondary hover:text-white hover:bg-surface-hover rounded-lg transition-colors"
                  aria-label="GitHub"
                >
                  <FaGithub className="w-6 h-6" />
                </a>
                <a
                  href={CONTACT_INFO.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent("linkedin_click", { link_location: "navbar_mobile" })}
                  className="p-2 text-text-secondary hover:text-white hover:bg-surface-hover rounded-lg transition-colors"
                  aria-label="LinkedIn"
                >
                  <FaLinkedin className="w-6 h-6" />
                </a>
              </div>
              <a
                href="#projects"
                onClick={(e) => handleNavClick(e, "#projects")}
                className="mt-2 bg-accent hover:bg-accent-hover text-white text-center font-semibold py-3 px-4 rounded-lg transition-colors w-full block shadow-sm"
              >
                View Projects
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
