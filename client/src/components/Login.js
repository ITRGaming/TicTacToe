import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import '../App.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false); // State for loading indicator
    const [error, setError] = useState(null); // State for error message
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.login(username, password);
            if (response && response.token) { 
                localStorage.setItem('token', response.token);
                navigate(`/${username}`);
            } else {
                console.error("Login successful, but token not found in response.");
                console.error(response.token);      
                    
            }
        } catch (error) {
            setError(error.response.data.error);
        // Handle login errors (e.g., display error message)
        }
    };

  return (
    <div>
      <h2>Login</h2>
      {error && <p className="error-message">{error}</p>} {/* Display error message */}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required // Add required attribute for validation
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required // Add required attribute for validation
          />
        </div>
        {isLoading && <p>Loading...</p>} {/* Display loading indicator */}
        <button type="submit" disabled={isLoading}>
          Login
        </button>
        <button onClick={() => navigate('/register')}>Register</button>
      </form>
    </div>
  );
};

export default Login;

// Add styling (optional)
