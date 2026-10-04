import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

import { Layout } from "./components/layout/Layout";
import { Home } from "./pages/Home/Home";
import { ProjectPage } from "./pages/Projects/ProjectPage";
import { Projects } from "./pages/Projects/Projects";
import { Experiments } from "./pages/Experiments/Experiments";
import { About } from "./pages/About/About";


function PlaceholderPage({
  title,
}: {
  title: string;
}) {
  return (
    <div className="container">
      <div className="page-placeholder">
        <span className="page-placeholder__label">
          Ogwusearch Labs
        </span>

        <h1>{title}</h1>

        <p>
          This section is currently under development.
        </p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/projects"
            element={<Projects />}
          />

          <Route
            path="/projects/:slug"
            element={<ProjectPage />}
          />

        <Route
  path="/experiments"
  element={<Experiments />}
/>



          <Route
            path="/writing"
            element={
              <PlaceholderPage title="Writing" />
            }
          />

          <Route
            path="/about"
            element={


              <Route path="/about" element={<About />} />
            }
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}