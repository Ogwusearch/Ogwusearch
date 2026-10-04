import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

import { projects } from "../../data/projects";

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
            <article
              key={project.slug}
              className="project-card"
            >
              <div className="project-card__top">
                <span className="project-card__category">
                  {project.category}
                </span>

                <span className="project-card__status">
                  {project.status}
                </span>
              </div>

              <div className="project-card__body">
                <h3>{project.name}</h3>
                <p>{project.description}</p>
              </div>

              <div className="project-card__footer">
                <div className="project-card__technologies">
                  {project.technologies.map((technology) => (
                    <span key={technology}>
                      {technology}
                    </span>
                  ))}
                </div>

                <ArrowUpRight
                  size={18}
                  aria-hidden="true"
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}