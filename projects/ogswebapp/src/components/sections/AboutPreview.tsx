import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function AboutPreview() {
  return (
    <section className="home-section home-section--surface">
      <div className="container about-preview">
        <div>
          <span className="eyebrow">About</span>

          <h2>Building at the intersection of engineering and software.</h2>
        </div>

        <div className="about-preview__content">
          <p>
            Ogwusearch Labs documents independent work across
            engineering software, electronics, software
            development, and AI.
          </p>

          <p>
            The portfolio provides a place to explore projects,
            experiments, technical writing, and the ideas behind
            the work.
          </p>

          <Link
            to="/about"
            className="section-link"
          >
            More about the work
            <ArrowRight
              size={16}
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}