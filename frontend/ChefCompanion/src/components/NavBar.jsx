import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';

function NavBar() {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <nav className="nav">
      <ul className="centered-nav-links"> 
        <li><Link to="/">Home</Link></li>
        <li><Link to="/login">Login</Link></li>
        <li
          onClick={() => {
            setShowDropdown(!showDropdown);
          }}
        >
          {showDropdown ? (
            <div className="dropdownDiv">
              <ul className="dropdownUl">
                <li><Link to="/profile">Profile</Link></li>
                <li><Link to="/my-sessions">My Recipes</Link></li>
                <li><Link to="/login" onClick={handleLogout}>Logout</Link></li>
              </ul>
            </div>
          ) : null}
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;
