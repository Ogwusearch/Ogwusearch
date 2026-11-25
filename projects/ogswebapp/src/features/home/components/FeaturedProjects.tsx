import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

import { projects } from "../../../data/projects";
import { ProjectCard } from "../../projects/components/ProjectCard";

export function FeaturedProjects() {
  const featuredProjects = projects.filter(
    (project) => project.featured,
  );

  return (
    <section
      id="featured-projects"
      className="home-section"
    >
      <div className="container">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Selected work</span>
            <h2>Featured Projects</h2>
          </div>

          <Link
            to="/projects"
            className="section-link"
          >
            View all
            <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>

        <div className="project-grid">
          {featuredProjects.map((project) => (
            <ProjectCard
              key={project.slug}
              project={project}
            />
          ))}
        </div>
      </div>
    </section>
  );
}