import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function Contact() {
  return (
    <section className="home-section">
      <div className="container">
        <div className="contact-card">
          <div>
            <span className="eyebrow">Explore</span>

            <h2>Interested in the work?</h2>

            <p>
              Ogwusearch is where I document technical work,
              experiments, and software projects across engineering
              and technology.
            </p>
          </div>

          <Link
            to="/about"
            className="button button--secondary"
          >
            Learn more about my work
            <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
