import { ExternalLink, Clock } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { motion } from "framer-motion";
import { cn } from "../utils/cn";
import { trackEvent } from "../utils/analytics";

export default function ProjectCard({ project, featured }) {
  const handleCodeClick = () => {
    trackEvent("project_view", { project_name: project.title, action: "view_code" });
    trackEvent("github_click", { link_location: "project_card", project_name: project.title });
  };

  const handleLiveDemoClick = () => {
    trackEvent("project_view", { project_name: project.title, action: "live_demo" });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      className={cn(
        "group flex flex-col bg-background border border-border rounded-xl overflow-hidden hover:border-accent/50 transition-colors",
        featured ? "lg:flex-row lg:col-span-2" : "col-span-1"
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden bg-[#0b1220] flex-shrink-0 border-b lg:border-b-0 lg:border-r border-border",
          featured
            ? "lg:w-2/5 aspect-video lg:aspect-[4/3]"
            : "w-full aspect-video"
        )}
      >
        <img
          src={project.image}
          alt={`Screenshot of ${project.title}`}
          className="w-full h-full object-contain object-center p-3 group-hover:scale-[1.02] transition-transform duration-500"
          loading="lazy"
        />
      </div>

      <div className="flex flex-col flex-grow p-6 lg:p-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold text-white tracking-tight">
            {project.title}
          </h3>
          {project.status === "Coming Soon" ? (
            <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 bg-surface border border-border text-text-secondary rounded-full whitespace-nowrap">
              <Clock className="w-3.5 h-3.5" />
              Coming Soon
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full whitespace-nowrap">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live
            </span>
          )}
        </div>

        <p className="text-text-secondary leading-relaxed mb-6 flex-grow">
          {project.description}
        </p>

        <div className="mb-6">
          <h4 className="text-sm font-semibold text-white mb-2 uppercase tracking-wider">
            Key Features
          </h4>
          <ul className="list-disc list-inside text-sm text-text-secondary space-y-1">
            {project.features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {project.technologies.map((tech, index) => (
            <span
              key={index}
              className="text-xs font-medium text-text-secondary px-2 py-1 bg-surface rounded-md border border-border"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="mt-auto flex gap-4">
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleCodeClick}
            className={cn(
              "flex-1 flex justify-center items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors border",
              "bg-surface hover:bg-surface-hover border-border text-white"
            )}
          >
            <FaGithub className="w-4 h-4" />
            Code
          </a>

          {project.status === "Live" && project.live !== "#" ? (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleLiveDemoClick}
              className="flex-1 flex justify-center items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-md font-medium transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Live Demo
            </a>
          ) : (
            <button
              disabled
              className="flex-1 flex justify-center items-center gap-2 px-4 py-2 bg-surface text-text-secondary border border-border rounded-md font-medium cursor-not-allowed opacity-75"
            >
              Coming Soon
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
