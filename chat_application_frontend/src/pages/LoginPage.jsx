import React, { useState } from 'react';
// import './LoginPage.css'; // Import the CSS file for styling
import '../styles/LoginPage.css';
import axios  from 'axios';
import { useNavigate } from 'react-router-dom';


const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const store_id = async (user_id) => {
    sessionStorage.setItem('user_id', user_id);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    const data = {
      password,
      email
    };

    const headers = {
      'Content-Type': 'application/json',

    };
    const url = "http://localhost:8000/api/v1/auth/login"
    

    try {

      const response = await axios.post(url, data, { headers });
      if(response.status === 200){

        await store_id(response.data.user_id)
        console.log(response.data.user_id)
        
        navigate("/chat")
      }

    } catch (error) {

      console.error('Error:', error);
    }

    setError('');
    console.log('Login successful with:', { email, password });
    // alert('Login successful!');
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2 className="login-title">Welcome Back</h2>
        <p className="login-subtitle">Please log in to your account</p>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit} className="login-form">
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
          <button type="submit" className="login-button">Log In</button>
        </form>
        <p className="signup-link">
          Don't have an account? <a href="/signup">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;