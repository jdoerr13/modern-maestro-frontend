import React, { useState, useEffect } from 'react';


function UpdateProfileForm({ contextUser, updateUserProfile }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    password: '', // Keep password management as is
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
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleEdit = (field) => {
    setEditing(prev => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleUpdate = async (field) => {
    // Prevent update if the field is 'username' or password field is empty
    if (field === 'username' || (field === 'password' && formData[field].trim() === '')) {
      console.error("Attempted to update username or empty password.");
      return;
    }
    try {
      await updateUserProfile({ [field]: formData[field] }); // Assume updateUserProfile can handle partial updates
      toggleEdit(field); // Toggle edit mode off after update
      console.log(`${field} updated successfully.`);
    } catch (error) {
      console.error(`Failed to update ${field}:`, error.message);
    }
  };

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <h2>Update Profile</h2>
      {Object.keys(formData).map((field) => (
        <div key={field}>
          <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
          {editing[field] ? (
            <>
              <input
                type={field === 'password' ? 'password' : 'text'}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                autoFocus
              />
              <button type="button" onClick={() => handleUpdate(field)}>Save</button>
              <button type="button" onClick={() => toggleEdit(field)}>Cancel</button>
            </>
          ) : (
            <>
              <span>{formData[field]}</span>
              {field !== 'username' && <button type="button" onClick={() => toggleEdit(field)}>Edit</button>}
            </>
          )}
        </div>
      ))}
    </form>
  );
}

export default UpdateProfileForm;
