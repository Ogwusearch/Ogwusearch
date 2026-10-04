import { ProjectGrid } from "../../components/projects/ProjectGrid";
import { projects } from "../../data/projects";

export function Projects() {
  return (
    <div className="projects-page">
      <section className="projects-page__hero">
        <div className="container">
          <span className="eyebrow">
            Portfolio
          </span>

          <h1>Projects</h1>

          <p>
            Independent software, engineering,
            electronics, and technical projects.
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