import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUserContext } from '../auth/UserContext';
import ModernMaestroApi from '../api/api';
import UpdateProfileForm from './UpdateProfileForm';
import ComposerForm from '../composers/ComposerForm';

function UserProfile() {
  const { user: contextUser } = useUserContext();
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
    const fetchUserProfileAndData = async () => {
      if (contextUser && contextUser.username) {
        try {
          const user = await ModernMaestroApi.getUserByUsername(contextUser.username);
          setUserProfile(user);

          const localIsComposer = localStorage.getItem('isComposer');
          const isComposerFromLocalStorage = localIsComposer === 'true';
          const isComposerApiStatus = user.isComposer ?? false;

          setIsComposer(isComposerApiStatus || isComposerFromLocalStorage);

          if (isComposerFromLocalStorage && user.user_id) {
            const composer = await ModernMaestroApi.getComposerByUserId(user.user_id);
            if (composer) {
              setComposerId(composer.composer_id);
              const socialMediaLinks = Array.isArray(composer.socialMediaLinks) ? composer.socialMediaLinks : [{ platform: '', link: '' }];
              setComposerForm({
                name: composer.name,
                biography: composer.biography,
                website: composer.website,
                socialMediaLinks,
              });
              const fetchedCompositions = await ModernMaestroApi.getCompositionsByComposerId(composer.composer_id);
              setCompositions(fetchedCompositions);
            } else {
              setComposerId(null);
              setComposerForm({ name: '', biography: '', website: '', socialMediaLinks: [{ platform: '', link: '' }] });
              setCompositions([]);
            }
          }
        } catch (error) {
          console.error("Could not fetch user profile:", error.message);
        }
      }
    };

    if (contextUser) fetchUserProfileAndData();
  }, [contextUser]);

  const updateUserProfile = async (updateData) => {
    if (!contextUser || !contextUser.user_id) return;
    try {
      await ModernMaestroApi.updateUser(contextUser.username, updateData);
    } catch (error) {
      console.error("Failed to update user profile:", error);
    }
  };

  const handleComposerStatusChange = async (e) => {
    const isComposerUpdated = e.target.value === "yes";
    localStorage.setItem('isComposer', isComposerUpdated.toString());
    setIsComposer(isComposerUpdated);

    if (isComposerUpdated) {
      try {
        const user = await ModernMaestroApi.getUserByUsername(contextUser.username);
        if (user) {
          setComposerForm(prev => ({ ...prev, name: user.username }));
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    } else {
      setComposerForm(prev => ({ ...prev, name: '' }));
    }

    const data = {
      isComposer: isComposerUpdated,
      composerDetails: isComposerUpdated ? { ...composerForm, user_id: contextUser.user_id } : null,
    };

    try {
      await ModernMaestroApi.updateComposerForUser(contextUser.user_id, data);
    } catch (error) {
      console.error("Error updating composer status:", error);
    }
  };

  const handleEditComposerDetails = () => {
    setIsEditingComposer(!isEditingComposer);
  };

  if (!contextUser) return <div>Loading user profile...</div>;

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
            <div>
              <h3>Are you a Composer:</h3>
              <div className="form-group" style={{ display: 'flex', gap: '1rem' }}>
                <label><input type="radio" value="yes" name="isComposer" checked={isComposer === true} onChange={handleComposerStatusChange} /> Yes</label>
                <label><input type="radio" value="no" name="isComposer" checked={isComposer === false} onChange={handleComposerStatusChange} /> No</label>
              </div>
            </div>
          )}

          {isComposer && (
            <>
              <button className="button" onClick={handleEditComposerDetails}>Edit Composer Details</button>
              {!isEditingComposer && composerId && (
                <div className="composer-summary">
                  <p><strong>Name:</strong> {composerForm.name || 'Not Provided'}</p>
                  <p><strong>Biography:</strong> {composerForm.biography || 'Not Provided'}</p>
                  <p><strong>Website:</strong> {composerForm.website || 'Not Provided'}</p>
                  <div>
                    <strong>Social Media Links:</strong>
                    {composerForm.socialMediaLinks.map((link, index) => (
                      <p key={index}>{link.platform}: {link.link}</p>
                    ))}
                  </div>
                </div>
              )}
              {isEditingComposer && (
                <ComposerForm composerId={composerId} user_id={contextUser.user_id} composerInfo={composerForm} />
              )}
            </>
          )}
        </div>

        <div className="composition-box">
          <h3>My Compositions</h3>
          <ul>
            {compositions.map(composition => (
              <li key={composition.composition_id}>
                <Link to={`/compositions/${composition.composition_id}`}>{composition.title}</Link>
              </li>
            ))}
          </ul>
          <div><Link className="button" to="/select-composer">Add New Composition</Link></div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
