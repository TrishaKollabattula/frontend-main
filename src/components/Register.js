//src/components/Register.js - Enhanced with Password Visibility Toggle
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
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);
  
  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      setIsDarkMode(true);
      document.body.classList.add('dark');
    }
  }, []);

  useEffect(() => {
    if (formData.password) {
      calculatePasswordStrength(formData.password);
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
      console.log('Registration response:', { status: response.status, data });

      if (response.ok) {
        setSuccess('Registration successful! Taking you to the survey...');
        
        localStorage.setItem('registeredUserId', formData.username.trim());
        localStorage.setItem('username', formData.username.trim());
        
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        
        console.log('Saved to localStorage:', {
          registeredUserId: formData.username.trim(),
          username: formData.username.trim()
        });
        
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
            setError('');
          } 
          else if (errorMessage.includes('email') && (errorMessage.includes('already') || errorMessage.includes('registered'))) {
            setValidationErrors({ 
              email: 'This email is already registered. Please use a different email or try logging in.' 
            });
            setError('');
          } 
          else if (errorMessage.includes('user') && errorMessage.includes('already')) {
            setError('An account with these details already exists. Please try logging in instead.');
          }
          else if (errorMessage.includes('password') && errorMessage.includes('match')) {
            setValidationErrors({
              confirmPassword: 'Passwords do not match'
            });
            setError('');
          }
          else if (errorMessage.includes('invalid') && errorMessage.includes('email')) {
            setValidationErrors({
              email: 'Please enter a valid email address'
            });
            setError('');
          }
          else if (errorMessage.includes('invalid') && errorMessage.includes('username')) {
            setValidationErrors({
              username: 'Username can only contain letters, numbers, and underscores'
            });
            setError('');
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
          } else if (response.status === 500) {
            setError('Server error occurred. Please try again later.');
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
    <div className={`register-container-split ${isDarkMode ? 'dark' : 'light'}`}>
      <button className="theme-toggle top-left" onClick={toggleTheme}>
        {isDarkMode ? '☀️' : '🌙'}
      </button>
      <button className="logout-button" onClick={() => navigate('/login')}>
        Logout →
      </button>

      <div className="extra-icons">
        <span className="icon1">🚀</span>
        <span className="icon2">🤖</span>
        <span className="icon3">📊</span>
        <span className="icon4">💡</span>
      </div>

      <div className="register-split-content">
        {/* Left Side - Marketing Message */}
        <div className="marketing-section">
          <div className="marketing-content">
            <div className="brand-section">
              <img src="/123.jpg" alt="Marketing Bot Logo" className="marketing-logo" />
            </div>
            
            <h1 className="marketing-title">
              START YOUR
              <span className="marketing-highlight">MARKETING REVOLUTION</span>
              Join the AI-Powered Future
            </h1>
            
            <p className="marketing-description">
              Transform your business with the power of AI. Join 1000+ forward-thinking entrepreneurs 
              who are already dominating social media. One platform, unlimited possibilities – create, 
              schedule, and scale your brand like never before.
            </p>
          </div>
        </div>

        {/* Right Side - Registration Form */}
        <div className="register-section">
          <div className="register-form-container">
            <h1 className="register-form-title">Create Your Account</h1>
            <p className="register-form-subtitle">Start your free journey today</p>

            <div className="info-card">
              <span style={{ fontSize: '1.25rem' }}>ℹ️</span>
              <p style={{ fontSize: '0.875rem', margin: 0, lineHeight: 1.6 }}>
                After registration, complete a quick survey to personalize your content.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={validationErrors.name ? 'error' : ''}
                  required
                />
                {validationErrors.name && <span className="field-error">{validationErrors.name}</span>}
              </div>

              <div className="form-group">
                <label>Email Address *</label>
                <input
                  type="email"
                  name="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={validationErrors.email ? 'error' : ''}
                  required
                />
                {validationErrors.email && <span className="field-error">{validationErrors.email}</span>}
              </div>

              <div className="form-group">
                <label>Username *</label>
                <input
                  type="text"
                  name="username"
                  placeholder="Choose a unique username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className={validationErrors.username ? 'error' : ''}
                  required
                />
                {validationErrors.username && <span className="field-error">{validationErrors.username}</span>}
                <small className="field-hint">Letters, numbers, and underscores only. Min 3 characters.</small>
              </div>

              <div className="form-group">
                <label>Password *</label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={validationErrors.password ? 'error' : ''}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                {formData.password && (
                  <div style={{
                    marginTop: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <div style={{
                      flex: 1,
                      height: '4px',
                      background: 'rgba(30, 41, 59, 0.5)',
                      borderRadius: '2px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${(passwordStrength / 5) * 100}%`,
                        background: getPasswordStrengthColor(),
                        transition: 'all 0.3s ease'
                      }}></div>
                    </div>
                    <span style={{
                      fontSize: '0.75rem',
                      color: getPasswordStrengthColor(),
                      fontWeight: 600
                    }}>{getPasswordStrengthLabel()}</span>
                  </div>
                )}
                {validationErrors.password && <span className="field-error">{validationErrors.password}</span>}
                <small className="field-hint">Use uppercase, lowercase, numbers & symbols for better security.</small>
              </div>

              <div className="form-group">
                <label>Confirm Password *</label>
                <div className="password-input-wrapper">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={validationErrors.confirmPassword ? 'error' : ''}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                {validationErrors.confirmPassword && <span className="field-error">{validationErrors.confirmPassword}</span>}
              </div>

              {error && (
                <div className="response-error">
                  <div className="response-icon">!</div>
                  <div className="response-content">
                    <p>{error}</p>
                  </div>
                </div>
              )}
              
              {success && (
                <div className="response-success">
                  <div className="response-icon">✓</div>
                  <div className="response-content">
                    <p>{success}</p>
                  </div>
                </div>
              )}

              <button type="submit" className="post-button" disabled={isLoading}>
                {isLoading ? <span className="spinner"></span> : 'Create Account'}
              </button>
            </form>

            <p style={{ 
              marginTop: '1.5rem', 
              textAlign: 'center', 
              fontSize: '0.875rem',
              color: isDarkMode ? 'var(--gray-400)' : 'var(--gray-600)'
            }}>
              Already have an account?{' '}
              <a 
                href="/login" 
                style={{ 
                  color: isDarkMode ? 'var(--primary-white)' : 'var(--primary-black)',
                  fontWeight: 'bold', 
                  textDecoration: 'none' 
                }}
              >
                Login here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;