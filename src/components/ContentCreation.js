//src/components/ContentCreation.js - Futuristic Enhanced Version
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ContentCreation.css';

const ContentCreation = ({ user }) => {
  const [prompt, setPrompt] = useState('');
  const [numImages, setNumImages] = useState('');
  const [contentType, setContentType] = useState('');
  const [platforms, setPlatforms] = useState({
    instagram: false,
    x: false,
    linkedin: false,
    facebook: false,
  });
  const [errors, setErrors] = useState({});
  const [responseMessage, setResponseMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastPayload, setLastPayload] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, []);

  const handlePlatformChange = (e) => {
    const { name, checked } = e.target;
    setPlatforms((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSelectAll = () => {
    setPlatforms({ instagram: true, x: true, linkedin: true, facebook: true });
  };

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

  const handleLogout = async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiry');
    localStorage.removeItem('username');
    window.location.href = '/login';
  };

  const validateForm = () => {
    const newErrors = {};
    if (!prompt.trim()) newErrors.prompt = 'Marketing theme is required';
    if (!numImages) newErrors.numImages = 'Please select the number of images';
    if (!contentType) newErrors.contentType = 'Please select a content type';
    if (!Object.values(platforms).includes(true)) {
      newErrors.platforms = 'Please select at least one platform';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e, isRetry = false) => {
    e?.preventDefault();
    if (validateForm() || isRetry) {
      setIsLoading(true);
      const payload = isRetry ? lastPayload : { prompt, numImages, contentType, platforms };
      setLastPayload(payload);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post(
          'http://13.233.45.167:5000/content/generate',
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        setResponseMessage('🎉 Content generated and posted successfully!');
        setIsError(false);
        setLastPayload(null);
        console.log('Backend Response:', response.data);
        setErrors({});
      } catch (err) {
        setResponseMessage(err.response?.data?.error || 'Failed to generate content. Please try again.');
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleReset = () => {
    setPrompt('');
    setNumImages('');
    setContentType('');
    setPlatforms({ instagram: false, x: false, linkedin: false, facebook: false });
    setErrors({});
    setResponseMessage('');
    setIsError(false);
    setLastPayload(null);
  };

  return (
    <div className={`content-creation-container ${isDarkMode ? 'dark' : 'light'}`}>
      {/* Background Watermark Text */}
      <div className="background-text bg-text-1" style={{'--rotate': '-15deg'}}>CREATE</div>
      <div className="background-text bg-text-2" style={{'--rotate': '12deg'}}>AUTOMATE</div>
      <div className="background-text bg-text-3" style={{'--rotate': '-8deg'}}>SOCIAL</div>
      <div className="background-text bg-text-4" style={{'--rotate': '20deg'}}>AI CONTENT</div>
      <div className="background-text bg-text-5" style={{'--rotate': '-18deg'}}>POST</div>
      
      {/* Tech Words */}
      <div className="tech-words tech-word-1">&lt;/&gt; GENERATE</div>
      <div className="tech-words tech-word-2">[ MARKETING ]</div>
      <div className="tech-words tech-word-3">{'{ ENGAGE }'}</div>
      <div className="tech-words tech-word-4">AI POWERED</div>

      {/* Floating Icons */}
      <div className="extra-icons">
        <span className="icon1">🚀</span>
        <span className="icon2">🤖</span>
        <span className="icon3">📊</span>
        <span className="icon4">💡</span>
      </div>

      {/* Theme Toggle */}
      <button className="theme-toggle top-left" onClick={toggleTheme}>
        {isDarkMode ? '☀️' : '🌙'}
      </button>

      {/* Logout Button */}
      <button className="logout-button top-right" onClick={handleLogout}>
        🚪
      </button>

      <div className="content-creation-box">
        <div className="header-section">
          <h1 className="content-creation-header">CraftingBrain</h1>
          <h2 className="content-creation-subheader">AI-Powered Content Creation</h2>
          <div className="header-decoration"></div>
        </div>

        {/* Enhanced Info Card */}
        <div className="info-card">
          <span className="info-card-icon">✨</span>
          <div className="info-card-text">
            <strong>Create Your Content with Just One Click!</strong>
            Transform your ideas into stunning social media posts instantly. Our AI analyzes your theme, 
            generates professional visuals, and publishes directly to your chosen platforms.
            <div className="info-highlights">
              <span className="info-highlight">⚡ Lightning Fast</span>
              <span className="info-highlight">🎨 Pro Quality</span>
              <span className="info-highlight">🚀 Auto-Post</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="prompt">Marketing Theme 🎯</label>
            <input
              type="text"
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="E.g., Promote eco-friendly products, AI technology trends..."
              required
            />
            {errors.prompt && <span className="error-message">{errors.prompt}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="numImages">Number of Images 📸</label>
            <select
              id="numImages"
              value={numImages}
              onChange={(e) => setNumImages(e.target.value)}
              required
            >
              <option value="" disabled>Choose number of images</option>
              {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} Image{n > 1 ? 's' : ''}</option>)}
            </select>
            {errors.numImages && <span className="error-message">{errors.numImages}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="contentType">Content Type 📝</label>
            <select
              id="contentType"
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
              required
            >
              <option value="" disabled>Choose content style</option>
              {[
                { value: "Informative", label: "📚 Informative - Educational & factual" },
                { value: "Inspirational", label: "💫 Inspirational - Motivating & uplifting" },
                { value: "Promotional", label: "🎉 Promotional - Sales & marketing" },
                { value: "Educational", label: "🎓 Educational - Teaching & training" },
                { value: "Engaging", label: "🔥 Engaging - Interactive & fun" }
              ].map((type) => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
            {errors.contentType && <span className="error-message">{errors.contentType}</span>}
          </div>

          <div className="form-group">
            <label>Target Platforms 🌐</label>
            <div className="platform-grid">
              {[
                { key: 'instagram', icon: '📷', name: 'Instagram' },
                { key: 'x', icon: '𝕏', name: 'X (Twitter)' },
                { key: 'linkedin', icon: '💼', name: 'LinkedIn' },
                { key: 'facebook', icon: '👥', name: 'Facebook' }
              ].map(({ key, icon, name }) => (
                <label key={key} className={`platform-card ${platforms[key] ? 'selected' : ''}`}>
                  <input
                    type="checkbox"
                    name={key}
                    checked={platforms[key]}
                    onChange={handlePlatformChange}
                    className="platform-checkbox"
                  />
                  <div className="platform-content">
                    <span className="platform-icon">{icon}</span>
                    <span className="platform-name">{name}</span>
                  </div>
                </label>
              ))}
            </div>
            <button type="button" className="select-all-button" onClick={handleSelectAll}>
              ✓ Select All Platforms
            </button>
            {errors.platforms && <span className="error-message">{errors.platforms}</span>}
          </div>

          <div className="form-actions">
            <button type="submit" className="post-button" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  <span>Generating...</span>
                </>
              ) : (
                '🚀 Generate & Post'
              )}
            </button>
            <button type="button" className="reset-button" onClick={handleReset}>
              🔄 Reset
            </button>
          </div>
        </form>

        {responseMessage && (
          <div className={isError ? 'response-error' : 'response-success'}>
            <div className="response-icon">{isError ? '!' : '✓'}</div>
            <div className="response-content">
              <p>{responseMessage}</p>
              {isError && lastPayload && (
                <button
                  type="button"
                  className="retry-button"
                  onClick={() => handleSubmit(null, true)}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner"></span>
                      <span>Retrying...</span>
                    </>
                  ) : (
                    '🔄 Retry'
                  )}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentCreation;