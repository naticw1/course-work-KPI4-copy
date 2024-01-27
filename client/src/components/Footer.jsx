import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <Link className="footer-link" to="/privacy-policy">
          Privacy Policy
        </Link>
        <Link className="footer-link" to="/digital-millennium-copyright-act">
          Digital Millennium Copyright Act
        </Link>
        <Link className="footer-link" to="/terms-of-service">
          Terms of Service
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
