import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

import type { Project } from "../../data/projects";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({
  project,
}: ProjectCardProps) {
  return (
    <article className="project-card">
      {project.image ? (
        <div className="project-card__image">
          <img
            src={project.image}
            alt={`${project.name} project`}
          />
        </div>
      ) : null}

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

        <Link
          to={`/projects/${project.slug}`}
          className="project-card__link"
          aria-label={`View ${project.name}`}
        >
          <ArrowUpRight
            size={18}
            aria-hidden="true"
          />
        </Link>
      </div>
    </article>
  );
}