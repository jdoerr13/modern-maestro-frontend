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
  const [isComposer, setIsComposer] = useState(contextUser && contextUser.isComposer !== undefined ? contextUser.isComposer : false);
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
  
          const isComposerApiStatus = user.isComposer ?? false;
  
          // Check local storage for isComposer value
          const localIsComposer = localStorage.getItem('isComposer');
          const isComposerFromLocalStorage = localIsComposer === 'true'; // Convert string to boolean
  
          console.log("API Status:", isComposerApiStatus);
          console.log("Local Storage:", localIsComposer, isComposerFromLocalStorage);
          setIsComposer(isComposerFromLocalStorage || isComposerApiStatus);
  
          if (isComposerFromLocalStorage && user.user_id) {
            try {
              const composer = await ModernMaestroApi.getComposerByUserId(user.user_id);
              if (composer) {
                setComposerId(composer.composer_id);
                setComposerForm({
                  name: composer.name,
                  biography: composer.biography,
                  website: composer.website,
                  socialMediaLinks: composer.socialMediaLinks || [{ platform: '', link: '' }],
                });
                const fetchedCompositions = await ModernMaestroApi.getCompositionsByComposerId(composer.composer_id);
                setCompositions(fetchedCompositions);
              } else {
                // Handle case where composer details are not found
                setComposerId(null);
                setComposerForm({
                  name: '', // Reset composer name
                  biography: '', // Reset biography
                  website: '', // Reset website
                  socialMediaLinks: [{ platform: '', link: '' }], // Reset social media links
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
      // Here you might want to handle the scenario where contextUser is null
      // For example, redirect to a login page, or show a loading spinner, etc.
      console.log('No user context available.');
    }
  }, [contextUser]);
  
  
  // Add a guard clause to prevent rendering the component if contextUser is null
  if (!contextUser) {
    // Render a loading message, a redirect, or any other placeholder component
    return <div>Loading user profile...</div>;
  }

  const handleEditComposer = () => {
    setIsEditingComposer(true); // Toggle editing state to show the edit form
  };
  // Implement updateUserProfile function
  const updateUserProfile = async (updateData) => {
    if (!contextUser || !contextUser.user_id) {
      console.error("No user context or user ID available for updating profile.");
      return;
    }
    try {
      // Assuming updateUser in your API accepts the user ID and the data to be updated
      const updatedUser = await ModernMaestroApi.updateUser(contextUser.username, updateData);
      console.log("Profile updated successfully:", updatedUser);
      // Optionally, update the user context or state here if needed
    } catch (error) {
      console.error("Failed to update user profile:", error);
    }
  }; 



  const handleComposerStatusChange = async (e) => {
    const isComposerUpdated = e.target.value === "yes";
  
    // Update local storage value based on user's preference
    localStorage.setItem('isComposer', isComposerUpdated ? 'true' : 'false');
    console.log("Local Storage Value:", localStorage.getItem('isComposer'));
    // Update isComposer state
    setIsComposer(isComposerUpdated);
  
    if (isComposerUpdated) {
      // Fetch the user details
      try {
        const user = await ModernMaestroApi.getUserByUsername(contextUser.username);
        if (user) {
          // Update composerForm with the user's first name
          setComposerForm(prevForm => ({
            ...prevForm,
            name: user.firstname || 'Not Provided' // Use the user's first name as the composer's name
          }));
          setIsComposer(isComposerUpdated); // Update composer status after successfully fetching user details
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    } else {
      // If the user is not a composer, reset the composer name
      setComposerForm(prevForm => ({
        ...prevForm,
        name: '' // Reset composer name
      }));
      setIsComposer(isComposerUpdated); // Update composer status immediately
      setComposerDetailsSubmitted(true);
    }
    
    const data = {
      isComposer: isComposerUpdated, 
      composerDetails: isComposerUpdated ? { ...composerForm, user_id: contextUser.user_id } : null, // Make sure to include the user_id here
    };
  
    try {
      await ModernMaestroApi.updateComposerForUser(contextUser.user_id, data);
      console.log("Composer status and user type updated successfully.");
    } catch (error) {
      console.error("Error updating composer status and user type:", error);
    }
  };
  
  




return (
  <div>

    <h2>User Profile</h2>
    <p>Welcome, {contextUser.firstName}!</p>


    <UpdateProfileForm contextUser={contextUser} updateUserProfile={updateUserProfile} />

    {userProfile && (
      <>
       
        <div>
          <label>Are you a Composer:</label>
          <div>
            <input
              type="radio"
              value="yes"
              name="isComposer"
              checked={isComposer === true}
              onChange={handleComposerStatusChange}
            /> Yes
              <>
                <input
                  type="radio"
                  value="no"
                  name="isComposer"
                  checked={isComposer === false}
                  onChange={handleComposerStatusChange}
                /> 
                No
              </>
          </div>
        </div>
      </>
  )}
  

  {isComposer && !composerId && (
      <>
        <button onClick={() => setIsEditingComposer(true)}>Please create your composer profile</button>
      </>
    )}

    {isComposer && composerId && (
      <ComposerForm composerId={composerId} user_id={contextUser.user_id} composerInfo={"composer"} />
    )}

    {!isComposer && composerDetailsSubmitted && (
      <>
        <div>
          <p>Name: {composerForm.name || 'Not Provided'}</p>
          <p>Biography: {composerForm.biography || 'Not Provided'}</p>
          <p>Website: {composerForm.website || 'Not Provided'}</p>
          <p>Social Media Links:</p>
          {composerForm.socialMediaLinks.map((link, index) => (
            <div key={index}>
              <p>{link.platform || 'Platform Unknown'}: {link.link || 'Link Not Provided'}</p>
            </div>
          ))}
        </div>
        <button onClick={handleEditComposer}>Edit Composer Details</button>
      </>
    )}
      

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
  );
}


export default UserProfile;