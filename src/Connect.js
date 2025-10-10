// src/Connect.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Connect.css';
import LinkedInConnect from './components/LinkedInConnect';
import InstagramConnect from './components/InstagramConnect';
import FacebookConnect from './components/FacebookConnect';

const Connect = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [user, setUser] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [socialConnections, setSocialConnections] = useState({
    instagram: { connected: false, detail: null },
    linkedin: { connected: false, detail: null },
    twitter: { connected: false, detail: null },
    facebook: { connected: false, detail: null }
  });
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      setIsDarkMode(true);
      document.body.classList.add('dark');
    }

    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `http://13.233.45.167:5000/user/profile`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.ok) {
          const userData = await response.json();
          console.log('User data from API:', userData);
          
          setUser({
            username: userData.username || username,
            email: userData.email || 'user@example.com',
            businessType: userData.business_type || 'Not specified',
            joinDate: userData.created_at 
              ? new Date(userData.created_at * 1000).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
              : 'Recently',
            postsCreated: userData.posts_created || 0,
            connectedAccounts: userData.connected_accounts || 0
          });
        } else {
          setUser({
            username: username || 'User',
            email: 'user@example.com',
            businessType: 'Not specified',
            joinDate: 'Recently',
            postsCreated: 0,
            connectedAccounts: 0
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setUser({
          username: username || 'User',
          email: 'user@example.com',
          businessType: 'Not specified',
          joinDate: 'Recently',
          postsCreated: 0,
          connectedAccounts: 0
        });
      }
    };

    fetchUserData();
    fetchSocialStatus();
  }, [navigate]);

  const fetchSocialStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const appUser = localStorage.getItem('username');
      
      const response = await fetch(
        `http://13.233.45.167:5000/social/status?app_user=${appUser}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log('Social status data:', data);
        
        setSocialConnections({
          instagram: {
            connected: data.instagram?.connected || false,
            detail: data.instagram?.detail || null
          },
          linkedin: {
            connected: data.linkedin?.connected || false,
            detail: data.linkedin?.detail || null
          },
          twitter: {
            connected: data.twitter?.connected || false,
            detail: data.twitter?.detail || null
          },
          facebook: {
            connected: data.facebook?.connected || false,
            detail: data.facebook?.detail || null
          }
        });
      }
    } catch (error) {
      console.error('Error fetching social status:', error);
    }
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

  const handleLogout = () => {
    setShowProfileMenu(false);
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login', { replace: true });
  };

  const handleSocialConnect = (platform) => {
    if (platform === 'Twitter') {
      alert(`${platform} connection coming soon!`);
    }
  };

  const connectedAccounts = [
    { 
      name: 'Instagram', 
      icon: '📷', 
      connected: socialConnections.instagram.connected, 
      color: '#E1306C',
      component: InstagramConnect,
      detail: socialConnections.instagram.detail
    },
    { 
      name: 'LinkedIn', 
      icon: '💼', 
      connected: socialConnections.linkedin.connected, 
      color: '#0077B5',
      component: LinkedInConnect,
      detail: socialConnections.linkedin.detail
    },
    { 
      name: 'Twitter', 
      icon: '🐦', 
      connected: socialConnections.twitter.connected, 
      color: '#1DA1F2',
      component: null,
      detail: socialConnections.twitter.detail
    },
    { 
      name: 'Facebook', 
      icon: '👥', 
      connected: socialConnections.facebook.connected, 
      color: '#1877F2',
      component: FacebookConnect,  // ✅ Added Facebook component
      detail: socialConnections.facebook.detail
    }
  ];

  const quickActions = [
    { title: 'Create Content', icon: '✨', path: '/content-creation', desc: 'Generate AI-powered posts' },
    { title: 'Schedule Posts', icon: '📅', path: '/schedule', desc: 'Plan your content calendar' },
    { title: 'Analytics', icon: '📊', path: '/analytics', desc: 'Track your performance' },
    { title: 'My Posts', icon: '📝', path: '/my-posts', desc: 'View all your content' }
  ];

  return (
    <div className={`connect-container ${isDarkMode ? 'dark' : 'light'}`}>
      <header className="connect-header">
        <div className="header-left">
          <img src="/123.jpg" alt="Logo" className="header-logo" />
          <h1 className="header-title">Marketing Bot</h1>
        </div>
        
        <div className="header-right">
          <button className="theme-toggle-btn" onClick={toggleTheme}>
            {isDarkMode ? '☀️' : '🌙'}
          </button>
          
          <div className="profile-dropdown">
            <button 
              className="profile-btn" 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              <div className="profile-avatar">
                {user?.username.charAt(0).toUpperCase()}
              </div>
              <span className="profile-name">{user?.username}</span>
              <span className="dropdown-arrow">▼</span>
            </button>
            
            {showProfileMenu && (
              <div className="profile-menu">
                <div className="profile-menu-header">
                  <div className="profile-avatar-large">
                    {user?.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="profile-info">
                    <h3>{user?.username}</h3>
                    <p>{user?.email}</p>
                  </div>
                </div>
                <div className="profile-menu-divider"></div>
                <button className="profile-menu-item" onClick={() => navigate('/profile')}>
                  👤 View Profile
                </button>
                <button className="profile-menu-item" onClick={() => navigate('/settings')}>
                  ⚙️ Settings
                </button>
                <div className="profile-menu-divider"></div>
                <button className="profile-menu-item logout" onClick={handleLogout}>
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="connect-main">
        <div className="connect-content">
          
          <section className="welcome-section">
            <h2 className="section-title">Welcome back, {user?.username}! 👋</h2>
            <p className="section-subtitle">
              Let's create amazing content for your {user?.businessType} business
            </p>
          </section>

          <section className="quick-actions-section">
            <h3 className="section-heading">Quick Actions</h3>
            <div className="quick-actions-grid">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  className="action-card"
                  onClick={() => navigate(action.path)}
                >
                  <div className="action-icon">{action.icon}</div>
                  <h4 className="action-title">{action.title}</h4>
                  <p className="action-desc">{action.desc}</p>
                </button>
              ))}
            </div>
          </section>

          <section className="social-connect-section">
            <div className="section-header">
              <h3 className="section-heading">Connect Social Media</h3>
              <p className="section-description">
                Link your accounts to start posting automatically
              </p>
            </div>
            
            <div className="social-accounts-grid">
              {connectedAccounts.map((account, index) => (
                <div key={index} className="social-account-card">
                  <div className="social-icon" style={{ background: account.color }}>
                    {account.icon}
                  </div>
                  <div className="social-info">
                    <h4 className="social-name">{account.name}</h4>
                    <p className="social-status">
                      {account.connected ? 'Connected' : 'Not connected'}
                    </p>
                    {/* ✅ Show connection details for Facebook */}
                    {account.name === 'Facebook' && account.connected && account.detail && (
                      <p className="social-detail">
                        Page: {account.detail.page_name}
                      </p>
                    )}
                  </div>
                  {account.component ? (
                    <account.component
                      appUser={user?.username}
                      onConnected={fetchSocialStatus}
                      connected={account.connected}
                      status={account.detail}
                    />
                  ) : (
                    <button 
                      className={`social-connect-btn ${account.connected ? 'connected' : ''}`}
                      onClick={() => handleSocialConnect(account.name)}
                    >
                      {account.connected ? 'Disconnect' : 'Connect'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="profile-card-section">
            <div className="profile-card">
              <div className="profile-card-header">
                <div className="profile-avatar-xl">
                  {user?.username.charAt(0).toUpperCase()}
                </div>
                <div className="profile-card-info">
                  <h3 className="profile-card-name">{user?.username}</h3>
                  <p className="profile-card-email">{user?.email}</p>
                </div>
                <button 
                  className="edit-profile-btn"
                  onClick={() => navigate('/profile')}
                >
                  Edit Profile
                </button>
              </div>
              
              <div className="profile-card-divider"></div>
              
              <div className="profile-card-details">
                <div className="profile-detail-item">
                  <span className="detail-label">Business Type</span>
                  <span className="detail-value">{user?.businessType || 'Not specified'}</span>
                </div>
                <div className="profile-detail-item">
                  <span className="detail-label">Member Since</span>
                  <span className="detail-value">{user?.joinDate}</span>
                </div>
                <div className="profile-detail-item">
                  <span className="detail-label">Posts Created</span>
                  <span className="detail-value">{user?.postsCreated || 0}</span>
                </div>
                <div className="profile-detail-item">
                  <span className="detail-label">Accounts Connected</span>
                  <span className="detail-value">
                    {Object.values(socialConnections).filter(s => s.connected).length}/4
                  </span>
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
};

export default Connect;