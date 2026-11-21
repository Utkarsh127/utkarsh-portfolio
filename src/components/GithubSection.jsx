import { ArrowRight } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { CONTACT_INFO } from "../data/socialLinks";
import { trackEvent } from "../utils/analytics";

export default function GithubSection() {
  return (
    <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <div className="max-w-3xl mx-auto flex flex-col items-center">
        <div className="p-4 bg-surface border border-border rounded-full mb-6">
          <FaGithub className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-white mb-4">
          Explore My Code
        </h2>
        <p className="text-lg text-text-secondary mb-8">
          Explore my repositories and see how I build, structure, and maintain real-world applications.
        </p>
        <a
          href={CONTACT_INFO.github}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent("github_click", { link_location: "github_section" })}
          className="bg-white hover:bg-gray-200 text-black px-8 py-3 rounded-md font-bold transition-colors flex items-center gap-2 group"
        >
          Visit GitHub
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </a>
      </div>
    </section>
  );
}
