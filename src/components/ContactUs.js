// src/components/ContactUs.js - COMPLETE WITH INLINE STYLES NAVBAR
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./ContactUs.css";

const ContactUs = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');
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

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('');

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      setTimeout(() => setSubmitStatus(''), 5000);
    }, 2000);
  };

  const contactMethods = [
    {
      icon: '📧',
      title: 'Email Us',
      details: 'craftingbrain@gmail.com',
      description: 'Send us an email anytime'
    },
    {
      icon: '🏢',
      title: 'Visit Us',
      details: 'Inikola Technologies',
      description: 'Powered by innovation'
    },
    {
      icon: '⏰',
      title: 'Response Time',
      details: 'Within 24 hours',
      description: 'We reply quickly'
    },
    {
      icon: '🌐',
      title: 'Office Hours',
      details: 'Mon - Fri, 9AM - 6PM',
      description: 'Local business hours'
    }
  ];

  const faqs = [
    {
      question: "How quickly do you respond to inquiries?",
      answer: "We typically respond within 24 hours during business days. For urgent matters, please mention 'URGENT' in your subject line."
    },
    {
      question: "Do you offer technical support?",
      answer: "Yes, we provide comprehensive technical support for all Posting Expert users. Our support team is available to help with any issues."
    },
    {
      question: "Can I schedule a demo of Posting Expert?",
      answer: "Absolutely! We'd love to show you how Posting Expert can transform your social media strategy. Contact us to schedule a personalized demo."
    },
    {
      question: "Do you offer custom solutions?",
      answer: "Yes, we work with businesses to create custom AI-powered marketing solutions tailored to their specific needs."
    }
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
    <div className="contact-us-container">
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
          <Link to="/privacy-policy" style={navLinkStyles}>Privacy Policy</Link>
          <Link to="/contact-us" style={activeLinkStyles}>Contact Us</Link>
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
      <div className="contact-content">
        <div className="contact-header">
          <h1>Get In Touch</h1>
          <p className="contact-subtitle">We'd love to hear from you! Reach out and let's start a conversation.</p>
        </div>

        <div className="contact-grid">
          {/* Contact Information */}
          <div className="contact-info-section">
            <h2>📞 Contact Information</h2>
            <p>Choose the most convenient way to reach us</p>
            
            <div className="contact-methods">
              {contactMethods.map((method, index) => (
                <div key={index} className="contact-method-card">
                  <div className="method-icon">{method.icon}</div>
                  <div className="method-content">
                    <h3>{method.title}</h3>
                    <p className="method-details">{method.details}</p>
                    <p className="method-description">{method.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="additional-info">
              <h3>💡 Before Contacting Us</h3>
              <ul>
                <li>Have your account information ready if you're an existing user</li>
                <li>Describe your issue or question in detail</li>
                <li>Include any relevant screenshots or error messages</li>
                <li>Let us know your preferred contact method</li>
              </ul>
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-form-section">
            <div className="form-container">
              <h2>✉️ Send us a Message</h2>
              <p>Fill out the form below and we'll get back to you soon</p>
              
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your email address"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Subject *</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="demo">Request a Demo</option>
                    <option value="partnership">Partnership</option>
                    <option value="feedback">Feedback</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows="6"
                    placeholder="Tell us how we can help you..."
                  ></textarea>
                </div>

                {submitStatus === 'success' && (
                  <div className="success-message">
                    ✅ Thank you! Your message has been sent successfully. We'll get back to you soon.
                  </div>
                )}

                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="loading-spinner"></span>
                      Sending...
                    </>
                  ) : (
                    'Send Message'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="faq-section">
          <h2>❓ Frequently Asked Questions</h2>
          <div className="faq-grid">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-card">
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Contact */}
        <div className="additional-contact">
          <h2>🚀 Ready to Transform Your Social Media?</h2>
          <p>Join hundreds of businesses using Posting Expert to automate their social media presence</p>
          <div className="cta-buttons">
            <button 
              className="cta-btn primary"
              onClick={() => navigate('/login')}
            >
              Start Free Trial
            </button>
            <button 
              className="cta-btn secondary"
              onClick={() => window.open('mailto:craftingbrain@gmail.com')}
            >
              Schedule Demo
            </button>
          </div>
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

export default ContactUs;