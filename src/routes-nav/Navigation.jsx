import React, { useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import UserContext from '../auth/UserContext'; // Ensure this path is correct

function Navigation() {
  const { user, logout } = useContext(UserContext); // Using the updated context

  return (
    <nav className="Navigation navbar navbar-expand-md">
      {user && <Link className="navbar-brand" to="/">Home</Link>} {/* Conditionally render Home link */}
      <ul className="navbar-nav ml-auto">
        {user ? (
          <>
            <li className="nav-item mr-4"><NavLink className="nav-link" to="/composers">Composers</NavLink></li>
            <li className="nav-item mr-4"><NavLink className="nav-link" to="/compositions">Compositions</NavLink></li>
            <li className="nav-item mr-4"><NavLink className="nav-link" to="/profile">Profile</NavLink></li>
            <li className="nav-item"><a className="nav-link" href="/" onClick={(e) => { e.preventDefault(); logout(); }}>Log out {user.username}</a></li>
          </>
        ) : (
          <>
            <li className="nav-item mr-4"><NavLink className="nav-link" to="/login">Login</NavLink></li>
            <li className="nav-item mr-4"><NavLink className="nav-link" to="/signup">Sign Up</NavLink></li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navigation;