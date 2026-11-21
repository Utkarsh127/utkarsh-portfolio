import { ArrowRight } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { motion } from "framer-motion";
import { CONTACT_INFO } from "../data/socialLinks";
import { trackEvent } from "../utils/analytics";

export default function Hero() {
  return (
    <section className="pt-32 pb-16 md:pt-40 md:pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-start justify-center min-h-[75vh]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-4">
          <span className="block text-text-secondary text-lg sm:text-xl md:text-2xl font-medium mb-2">
            Hi, I'm Utkarsh Pachauri
          </span>
          Full-Stack Developer
        </h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <p className="mt-4 text-xl sm:text-2xl text-white font-medium max-w-3xl">
          Building scalable web applications and AI-powered software.
        </p>
        <p className="mt-4 text-base sm:text-lg text-text-secondary max-w-2xl leading-relaxed">
          Full-stack developer focused on creating real-world applications using React, JavaScript, Node.js, Express.js, MongoDB, REST APIs, Docker, and AI integrations.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-10 flex flex-wrap gap-4"
      >
        <a
          href="#projects"
          className="bg-accent hover:bg-accent-hover text-white px-6 py-3 rounded-md font-semibold transition-colors flex items-center gap-2 group"
        >
          View Projects
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </a>
        <a
          href={CONTACT_INFO.github}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent("github_click", { link_location: "hero" })}
          className="bg-surface hover:bg-surface-hover border border-border text-white px-6 py-3 rounded-md font-medium transition-colors flex items-center gap-2"
        >
          <FaGithub className="w-5 h-5" />
          GitHub
        </a>
        <a
          href={CONTACT_INFO.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent("linkedin_click", { link_location: "hero" })}
          className="bg-surface hover:bg-surface-hover border border-border text-white px-6 py-3 rounded-md font-medium transition-colors flex items-center gap-2"
        >
          <FaLinkedin className="w-5 h-5" />
          LinkedIn
        </a>
      </motion.div>
    </section>
  );
}
