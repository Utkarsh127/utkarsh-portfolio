import { Server, Layout, Database, Sparkles } from "lucide-react";

const highlights = [
  {
    title: "Frontend Engineering",
    description: "React • JavaScript • Tailwind CSS",
    icon: Layout,
  },
  {
    title: "Backend Engineering",
    description: "Node.js • Express • REST APIs",
    icon: Server,
  },
  {
    title: "Database Architecture",
    description: "MongoDB • Atlas • Mongoose",
    icon: Database,
  },
  {
    title: "AI Applications",
    description: "Generative AI • AI APIs • Agentic AI",
    icon: Sparkles,
  },
];

export default function Highlights() {
  return (
    <section className="py-12 border-y border-border bg-surface/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {highlights.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="flex flex-col items-start">
                <div className="p-2 bg-background border border-border rounded-lg mb-4">
                  <Icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">
                  {item.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
