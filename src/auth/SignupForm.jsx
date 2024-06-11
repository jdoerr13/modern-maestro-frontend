import React, { useState } from "react";
import { useUserContext } from '../auth/UserContext';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import './LoginSignForm.css';

Modal.setAppElement('#root'); // Ensure modal can properly handle accessibility

function SignupForm() {
  const navigate = useNavigate();
  const { signup } = useUserContext();
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    firstName: "",
    lastName: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((data) => ({
      ...data,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password || !formData.email) {
      setError('Username, password, and email are required.');
      setIsModalOpen(true);
      return;
    }

    try {
      await signup(formData);
      localStorage.removeItem('isComposer');
      navigate('/');
    } catch (err) {
      console.error('Signup error:', err); // Log the error for debugging
      console.log('Error response:', err.response); // Log the error response to inspect it
      setError(err.response?.data?.message || 'Username or email allready exist. Please make sure password is five characters.');
      setIsModalOpen(true); // Open modal on error
    }
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close modal
  };

  return (
    <div className="form-page">
      <div className="form-container">
        <h2 className="form-title">Sign Up</h2>
        <form onSubmit={handleSubmit} className="form-content">
          <div>
            <label>Username:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>First Name:</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Last Name:</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>
          <div>
            <button type="submit">Sign Up</button>
          </div>
        </form>

        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          contentLabel="Error Modal"
          className="error-modal"
          overlayClassName="error-overlay"
        >
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={closeModal}>Close</button>
        </Modal>
      </div>
    </div>
  );
}

export default SignupForm;
