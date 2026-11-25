import { profile } from "../../../data/profile";
import { ArrowDown, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function Hero() {
  return (
    <section className="home-hero">
      <div className="container home-hero__inner">
        <div className="home-hero__content">
          <span className="eyebrow">
            {profile.name} · {profile.brand}
          </span>

          <h1>
            {profile.headline}
          </h1>

          <p className="home-hero__description">
            {profile.positioning}. {profile.summary}
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