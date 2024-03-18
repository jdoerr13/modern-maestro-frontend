import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../auth/UserContext'; 
import ModernMaestroApi from '../api/api';

function UserProfile() {
  const { user: contextUser, logout } = useUserContext();
  const [userProfile, setUserProfile] = useState(null);
  const [userCompositions, setUserCompositions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfileAndData = async () => {
      try {
        // Ensure contextUser contains the username
        if (contextUser && contextUser.username) {
          const user = await ModernMaestroApi.getUserByUsername(contextUser.username);
          console.log(user);
          setUserProfile(user);

          // Check if user is a composer and fetch compositions if they are
          if (user.isComposer) {
            const compositions = await ModernMaestroApi.getCompositionsByComposerId(user.composerId);
            setUserCompositions(compositions);
          }
        }
      } catch (error) {
        console.error("Could not fetch user profile or compositions", error.message);
        // Consider handling user not found or authorization errors
      }
    };

    fetchUserProfileAndData();
  }, [contextUser]); // Dependency on contextUser to refetch if it changes

  const handleUpdateProfile = () => {
    navigate('/profile/edit'); // Adjust based on your routing for profile update
  };

  return (
    <div>
      <h1>User Profile</h1>
      {userProfile && (
        <>
          <p>Welcome, {userProfile.username}!</p>
          {userCompositions.length > 0 && (
            <>
              <h2>My Compositions</h2>
              <ul>
                {userCompositions.map(comp => (
                  <li key={comp.composition_id}>{comp.title}</li>
                ))}
              </ul>
            </>
          )}
          <button onClick={handleUpdateProfile}>Update Profile</button>
          <button onClick={logout}>Logout</button>
        </>
      )}
    </div>
  );
}

export default UserProfile;
