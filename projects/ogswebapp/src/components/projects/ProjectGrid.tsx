import type { Project } from "../../data/projects";
import { ProjectCard } from "./ProjectCard";

interface ProjectGridProps {
  projects: Project[];
}

export function ProjectGrid({
  projects,
}: ProjectGridProps) {
  if (projects.length === 0) {
    return (
      <div className="projects-empty">
        <p>No projects available yet.</p>
      </div>
    );
  }

  return (
    <div className="project-grid">
      {projects.map((project) => (
        <ProjectCard
          key={project.slug}
          project={project}
        />
      ))}
    </div>
  );
}