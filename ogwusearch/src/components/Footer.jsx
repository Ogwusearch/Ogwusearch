// src/components/Footer.jsx
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-links">
        <Link to="/">Home</Link>
        <Link to="/projects">Projects</Link>
        <Link to="/blog">Blog</Link>
        <Link to="/contact">Contact</Link>
      </div>
      <p className="footer-text">
        © {new Date().getFullYear()} Ogwusearch. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
