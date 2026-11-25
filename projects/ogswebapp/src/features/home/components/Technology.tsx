const capabilities = [
  {
    number: "01",
    title: "Engineering Software",
    description:
      "Software for engineering calculations, analysis, design workflows, and technical problem solving.",
  },
  {
    number: "02",
    title: "Electronics",
    description:
      "Circuit design, simulation, power electronics, hardware experiments, and practical electronics work.",
  },
  {
    number: "03",
    title: "Software Architecture",
    description:
      "Application architecture, data systems, APIs, reusable components, validation, and testing.",
  },
  {
    number: "04",
    title: "AI",
    description:
      "Exploration of artificial intelligence and AI-assisted technical workflows.",
  },
];

const technologies = [
  "TypeScript",
  "React",
  "Vite",
  "Python",
  "PostgreSQL",
  "SQLite",
  "Docker",
  "Git",
];

export function Technology() {
  return (
    <section className="home-section home-section--surface">
      <div className="container">
        <div className="section-heading section-heading--stacked">
          <span className="eyebrow">Capabilities</span>

          <h2>Technology &amp; Engineering</h2>

          <p>
            A practical collection of software and engineering
            disciplines used across independent projects and
            experiments.
          </p>
        </div>

        <div className="capability-grid">
          {capabilities.map((capability) => (
            <article
              key={capability.number}
              className="capability-card"
            >
              <span>{capability.number}</span>

              <h3>{capability.title}</h3>

              <p>{capability.description}</p>
            </article>
          ))}
        </div>

        <div className="technology-list">
          {technologies.map((technology) => (
            <span key={technology}>
              {technology}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}