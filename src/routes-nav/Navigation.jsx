import React, { useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import UserContext from '../auth/UserContext'; // Ensure this path is correct

function Navigation() {
  const { user, logout } = useContext(UserContext); 
  const navigate = useNavigate(); // Initialize useNavigate

  const handleLogout = (e) => {
    e.preventDefault();
    logout(); 
    navigate('/'); 
  };

  return (
    <nav className="Navigation navbar navbar-expand-md fixed-top"> {/* Add fixed-top class */}
      <div className="container-fluid"> {/* Use Bootstrap container */}
        <Link className="navbar-brand" to="/">Home</Link>
        <div className="navbar-nav ml-md-auto"> {/* Use ml-md-auto for medium and larger screens */}
          {user ? (
            <>
              <NavLink className="nav-item nav-link" to="/composers">Composers</NavLink>
              <NavLink className="nav-item nav-link" to="/compositions">Compositions</NavLink>
              <NavLink className="nav-item nav-link" to="/profile">Profile</NavLink>
              <a className="nav-item nav-link" href="/" onClick={handleLogout}>Log out {user.username}</a>
            </>
          ) : (
            <>
              <NavLink className="nav-item nav-link" to="/signup">Sign Up</NavLink>
              <NavLink className="nav-item nav-link" to="/login">Login</NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
