import { engineeringAreas } from "../../../data/engineering";

export function EngineeringPage() {
  return (
    <div className="engineering-page">
      <section className="projects-page__hero">
        <div className="container">
          <span className="eyebrow">Engineering</span>

          <h1>Engineering beyond software.</h1>

          <p>
            Exploring the design, analysis, development, and
            practical application of engineering systems.
          </p>
        </div>
      </section>

      <section className="home-section">
        <div className="container">
          <div className="section-heading section-heading--stacked">
            <span className="eyebrow">Technical Domains</span>
            <h2>Areas of engineering focus</h2>
            <p>
              These domains represent the technical areas explored
              through projects, experiments, research, and practical
              development.
            </p>
          </div>

          <div className="about-focus-grid">
            {engineeringAreas.map((area, index) => (
              <article
                key={area.title}
                className="about-focus-card"
              >
                <span className="about-focus-card__number">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <h3>{area.title}</h3>
                <p>{area.description}</p>

                <ul>
                  {area.disciplines.map((discipline) => (
                    <li key={discipline}>{discipline}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
