// src/components/Register.js - Complete Fixed Version
import React, { useState, useEffect } from 'react';
import './Register.css';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [validationErrors, setValidationErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const darkMode = saved === 'dark' || saved === null;
    setIsDarkMode(darkMode);
    
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, []);

  useEffect(() => {
    if (formData.password) {
      calculatePasswordStrength(formData.password);
    } else {
      setPasswordStrength(0);
    }
  }, [formData.password]);

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
    
    if (newMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 10) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    setPasswordStrength(strength);
  };

  const getPasswordStrengthLabel = () => {
    if (passwordStrength === 0) return '';
    if (passwordStrength <= 2) return 'Weak';
    if (passwordStrength <= 3) return 'Fair';
    if (passwordStrength <= 4) return 'Good';
    return 'Strong';
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 2) return '#ef4444';
    if (passwordStrength <= 3) return '#f59e0b';
    if (passwordStrength <= 4) return '#10b981';
    return '#22d3ee';
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    if (error) setError('');
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.username.trim()) {
      errors.username = 'Username is required';
    } else if (formData.username.trim().length < 3) {
      errors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      errors.username = 'Username can only contain letters, numbers, and underscores';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors({});
    setIsLoading(true);

    try {
      const response = await fetch(
        'https://4fqbpp1yya.execute-api.ap-south-1.amazonaws.com/prod/user/register',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name.trim(),
            email: formData.email.toLowerCase().trim(),
            username: formData.username.trim(),
            password: formData.password,
            confirmPassword: formData.confirmPassword 
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccess('Registration successful! Taking you to the survey...');
        
        localStorage.setItem('registeredUserId', formData.username.trim());
        localStorage.setItem('username', formData.username.trim());
        
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        
        setFormData({
          name: '',
          email: '',
          username: '',
          password: '',
          confirmPassword: ''
        });
        
        setTimeout(() => {
          navigate('/survey');
        }, 1500);

      } else {
        if (data.error) {
          const errorMessage = data.error.toLowerCase();
          
          if (errorMessage.includes('username') && (errorMessage.includes('already') || errorMessage.includes('exists'))) {
            setValidationErrors({ 
              username: 'Username already taken. Please choose a different username.' 
            });
          } 
          else if (errorMessage.includes('email') && (errorMessage.includes('already') || errorMessage.includes('registered'))) {
            setValidationErrors({ 
              email: 'This email is already registered. Please use a different email or try logging in.' 
            });
          } 
          else if (errorMessage.includes('user') && errorMessage.includes('already')) {
            setError('An account with these details already exists. Please try logging in instead.');
          }
          else {
            setError(data.error);
          }
        } 
        else {
          if (response.status === 409) {
            setError('User already exists. Please try logging in or use different credentials.');
          } else if (response.status === 400) {
            setError('Invalid registration data. Please check all fields and try again.');
          } else {
            setError('Registration failed. Please try again.');
          }
        }
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="futuristic-register-container">
      <div className="cyber-grid"></div>

      <div className="floating-particles">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="particle"></div>
        ))}
      </div>

      <button className="theme-toggle-futuristic" onClick={toggleTheme}>
        {isDarkMode ? '☀️' : '🌙'}
      </button>

      <button className="back-to-login-btn" onClick={() => navigate('/login')}>
        ← Back to Login
      </button>

      <div className="register-content-wrapper">
        <div className="hero-section">
          <div className="brand-header-futuristic">
            <div className="brand-main">
              <div className="logo-container">
                <img src="/123.png" alt="Marketing Bot" className="brand-logo-futuristic" />
                <div className="logo-glow"></div>
              </div>
            </div>
          </div>

          <div className="hero-typing-container">
            <h1 className="hero-title">
              <span className="gradient-text">START YOUR MARKETING REVOLUTION</span>
            </h1>
            <p className="hero-subtitle">
              Transform your business with the power of AI. Join 1000+ forward-thinking entrepreneurs 
              who are already dominating social media.
            </p>
          </div>

          {/* Integrations Section with Orbit Animation */}
          <div className="integrations-section">
            <h3 className="section-title">
              <span className="icon-pulse">🔗</span>
              Connect Your Platforms
            </h3>
            <p className="section-subtitle">Seamlessly integrate with your favorite social media channels</p>

            <div className="platforms-orbit">
              <div className="orbit-center">
                <div className="center-logo">🤖</div>
                <div className="pulse-ring"></div>
                <div className="pulse-ring-2"></div>
              </div>

              <div className="platform-node" style={{"--index": 0, "--color": "#E4405F"}}>
                <div className="connection-line" style={{background: "linear-gradient(to bottom, #E4405F, transparent)"}}></div>
                <div className="platform-icon" style={{"--color": "#E4405F"}}>
                  📷
                </div>
                <span className="platform-name">Instagram</span>
              </div>

              <div className="platform-node" style={{"--index": 1, "--color": "#0A66C2"}}>
                <div className="connection-line" style={{background: "linear-gradient(to bottom, #0A66C2, transparent)"}}></div>
                <div className="platform-icon" style={{"--color": "#0A66C2"}}>
                  💼
                </div>
                <span className="platform-name">LinkedIn</span>
              </div>

              <div className="platform-node" style={{"--index": 2, "--color": "#1DA1F2"}}>
                <div className="connection-line" style={{background: "linear-gradient(to bottom, #1DA1F2, transparent)"}}></div>
                <div className="platform-icon" style={{"--color": "#1DA1F2"}}>
                  🐦
                </div>
                <span className="platform-name">Facebook</span>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="features-futuristic">
            <div className="feature-card-futuristic">
              <div className="feature-icon-futuristic">⚡</div>
              <h4>AI-Powered</h4>
              <p>Generate content using advanced AI technology</p>
            </div>
            <div className="feature-card-futuristic">
              <div className="feature-icon-futuristic">📊</div>
              <h4>Analytics</h4>
              <p>Track performance across all platforms</p>
            </div>
            <div className="feature-card-futuristic">
              <div className="feature-icon-futuristic">🚀</div>
              <h4>Auto-Post</h4>
              <p>Schedule and publish automatically</p>
            </div>
          </div>
        </div>

        <div className="register-form-section">
          <div className="form-container-futuristic">
            <div className="form-header-futuristic">
              <h2>Create Your Account</h2>
              <p>Start your free journey today</p>
            </div>

            <div className="info-card-futuristic">
              <span>ℹ️</span>
              <p>After registration, complete a quick survey to personalize your content.</p>
            </div>

            <form onSubmit={handleSubmit} className="futuristic-form">
              <div className="input-group-futuristic">
                <label>Full Name *</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={validationErrors.name ? 'error' : ''}
                  />
                  <div className="input-glow"></div>
                </div>
                {validationErrors.name && (
                  <span className="field-error">{validationErrors.name}</span>
                )}
              </div>

              <div className="input-group-futuristic">
                <label>Email Address *</label>
                <div className="input-wrapper">
                  <input
                    type="email"
                    name="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={validationErrors.email ? 'error' : ''}
                  />
                  <div className="input-glow"></div>
                </div>
                {validationErrors.email && (
                  <span className="field-error">{validationErrors.email}</span>
                )}
              </div>

              <div className="input-group-futuristic">
                <label>Username *</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    name="username"
                    placeholder="Choose a unique username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className={validationErrors.username ? 'error' : ''}
                  />
                  <div className="input-glow"></div>
                </div>
                {validationErrors.username && (
                  <span className="field-error">{validationErrors.username}</span>
                )}
                <small className="field-hint">Letters, numbers, and underscores only. Min 3 characters.</small>
              </div>

              <div className="input-group-futuristic">
                <label>Password *</label>
                <div className="password-wrapper-futuristic">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={validationErrors.password ? 'error' : ''}
                  />
                  <button
                    type="button"
                    className="password-toggle-futuristic"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                  <div className="input-glow"></div>
                </div>
                {formData.password && (
                  <div className="password-strength-indicator">
                    <div className="strength-bar">
                      <div 
                        className="strength-fill"
                        style={{
                          width: `${(passwordStrength / 5) * 100}%`,
                          background: getPasswordStrengthColor()
                        }}
                      ></div>
                    </div>
                    <span style={{ color: getPasswordStrengthColor() }}>
                      {getPasswordStrengthLabel()}
                    </span>
                  </div>
                )}
                {validationErrors.password && (
                  <span className="field-error">{validationErrors.password}</span>
                )}
                <small className="field-hint">Use uppercase, lowercase, numbers & symbols.</small>
              </div>

              <div className="input-group-futuristic">
                <label>Confirm Password *</label>
                <div className="password-wrapper-futuristic">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={validationErrors.confirmPassword ? 'error' : ''}
                  />
                  <button
                    type="button"
                    className="password-toggle-futuristic"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                  <div className="input-glow"></div>
                </div>
                {validationErrors.confirmPassword && (
                  <span className="field-error">{validationErrors.confirmPassword}</span>
                )}
              </div>

              {error && (
                <div className="alert-futuristic error-alert">
                  <span className="alert-icon">⚠️</span>
                  <span>{error}</span>
                </div>
              )}
              
              {success && (
                <div className="alert-futuristic success-alert">
                  <span className="alert-icon">✓</span>
                  <span>{success}</span>
                </div>
              )}

              <button type="submit" className="submit-btn-futuristic" disabled={isLoading}>
                <div className="btn-glow"></div>
                {isLoading ? (
                  <div className="loading-spinner"></div>
                ) : (
                  <>
                    Create Account
                    <span className="btn-arrow">→</span>
                  </>
                )}
              </button>
            </form>

            <div className="form-footer-futuristic">
              <p>
                Already have an account?
                <a href="/login">Login here</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;