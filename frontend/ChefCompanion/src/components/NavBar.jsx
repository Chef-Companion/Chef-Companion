import { Link } from 'react-router-dom';
import './NavBar.css';

function NavBar() {
  // const [showDropdown, setShowDropdown] = useState(false);

  return (
    <nav className="nav">
      <ul className="centered-nav-links"> 
        <li><Link to="/">Home</Link></li>
        <li><Link to="/main">Search</Link></li>
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
                <li><Link to="/login">Logout</Link></li>
              </ul>
            </div>
          ) : null}
        </li> */}
      </ul>
    </nav>
  );
}

export default NavBar;
