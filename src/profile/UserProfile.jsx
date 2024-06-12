import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUserContext } from '../auth/UserContext';
import ModernMaestroApi from '../api/api';
import UpdateProfileForm from './UpdateProfileForm'; 
import ComposerForm from '../composers/ComposerForm'; 


function UserProfile() {
  const { user: contextUser } = useUserContext();
  console.log("contextUserUser p:", contextUser);
  const [composerId, setComposerId] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isComposer, setIsComposer] = useState(false);
  const [isEditingComposer, setIsEditingComposer] = useState(false);

  const [composerDetailsSubmitted, setComposerDetailsSubmitted] = useState(false);
  const navigate = useNavigate();
  const [compositions, setCompositions] = useState([]); 
  const [composerForm, setComposerForm] = useState({
    name: '',
    biography: '',
    website: '',
    socialMediaLinks: [{ platform: '', link: '' }],
  });

  useEffect(() => {
    setIsComposer(false); // Set isComposer to false when the component mounts
  }, []);

  useEffect(() => {
    const fetchUserProfileAndData = async () => {
      if (contextUser && contextUser.username) {
        try {
          const user = await ModernMaestroApi.getUserByUsername(contextUser.username);
          setUserProfile(user);
  
          // Check local storage for isComposer value
          const localIsComposer = localStorage.getItem('isComposer');
          const isComposerFromLocalStorage = localIsComposer === 'true'; 
          const isComposerApiStatus = user.isComposer ?? false;
  
          console.log("API Status:", isComposerApiStatus);
          console.log("Local Storage:", localIsComposer, isComposerFromLocalStorage);
          setIsComposer(isComposerApiStatus || isComposerFromLocalStorage);
  
          if (isComposerFromLocalStorage && user.user_id) {
            try {
              const composer = await ModernMaestroApi.getComposerByUserId(user.user_id);
              if (composer) {
                setComposerId(composer.composer_id);
                // Check if composer.socialMediaLinks exists and is an array
                const socialMediaLinks = composer.socialMediaLinks && Array.isArray(composer.socialMediaLinks)
                  ? composer.socialMediaLinks
                  : [{ platform: '', link: '' }]; // Default to an empty array if composer.socialMediaLinks is not valid
                setComposerForm({
                  name: composer.name,
                  biography: composer.biography,
                  website: composer.website,
                  socialMediaLinks: socialMediaLinks,
                });
                const fetchedCompositions = await ModernMaestroApi.getCompositionsByComposerId(composer.composer_id);
                setCompositions(fetchedCompositions);
              } else {
                // Handle case where composer details are not found
                setComposerId(null);
                setComposerForm({
                  name: '', // Reset composer name
                  biography: '', 
                  website: '', 
                  socialMediaLinks: [{ platform: '', link: '' }], 
                });
                setCompositions([]); // Reset compositions
              }
            } catch (error) {
              console.error("Error fetching composer details:", error);
            }
          }
        } catch (error) {
          console.error("Could not fetch user profile:", error.message);
        }
      }
    };
  
    if (contextUser) {
      fetchUserProfileAndData();
    } else {
      console.log('No user context available.');
    }
  }, [contextUser]);
  
  // guard clause to prevent rendering the component if contextUser is null
  if (!contextUser) {
    return <div>Loading user profile...</div>;
  }

  const handleEditComposer = () => {
    setIsEditingComposer(true); // Toggle editing state to show the edit form
  };
  const updateUserProfile = async (updateData) => {
    if (!contextUser || !contextUser.user_id) {
      console.error("No user context or user ID available for updating profile.");
      return;
    }
    try {
      // Assuming updateUser in your API accepts the user ID and the data to be updated
      const updatedUser = await ModernMaestroApi.updateUser(contextUser.username, updateData);
      console.log("Profile updated successfully:", updatedUser);
    } catch (error) {
      console.error("Failed to update user profile:", error);
    }
  }; 

console.log("composerFORMMMMMM info:", composerForm)

const handleComposerStatusChange = async (e) => {
  const isComposerUpdated = e.target.value === "yes";
  console.log("Radio change to:", isComposerUpdated); 
  // Update local storage value based on user's preference
  localStorage.setItem('isComposer', isComposerUpdated ? 'true' : 'false');
  
  // Update isComposer state
  setIsComposer(isComposerUpdated);

  if (isComposerUpdated) {
    // Fetch the user details
    try {
      const user = await ModernMaestroApi.getUserByUsername(contextUser.username);
      if (user) {
        // Update composerForm with the user's username when user data is successfully fetched
        setComposerForm(prevForm => ({
          ...prevForm,
          name: user.username  //  updates the composer name to the user's username
        }));
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  } else {
    // If the user is not a composer, reset the composer name
    setComposerForm(prevForm => ({
      ...prevForm,
      name: '' 
    }));
  }

  // Update the composer details on the backend
  const data = {
    isComposer: isComposerUpdated,
    composerDetails: isComposerUpdated ? { ...composerForm, user_id: contextUser.user_id } : null,
  };

  try {
    await ModernMaestroApi.updateComposerForUser(contextUser.user_id, data);
    console.log("Composer status and user type updated successfully.");
  } catch (error) {
    console.error("Error updating composer status and user type:", error);
  }
};
  

  const handleEditComposerDetails = () => {
    setIsEditingComposer(!isEditingComposer);
  };

  return (
    <div className="user-profile-container">
    <div className="top-header">
      <h2>User Profile</h2>
      <p>Welcome, {contextUser.firstName}!</p>
    </div>

    <div className="boxes-container">
        <div className="profile-box">
        <UpdateProfileForm contextUser={contextUser} updateUserProfile={updateUserProfile} />
      </div>
  


      <div className="composer-box">
      {userProfile && (
          <>
            <div>
              <h3>Are you a Composer:</h3>
              <div>
                <input type="radio" value="yes" name="isComposer" checked={isComposer === true} onChange={handleComposerStatusChange} /> Yes
                <input type="radio" value="no" name="isComposer" checked={isComposer === false} onChange={handleComposerStatusChange} /> No
              </div>
            </div>
          </>
        )}
        {isComposer && (
          <>
             <button onClick={handleEditComposerDetails}>Edit Composer Details</button>
            {composerId && !isEditingComposer && (
              <>
                <div><p>Name: {composerForm.name || 'Not Provided'}</p></div>
                <div><p>Biography: {composerForm.biography || 'Not Provided'}</p></div>
                <div><p>Website: {composerForm.website || 'Not Provided'}</p></div>
                <div>
                  <p>Social Media Links:</p>
                  {composerForm.socialMediaLinks.map((link, index) => 
                    <div key={index}><p>{link.platform}: {link.link} </p></div>
                  )}
                </div>
             
              </>
            )}
  
            {isComposer && isEditingComposer && (
              <ComposerForm composerId={composerId} user_id={contextUser.user_id} composerInfo={composerForm} />
            )}
  
            {/* {isComposer && !composerId && (
              <button onClick={() => setIsEditingComposer(true)}>Please create your composer profile</button>
            )} */}
          </>
        )}
         </div>
      
       <div className="composition-box">
        <h3>My Compositions:</h3>
        <ul>
          {compositions.map(composition => (
            <li key={composition.composition_id}>
              <Link to={`/compositions/${composition.composition_id}`}>{composition.title}</Link>
            </li>
          ))}
        </ul>
        <div><Link to="/select-composer">Add New Composition</Link></div>
      </div>
    </div>
   </div>
  );
  
}

export default UserProfile;