import React, { useState, useEffect } from 'react';

function UpdateProfileForm({ contextUser, updateUserProfile }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    password: '',
  });

  const [editing, setEditing] = useState({
    email: false,
    firstName: false,
    lastName: false,
    password: false,
  });

  useEffect(() => {
    if (contextUser) {
      setFormData({
        username: contextUser.username || '',
        email: contextUser.email || '',
        firstName: contextUser.firstName || '',
        lastName: contextUser.lastName || '',
        password: '',
      });
    }
  }, [contextUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleEdit = (field) => {
    setEditing(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleUpdate = async (field) => {
    if (field === 'username' || (field === 'password' && formData[field].trim() === '')) return;
    try {
      await updateUserProfile({ [field]: formData[field] });
      toggleEdit(field);
    } catch (error) {
      console.error(`Failed to update ${field}:`, error.message);
    }
  };

  return (
    <form className="spaced-stack" onSubmit={(e) => e.preventDefault()}>
      <h2>Update Profile</h2>
      {Object.keys(formData).map((field) => (
        <div key={field} className="form-row">
          <label><strong>{field.charAt(0).toUpperCase() + field.slice(1)}:</strong></label>
          {editing[field] ? (
            <>
              <input
                type={field === 'password' ? 'password' : 'text'}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className="form-input"
                autoFocus
              />
              <div className="form-actions">
                <button className="button" type="button" onClick={() => handleUpdate(field)}>Save</button>
                <button className="button" type="button" onClick={() => toggleEdit(field)}>Cancel</button>
              </div>
            </>
          ) : (
            <div className="form-display">
              <span>{field === 'password' ? '••••••' : formData[field]}</span>
              {field !== 'username' && (
                <button className="button" type="button" onClick={() => toggleEdit(field)}>Edit</button>
              )}
            </div>
          )}
        </div>
      ))}
    </form>
  );
}

export default UpdateProfileForm;