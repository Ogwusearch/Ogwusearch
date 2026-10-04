import { Navigate, useParams } from "react-router-dom";

import { ProjectDetail } from "../../components/projects/ProjectDetail";
import { projects } from "../../data/projects";

export function ProjectPage() {
  const { slug } = useParams();

  const project = projects.find(
    (item) => item.slug === slug,
  );

  if (!project) {
    return (
      <Navigate
        to="/projects"
        replace
      />
    );
  }

  return <ProjectDetail project={project} />;
}