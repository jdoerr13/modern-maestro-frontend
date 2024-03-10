import React from "react";
import { Routes, Route } from "react-router-dom"; // Import Routes
import Home from "../Home";
import LoginForm from "../auth/LoginForm";
import SignupForm from "../auth/SignupForm";

function CustomRoutes({ login, signup }) { // Renamed to avoid conflict
  return (
    <Routes> {/* Use the Routes component to wrap Route components */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginForm login={login} />} />
      <Route path="/signup" element={<SignupForm signup={signup} />} />
    </Routes>
  );
}

export default CustomRoutes;