import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ModernMaestroApi from '../api/api';

const ComposerForm = () => {
  const navigate = useNavigate();
  const { composerId } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    biography: '',
    website: '',
    socialMediaLinks: [{ platform: '', link: '' }], // Initialize with one empty field
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchComposer = async () => {
      if (composerId) {
        const composer = await ModernMaestroApi.getComposerById(composerId);
        const socialMediaLinks = Object.entries(composer.social_media_links || {}).map(([platform, link]) => ({ platform, link }));
        setFormData({ ...composer, socialMediaLinks: socialMediaLinks.length > 0 ? socialMediaLinks : [{ platform: '', link: '' }] });
      }
    };
    if (composerId) fetchComposer();
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
    // Convert socialMediaLinks array back to object for submission
    const socialMediaLinksObject = formData.socialMediaLinks.reduce((acc, { platform, link }) => {
      if (platform && link) acc[platform] = link;
      return acc;
    }, {});

    const submitData = { ...formData, social_media_links: socialMediaLinksObject };

    try {
      if (composerId) {
        await ModernMaestroApi.updateComposer(composerId, submitData);
      } else {
        await ModernMaestroApi.createComposer(submitData);
      }
      navigate("/composers");
    } catch (error) {
      console.error("Saving composer failed", error);
      setErrors({ submit: error.message || "Error saving composer" });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Composer Info</h3>
      <div>
        <label htmlFor="name">Name</label>
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
    </form>
  );
};

export default ComposerForm;
