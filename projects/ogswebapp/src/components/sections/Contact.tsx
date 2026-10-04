import { Mail, ArrowUpRight } from "lucide-react";

export function Contact() {
  return (
    <section className="home-section">
      <div className="container">
        <div className="contact-card">
          <div>
            <span className="eyebrow">Contact</span>

            <h2>Have a technical idea?</h2>

            <p>
              Ogwusearch Labs is a place to document technical
              work, experiments, and software projects.
            </p>
          </div>

          <a
            href="mailto:contact@example.com"
            className="button button--secondary"
          >
            <Mail size={17} aria-hidden="true" />
            Get in touch
            <ArrowUpRight
              size={16}
              aria-hidden="true"
            />
          </a>
        </div>
      </div>
    </section>
  );
}