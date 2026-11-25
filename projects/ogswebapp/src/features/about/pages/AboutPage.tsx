import { profile } from "../../../data/profile";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

const focusAreas = [
  {
    number: "01",
    title: "Engineering Software",
    description:
      "Building software for engineering calculations, analysis, system design, validation, and technical workflows.",
  },
  {
    number: "02",
    title: "Electronics",
    description:
      "Exploring circuits, power electronics, simulation, components, measurements, and practical hardware development.",
  },
  {
    number: "03",
    title: "Energy Systems",
    description:
      "Exploring solar energy systems, load analysis, system sizing, battery storage, power conversion, and practical energy engineering.",
  },
  {
    number: "04",
    title: "Software Architecture",
    description:
      "Designing structured applications with clear boundaries, reusable components, validation, testing, and maintainable code.",
  },
  {
    number: "05",
    title: "Artificial Intelligence",
    description:
      "Exploring AI and AI-assisted workflows as tools for software development, engineering, research, and experimentation.",
  },
];

const principles = [
  "Build things that are useful.",
  "Understand the system before optimizing it.",
  "Keep engineering decisions traceable.",
  "Prefer clear architecture over unnecessary complexity.",
  "Learn through practical experimentation.",
];

export function AboutPage() {
  return (
    <div className="about-page">
      <section className="about-page__hero">
        <div className="container about-page__hero-layout">
          <div className="about-page__portrait">
            <img
              src="/images/profile/ogwusearch-profile-portrait.jpg"
              alt="Portrait of Okpe Emmanuel Ogwu"
              width="499"
              height="749"
              fetchPriority="high"
            />
          </div>

          <div className="about-page__hero-content">
            <span className="eyebrow">About</span>

            <h1>{profile.name}</h1>

            <p className="about-page__headline">
              {profile.headline}
            </p>

            <p className="about-page__lead">
              {profile.positioning}. {profile.summary}
              {" "}This portfolio documents the work and exploration
              carried out under {profile.brand}.
            </p>
          </div>
        </div>
      </section>

      <section className="home-section home-section--surface">
        <div className="container about-page__intro">
          <div>
            <span className="eyebrow">The Work</span>

            <h2>
              Software is a tool for understanding and building
              real systems.
            </h2>
          </div>

          <div className="about-page__copy">
            <p>
              The work documented here sits across several
              technical disciplines rather than a single software
              category.
            </p>

            <p>
              Some projects are software products. Others are
              engineering tools, electronics experiments,
              simulations, architectural studies, or explorations
              of new technologies.
            </p>

            <p>
              The common thread is practical problem solving:
              understanding a problem, modelling it, building a
              system, testing assumptions, and improving the result.
            </p>
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="container">
          <div className="section-heading section-heading--stacked">
            <span className="eyebrow">Focus Areas</span>

            <h2>Areas of focus</h2>

            <p>
              The work currently spans engineering software,
              electronics, energy systems, software architecture,
              and artificial intelligence.
            </p>
          </div>

          <div className="about-focus-grid">
            {focusAreas.map((area) => (
              <article
                key={area.number}
                className="about-focus-card"
              >
                <span className="about-focus-card__number">
                  {area.number}
                </span>

                <h3>{area.title}</h3>

                <p>{area.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section home-section--surface">
        <div className="container about-page__principles">
          <div>
            <span className="eyebrow">Approach</span>

            <h2>How the work is approached.</h2>
          </div>

          <ol className="about-principles">
            {principles.map((principle, index) => (
              <li key={principle}>
                <span>
                  {String(index + 1).padStart(2, "0")}
                </span>

                <p>{principle}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="home-section">
        <div className="container">
          <div className="about-page__closing">
            <span className="eyebrow">Explore the Work</span>

            <h2>
              The portfolio is only part of the story.
            </h2>

            <p>
              Projects show what is being built. Experiments show
              what is being investigated. Writing will document
              the ideas, decisions, and lessons behind the work.
            </p>

            <div className="about-page__actions">
              <Link
                to="/projects"
                className="button button--primary"
              >
                Explore projects
                <ArrowRight size={17} aria-hidden="true" />
              </Link>

              <Link
                to="/experiments"
                className="button button--secondary"
              >
                View experiments
                <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}