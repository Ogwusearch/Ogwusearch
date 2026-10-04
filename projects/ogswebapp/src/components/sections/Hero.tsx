import { ArrowDown, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function Hero() {
  return (
    <section className="home-hero">
      <div className="container home-hero__inner">
        <div className="home-hero__content">
          <span className="eyebrow">
            Ogwusearch Labs
          </span>

          <h1>
            Engineering Software
            <br />
            <span>Electronics • AI</span>
          </h1>

          <p className="home-hero__description">
            A technical portfolio documenting software,
            engineering, electronics, experiments, and
            ongoing technical work.
          </p>

          <div className="home-hero__actions">
            <Link
              to="/projects"
              className="button button--primary"
            >
              Explore projects
              <ArrowRight size={17} aria-hidden="true" />
            </Link>

            <a
              href="#featured-projects"
              className="button button--secondary"
            >
              View work
              <ArrowDown size={17} aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="home-hero__meta" aria-label="Portfolio focus">
          <div className="hero-meta-item">
            <span>01</span>
            <p>Engineering Software</p>
          </div>

          <div className="hero-meta-item">
            <span>02</span>
            <p>Electronics</p>
          </div>

          <div className="hero-meta-item">
            <span>03</span>
            <p>Artificial Intelligence</p>
          </div>
        </div>
      </div>
    </section>
  );
}