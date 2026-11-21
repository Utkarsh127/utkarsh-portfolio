
import { Code2, GraduationCap } from "lucide-react";

const journey = [
  {
    id: 1,
    type: "Development",
    period: "Present",
    title: "Full-Stack Developer",
    subtitle: "Independent Projects & Application Development",
    icon: Code2,
    highlights: [
      "Building full-stack applications using React.js, Node.js, Express.js, and MongoDB.",
      "Implementing real-time communication using Socket.IO and WebSockets.",
      "Developing REST APIs, JWT authentication, and database integrations.",
      "Integrating AI APIs and exploring AI-powered application development.",
      "Working on responsive interfaces, Docker, and application deployment."
    ],
    featured: true
  },
  {
    id: 2,
    type: "Education",
    period: "2020 – 2024",
    title: "Bachelor of Technology (B.Tech)",
    subtitle: "Information Technology",
    institution: "Rustamji Institute of Technology",
    icon: GraduationCap,
    highlights: [
      "Graduated in 2024.",
      "Achieved 78% in B.Tech.",
      "Built a foundation in computer science and software development."
    ],
    featured: false
  }
];

export default function Experience() {
  return (
    <section
      id="experience"
      className="py-20 bg-surface/50 border-y border-border"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="mb-12">
          <span className="text-sm font-semibold text-accent uppercase tracking-wider">
            My Background
          </span>

          <h2 className="text-3xl font-bold tracking-tight text-white mt-2">
            Development Journey
          </h2>

          <p className="text-text-secondary mt-3 max-w-2xl">
            My academic background and hands-on journey in
            building modern software applications.
          </p>
        </div>

        <div className="max-w-4xl border-l-2 border-border ml-4 md:ml-6 space-y-12">

          {journey.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.id}
                className="relative pl-8 md:pl-12"
              >
                <div
                  className={`absolute -left-[17px] top-1 w-8 h-8
                  bg-background border-2 rounded-full
                  flex items-center justify-center
                  ${item.featured ? "border-accent" : "border-border"}`}
                >
                  <Icon
                    className={`w-4 h-4 ${item.featured
                      ? "text-accent"
                      : "text-text-secondary"
                      }`}
                  />
                </div>

                <div
                  className={`bg-background border rounded-xl p-6
                  transition-colors hover:border-accent/40
                  ${item.featured ? "border-accent/30" : "border-border"}`}
                >
                  <span className="text-sm font-semibold text-accent mb-2 block">
                    {item.period}
                  </span>

                  <span className="text-xs uppercase tracking-wider text-text-secondary">
                    {item.type}
                  </span>

                  <h3 className="text-xl font-bold text-white mt-2">
                    {item.title}
                  </h3>

                  <p className="text-text-secondary mt-1 mb-2">
                    {item.subtitle}
                  </p>

                  {item.institution && (
                    <p className="text-sm text-text-secondary mb-4">
                      {item.institution}
                    </p>
                  )}

                  <ul className="list-disc list-inside text-text-secondary space-y-2">
                    {item.highlights.map((highlight, index) => (
                      <li key={index}>{highlight}</li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}

        </div>
      </div>
    </section>
  );
}
