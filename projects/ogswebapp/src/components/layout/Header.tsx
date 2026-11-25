import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

import { Navigation } from "./Navigation";
import { profile } from "../../data/profile";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobileMenu = () => {
    setMobileOpen(false);
  };

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link
          to="/"
          className="site-brand"
          aria-label={`${profile.brand} home`}
          onClick={closeMobileMenu}
        >
          <span className="site-brand__emblem" aria-hidden="true">
            <svg viewBox="0 0 220 112" role="presentation">
              <defs>
                <path
                  id="ogwusearch-header-arc"
                  d="M 42 72 A 68 68 0 0 1 178 72"
                />
              </defs>

              <text className="site-brand__arc-text">
                <textPath
                  href="#ogwusearch-header-arc"
                  startOffset="50%"
                  textAnchor="middle"
                >
                  {profile.brand}
                </textPath>
              </text>

              <circle
                className="site-brand__glow"
                cx="110"
                cy="80"
                r="31"
              />

              <g className="site-brand__rotating-mark">
                <circle
                  className="site-brand__mark"
                  cx="110"
                  cy="80"
                  r="23"
                />
                <text
                  className="site-brand__letter"
                  x="110"
                  y="89"
                >
                  O
                </text>
              </g>

              <circle
                className="site-brand__accent"
                cx="139"
                cy="99"
                r="4"
              />
            </svg>
          </span>
        </Link>

        <div className="site-header__desktop-nav">
          <Navigation />
        </div>

        <button
          type="button"
          className="menu-button"
          aria-label={
            mobileOpen
              ? "Close navigation menu"
              : "Open navigation menu"
          }
          aria-expanded={mobileOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMobileOpen((current) => !current)}
        >
          {mobileOpen ? (
            <X size={22} aria-hidden="true" />
          ) : (
            <Menu size={22} aria-hidden="true" />
          )}
        </button>
      </div>

      {mobileOpen && (
        <div
          id="mobile-navigation"
          className="site-header__mobile-nav"
        >
          <div className="container">
            <Navigation
              mobile
              onNavigate={closeMobileMenu}
            />
          </div>
        </div>
      )}
    </header>
  );
}
