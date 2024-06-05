import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ModernMaestroApi from '../api/api';

const ComposerForm = ({ user_id, composerId, composerInfo }) => {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  console.log(composerInfo);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    biography: '',
    website: '',
    socialMediaLinks: [{ platform: '', link: '' }],
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (composerInfo) {
      setFormData({
        name: composerInfo.name || '',
        biography: composerInfo.biography || '',
        website: composerInfo.website || '',
        socialMediaLinks: composerInfo.social_media_links
          ? Object.entries(composerInfo.social_media_links).map(([platform, link]) => ({ platform, link }))
          : [{ platform: '', link: '' }],
      });
    }
  }, [composerInfo]);

  useEffect(() => {
    const fetchComposer = async () => {
      if (composerId) {
        try {
          const composer = await ModernMaestroApi.getComposerById(composerId);
          const socialMediaLinks = Object.entries(composer.social_media_links || {}).map(([platform, link]) => ({ platform, link }));
          setFormData({
            name: composer.name || '',
            biography: composer.biography || '',
            website: composer.website || '',
            socialMediaLinks: socialMediaLinks.length > 0 ? socialMediaLinks : [{ platform: '', link: '' }]
          });
        } catch (error) {
          console.error('Error fetching composer:', error);
        }
      }
    };
    fetchComposer();
  }, [composerId]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLinkChange = (index, event) => {
    const updatedLinks = [...formData.socialMediaLinks];
    updatedLinks[index][event.target.name] = event.target.value;
    setFormData({ ...formData, socialMediaLinks: updatedLinks });
  };

  const handleAddLink = () => {
    setFormData({
      ...formData,
      socialMediaLinks: [...formData.socialMediaLinks, { platform: '', link: '' }],
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
      // Constructing the correct URL based on whether composerId exists
      const apiUrl = composerId ? `${composerId}` : '';
      
      // Constructing socialMediaLinks as an object from the array
      const socialMediaLinksObject = formData.socialMediaLinks.reduce((acc, { platform, link }) => {
        if (platform && link) acc[platform] = link;
        return acc;
      }, {});
      
      console.log("NAME:", formData.name);
      // Preparing the data to update or create the composer's details
      const submitData = {
        name: formData.name,
        biography: formData.biography,
        website: formData.website,
        social_media_links: socialMediaLinksObject,
        user_id: user_id // Ensure you are passing user_id correctly
      };
  
      if (composerId) {
        // Update existing composer profile
        console.log("Updating composer with ID:", composerId, "Data:", submitData);
        const response = await ModernMaestroApi.updateComposer(apiUrl, submitData);
        console.log("Composer updated successfully:", response);
         // Show success message
         setShowSuccessMessage(true);
         setTimeout(() => {
          setShowSuccessMessage(false);
        }, 3000); // 3000 milliseconds (3 seconds) in this example
        navigate(`/composers`); // Redirect after successful update

      } else {
        // Create a new composer profile
        console.log("Creating a new composer with data:", submitData);
        const response = await ModernMaestroApi.createComposer(apiUrl, submitData);
        console.log("New composer created successfully:", response);
        navigate(`/composers`); // Redirect after successful creation
      }

            // Show success message
            setShowSuccessMessage(true);

            // After some time, hide the success message
            setTimeout(() => {
              setShowSuccessMessage(false);
            }, 3000); // 3000 milliseconds (3 seconds) in this example
    } catch (error) {
      console.error("Failed to save composer:", error);
      const errorMessage = error.response?.data?.error || error.message || "Error saving composer";
      setErrors({ submit: errorMessage });
    }
  };
  
  
  return (
    <form onSubmit={handleSubmit}>
      <h3>Composer Info:</h3>
      {/* Form fields */}
      <div>
        <label htmlFor="name">Full Name</label>
        <input id="name" name="name" value={formData.name} onChange={handleChange} required />
      </div>
      <div>
        <label htmlFor="biography">Biography</label>
        <textarea id="biography" name="biography" value={formData.biography} onChange={handleChange} />
      </div>
      <div>
        <label htmlFor="website">Website</label>
        <input id="website" name="website" value={formData.website} onChange={handleChange} />
      </div>
      <div>
        <label>Social Media Links</label>
        {formData.socialMediaLinks.map((link, index) => (
          <div key={index}>
            <input
              name="platform"
              value={link.platform}
              onChange={(e) => handleLinkChange(index, e)}
              placeholder="Platform name"
            />
            <input
              name="link"
              value={link.link}
              onChange={(e) => handleLinkChange(index, e)}
              placeholder="URL"
            />
          </div>
        ))}
        <button type="button" onClick={handleAddLink}>Add Link</button>
      </div>
      <button type="submit">Save</button>
      {/* Success message */}
      {showSuccessMessage && (
        <div className="alert alert-success" role="alert">
          Composer updated successfully!
        </div>
      )}
    </form>
  );
};

export default ComposerForm;