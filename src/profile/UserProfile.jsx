import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUserContext } from '../auth/UserContext';
import ModernMaestroApi from '../api/api';

function UserProfile() {
  const { user: contextUser } = useUserContext();
  const [composerId, setComposerId] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isComposer, setIsComposer] = useState(false);
  const [composerDetailsSubmitted, setComposerDetailsSubmitted] = useState(false);
  const navigate = useNavigate();
  const [compositions, setCompositions] = useState([]);

  // Composer form state
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

          const isComposerApiStatus = user.isComposer ?? false;
          const storedIsComposer = localStorage.getItem('isComposer');
          const isComposerValue = storedIsComposer !== null ? storedIsComposer === 'true' : isComposerApiStatus;
          setIsComposer(isComposerValue);

          if (isComposerValue) {
            try {
              const composer = await ModernMaestroApi.getComposerByUserId(user.user_id);
              console.log("composerDUDE:",composer);
              if (composer) {
                setComposerId(composer.composer_id);
                // Update composerForm with fetched composer details
                setComposerForm(prevForm => ({
                  ...prevForm,
                  name: composer.name || '',
                  biography: composer.biography || '',
                  website: composer.website || '',
                  socialMediaLinks: composer.socialMediaLinks || [{ platform: '', link: '' }],
                }));
                const fetchedCompositions = await ModernMaestroApi.getCompositionsByComposerId(composer.composer_id);
                setCompositions(fetchedCompositions);
              }
            } catch (composerError) {
              console.error("Error fetching composer details:", composerError.message);
              // Handle case where composer details are not found, such as resetting the form or showing a message
            }
          }

          const storedComposerDetailsSubmitted = localStorage.getItem('composerDetailsSubmitted');
          setComposerDetailsSubmitted(storedComposerDetailsSubmitted === 'true');
        } catch (error) {
          console.error("Could not fetch user profile or compositions", error.message);
        }
      }
    };

    fetchUserProfileAndData();
  }, [contextUser]);

  const handleComposerStatusChange = async (e) => {
    const updatedIsComposer = e.target.checked;
    setIsComposer(updatedIsComposer);
    localStorage.setItem('isComposer', updatedIsComposer.toString());
  
    if (!contextUser || !contextUser.user_id) {
      console.error("User ID is undefined or incorrect");
      return;
    }
  
    try {
      if (updatedIsComposer) {
        // If checking the box, attempt to update user type to composer
        await ModernMaestroApi.updateUserType(contextUser.user_id, true);
      } else {
        // If unchecking the box, reset composer form and ID, and update user type to normal
        setComposerForm({
          name: '',
          biography: '',
          website: '',
          socialMediaLinks: [{ platform: '', link: '' }],
        });
        setComposerId(null);
        setComposerDetailsSubmitted(false);
        localStorage.setItem('composerDetailsSubmitted', 'false');
        await ModernMaestroApi.updateUserType(contextUser.user_id, false);
      }
    } catch (error) {
      console.error("Error updating user type", error);
    }
  };
  
  
  


  // Handle changes in the composer form fields
  const handleComposerFormChange = (e) => {
    const { name, value } = e.target;
    setComposerForm(prevForm => ({ ...prevForm, [name]: value }));
  };

  // Handle changes in the social media links
  const handleSocialMediaLinkChange = (index, e) => {
    const updatedLinks = [...composerForm.socialMediaLinks];
    updatedLinks[index][e.target.name] = e.target.value;
    setComposerForm({ ...composerForm, socialMediaLinks: updatedLinks });
  };

  // Add a new social media link field
  const handleAddSocialMediaLink = () => {
    setComposerForm({
      ...composerForm,
      socialMediaLinks: [...composerForm.socialMediaLinks, { platform: '', link: '' }],
    });
  };

  // Submit the composer form
  const handleSubmitComposerForm = async (e) => {
    e.preventDefault();
    if (!composerForm.name.trim()) {
      alert("Please provide a name for the composer.");
      return;
    }

    const socialMediaLinksObject = composerForm.socialMediaLinks.reduce((acc, { platform, link }) => {
      if (platform && link) acc[platform] = link;
      return acc;
    }, {});

    try {
      await ModernMaestroApi.updateComposerForUser(contextUser.user_id, {
        isComposer: true,
        composerDetails: {
          ...composerForm,
          social_media_links: socialMediaLinksObject,
        },
      });
      localStorage.setItem('composerDetailsSubmitted', 'true');
      setComposerDetailsSubmitted(true); 
    } catch (error) {
      console.error("Failed to update composer details", error);
    }
  };



  return (
    <div>
      <h1>User Profile</h1>
      {userProfile && (
        <>
          <p>Welcome, {userProfile.username}!</p>
          <div>
            <label>
              Composer:
              <input type="checkbox" checked={isComposer} onChange={handleComposerStatusChange} />
            </label>
          </div>
          {isComposer && (
            <>
              {!composerDetailsSubmitted ? (
                // Form for entering or updating composer details
                <form onSubmit={handleSubmitComposerForm}>
                  <input name="name" value={composerForm.name} onChange={handleComposerFormChange} placeholder="Name" required />
                  <textarea name="biography" value={composerForm.biography} onChange={handleComposerFormChange} placeholder="Biography" />
                  <input name="website" value={composerForm.website} onChange={handleComposerFormChange} placeholder="Website" />
                  <div>
                    <label>Social Media Links</label>
                    {composerForm.socialMediaLinks.map((link, index) => (
                      <div key={index}>
                        <input
                          name="platform"
                          value={link.platform}
                          onChange={(e) => handleSocialMediaLinkChange(index, e)}
                          placeholder="Platform name"
                        />
                        <input
                          name="link"
                          value={link.link}
                          onChange={(e) => handleSocialMediaLinkChange(index, e)}
                          placeholder="URL"
                        />
                      </div>
                    ))}
                    <button type="button" onClick={handleAddSocialMediaLink}>Add Link</button>
                  </div>
                  <button type="submit">Submit Composer Details</button>
                </form>
              ) : (
                <>
                {/* Displaying submitted composer details */}
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

                <button type="button" onClick={() => composerId ? navigate(`/composers/${composerId}/edit`) : console.error("Composer ID not found")}>Edit Your Composer Details</button>
 
              </>
            )}
          </>
        )}
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
  <div><Link to="/select-composer">Add New Composition</Link> </div>
  </div>
);
                  }
export default UserProfile;