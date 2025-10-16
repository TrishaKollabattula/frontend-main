// src/components/Login.js - Futuristic AI Version (Fixed)
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);
  const navigate = useNavigate();

  const phrases = useMemo(() => [
    'Generates Content',
    'Post to Multiple Platforms',
    'Smart Schedulers',
    'Boost Your Engagement',
    'Automate Your Marketing'
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

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark" || !saved) {
      setIsDarkMode(true);
      document.body.classList.add("dark");
    }

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

  return (
    <div className="futuristic-login-container">
      <div className="cyber-grid"></div>
      <div className="floating-particles">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="particle"></div>
        ))}
      </div>

      <button className="theme-toggle-futuristic" onClick={toggleTheme}>
        {isDarkMode ? '☀️' : '🌙'}
      </button>

      <nav className="header-nav">
        <a href="#home" className="nav-link">Home</a>
        <a href="#about" className="nav-link">About</a>
        <a href="#contact" className="nav-link">Contact</a>
      </nav>

      <div id="home" className="login-content-wrapper">
        <div className="hero-section">
          <div className="brand-header-futuristic">
            <div className="brand-presents">Inikola Presents</div>
            <div className="brand-main">
              <div className="logo-container">
                <img src="/123.png" alt="Marketing Bot" className="brand-logo-futuristic" />
                <div className="logo-glow"></div>
              </div>
              <div className="brand-info-futuristic">
                <h1>Marketing Bot</h1>
                <p className="brand-tagline">AI-Powered Automation</p>
              </div>
            </div>
          </div>

          <div className="hero-typing-container">
            <h2 className="hero-title">
              <span className="gradient-text">{typedText}</span>
              <span className="cursor-blink">|</span>
            </h2>
            <p className="hero-subtitle">
              Revolutionize your social media presence with cutting-edge AI technology
            </p>
          </div>

          <div className="integrations-section">
            <h3 className="section-title">
              <span className="icon-pulse">🔗</span> Seamless Integrations
            </h3>
            <p className="section-subtitle">Connect with multiple platforms instantly</p>
            
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
                  <div className="connection-line"></div>
                </div>
              ))}
            </div>
          </div>

          <div className="features-futuristic">
            <div className="feature-card-futuristic">
              <div className="feature-icon-futuristic">🎨</div>
              <h4>AI Content</h4>
              <p>Generate stunning visuals & captions</p>
            </div>
            <div className="feature-card-futuristic">
              <div className="feature-icon-futuristic">📊</div>
              <h4>Analytics</h4>
              <p>Real-time performance insights</p>
            </div>
            <div className="feature-card-futuristic">
              <div className="feature-icon-futuristic">⚡</div>
              <h4>Automation</h4>
              <p>Schedule & post automatically</p>
            </div>
          </div>
        </div>

        <div className="login-form-section">
          <div className="form-container-futuristic">
            <div className="form-header-futuristic">
              <h2>Welcome Back</h2>
              <p>Access your AI marketing dashboard</p>
            </div>

            <form className="futuristic-form" onSubmit={handleSubmit}>
              <div className="input-group-futuristic">
                <label>Username</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                  <div className="input-glow"></div>
                </div>
              </div>

              <div className="input-group-futuristic">
                <label>Password</label>
                <div className="input-wrapper password-wrapper-futuristic">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
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
              </div>

              <div className="remember-me-futuristic">
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span className="checkmark"></span>
                  <span className="checkbox-label">Remember me for 30 days</span>
                </label>
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

              <button 
                type="submit" 
                className="submit-btn-futuristic" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="loading-spinner"></span>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>Launch Dashboard</span>
                    <span className="btn-arrow">→</span>
                  </>
                )}
                <div className="btn-glow"></div>
              </button>
            </form>

            <div className="form-footer-futuristic">
              <p>
                New to Marketing Bot? 
                <a href="/register"> Create Account</a>
              </p>
            </div>

            <div className="stats-futuristic">
              <div className="stat-item-futuristic">
                <div className="stat-value">10+</div>
                <div className="stat-label">Active Users</div>
              </div>
              <div className="stat-item-futuristic">
                <div className="stat-value">50+</div>
                <div className="stat-label">Posts</div>
              </div>
              <div className="stat-item-futuristic">
                <div className="stat-value">98%</div>
                <div className="stat-label">Success</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <section id="about" className="info-section">
        <div className="section-container">
          <div className="section-header">
            <h2>About Marketing Bot</h2>
            <p>Your AI-Powered Social Media Automation Platform</p>
          </div>
          <div className="section-content">
            <p>
              Marketing Bot is a cutting-edge AI-powered platform designed to revolutionize the way businesses manage their social media presence. We combine advanced artificial intelligence with seamless platform integrations to deliver unprecedented marketing automation capabilities.
            </p>
            
            <h3>🎯 Our Mission</h3>
            <p>
              To empower businesses of all sizes to harness the power of AI for creating, scheduling, and managing their social media content across multiple platforms effortlessly.
            </p>
            
            <h3>✨ Key Features</h3>
            <ul>
              <li>AI-powered content generation for stunning visuals and engaging captions</li>
              <li>Seamless integration with LinkedIn, Instagram, and Facebook</li>
              <li>Intelligent scheduling and automated posting</li>
              <li>Real-time analytics and performance insights</li>
              <li>Smart campaign management and optimization</li>
              <li>Multi-platform content adaptation</li>
            </ul>
            
            <h3>🚀 Why Choose Us</h3>
            <p>
              With Marketing Bot, you're not just getting a tool – you're getting a strategic partner in your digital marketing journey. Our platform leverages state-of-the-art AI technology to help you create compelling content, save time, and achieve better results across all your social media channels.
            </p>
            
            <p>
              Join thousands of businesses already transforming their social media strategy with Marketing Bot.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="info-section">
        <div className="section-container">
          <div className="section-header">
            <h2>Get In Touch</h2>
            <p>We'd love to hear from you!</p>
          </div>
          <div className="section-content">
            <p>
              Have questions about Marketing Bot? Want to learn more about our services? Our team is here to help you succeed.
            </p>
            
            <div className="contact-grid">
              <div className="contact-card">
                <div className="contact-card-icon">📧</div>
                <div className="contact-card-label">Email Us</div>
                <div className="contact-card-value">
                  <a href="mailto:craftingbrain@gmail.com">craftingbrain@gmail.com</a>
                </div>
              </div>
              
              <div className="contact-card">
                <div className="contact-card-icon">🌐</div>
                <div className="contact-card-label">Company</div>
                <div className="contact-card-value">Inikola Technologies</div>
              </div>
              
              <div className="contact-card">
                <div className="contact-card-icon">⏰</div>
                <div className="contact-card-label">Response Time</div>
                <div className="contact-card-value">Within 24 hours</div>
              </div>
            </div>
            
            <h3>💬 What We Can Help With</h3>
            <ul>
              <li>Platform demos and walkthroughs</li>
              <li>Technical support and troubleshooting</li>
              <li>Feature requests and feedback</li>

              <li>General inquiries</li>
            </ul>
            
            <p style={{marginTop: '2rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '1.125rem'}}>
              We're committed to providing exceptional support and ensuring your success with Marketing Bot.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;
