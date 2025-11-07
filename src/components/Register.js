// src/components/Register.js - BLACK, MAROON & TEAL THEME
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Register.css';

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
  const [validationErrors, setValidationErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(true);
  const [typedText, setTypedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);
  
  const navigate = useNavigate();

  const phrases = useMemo(() => [
    'Join the Revolution',
    'Start Creating Content',
    'Automate Your Marketing',
    'Grow Your Business',
    'AI-Powered Success'
  ], []);

  useEffect(() => {
    const handleType = () => {
      const current = loopNum % phrases.length;
      const fullText = phrases[current];

      setTypedText(
        isDeleting
          ? fullText.substring(0, typedText.length - 1)
          : fullText.substring(0, typedText.length + 1)
      );

      setTypingSpeed(isDeleting ? 30 : 100);

      if (!isDeleting && typedText === fullText) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && typedText === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }
    };

    const timer = setTimeout(handleType, typingSpeed);
    return () => clearTimeout(timer);
  }, [typedText, isDeleting, loopNum, typingSpeed, phrases]);

  useEffect(() => {
    if (formData.password) {
      calculatePasswordStrength(formData.password);
    } else {
      setPasswordStrength(0);
    }
  }, [formData.password]);

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
    if (passwordStrength <= 2) return '#dc2626';
    if (passwordStrength <= 3) return '#f59e0b';
    if (passwordStrength <= 4) return '#059669';
    return '#5a9c9c';
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

  const closeRegisterModal = () => {
    setShowRegisterModal(false);
    setError('');
    setSuccess('');
    navigate('/login');
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

  const socialPlatforms = [
    { name: 'LinkedIn', icon: '/images/linkedin.png', color: '#0077B5' },
    { name: 'Instagram', icon: '/images/instagram.jpg', color: '#E1306C' },
    { name: 'Facebook', icon: '/images/facebook.png', color: '#1877F2' }
  ];

  const horizontalFeatures = [
    {
      icon: "🔗",
      title: "Multi-Platform Integration",
      description: "Connect to LinkedIn, Instagram, Facebook, Twitter, and more."
    },
    {
      icon: "🤖",
      title: "AI Content Creation",
      description: "Generate engaging posts and stunning images using AI."
    },
    {
      icon: "📤",
      title: "Auto Posting",
      description: "Schedule and publish content automatically."
    }
  ];

  const navbarStyles = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    background: 'rgba(255, 255, 255, 0.98)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderBottom: '2px solid rgba(90, 156, 156, 0.2)',
    padding: '1rem 2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10000,
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    transition: 'all 0.3s ease'
  };

  const leftSectionStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    flexShrink: 0
  };

  const logoStyles = {
    width: '46px',
    height: '46px',
    borderRadius: '12px',
    objectFit: 'cover',
    background: 'linear-gradient(135deg, #6b2020 0%, #5a9c9c 100%)',
    padding: '2px',
    flexShrink: 0,
    boxShadow: '0 4px 15px rgba(90, 156, 156, 0.3)'
  };

  const brandTextStyles = {
    fontSize: '1.6rem',
    fontWeight: 800,
    background: 'linear-gradient(135deg, #6b2020 0%, #5a9c9c 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    flexShrink: 0,
    whiteSpace: 'nowrap'
  };

  const navLinksStyles = {
    display: 'flex',
    gap: '2.4rem',
    alignItems: 'center',
    flexShrink: 0
  };

  const navLinkStyles = {
    color: '#4a4a4a',
    textDecoration: 'none',
    fontWeight: 600,
    transition: 'color 0.25s ease',
    whiteSpace: 'nowrap'
  };

  const registerButtonStyles = {
    background: 'linear-gradient(135deg, #6b2020 0%, #5a9c9c 100%)',
    color: '#fff',
    border: 'none',
    padding: '0.8rem 1.6rem',
    borderRadius: '12px',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.25s ease',
    boxShadow: '0 4px 12px rgba(90, 156, 156, 0.3)',
    whiteSpace: 'nowrap'
  };

  const modalOverlayStyles = {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0, 0, 0, 0.6)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: showRegisterModal ? 1 : 0,
    visibility: showRegisterModal ? 'visible' : 'hidden',
    transition: 'opacity 0.4s ease, visibility 0.4s ease',
    zIndex: 9999
  };

  return (
    <div className="register-container">
      <div className="cyber-grid"></div>

      <div className="geometric-bg">
        <div className="shape"></div>
        <div className="shape"></div>
        <div className="shape"></div>
        <div className="shape"></div>
        <div className="shape"></div>
      </div>
          
      <div className="floating-particles">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="particle"></div>
        ))}
      </div>

      {/* NAVBAR */}
      <nav style={navbarStyles}>
        <div style={leftSectionStyles}>
          <img 
            src="/123.png" 
            alt="Posting Expert" 
            style={logoStyles}
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <span style={brandTextStyles}>Posting Expert</span>
        </div>
        
        <div style={navLinksStyles}>
          <Link to="/login" style={navLinkStyles}>Home</Link>
          <Link to="/about" style={navLinkStyles}>About</Link>
          <Link to="/privacy-policy" style={navLinkStyles}>Privacy Policy</Link>
          <Link to="/contact-us" style={navLinkStyles}>Contact Us</Link>
        </div>

        <div>
          <button 
            onClick={() => navigate('/login')}
            type="button"
            style={registerButtonStyles}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 25px rgba(90, 156, 156, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 12px rgba(90, 156, 156, 0.3)';
            }}
          >
            Back to Login
          </button>
        </div>
      </nav>

      {/* REGISTER MODAL */}
      <div style={modalOverlayStyles}>
        <div className="modal-content">
          <button className="modal-close" onClick={closeRegisterModal} type="button">✕</button>
          
          <div className="form-header">
            <h2>Create Your Account</h2>
            <p>Join thousands of successful marketers</p>
          </div>

          <form className="register-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>FULL NAME</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleInputChange}
                className={validationErrors.name ? 'error' : ''}
                autoComplete="off"
                required
              />
              {validationErrors.name && (
                <span className="field-error">{validationErrors.name}</span>
              )}
            </div>

            <div className="form-group">
              <label>EMAIL ADDRESS</label>
              <input
                type="email"
                name="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={handleInputChange}
                className={validationErrors.email ? 'error' : ''}
                autoComplete="off"
                required
              />
              {validationErrors.email && (
                <span className="field-error">{validationErrors.email}</span>
              )}
            </div>

            <div className="form-group">
              <label>USERNAME</label>
              <input
                type="text"
                name="username"
                placeholder="Choose a unique username"
                value={formData.username}
                onChange={handleInputChange}
                className={validationErrors.username ? 'error' : ''}
                autoComplete="off"
                required
              />
              {validationErrors.username && (
                <span className="field-error">{validationErrors.username}</span>
              )}
              <small className="field-hint">Letters, numbers, and underscores only. Min 3 characters.</small>
            </div>

            <div className="form-group">
              <label>PASSWORD</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={validationErrors.password ? 'error' : ''}
                  autoComplete="off"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
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
                  <span style={{ color: getPasswordStrengthColor(), fontSize: '0.85rem', fontWeight: 600 }}>
                    {getPasswordStrengthLabel()}
                  </span>
                </div>
              )}
              {validationErrors.password && (
                <span className="field-error">{validationErrors.password}</span>
              )}
              <small className="field-hint">Use uppercase, lowercase, numbers & symbols.</small>
            </div>

            <div className="form-group">
              <label>CONFIRM PASSWORD</label>
              <div className="password-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={validationErrors.confirmPassword ? 'error' : ''}
                  autoComplete="off"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {validationErrors.confirmPassword && (
                <span className="field-error">{validationErrors.confirmPassword}</span>
              )}
            </div>

            {error && (
              <div className="alert alert-error">
                <span className="alert-icon">⚠️</span>
                <span>{error}</span>
              </div>
            )}
            
            {success && (
              <div className="alert alert-success">
                <span className="alert-icon">✓</span>
                <span>{success}</span>
              </div>
            )}

            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading-spinner"></span>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>CREATE ACCOUNT</span>
                  <span className="btn-arrow">→</span>
                </>
              )}
            </button>
          </form>

          <div className="form-footer">
            <p>
              Already have an account?{' '}
              <Link to="/login">Login here</Link>
            </p>
          </div>
        </div>
      </div>

      <div className="content-wrapper">
        <div className="hero">
          <div className="brand-header">
            <div className="brand-presents">Powered by Inikola Technologies</div>
            <div className="brand-main">
              <div className="logo-container">
                <img src="/123.png" alt="Posting Expert" className="brand-logo" />
              </div>
              <div className="brand-info">
                <h1>Posting Expert</h1>
                <p className="brand-tagline">AI-Powered Social Media Automation</p>
              </div>
            </div>
          </div>

          <div className="hero-typing-container">
            <h2 className="hero-title">
              <span className="gradient-text">{typedText}</span>
              <span className="cursor-blink">|</span>
            </h2>
            <p className="hero-subtitle">
              Transform your social media strategy with cutting-edge AI technology. 
              Generate stunning content, schedule posts, and grow your presence.
            </p>
          </div>

          <div className="horizontal-features-section">
            <h3 className="section-title">
              <span className="icon-pulse">🚀</span> Powerful Features
            </h3>
            <p className="section-subtitle">Everything you need to automate your marketing</p>
            
            <div className="horizontal-features-container">
              <div className="horizontal-features-scroll">
                {horizontalFeatures.map((feature, index) => (
                  <div key={index} className="card horizontal-feature-card">
                    <div className="horizontal-feature-icon">
                      {feature.icon}
                    </div>
                    <h4>{feature.title}</h4>
                    <p>{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="integrations-section">
            <h3 className="section-title">
              <span className="icon-pulse">🔗</span> Seamless Integrations
            </h3>
            <p className="section-subtitle">Connect with your favorite platforms instantly</p>
            
            <div className="platforms-orbit">
              <div className="orbit-center">
                <div className="center-logo">🤖</div>
                <div className="pulse-ring"></div>
                <div className="pulse-ring-2"></div>
              </div>
              
              {socialPlatforms.map((platform, index) => (
                <div 
                  key={platform.name}
                  className="platform-node"
                  style={{
                    '--index': index,
                    '--total': socialPlatforms.length,
                    '--color': platform.color
                  }}
                >
                  <a href={`https://${platform.name.toLowerCase()}.com`} target="_blank" rel="noopener noreferrer">
                    <div className="platform-icon">
                      <img src={platform.icon} alt={platform.name} />
                    </div>
                  </a>
                  <div className="platform-name">{platform.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Posting Expert</h4>
            <p>AI-Powered Social Media Automation</p>
            <p className="footer-tagline">Built by Inikola × CraftingBrain</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <Link to="/login">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/contact-us">Contact Us</Link>
          </div>
          <div className="footer-section">
            <h4>Connect</h4>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 Posting Expert. All rights reserved. | Powered by Inikola Technologies & CraftingBrain</p>
        </div>
      </footer>
    </div>
  );
};

export default Register;