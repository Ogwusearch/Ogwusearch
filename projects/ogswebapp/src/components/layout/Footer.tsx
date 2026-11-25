import { profile } from "../../data/profile";
import { Link } from "react-router-dom";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <div>
          <Link
            to="/"
            className="site-footer__brand"
            aria-label={`${profile.brand} home`}
          >
            <span className="site-footer__emblem" aria-hidden="true">
              <svg viewBox="0 0 220 112" role="presentation">
                <defs>
                  <path
                    id="ogwusearch-footer-arc"
                    d="M 42 72 A 68 68 0 0 1 178 72"
                  />
                </defs>

                <text className="site-footer__arc-text">
                  <textPath
                    href="#ogwusearch-footer-arc"
                    startOffset="50%"
                    textAnchor="middle"
                  >
                    {profile.brand}
                  </textPath>
                </text>

                <circle
                  className="site-footer__glow"
                  cx="110"
                  cy="80"
                  r="31"
                />

                <g className="site-footer__rotating-mark">
                  <circle
                    className="site-footer__mark"
                    cx="110"
                    cy="80"
                    r="23"
                  />
                  <text
                    className="site-footer__letter"
                    x="110"
                    y="89"
                  >
                    O
                  </text>
                </g>

                <circle
                  className="site-footer__accent"
                  cx="139"
                  cy="99"
                  r="4"
                />
              </svg>
            </span>
          </Link>

          <p className="site-footer__tagline">
            {profile.positioning}
          </p>
        </div>

        <p className="site-footer__copyright">
          © {year} {profile.name} · {profile.brand}
        </p>
      </div>
    </footer>
  );
}
