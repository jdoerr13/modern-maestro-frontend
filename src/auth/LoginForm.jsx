import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from './UserContext'; // Adjust the import path

function LoginForm() {
  const { login } = useContext(UserContext); // Destructure login from context
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((data) => ({
      ...data,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData);
      navigate('/'); // Navigate after successful login
    } catch (err) {
      setError('Login failed. Please try again.');
      console.error('Login error:', err);
    }
  };


  return (
    <form onSubmit={handleSubmit}>
      <div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
      <label>
        Username:
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        Password:
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
      </label>
      <br />
      <button type="submit">Login</button>
    </form>
  );
}

export default LoginForm;
