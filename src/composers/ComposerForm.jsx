import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ComposerForm({ user_id, composerId, composerInfo }) {
  const [formData, setFormData] = useState({
    name: '',
    biography: '',
    website: '',
    socialMediaLinks: [{ platform: '', link: '' }],
  });
  const [errors, setErrors] = useState({});
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (composerInfo) {
      setFormData({
        name: composerInfo.name || '',
        biography: composerInfo.biography || '',
        website: composerInfo.website || '',
        socialMediaLinks: composerInfo.socialMediaLinks || [{ platform: '', link: '' }],
      });
    }
  }, [composerInfo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLinkChange = (index, e) => {
    const updatedLinks = [...formData.socialMediaLinks];
    updatedLinks[index][e.target.name] = e.target.value;
    setFormData(prev => ({ ...prev, socialMediaLinks: updatedLinks }));
  };

  const handleAddLink = () => {
    setFormData(prev => ({
      ...prev,
      socialMediaLinks: [...prev.socialMediaLinks, { platform: '', link: '' }],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Submission logic here...
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <form className="main-content spaced-stack" onSubmit={handleSubmit}>
      <h2 style={{ textAlign: 'center' }}>
        {composerId ? 'Edit Composer' : 'Add New Composer'}
      </h2>

      <div className="form-group">
        <label htmlFor="name">Full Name</label>
        <input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="form-control"
        />
      </div>

      <div className="form-group">
        <label htmlFor="biography">Biography</label>
        <textarea
          id="biography"
          name="biography"
          value={formData.biography}
          onChange={handleChange}
          className="form-control"
        />
      </div>

      <div className="form-group">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          value={formData.website}
          onChange={handleChange}
          className="form-control"
        />
      </div>

      <div className="form-group">
        <label>Social Media Links</label>
        {formData.socialMediaLinks.map((link, index) => (
          <div
            className="social-link-row"
            key={index}
            style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}
          >
            <input
              name="platform"
              value={link.platform}
              onChange={(e) => handleLinkChange(index, e)}
              placeholder="Platform"
              className="form-control"
            />
            <input
              name="link"
              value={link.link}
              onChange={(e) => handleLinkChange(index, e)}
              placeholder="URL"
              className="form-control"
            />
          </div>
        ))}
        <button type="button" className="button" onClick={handleAddLink}>+ Add Link</button>
      </div>

      <div className="form-group" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
  <div></div> {/* Filler to push button to the right */}
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="button" type="button" onClick={handleBack}>
            Back
          </button>
          <button className="button" type="submit">
            Save
          </button>
        </div>
      </div>

      {showSuccessMessage && (
        <div className="alert alert-success" role="alert">
          Composer saved successfully!
        </div>
      )}

      {errors.submit && <p className="error">{errors.submit}</p>}
    </form>
  );
}

export default ComposerForm;
