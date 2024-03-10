import React, { useState } from 'react';
import ModernMaestroApi from '../api/ModernMaestroApi';

function ComposerForm({ composerId, save }) {
  const [formData, setFormData] = useState({
    name: '',
    biography: '',
    // Initialize other fields as needed
  });

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const composer = composerId
        ? await ModernMaestroApi.updateComposer(composerId, formData)
        : await ModernMaestroApi.createComposer(formData);
      save(composer);
    } catch (errors) {
      console.error("Saving composer failed", errors);
      // Handle errors, e.g., show error messages to the user
    }
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(data => ({ ...data, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Name:</label>
        <input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
      </div>
      {/* Add more fields as needed */}
      <button type="submit">Save Composer</button>
    </form>
  );
}

export default ComposerForm;
