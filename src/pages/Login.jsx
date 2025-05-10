// src/pages/Login.jsx
import React, { useState, useEffect } from 'react';
import {
  FaGoogle, FaFacebook, FaApple, FaTwitter, FaGithub, FaEnvelope, FaLock, FaUser,
  FaEye, FaEyeSlash, FaPhone
} from 'react-icons/fa';
import '../styles/Login.css';

const Login = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const authBox = document.querySelector('.auth-box');
    if (authBox) {
      setTimeout(() => authBox.classList.add('animate-in'), 100);
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const endpoint = isLogin ? 'login' : 'signup';

      const response = await fetch(`http://localhost:5000/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          phone: formData.phone
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Something went wrong');
        return;
      }

      const user = {
        id: data.user?.id || Date.now(),
        name: data.user?.name || formData.name || formData.email.split('@')[0],
        email: formData.email,
        avatar: `https://ui-avatars.com/api/?name=${formData.name || formData.email}&background=1DB954&color=fff`,
      };

      localStorage.setItem('grooveUser', JSON.stringify(user));
      onLogin(user);

    } catch (err) {
      console.error('Login error:', err);
      setError('Server error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    setIsLoading(true);
    setTimeout(() => {
      onLogin({
        id: '1',
        name: provider + ' User',
        email: `${provider.toLowerCase()}@example.com`,
        avatar: `https://ui-avatars.com/api/?name=${provider}+User&background=1DB954&color=fff`,
      });
    }, 1000);
  };

  const handleForgotPassword = () => {
    alert('Password reset link will be sent to your email');
  };

  return (
    <div className="auth-container">
      <div className="groove-logo">Groove</div>
      <div className="auth-box">
        <div className="auth-header">
          <h1>{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
          <p>{isLogin ? 'Sign in to continue' : 'Sign up to get started'}</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <>
              <div className="form-group">
                <FaUser className="input-icon" />
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <FaPhone className="input-icon" />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </>
          )}

          <div className="form-group">
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <FaLock className="input-icon" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {isLogin && (
            <button
              type="button"
              className="forgot-password"
              onClick={handleForgotPassword}
            >
              Forgot Password?
            </button>
          )}

          {error && <div className="error-message">{error}</div>}
          <button
            type="submit"
            className="auth-button"
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className="social-login">
          <p>Or continue with</p>
          <div className="social-buttons">
            <button type="button" className="social-button google" onClick={() => handleSocialLogin('Google')} disabled={isLoading}><FaGoogle /></button>
            <button type="button" className="social-button facebook" onClick={() => handleSocialLogin('Facebook')} disabled={isLoading}><FaFacebook /></button>
            <button type="button" className="social-button apple" onClick={() => handleSocialLogin('Apple')} disabled={isLoading}><FaApple /></button>
            <button type="button" className="social-button twitter" onClick={() => handleSocialLogin('Twitter')} disabled={isLoading}><FaTwitter /></button>
            <button type="button" className="social-button github" onClick={() => handleSocialLogin('GitHub')} disabled={isLoading}><FaGithub /></button>
          </div>
        </div>

        <div className="auth-footer">
          <p>
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
            <button type="button" className="toggle-auth" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
