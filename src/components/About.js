// src/components/About.js - COMPLETE WITH INLINE STYLES NAVBAR
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./About.css";

const About = () => {
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

  const teamMembers = [
    {
      name: "Inikola Technologies",
      role: "Technology Partner",
      description: "Leading the innovation in AI-powered marketing solutions",
      expertise: ["AI/ML", "Cloud Infrastructure", "Software Development"],
      avatar: "🏢"
    },
    {
      name: "CraftingBrain",
      role: "Strategic Partner", 
      description: "Driving educational technology and content excellence",
      expertise: ["EdTech", "Content Strategy", "User Experience"],
      avatar: "🧠"
    }
  ];

  const milestones = [
    { year: "2024", event: "Posting Expert Launched", description: "Revolutionizing social media automation" },
    { year: "2024", event: "AI Integration", description: "Advanced GPT-4 content generation" },
    { year: "2024", event: "Multi-Platform Support", description: "LinkedIn, Instagram, Facebook integration" },
    { year: "2025", event: "Enterprise Adoption", description: "Trusted by leading companies" }
  ];

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
    <div className="about-container">
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
          <Link to="/about" style={activeLinkStyles}>About</Link>
          <Link to="/privacy-policy" style={navLinkStyles}>Privacy Policy</Link>
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
      <div className="about-content">
        {/* Hero Section */}
        <section className="about-hero">
          <div className="hero-content">
            <h1>About Posting Expert</h1>
            <p className="hero-subtitle">
              Revolutionizing Social Media Management with Artificial Intelligence
            </p>
            <div className="hero-stats">
              <div className="stat">
                <div className="stat-number">500+</div>
                <div className="stat-label">Active Users</div>
              </div>
              <div className="stat">
                <div className="stat-number">10K+</div>
                <div className="stat-label">Posts Generated</div>
              </div>
              <div className="stat">
                <div className="stat-number">3</div>
                <div className="stat-label">Platforms</div>
              </div>
              <div className="stat">
                <div className="stat-number">98%</div>
                <div className="stat-label">Success Rate</div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="mission-section">
          <div className="section-container">
            <div className="mission-grid">
              <div className="mission-content">
                <h2>🚀 Our Mission</h2>
                <p>
                  To democratize AI-powered social media marketing for businesses of all sizes. 
                  We believe that every company deserves access to cutting-edge technology that 
                  can transform their digital presence and drive real results.
                </p>
                <p>
                  Posting Expert was born from the collaboration between <strong>Inikola Technologies</strong> 
                  and <strong>CraftingBrain</strong>, combining technical excellence with strategic 
                  marketing insights.
                </p>
              </div>
              <div className="mission-visual">
                <div className="floating-card">
                  <div className="card-icon">🤖</div>
                  <h4>AI-Powered</h4>
                  <p>Advanced machine learning algorithms</p>
                </div>
                <div className="floating-card">
                  <div className="card-icon">⚡</div>
                  <h4>Lightning Fast</h4>
                  <p>Generate content in seconds</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="story-section">
          <div className="section-container">
            <h2>📖 Our Story</h2>
            <div className="story-timeline">
              {milestones.map((milestone, index) => (
                <div key={index} className="timeline-item">
                  <div className="timeline-year">{milestone.year}</div>
                  <div className="timeline-content">
                    <h3>{milestone.event}</h3>
                    <p>{milestone.description}</p>
                  </div>
                  <div className="timeline-connector"></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="team-section">
          <div className="section-container">
            <h2>👥 Our Team</h2>
            <p className="section-subtitle">
              Powered by the strategic partnership of two innovative companies
            </p>
            
            <div className="team-grid">
              {teamMembers.map((member, index) => (
                <div key={index} className="team-card">
                  <div className="member-avatar">
                    {member.avatar}
                  </div>
                  <div className="member-info">
                    <h3>{member.name}</h3>
                    <p className="member-role">{member.role}</p>
                    <p className="member-description">{member.description}</p>
                    <div className="expertise-tags">
                      {member.expertise.map((skill, skillIndex) => (
                        <span key={skillIndex} className="expertise-tag">{skill}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="values-section">
          <div className="section-container">
            <h2>💎 Our Values</h2>
            <div className="values-grid">
              <div className="value-card">
                <div className="value-icon">🎯</div>
                <h3>Innovation</h3>
                <p>Constantly pushing the boundaries of what's possible with AI and automation</p>
              </div>
              <div className="value-card">
                <div className="value-icon">🤝</div>
                <h3>Collaboration</h3>
                <p>Working together with our users to create the best possible solutions</p>
              </div>
              <div className="value-card">
                <div className="value-icon">🔒</div>
                <h3>Security</h3>
                <p>Enterprise-grade security and privacy for all user data</p>
              </div>
              <div className="value-card">
                <div className="value-icon">🚀</div>
                <h3>Excellence</h3>
                <p>Committed to delivering exceptional results and user experiences</p>
              </div>
            </div>
          </div>
        </section>

        {/* Technology Section */}
        <section className="tech-section">
          <div className="section-container">
            <h2>🔧 Our Technology</h2>
            <div className="tech-stack">
              <div className="tech-item">
                <div className="tech-icon">🧠</div>
                <div className="tech-info">
                  <h3>AI Content Generation</h3>
                  <p>Powered by advanced GPT-4 technology for creating engaging, platform-optimized content</p>
                </div>
              </div>
              <div className="tech-item">
                <div className="tech-icon">🔗</div>
                <div className="tech-info">
                  <h3>Seamless Integrations</h3>
                  <p>Direct API connections with LinkedIn, Instagram, and Facebook for effortless posting</p>
                </div>
              </div>
              <div className="tech-item">
                <div className="tech-icon">📊</div>
                <div className="tech-info">
                  <h3>Smart Analytics</h3>
                  <p>Real-time performance tracking and optimization recommendations</p>
                </div>
              </div>
              <div className="tech-item">
                <div className="tech-icon">⚡</div>
                <div className="tech-info">
                  <h3>Cloud Infrastructure</h3>
                  <p>Scalable, reliable cloud architecture ensuring 99.9% uptime</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="section-container">
            <h2>Ready to Transform Your Social Media?</h2>
            <p>Join hundreds of businesses already using Posting Expert to save time and grow their presence</p>
            <div className="cta-buttons">
              <button 
                className="cta-btn primary"
                onClick={() => navigate('/login')}
              >
                Start Free Trial
              </button>
              <button 
                className="cta-btn secondary"
                onClick={() => navigate('/contact-us')}
              >
                Contact Sales
              </button>
            </div>
          </div>
        </section>
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

export default About;