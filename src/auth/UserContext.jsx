import React, { createContext, useState, useEffect } from 'react';
import ModernMaestroApi from '../api/api'; // Adjust the path as necessary

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    decodeJWT();
  }, []);

  const decodeJWT = () => {
    const token = localStorage.getItem('modernmaestro-token');
    if (!token) return;

    try {
      ModernMaestroApi.token = token; // Set token for API usage
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const decodedPayload = JSON.parse(window.atob(base64));

      if (decodedPayload && decodedPayload.username) {
        setUser({ username: decodedPayload.username });
      }
    } catch (error) {
      console.error("Error decoding JWT:", error);
      setUser(null);
    }
  };

  const login = async (loginData) => {
    try {
      const token = await ModernMaestroApi.login(loginData);
      localStorage.setItem('modernmaestro-token', token);
      decodeJWT();
    } catch (errors) {
      console.error("Login failed", errors);
    }
  };

  const logout = () => {
    localStorage.removeItem('modernmaestro-token');
    setUser(null);
    ModernMaestroApi.token = null; // Clear token for API
  };

  const signup = async (signupData) => {
    try {
      const token = await ModernMaestroApi.signup(signupData);
      localStorage.setItem('modernmaestro-token', token);
      decodeJWT();
    } catch (errors) {
      console.error("Signup failed", errors);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, login, logout, signup }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
