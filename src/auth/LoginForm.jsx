import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from './UserContext'; 
import Modal from 'react-modal';
import './LoginSignForm.css';

Modal.setAppElement('#root'); 

function LoginForm() {
  const { login } = useContext(UserContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((data) => ({
      ...data,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      setError('Both username and password are required.');
      setIsModalOpen(true);
      return;
    }

    try {
      await login(formData);
      navigate('/');
    } catch (err) {
      console.error('Login error:', err); 
      console.log('Error response:', err.response); 
      setError(err.response?.data?.message || 'Invalid username or password.');
      setIsModalOpen(true); // Open modal on error
    }
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close modal
  };

  return (
    <div className="form-page">
      <div className="form-container">
        <h2 className="form-title">Login</h2>
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
            <button type="submit">Login</button>
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

export default LoginForm;
