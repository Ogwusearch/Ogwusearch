import type { ReactNode } from "react";
import {
  ArrowLeft,
  ExternalLink,
} from "lucide-react";

import { Link } from "react-router-dom";

import type { Project } from "../../data/projects";

interface ProjectDetailProps {
  project: Project;
}

function DetailSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="project-detail__section">
      <span className="eyebrow">
        {title}
      </span>

      <div className="project-detail__section-content">
        {children}
      </div>
    </section>
  );
}

export function ProjectDetail({
  project,
}: ProjectDetailProps) {
  return (
    <article className="project-detail">
      <div className="container">
        <Link
          to="/projects"
          className="project-detail__back"
        >
          <ArrowLeft
            size={16}
            aria-hidden="true"
          />
          Back to projects
        </Link>

        <header className="project-detail__header">
          <div>
            <span className="eyebrow">
              {project.category}
            </span>

            <h1>{project.name}</h1>

            <p className="project-detail__description">
              {project.description}
            </p>
          </div>

          <div className="project-detail__status">
            {project.status}
          </div>
        </header>

        {project.image ? (
          <div className="project-detail__image">
            <img
              src={project.image}
              alt={`${project.name} project`}
            />
          </div>
        ) : null}

        <div className="project-detail__content">
          <DetailSection title="Overview">
            <p>
              {project.overview ??
                "Project overview has not been documented yet."}
            </p>
          </DetailSection>

          <DetailSection title="Problem">
            <p>
              {project.problem ??
                "Problem statement has not been documented yet."}
            </p>
          </DetailSection>

          <DetailSection title="What was built">
            <p>
              {project.built ??
                "Implementation details have not been documented yet."}
            </p>
          </DetailSection>

          <DetailSection title="Architecture">
            <p>
              {project.architecture ??
                "Architecture documentation has not been added yet."}
            </p>
          </DetailSection>

          <DetailSection title="Technologies">
            <div className="project-detail__technologies">
              {project.technologies.map((technology) => (
                <span key={technology}>
                  {technology}
                </span>
              ))}
            </div>
          </DetailSection>

          <DetailSection title="Screenshots">
            {project.screenshots &&
            project.screenshots.length > 0 ? (
              <div className="project-detail__screenshots">
                {project.screenshots.map(
                  (screenshot) => (
                    <img
                      key={screenshot}
                      src={screenshot}
                      alt={`${project.name} screenshot`}
                    />
                  ),
                )}
              </div>
            ) : (
              <p>
                Screenshots have not been added yet.
              </p>
            )}
          </DetailSection>

          <DetailSection title="Engineering details">
            <p>
              {project.engineeringDetails ??
                "Engineering details have not been documented yet."}
            </p>
          </DetailSection>

          <DetailSection title="Status">
            <p>{project.status}</p>
          </DetailSection>

          <DetailSection title="Links">
            <div className="project-detail__links">
              {project.repository ? (
                <a
                  href={project.repository}
                  target="_blank"
                  rel="noreferrer"
                  className="button button--secondary"
                >
                  <ExternalLink
  size={17}
  aria-hidden="true"
/>
Repository
                </a>
              ) : null}

              {project.demo ? (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noreferrer"
                  className="button button--primary"
                >
                  <ExternalLink
                    size={17}
                    aria-hidden="true"
                  />
                  Live Demo
                </a>
              ) : null}

              {!project.repository &&
              !project.demo ? (
                <p>
                  Project links have not been added yet.
                </p>
              ) : null}
            </div>
          </DetailSection>
        </div>
      </div>
    </article>
  );
}