import { ArrowRight, FlaskConical } from "lucide-react";
import { Link } from "react-router-dom";

import { experiments } from "../../data/experiments";

export function Experiments() {
  return (
    <section className="home-section">
      <div className="container">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Lab</span>
            <h2>Experiments</h2>
          </div>

          <Link
            to="/experiments"
            className="section-link"
          >
            Explore
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>

        <div className="experiment-grid">
          {experiments.slice(0, 3).map((experiment) => (
            <article
              key={experiment.slug}
              className="experiment-card"
            >
              <div className="experiment-card__icon">
                <FlaskConical
                  size={20}
                  aria-hidden="true"
                />
              </div>

              <h3>{experiment.title}</h3>

              <p>{experiment.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}