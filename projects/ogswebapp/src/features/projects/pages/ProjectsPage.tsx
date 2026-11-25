import { ProjectGrid } from "../components/ProjectGrid";
import { projects } from "../../../data/projects";

export function ProjectsPage() {
  return (
    <div className="projects-page">
      <section className="projects-page__hero">
        <div className="container">
          <span className="eyebrow">
            Portfolio
          </span>

          <h1>Projects</h1>

          <p>
            A collection of software platforms, engineering
            tools, electronics projects, and hardware
            development work. Each project documents its
            purpose, implementation, and current progress.
          </p>
        </div>
      </section>

      <section className="home-section">
        <div className="container">
          <ProjectGrid projects={projects} />
        </div>
      </section>
    </div>
  );
}