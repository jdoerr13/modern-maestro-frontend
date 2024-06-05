import React, { createContext, useContext, useState, useEffect } from 'react';
import ModernMaestroApi from '../api/api'; // Adjust the path as necessary

const UserContext = createContext();

// Define a constant for your token storage key
const TOKEN_STORAGE_ID = 'modernmaestro-token';

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUserDetails = localStorage.getItem('userDetails');
    if (storedUserDetails) {
      setUser(JSON.parse(storedUserDetails));
    }

    const decodeAndFetchUser = async () => {
      await decodeJWT();
    };
  
    // Call the async function
    decodeAndFetchUser();
  }, []);

  const decodeJWT = async () => {
    const token = localStorage.getItem(TOKEN_STORAGE_ID);
    if (!token) return;

    try {
      ModernMaestroApi.token = token; // Set token for API usage
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const decodedPayload = JSON.parse(window.atob(base64));

      if (decodedPayload && decodedPayload.username) {
        await fetchUserDetails(decodedPayload.username);
      }
    } catch (error) {
      console.error("Error decoding JWT:", error);
      setUser(null);
    }
  };


  const fetchUserDetails = async (username) => {
    try {
      const userDetails = await ModernMaestroApi.getUserByUsername(username);
      setUser({
        username: userDetails.username,
        email: userDetails.email,
        firstName: userDetails.firstName,
        lastName: userDetails.lastName,
        user_id: userDetails.user_id,
        // Avoid storing sensitive information like passwords
      });

      // Store user details in localStorage for persistence
      localStorage.setItem('userDetails', JSON.stringify({
        username: userDetails.username,
        email: userDetails.email,
        firstName: userDetails.firstName,
        lastName: userDetails.lastName,
        user_id: userDetails.user_id,
        // Exclude password or sensitive info
      }));
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const login = async (loginData) => {
    try {
      const token = await ModernMaestroApi.login(loginData);
      localStorage.setItem(TOKEN_STORAGE_ID, token);
      await decodeJWT();
    } catch (errors) {
      console.error("Login failed", errors);
      throw errors;
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_STORAGE_ID);
    localStorage.removeItem('userDetails'); // Remove user details on logout
    setUser(null);
    ModernMaestroApi.token = null;
  };

  const signup = async (signupData) => {
    try {
      const token = await ModernMaestroApi.signup(signupData);
      localStorage.setItem(TOKEN_STORAGE_ID, token);
      await decodeJWT();
    } catch (errors) {
      console.error("Signup failed", errors);
      throw errors;
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
