import { Link } from "react-router-dom";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <div>
          <Link to="/" className="site-footer__brand">
            Ogwusearch Labs
          </Link>

          <p className="site-footer__tagline">
            Engineering Software • Electronics • AI
          </p>
        </div>

        <p className="site-footer__copyright">
          © {year} Ogwusearch Labs
        </p>
      </div>
    </footer>
  );
}
