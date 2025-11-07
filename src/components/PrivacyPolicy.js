// src/components/PrivacyPolicy.js - COMPLETE WITH INLINE STYLES NAVBAR
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./PrivacyPolicy.css";

const PrivacyPolicy = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const navigate = useNavigate();

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
    
    if (newMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  };

  React.useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark" || !saved) {
      setIsDarkMode(true);
      document.body.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.body.classList.remove("dark");
    }
  }, []);

  // Navbar inline styles
  const navbarStyles = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    background: isDarkMode ? 'rgba(18, 22, 50, 0.78)' : 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderBottom: isDarkMode ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #e5e9f2',
    padding: '1rem 2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 1000,
    boxShadow: '0 6px 16px rgba(16, 18, 38, 0.06)',
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
    background: 'linear-gradient(135deg, #5b7cfa, #9b5ef7)',
    padding: '2px',
    flexShrink: 0
  };

  const brandTextStyles = {
    fontSize: '1.6rem',
    fontWeight: 800,
    background: 'linear-gradient(135deg, #5b7cfa, #9b5ef7)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    flexShrink: 0,
    whiteSpace: 'nowrap'
  };

  const themeButtonStyles = {
    width: '44px',
    height: '44px',
    borderRadius: '10px',
    background: isDarkMode ? 'rgba(18, 22, 50, 0.78)' : 'rgba(255, 255, 255, 0.85)',
    border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #e5e9f2',
    color: isDarkMode ? '#eef1ff' : '#101226',
    fontSize: '1.3rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    flexShrink: 0,
    boxShadow: '0 6px 16px rgba(16, 18, 38, 0.06)'
  };

  const navLinksStyles = {
    display: 'flex',
    gap: '2.4rem',
    alignItems: 'center',
    flexShrink: 0
  };

  const navLinkStyles = {
    color: isDarkMode ? '#eef1ff' : '#101226',
    textDecoration: 'none',
    fontWeight: 600,
    transition: 'color 0.25s ease',
    whiteSpace: 'nowrap'
  };

  const activeLinkStyles = {
    ...navLinkStyles,
    color: '#5b7cfa'
  };

  const loginButtonStyles = {
    background: 'linear-gradient(135deg, #5b7cfa, #9b5ef7)',
    color: '#fff',
    border: 'none',
    padding: '0.8rem 1.6rem',
    borderRadius: '12px',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.25s ease',
    boxShadow: '0 6px 16px rgba(16, 18, 38, 0.06)',
    whiteSpace: 'nowrap'
  };

  return (
    <div className="privacy-policy-container">
      {/* Background Elements */}
      <div className="cyber-grid"></div>
      <div className="geometric-bg">
        <div className="shape"></div>
        <div className="shape"></div>
        <div className="shape"></div>
      </div>
      
      <div className="floating-particles">
        {[...Array(15)].map((_, i) => (
          <div key={i} className="particle"></div>
        ))}
      </div>

      {/* NAVBAR WITH INLINE STYLES - GUARANTEED TO RENDER */}
      <nav style={navbarStyles}>
        {/* LEFT: Logo + Brand + Theme */}
        <div style={leftSectionStyles}>
          <img 
            src="/123.png" 
            alt="Posting Expert" 
            style={logoStyles}
            onError={(e) => {
              e.target.style.display = 'none';
              console.error('Logo image not found at /123.png');
            }}
          />
          <span style={brandTextStyles}>Posting Expert</span>
          <button 
            onClick={toggleTheme}
            type="button"
            style={themeButtonStyles}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.1)';
              e.target.style.borderColor = '#5b7cfa';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.borderColor = isDarkMode ? 'rgba(255, 255, 255, 0.08)' : '#e5e9f2';
            }}
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </div>
        
        {/* CENTER: Nav Links */}
        <div style={navLinksStyles}>
          <Link to="/login" style={navLinkStyles}>Home</Link>
          <Link to="/about" style={navLinkStyles}>About</Link>
          <Link to="/privacy-policy" style={activeLinkStyles}>Privacy Policy</Link>
          <Link to="/contact-us" style={navLinkStyles}>Contact Us</Link>
        </div>

        {/* RIGHT: Login Button */}
        <div>
          <button 
            onClick={() => navigate('/login')}
            type="button"
            style={loginButtonStyles}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 18px 40px rgba(16, 18, 38, 0.14)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 6px 16px rgba(16, 18, 38, 0.06)';
            }}
          >
            Login
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="privacy-content">
        <div className="privacy-header">
          <h1>Privacy Policy</h1>
          <p className="last-updated">Last Updated: December 2024</p>
        </div>

        <div className="privacy-sections">
          <section className="privacy-section">
            <h2>📋 Introduction</h2>
            <p>
              Welcome to Posting Expert ("we," "our," or "us"). We are committed to protecting your 
              privacy and ensuring the security of your personal information. This Privacy Policy 
              explains how we collect, use, disclose, and safeguard your information when you use 
              our AI-powered social media automation platform.
            </p>
          </section>

          <section className="privacy-section">
            <h2>🔍 Information We Collect</h2>
            <div className="info-categories">
              <div className="info-category">
                <h3>Personal Information</h3>
                <ul>
                  <li>Name and contact details</li>
                  <li>Email address</li>
                  <li>Professional information</li>
                  <li>Social media account credentials (securely encrypted)</li>
                </ul>
              </div>
              
              <div className="info-category">
                <h3>Usage Data</h3>
                <ul>
                  <li>Platform interaction data</li>
                  <li>Content generation patterns</li>
                  <li>Performance metrics</li>
                  <li>Technical logs and analytics</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="privacy-section">
            <h2>🎯 How We Use Your Information</h2>
            <div className="usage-grid">
              <div className="usage-card">
                <div className="usage-icon">🤖</div>
                <h4>AI Content Generation</h4>
                <p>To create personalized content using our advanced AI algorithms</p>
              </div>
              
              <div className="usage-card">
                <div className="usage-icon">📊</div>
                <h4>Platform Optimization</h4>
                <p>To improve our services and user experience</p>
              </div>
              
              <div className="usage-card">
                <div className="usage-icon">🔒</div>
                <h4>Security & Protection</h4>
                <p>To protect against fraud and unauthorized access</p>
              </div>
              
              <div className="usage-card">
                <div className="usage-icon">💬</div>
                <h4>Customer Support</h4>
                <p>To provide timely assistance and resolve issues</p>
              </div>
            </div>
          </section>

          <section className="privacy-section">
            <h2>🔗 Data Sharing & Disclosure</h2>
            <p>
              We do not sell, trade, or otherwise transfer your personal information to third parties 
              except in the following circumstances:
            </p>
            <ul>
              <li>With your explicit consent</li>
              <li>To comply with legal obligations</li>
              <li>To protect our rights and safety</li>
              <li>With service providers who assist our operations (under strict confidentiality)</li>
            </ul>
          </section>

          <section className="privacy-section">
            <h2>🛡️ Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your data:
            </p>
            <div className="security-features">
              <div className="security-feature">
                <span className="security-icon">🔐</span>
                <span>End-to-end encryption</span>
              </div>
              <div className="security-feature">
                <span className="security-icon">🛡️</span>
                <span>Regular security audits</span>
              </div>
              <div className="security-feature">
                <span className="security-icon">📝</span>
                <span>Access controls and authentication</span>
              </div>
              <div className="security-feature">
                <span className="security-icon">🔍</span>
                <span>Continuous monitoring</span>
              </div>
            </div>
          </section>

          <section className="privacy-section">
            <h2>🌍 Data Retention</h2>
            <p>
              We retain your personal information only for as long as necessary to fulfill the 
              purposes outlined in this Privacy Policy, unless a longer retention period is 
              required or permitted by law.
            </p>
          </section>

          <section className="privacy-section">
            <h2>📝 Your Rights</h2>
            <p>You have the right to:</p>
            <div className="rights-grid">
              <div className="right-card">
                <h4>Access</h4>
                <p>Request copies of your personal data</p>
              </div>
              <div className="right-card">
                <h4>Rectification</h4>
                <p>Correct inaccurate information</p>
              </div>
              <div className="right-card">
                <h4>Erasure</h4>
                <p>Request deletion of your data</p>
              </div>
              <div className="right-card">
                <h4>Portability</h4>
                <p>Transfer your data to another service</p>
              </div>
            </div>
          </section>

          <section className="privacy-section">
            <h2>🍪 Cookies & Tracking</h2>
            <p>
              We use cookies and similar tracking technologies to track activity on our platform 
              and hold certain information. You can instruct your browser to refuse all cookies 
              or to indicate when a cookie is being sent.
            </p>
          </section>

          <section className="privacy-section">
            <h2>📞 Contact Information</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <div className="contact-info">
              <p><strong>Email:</strong> craftingbrain@gmail.com</p>
              <p><strong>Company:</strong> Inikola Technologies</p>
            </div>
          </section>

          <section className="privacy-section">
            <h2>🔄 Policy Updates</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes 
              by posting the new Privacy Policy on this page and updating the "Last Updated" date.
            </p>
          </section>
        </div>

        <div className="privacy-footer">
          <p>
            By using Posting Expert, you acknowledge that you have read and understood 
            this Privacy Policy.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="premium-footer">
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

export default PrivacyPolicy;