import {
  ArrowLeft,
  ArrowUpRight,
  FlaskConical,
} from "lucide-react";
import { Link } from "react-router-dom";

import { experiments } from "../../data/experiments";

export function Experiments() {
  return (
    <div className="experiments-page">
      <section className="experiments-page__hero">
        <div className="container">
          <Link
            to="/"
            className="experiments-page__back"
          >
            <ArrowLeft
              size={16}
              aria-hidden="true"
            />
            Back home
          </Link>

          <span className="eyebrow">
            Ogwusearch Labs / Lab
          </span>

          <h1>Experiments</h1>

          <p>
            Practical experiments across electronics,
            engineering, software architecture, simulation,
            and artificial intelligence.
          </p>
        </div>
      </section>

      <section className="home-section">
        <div className="container">
          <div className="experiments-page__heading">
            <div>
              <span className="eyebrow">
                Current work
              </span>

              <h2>Technical exploration</h2>
            </div>

            <p>
              These experiments document areas being explored
              through practical work, prototypes, calculations,
              software, and technical research.
            </p>
          </div>

          <div className="experiments-page__grid">
            {experiments.map((experiment, index) => (
              <article
                key={experiment.slug}
                className="experiments-page__card"
              >
                <div className="experiments-page__card-top">
                  <div className="experiments-page__icon">
                    <FlaskConical
                      size={21}
                      aria-hidden="true"
                    />
                  </div>

                  <span className="experiments-page__number">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <div className="experiments-page__card-content">
                  <div className="experiments-page__meta">
                    <span>
                      {experiment.category}
                    </span>

                    <span>
                      {experiment.status}
                    </span>
                  </div>

                  <h3>{experiment.title}</h3>

                  <p>
                    {experiment.description}
                  </p>
                </div>

                <div className="experiments-page__card-footer">
                  <div className="experiments-page__technologies">
                    {experiment.technologies.map(
                      (technology) => (
                        <span key={technology}>
                          {technology}
                        </span>
                      ),
                    )}
                  </div>

                  <span
                    className="experiments-page__arrow"
                    aria-hidden="true"
                  >
                    <ArrowUpRight size={18} />
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section home-section--surface">
        <div className="container experiments-page__footer">
          <div>
            <span className="eyebrow">
              More work
            </span>

            <h2>Explore the projects</h2>

            <p>
              Experiments often grow into larger projects.
              Explore the software and engineering work behind
              the lab.
            </p>
          </div>

          <Link
            to="/projects"
            className="button button--secondary"
          >
            View projects
            <ArrowUpRight
              size={17}
              aria-hidden="true"
            />
          </Link>
        </div>
      </section>
    </div>
  );
}