import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';

// NavBar component
function NavBar() {
  // State to manage the visibility of the dropdown
  // (Note: Dropdown section and related state removed)

  return (
    // Navigation bar container
    <nav className="nav">
      {/* Centered navigation links */}
      <ul className="centered-nav-links">
        {/* Home link */}
        <li><Link to="/">Home</Link></li>
        {/* Additional navigation links can be added here */}
      </ul>
    </nav>
  );
}

export default NavBar;
