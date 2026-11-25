import { Route, Routes } from "react-router-dom";

import { AboutPage } from "../features/about/pages/AboutPage";
import { EngineeringPage } from "../features/engineering/pages/EngineeringPage";
import { ExperimentsPage } from "../features/experiments/pages/ExperimentsPage";
import { HomePage } from "../features/home/pages/HomePage";
import { ProjectPage } from "../features/projects/pages/ProjectPage";
import { ProjectsPage } from "../features/projects/pages/ProjectsPage";
import { WritingPage } from "../features/writing/pages/WritingPage";
import { NotFoundPage } from "./NotFoundPage";

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/projects" element={<ProjectsPage />} />
      <Route path="/projects/:slug" element={<ProjectPage />} />
      <Route path="/engineering" element={<EngineeringPage />} />
      <Route path="/experiments" element={<ExperimentsPage />} />
      <Route path="/writing" element={<WritingPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
