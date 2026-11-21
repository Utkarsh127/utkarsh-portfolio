import { projects } from "../data/projects";
import ProjectCard from "./ProjectCard";

export default function Projects() {
  return (
    <section id="projects" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-12">
        <h2 className="text-3xl font-bold tracking-tight text-white mb-4">
          Featured Projects
        </h2>
        <p className="text-lg text-text-secondary max-w-2xl">
          A selection of real-world applications I've built, focusing on scalable architecture, clean code, and intuitive user experiences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {projects.map((project, index) => (
          <ProjectCard key={project.slug || index} project={project} featured={project.featured} />
        ))}
      </div>
    </section>
  );
}
