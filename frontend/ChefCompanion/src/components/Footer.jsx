import React from 'react';
import './Footer.css'; 

function Footer() {
  return (
    <footer className="footer">
      <div className="links">
        <a href="/about" className="link">About</a>
        <a href="/contact" className="link">Contact</a>
      </div>
      <p className="copyright">© 2023 Chef Companion. All rights reserved.</p>
    </footer>
  );
}

export default Footer;