import React, { createContext, useContext, useState, useEffect } from 'react';
import ModernMaestroApi from '../api/api'; // Adjust the path as necessary

const UserContext = createContext();

// Define a constant for your token storage key
const TOKEN_STORAGE_ID = 'modernmaestro-token';

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    decodeJWT();
  }, []);

  const decodeJWT = () => {
    const token = localStorage.getItem(TOKEN_STORAGE_ID);
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

  // You might define fetchUserDetails here or directly within decodeJWT
  // This function would be responsible for making an API call to the backend
  const fetchUserDetails = async (username) => {
    try {
      const userDetails = await ModernMaestroApi.getUserByUsername(username);
      setUser(userDetails); // Assuming this API call returns full user details
    } catch (error) {
      console.error("Error fetching user details:", error);
      // Handle error, possibly by logging out the user if the token is invalid
    }
  };

  const login = async (loginData) => {
    try {
      const token = await ModernMaestroApi.login(loginData);
      localStorage.setItem(TOKEN_STORAGE_ID, token);
      decodeJWT();
    } catch (errors) {
      console.error("Login failed", errors);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    ModernMaestroApi.token = null; // Clear token for API
  };

  const signup = async (signupData) => {
    try {
      const token = await ModernMaestroApi.signup(signupData);
      localStorage.setItem(TOKEN_STORAGE_ID, token);
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

// Custom hook to use the UserContext
export const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};

export default UserContext;
