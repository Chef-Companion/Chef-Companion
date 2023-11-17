import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';

// NavBar component
function NavBar() {
  // const [showDropdown, setShowDropdown] = useState(false);

  return (
    // Navigation bar container
    <nav className="nav">
      {/* Centered navigation links */}
      <ul className="centered-nav-links">
        {/* Home link */}
        <li><Link to="/">Home</Link></li>
        {/*   LOGIN FEATURE - POTENTIAL FUTURE USE
        
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
                <li><Link to="/recipes">My Recipes</Link></li>
                <li><Link to="/login" onClick={handleLogout}>Logout</Link></li>
              </ul>
            </div>
          ) : null}
        </li> */}
      </ul>
    </nav>
  );
}

export default NavBar;
