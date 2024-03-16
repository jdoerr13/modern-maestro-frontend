import React, { useState } from "react";
import { useUserContext } from '../auth/UserContext'; 
import { useNavigate } from 'react-router-dom';


function SignupForm() {
  const navigate = useNavigate();
  const { signup } = useUserContext();
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    firstName: "", // Included as per schema
    lastName: "", // Included as per schema
    // 'user_type', 'preferences', and 'isAdmin' will not be included in the signup form
    // and can be updated later in the user's profile page.
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((data) => ({
      ...data,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear any existing errors
    try {
      await signup(formData); // If signup is successful, no error is thrown
      navigate('/'); // Redirects to the home page
    } catch (error) {
      // If an error is caught, that means signup wasn't successful
      setError(error.response?.data?.message || "An error occurred during signup. Please try again.");
    }
  };


  return (
    <form onSubmit={handleSubmit}>
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
      {error && <div style={{color: 'red'}}>{error}</div>}
      <button type="submit">Signup</button>
      </div>
    </form>
  );
}

export default SignupForm;