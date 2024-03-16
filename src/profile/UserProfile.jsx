import React, { useEffect, useState } from 'react';
import { useUserContext } from '../auth/UserContext'; // Adjust the import path as necessary
import ModernMaestroApi from '../api/api'; // Adjust the path as necessary

function UserProfile() {
  const { user: contextUser, logout } = useUserContext();
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Ensure that `contextUser` includes `username`
        const username = contextUser?.username; // Assuming `contextUser` has a `username` property
        if (!username) throw new Error("Username is undefined");
        
        const user = await ModernMaestroApi.getCurrentUser(username);
        setUserProfile(user);
      } catch (error) {
        console.error("Could not fetch user profile", error.message);
      }
    };
  
    fetchUserProfile();
  }, [contextUser]); // Depend on `contextUser` to re-fetch when it changes

  return (
    <div>
      <h1>User Profile</h1>
      {userProfile && <p>Welcome, {userProfile.username}!</p>}
      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default UserProfile;
