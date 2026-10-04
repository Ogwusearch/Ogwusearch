import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

import { Navigation } from "./Navigation";

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
          aria-label="Ogwusearch Labs home"
          onClick={closeMobileMenu}
        >
          <span className="site-brand__mark">O</span>

          <span className="site-brand__text">
            Ogwusearch Labs
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
