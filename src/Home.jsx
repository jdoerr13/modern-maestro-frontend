import React, { useContext } from "react";
import { Link } from "react-router-dom";
import UserContext from "./auth/UserContext"; // Ensure this path is correct

function Home() {
  const { user } = useContext(UserContext);

  return (
    <div className="Homepage">
      <div className="container">
      
      
        {user ? (
          <div>
            <h2>Welcome Back, {user.username}!</h2>
            <p className="lead">Explore the new world of classical music with Modern Maestro.</p>
          </div>
        ) : (
          <div>
            <h1 className="mb-4">Welcome to Modern Maestro!</h1>
            <p className="lead">Explore the new world of classical music with Modern Maestro.</p>
              <Link className="button" to="/login">Log in</Link>
              <Link className="button" to="/signup">Sign up</Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
