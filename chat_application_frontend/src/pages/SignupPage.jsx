import React, { useState } from 'react';
// import './SignupPage.css'; // Import the CSS file for styling
import "../styles/SignupPage.css"
import axios from "axios"
import { useNavigate } from 'react-router-dom';



const SignupPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');




  const handleSubmit = async (e) => {
    e.preventDefault();


    if (!username || !email || !password || !confirmPassword) {
      setError('All fields are required');
      setSuccess('');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setSuccess('');
      return;
    }

    const data = {
      username,
      password,
      email
    };

    const headers = {
      'Content-Type': 'application/json',

    };
    const url = "http://localhost:8000/api/v1/auth/signup"
    

    try {

      const response = await axios.post(url, data, { headers });
      if(response.status === 201){
        navigate("/chat")
      }

    } catch (error) {
      // console.error('Error:', error);
    }


  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <h2 className="signup-title">Create Your Account</h2>
        <p className="signup-subtitle">Join us to get started</p>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-group">
            <label htmlFor="username" className="form-label">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              className="form-input"
              required
            />
          </div>
          <button type="submit" className="signup-button">Sign Up</button>
        </form>
        <p className="login-link">
          Already have an account? <a href="/login">Log in</a>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;