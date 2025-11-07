// src/components/Login.js - BLACK, MAROON & TEAL THEME
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Login.css";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);
  const [showLoginModal, setShowLoginModal] = useState(true);
  const navigate = useNavigate();

  const phrases = useMemo(() => [
    'Generate AI Content',
    'Post to Multiple Platforms',
    'Smart Scheduling',
    'Boost Engagement',
    'Automate Marketing'
  ], []);

  const horizontalFeatures = [
    {
      icon: "🔗",
      title: "Multi-Platform Integration",
      description: "Connect to LinkedIn, Instagram, Facebook, Twitter, and more. Manage all your social media accounts from one dashboard."
    },
    {
      icon: "🤖",
      title: "AI Content Creation",
      description: "Automatically generate engaging posts, captions, and stunning images using advanced AI technology."
    },
    {
      icon: "📤",
      title: "Auto Posting",
      description: "Schedule and publish content automatically across all your connected social media platforms with one click."
    },
    {
      icon: "📊",
      title: "Advanced Analytics",
      description: "Track performance with detailed analytics, engagement metrics, and growth insights for all your platforms."
    },
    {
      icon: "🎯",
      title: "Smart Scheduling",
      description: "Optimize posting times for maximum engagement using AI-powered scheduling algorithms."
    },
    {
      icon: "✨",
      title: "Premium Experience",
      description: "Enjoy a seamless, intuitive interface designed for both beginners and marketing professionals."
    }
  ];

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

  const openLoginModal = () => {
    setShowLoginModal(true);
    setError("");
    setSuccess("");
  };

  const closeLoginModal = () => {
    setShowLoginModal(false);
    setError("");
    setSuccess("");
  };

  useEffect(() => {
    const rememberedUsername = localStorage.getItem("rememberedUsername");
    const rememberedRememberMe = localStorage.getItem("rememberMe") === "true";
    
    if (rememberedUsername && rememberedRememberMe) {
      setUsername(rememberedUsername);
      setRememberMe(true);
    }

    const token = localStorage.getItem("token");
    if (token) {
      const tokenExpiry = localStorage.getItem("tokenExpiry");
      if (tokenExpiry && parseInt(tokenExpiry) > Date.now()) {
        navigate("/connect", { replace: true });
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("tokenExpiry");
      }
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);
    
    try {
      const response = await axios.post(
        "https://4fqbpp1yya.execute-api.ap-south-1.amazonaws.com/prod/user/login",
        { username, password, rememberMe }
      );
      
      const { token, user, rememberMe: rememberMeResponse, expiresIn } = response.data;
      
      localStorage.setItem("token", token);
      localStorage.setItem("username", user.username);
      
      const expiryTime = Date.now() + (expiresIn * 1000);
      localStorage.setItem("tokenExpiry", expiryTime.toString());
      
      if (rememberMeResponse) {
        localStorage.setItem("rememberedUsername", username);
        localStorage.setItem("rememberMe", "true");
      } else {
        localStorage.removeItem("rememberedUsername");
        localStorage.removeItem("rememberMe");
      }
      
      setSuccess("Login successful! Redirecting...");
      
      if (onLogin) {
        onLogin(user);
      }
      
      setTimeout(() => {
        setIsLoading(false);
        closeLoginModal();
        navigate("/connect", { replace: true });
      }, 1000);
      
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Invalid username or password";
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  const socialPlatforms = [
    { name: 'LinkedIn', icon: '/images/linkedin.png', color: '#0077B5' },
    { name: 'Instagram', icon: '/images/instagram.jpg', color: '#E1306C' },
    { name: 'Facebook', icon: '/images/facebook.png', color: '#1877F2' }
  ];

  const trustedCompanies = [
    { name: 'Inikola', logo: '🏢', description: 'Tech Innovation' },
    { name: 'CraftingBrain', logo: '🧠', description: 'EdTech Company' }
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

  const activeLinkStyles = {
    ...navLinkStyles,
    color: '#6b2020'
  };

  const loginButtonStyles = {
    background: 'linear-gradient(135deg, #6b2020 0%, #5a9c9c 100%)',
    color: '#FFFFFF',
    border: 'none',
    padding: '0.8rem 1.6rem',
    borderRadius: '12px',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.25s ease',
    boxShadow: '0 4px 15px rgba(90, 156, 156, 0.3)',
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
    opacity: showLoginModal ? 1 : 0,
    visibility: showLoginModal ? 'visible' : 'hidden',
    transition: 'opacity 0.4s ease, visibility 0.4s ease',
    zIndex: 9999
  };

  return (
    <div className="login-container">
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
          <Link to="/login" style={activeLinkStyles}>Home</Link>
          <Link to="/about" style={navLinkStyles}>About</Link>
          <Link to="/privacy-policy" style={navLinkStyles}>Privacy Policy</Link>
          <Link to="/contact-us" style={navLinkStyles}>Contact Us</Link>
        </div>

        <div>
          <button 
            onClick={openLoginModal}
            type="button"
            style={loginButtonStyles}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 25px rgba(90, 156, 156, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(90, 156, 156, 0.3)';
            }}
          >
            Login
          </button>
        </div>
      </nav>

      {/* LOGIN MODAL */}
      <div style={modalOverlayStyles}>
        <div className="modal-content">
          <button className="modal-close" onClick={closeLoginModal} type="button">✕</button>
          
          <div className="form-header">
            <h2>Welcome Back</h2>
            <p>Access your AI marketing dashboard</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>USERNAME</label>
              <input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="off"
                required
              />
            </div>

            <div className="form-group">
              <label>PASSWORD</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
            </div>

            <div className="checkbox-group">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label>Remember me for 30 days</label>
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
                  <span>LAUNCH DASHBOARD</span>
                  <span className="btn-arrow">→</span>
                </>
              )}
            </button>
          </form>

          <div className="form-footer">
            <p>
              New to Posting Expert?{' '}
              <Link to="/register">Create Account</Link>
            </p>
          </div>
        </div>
      </div>

      <div id="home" className="content-wrapper">
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
              Generate stunning content, schedule posts, and grow your presence across multiple platforms.
            </p>
          </div>

          <div className="hero-cta-section">
            <button className="btn btn-primary" onClick={openLoginModal} type="button">
              <span>Get Started Now</span>
              <span className="cta-arrow">→</span>
            </button>
          </div>

          <div className="horizontal-features-section">
            <h3 className="section-title">
              <span className="icon-pulse">🚀</span> Powerful Features
            </h3>
            <p className="section-subtitle">Everything you need to automate your social media marketing</p>
            
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

          <div id="trusted" className="trusted-section">
            <h3 className="section-title">
              <span className="icon-pulse">🏆</span> Trusted By Leading Companies
            </h3>
            <p className="section-subtitle">Join innovative teams already using Posting Expert</p>
            
            <div className="trusted-companies">
              {trustedCompanies.map((company, index) => (
                <div key={index} className="card company-card">
                  <div className="company-logo">{company.logo}</div>
                  <div className="company-info">
                    <h4>{company.name}</h4>
                    <p>{company.description}</p>
                  </div>
                </div>
              ))}
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

          <div className="hero-cta-section">
            <p style={{ marginBottom: '2rem', fontSize: '1.2rem', opacity: 0.8, color: '#ffffff' }}>
              Ready to transform your social media presence?
            </p>
            <button className="btn btn-primary" onClick={openLoginModal} type="button">
              <span>Start Your Journey</span>
              <span className="cta-arrow">🚀</span>
            </button>
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

export default Login;