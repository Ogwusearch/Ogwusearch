import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <section className="container page-placeholder">
      <span className="page-placeholder__label">404</span>
      <h1>Page not found</h1>
      <p>The page you requested does not exist or may have moved.</p>
      <Link to="/" className="button button--primary">
        Return home
      </Link>
    </section>
  );
}
