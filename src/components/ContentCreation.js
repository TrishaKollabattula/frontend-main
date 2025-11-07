// src/components/ContentCreation.js - BLACK, MAROON & TEAL THEME
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './ContentCreation.css';

const API = 'http://13.233.45.167:5000';

const ContentCreation = ({ user }) => {
  const [prompt, setPrompt] = useState('');
  const [numImages, setNumImages] = useState('');
  const [contentType, setContentType] = useState('');
  const [platforms, setPlatforms] = useState({
    instagram: false,
    linkedin: false,
    facebook: false,
  });

  const [errors, setErrors] = useState({});
  const [responseMessage, setResponseMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // queue state
  const [jobId, setJobId] = useState(null);
  const [jobStatus, setJobStatus] = useState(null);
  const [result, setResult] = useState(null);
  const pollRef = useRef(null);

  const [lastPayload, setLastPayload] = useState(null);

  // Meme Mode state
  const [isMemeMode, setIsMemeMode] = useState(() => {
    const saved = localStorage.getItem('meme_mode');
    return saved === 'true';
  });

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  const handlePlatformChange = (e) => {
    const { name, checked } = e.target;
    setPlatforms((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSelectAll = () => {
    setPlatforms({ instagram: true, linkedin: true, facebook: true });
  };

  const toggleMemeMode = () => {
    const next = !isMemeMode;
    setIsMemeMode(next);
    localStorage.setItem('meme_mode', String(next));
  };

  const handleLogout = async () => {
    await new Promise((r) => setTimeout(r, 300));
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiry');
    localStorage.removeItem('username');
    localStorage.removeItem('user_id');
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

  const extractResultFromStatus = (data) => {
    const meta = data?.meta || {};
    return meta.result || data.result || data.output || null;
  };

  const extractErrorFromStatus = (data) => {
    const meta = data?.meta || {};
    return meta.error || data.error || null;
  };

  const pollStatus = (id) => {
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(async () => {
      try {
        const { data } = await axios.get(`${API}/queue/status/${id}`);
        setJobStatus(data.status);

        if (data.status === 'completed') {
          const r = extractResultFromStatus(data);
          setResult(r);
          setResponseMessage('🎉 Content generated successfully! Check your email for download links.');
          setIsError(false);
          setIsLoading(false);
          clearInterval(pollRef.current);
          pollRef.current = null;
        } else if (data.status === 'failed') {
          const errText = extractErrorFromStatus(data) || 'Job failed. Please try again.';
          setIsLoading(false);
          setIsError(true);
          setResponseMessage(errText);
          clearInterval(pollRef.current);
          pollRef.current = null;
        }
      } catch (err) {
        setIsLoading(false);
        setIsError(true);
        setResponseMessage('Failed to fetch job status.');
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    }, 2000);
  };

  const enqueue = async (payload) => {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const { data } = await axios.post(`${API}/queue/enqueue`, payload, { headers });
    return data;
  };

  const handleSubmit = async (e, isRetry = false) => {
    e?.preventDefault();
    if (!(validateForm() || isRetry)) return;

    const userId =
      (user && (user.username || user.id)) ||
      localStorage.getItem('username') ||
      localStorage.getItem('user_id') ||
      '';

    const username = 
      (user && user.username) ||
      localStorage.getItem('username') ||
      userId ||
      '';

    if (!userId || !username) {
      setIsError(true);
      setResponseMessage('You must be logged in. Missing user credentials.');
      return;
    }

    setIsLoading(true);
    setIsError(false);
    setResponseMessage('');
    setResult(null);
    setJobStatus(null);
    setJobId(null);

    const payload = isRetry
      ? lastPayload
      : {
          prompt,
          numImages: Number(numImages),
          contentType,
          user_id: userId,
          username: username,
          platforms: {
            instagram: platforms.instagram,
            linkedin: platforms.linkedin,
            facebook: platforms.facebook,
          },
          meme: isMemeMode,
          meme_mode: isMemeMode,
        };

    setLastPayload(payload);

    try {
      const { job_id } = await enqueue(payload);
      setJobId(job_id);
      setJobStatus('queued');
      setResponseMessage('✅ Request queued successfully! Check your email for updates on processing status.');

      pollStatus(job_id);
    } catch (err) {
      setIsLoading(false);
      setIsError(true);
      const msg =
        err?.response?.data?.error ||
        err?.message ||
        'Failed to enqueue job. Please try again.';
      setResponseMessage(msg);
    }
  };

  const handleReset = () => {
    setPrompt('');
    setNumImages('');
    setContentType('');
    setPlatforms({ instagram: false, linkedin: false, facebook: false });
    setErrors({});
    setResponseMessage('');
    setIsError(false);
    setLastPayload(null);
    setResult(null);
    setJobStatus(null);
    setJobId(null);
    if (pollRef.current) clearInterval(pollRef.current);
  };

  const statusLabel = (() => {
    if (jobStatus === 'in_progress') return 'Processing…';
    if (jobStatus === 'queued') return 'Queued…';
    if (jobStatus === 'completed') return 'Completed';
    if (jobStatus === 'failed') return 'Failed';
    return jobStatus || '—';
  })();

  const isBusy = isLoading || jobStatus === 'queued' || jobStatus === 'in_progress';

  return (
    <div className="content-creation-container">
      {/* Animated Background Effects */}
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

      {/* Logout Button */}
      <button className="logout-button" onClick={handleLogout} type="button">
        <span className="logout-icon">🚪</span>
        <span className="logout-text">Logout</span>
      </button>

      <div className="content-creation-box">
        <div className="header-section">
          <div className="brand-badge">
            <span className="brand-badge-icon">⚡</span>
            <span className="brand-badge-text">Posting Expert</span>
          </div>
          <h1 className="content-creation-header">AI Content Studio</h1>
          <p className="content-creation-subheader">Transform Ideas into Engaging Social Media Content</p>
          <div className="header-decoration"></div>
        </div>

        {/* Info Card */}
        <div className="info-card">
          <div className="info-card-icon-wrapper">
            <span className="info-card-icon">✨</span>
          </div>
          <div className="info-card-content">
            <h3 className="info-card-title">Create Your Content with AI Power!</h3>
            <p className="info-card-description">
              Transform your ideas into stunning social media posts instantly. Our AI analyzes your theme,
              generates professional visuals, and publishes directly to your chosen platforms.
            </p>
            <div className="info-highlights">
              <span className="info-highlight">
                <span className="highlight-icon">⚡</span>
                <span>Lightning Fast</span>
              </span>
              <span className="info-highlight">
                <span className="highlight-icon">🎨</span>
                <span>Pro Quality</span>
              </span>
              <span className="info-highlight">
                <span className="highlight-icon">🚀</span>
                <span>Auto-Post</span>
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="content-form">
          <div className="form-group">
            <label htmlFor="prompt">
              <span className="label-icon">🎯</span>
              <span className="label-text">Marketing Theme</span>
            </label>
            <input
              type="text"
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="E.g., Promote eco-friendly products, AI technology trends..."
              className="form-input"
              required
            />
            {errors.prompt && <span className="error-message">{errors.prompt}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="numImages">
                <span className="label-icon">📸</span>
                <span className="label-text">Number of Images</span>
              </label>
              <select
                id="numImages"
                value={numImages}
                onChange={(e) => setNumImages(e.target.value)}
                className="form-select"
                required
              >
                <option value="" disabled>Choose number</option>
                {[1, 2, 3, 4, 5].map(n => (
                  <option key={n} value={n}>{n} Image{n > 1 ? 's' : ''}</option>
                ))}
              </select>
              {errors.numImages && <span className="error-message">{errors.numImages}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="contentType">
                <span className="label-icon">📝</span>
                <span className="label-text">Content Type</span>
              </label>
              <select
                id="contentType"
                value={contentType}
                onChange={(e) => setContentType(e.target.value)}
                className="form-select"
                required
              >
                <option value="" disabled>Choose style</option>
                {[
                  { value: "Informative", label: "📚 Informative" },
                  { value: "Inspirational", label: "💫 Inspirational" },
                  { value: "Promotional", label: "🎉 Promotional" },
                  { value: "Educational", label: "🎓 Educational" },
                  { value: "Engaging", label: "🔥 Engaging" }
                ].map((type) => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
              {errors.contentType && <span className="error-message">{errors.contentType}</span>}
            </div>
          </div>

          {/* Meme Mode */}
          <div className="form-group meme-mode-group">
            <div className="meme-mode-header">
              <label className="meme-mode-label">
                <span className="label-icon">😄</span>
                <span className="label-text">Meme Mode</span>
              </label>
              <label className="meme-switch">
                <input
                  type="checkbox"
                  checked={isMemeMode}
                  onChange={toggleMemeMode}
                  disabled={isBusy}
                />
                <span className="meme-slider"></span>
              </label>
            </div>
            <p className="meme-mode-description">
              {isMemeMode
                ? '✓ Meme templates, captions, and aspect ratios enabled'
                : 'Turn on to generate meme-style content with Impact font and panels'}
            </p>
          </div>

          <div className="form-group">
            <label>
              <span className="label-icon">🌐</span>
              <span className="label-text">Target Platforms</span>
            </label>
            <div className="platform-grid">
              {[
                { key: 'instagram', icon: '📷', name: 'Instagram', color: '#E1306C' },
                { key: 'linkedin', icon: '💼', name: 'LinkedIn', color: '#0077B5' },
                { key: 'facebook', icon: '👥', name: 'Facebook', color: '#1877F2' }
              ].map(({ key, icon, name, color }) => (
                <label 
                  key={key} 
                  className={`platform-card ${platforms[key] ? 'selected' : ''}`}
                  style={platforms[key] ? {'--platform-color': color} : {}}
                >
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
                    {platforms[key] && <span className="platform-checkmark">✓</span>}
                  </div>
                </label>
              ))}
            </div>
            <button type="button" className="select-all-button" onClick={handleSelectAll}>
              <span className="btn-icon">✓</span>
              <span>Select All Platforms</span>
            </button>
            {errors.platforms && <span className="error-message">{errors.platforms}</span>}
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={isBusy}>
              {isBusy ? (
                <>
                  <span className="loading-spinner"></span>
                  <span>{statusLabel}</span>
                </>
              ) : (
                <>
                  <span className="btn-icon">🚀</span>
                  <span>Generate & Post</span>
                </>
              )}
            </button>
            <button type="button" className="btn btn-secondary" onClick={handleReset} disabled={isLoading}>
              <span className="btn-icon">🔄</span>
              <span>Reset</span>
            </button>
          </div>
        </form>

        {/* Queue status */}
        {(jobId || jobStatus) && (
          <div className="queue-status">
            <div className="status-item">
              <span className="status-label">Job ID:</span>
              <span className="status-value">{jobId || '-'}</span>
            </div>
            <div className="status-item">
              <span className="status-label">Status:</span>
              <span className={`status-badge status-${jobStatus}`}>{statusLabel}</span>
            </div>
            <p className="email-reminder">
              <span className="reminder-icon">📧</span>
              <span>Check your email for detailed updates</span>
            </p>
          </div>
        )}

        {/* Response Message */}
        {responseMessage && (
          <div className={`alert ${isError ? 'alert-error' : 'alert-success'}`}>
            <div className="alert-icon-wrapper">
              <span className="alert-icon">{isError ? '⚠️' : '✓'}</span>
            </div>
            <div className="alert-content">
              <p className="alert-message">{responseMessage}</p>
              {isError && lastPayload && (
                <button
                  type="button"
                  className="retry-button"
                  onClick={(e) => handleSubmit(e, true)}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="loading-spinner"></span>
                      <span>Retrying...</span>
                    </>
                  ) : (
                    <>
                      <span className="btn-icon">🔄</span>
                      <span>Retry</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Generated Assets */}
        {result?.image_urls?.length > 0 && (
          <div className="generated-preview">
            <h3 className="preview-title">
              <span className="preview-icon">🖼️</span>
              <span>Generated Images</span>
            </h3>
            <div className="preview-grid">
              {result.image_urls.map((url, i) => (
                <a key={i} href={url} target="_blank" rel="noreferrer" className="preview-link">
                  <img src={url} alt={`Generated ${i + 1}`} className="preview-image" />
                  <div className="preview-overlay">
                    <span className="preview-overlay-text">View Full Size</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
        
        {result?.pdf_url && (
          <div className="generated-preview">
            <h3 className="preview-title">
              <span className="preview-icon">📄</span>
              <span>LinkedIn/PDF Document</span>
            </h3>
            <a href={result.pdf_url} target="_blank" rel="noreferrer" className="pdf-link">
              <span className="pdf-icon">📥</span>
              <span>Download PDF</span>
              <span className="link-arrow">→</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentCreation;