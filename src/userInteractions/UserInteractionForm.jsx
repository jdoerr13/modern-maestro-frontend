import React, { useState } from 'react';
import ModernMaestroApi from '../api/api';

function UserInteractionForm({ interactionId = null, setIsEditing, targetId }) {
  const isUpdateMode = interactionId !== null;
  const [formData, setFormData] = useState({
    target_id: targetId, // Assuming targetId is the ID of the composition
    target_type: 'composition', // Assuming interactions are for compositions
    interaction_type: '', // 'comment' or 'rating'
    content: '',
    rating: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(data => ({ ...data, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isUpdateMode) {
        await ModernMaestroApi.updateUserInteraction(interactionId, formData);
      } else {
        await ModernMaestroApi.createUserInteraction(formData);
      }
      if (setIsEditing) setIsEditing(false);
      // Reset form
      setFormData({
        target_id: targetId,
        target_type: 'composition',
        interaction_type: '',
        content: '',
        rating: '',
      });
      // Optionally, redirect or refresh interactions list
    } catch (error) {
      console.error("Error handling the user interaction form:", error);
      // Handle form submission error (e.g., display an error message)
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="interaction_type">Interaction Type:</label>
        <select id="interaction_type" name="interaction_type" value={formData.interaction_type} onChange={handleChange} required>
          <option value="">Select Type</option>
          <option value="comment">Comment</option>
          <option value="rating">Rating</option>
        </select>
      </div>
      {formData.interaction_type === 'comment' && (
        <div>
          <label htmlFor="content">Comment:</label>
          <textarea id="content" name="content" value={formData.content} onChange={handleChange} required />
        </div>
      )}
      {formData.interaction_type === 'rating' && (
        <div>
          <label htmlFor="rating">Rating (1-5):</label>
          <input type="number" id="rating" name="rating" min="1" max="5" value={formData.rating} onChange={handleChange} required />
        </div>
      )}
      <button type="submit">{isUpdateMode ? 'Update Interaction' : 'Create Interaction'}</button>
    </form>
  );
}

export default UserInteractionForm;
