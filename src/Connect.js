// src/Connect.js - BLACK, MAROON & TEAL THEME
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Connect.css';
import LinkedInConnect from './components/LinkedInConnect';
import InstagramConnect from './components/InstagramConnect';
import FacebookConnect from './components/FacebookConnect';

const Connect = () => {
  const [user, setUser] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [socialConnections, setSocialConnections] = useState({
    instagram: { connected: false, detail: null },
    linkedin: { connected: false, detail: null },
    twitter: { connected: false, detail: null },
    facebook: { connected: false, detail: null }
  });
  const navigate = useNavigate();

  useEffect(() => {
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

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setShowProfileMenu(false);
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiry');
    localStorage.removeItem('username');
    
    window.location.href = '/login';
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
      name: 'Facebook', 
      icon: '👥', 
      connected: socialConnections.facebook.connected, 
      color: '#1877F2',
      component: FacebookConnect,
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
    <div className="connect-container">
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

      <header className="connect-header">
        <div className="header-left">
          <img src="/123.png" alt="Posting Expert" className="header-logo" />
          <div className="header-brand">
            <h1 className="header-title">Posting Expert</h1>
            <p className="header-subtitle">AI Marketing Studio</p>
          </div>
        </div>
        
        <div className="header-right">
          <div className="profile-dropdown">
            <button 
              className="profile-btn" 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              type="button"
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
                <button 
                  className="profile-menu-item" 
                  onClick={() => navigate('/profile')}
                  type="button"
                >
                  <span className="menu-icon">👤</span>
                  <span>View Profile</span>
                </button>
                <button 
                  className="profile-menu-item" 
                  onClick={() => navigate('/settings')}
                  type="button"
                >
                  <span className="menu-icon">⚙️</span>
                  <span>Settings</span>
                </button>
                <div className="profile-menu-divider"></div>
                <button 
                  className="profile-menu-item logout" 
                  onClick={handleLogout} 
                  disabled={isLoggingOut}
                  type="button"
                >
                  <span className="menu-icon">{isLoggingOut ? '⏳' : '🚪'}</span>
                  <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="connect-main">
        <div className="connect-content">
          
          <section className="welcome-section">
            <div className="welcome-badge">
              <span className="badge-icon">👋</span>
              <span className="badge-text">Welcome Back</span>
            </div>
            <h2 className="section-title">Hi, {user?.username}!</h2>
            <p className="section-subtitle">
              Ready to create amazing content for your {user?.businessType} business
            </p>
            
            {/* Stats Overview Cards */}
            <div className="stats-overview">
              <div className="stat-card">
                <div className="stat-icon-wrapper">
                  <div className="stat-icon">📊</div>
                </div>
                <div className="stat-info">
                  <div className="stat-value">{user?.postsCreated || 0}</div>
                  <div className="stat-label">Total Posts</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon-wrapper">
                  <div className="stat-icon">🔗</div>
                </div>
                <div className="stat-info">
                  <div className="stat-value">
                    {Object.values(socialConnections).filter(s => s.connected).length}/3
                  </div>
                  <div className="stat-label">Connected</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon-wrapper">
                  <div className="stat-icon">⚡</div>
                </div>
                <div className="stat-info">
                  <div className="stat-value">Active</div>
                  <div className="stat-label">Status</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon-wrapper">
                  <div className="stat-icon">📅</div>
                </div>
                <div className="stat-info">
                  <div className="stat-value">{user?.joinDate}</div>
                  <div className="stat-label">Member Since</div>
                </div>
              </div>
            </div>
          </section>

          <section className="quick-actions-section">
            <div className="section-header">
              <h3 className="section-heading">
                <span className="heading-icon">⚡</span>
                <span>Quick Actions</span>
              </h3>
              <p className="section-description">Get started with powerful marketing tools</p>
            </div>
            <div className="quick-actions-grid">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  className="action-card"
                  onClick={() => navigate(action.path)}
                  type="button"
                >
                  <div className="action-icon-wrapper">
                    <div className="action-icon">{action.icon}</div>
                  </div>
                  <h4 className="action-title">{action.title}</h4>
                  <p className="action-desc">{action.desc}</p>
                  <div className="action-arrow">→</div>
                </button>
              ))}
            </div>
          </section>

          <section className="social-connect-section">
            <div className="section-header">
              <h3 className="section-heading">
                <span className="heading-icon">🌐</span>
                <span>Connect Social Media</span>
              </h3>
              <p className="section-description">
                Link your accounts to start posting automatically
              </p>
            </div>
            
            <div className="social-accounts-grid">
              {connectedAccounts.map((account, index) => (
                <div key={index} className="social-account-card">
                  <div className="social-card-header">
                    <div className="social-icon" style={{ background: account.color }}>
                      {account.icon}
                    </div>
                    <div className="social-info">
                      <h4 className="social-name">{account.name}</h4>
                      <p className={`social-status ${account.connected ? 'connected' : ''}`}>
                        {account.connected ? (
                          <>
                            <span className="status-icon">✓</span>
                            <span>Connected</span>
                          </>
                        ) : (
                          <>
                            <span className="status-icon">○</span>
                            <span>Not connected</span>
                          </>
                        )}
                      </p>
                      {account.name === 'Facebook' && account.connected && account.detail && (
                        <p className="social-detail">
                          Page: {account.detail.page_name}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="social-card-actions">
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
                        type="button"
                      >
                        <span className="btn-icon">{account.connected ? '✓' : '+'}</span>
                        <span>{account.connected ? 'Connected' : 'Connect'}</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="profile-card-section">
            <div className="section-header">
              <h3 className="section-heading">
                <span className="heading-icon">👤</span>
                <span>Your Profile</span>
              </h3>
            </div>
            
            <div className="profile-card">
              <div className="profile-card-header">
                <div className="profile-avatar-xl">
                  {user?.username.charAt(0).toUpperCase()}
                </div>
                <div className="profile-card-info">
                  <h3 className="profile-card-name">{user?.username}</h3>
                  <p className="profile-card-email">{user?.email}</p>
                  <div className="profile-badges">
                    <span className="profile-badge">Active Member</span>
                    <span className="profile-badge">Pro User</span>
                  </div>
                </div>
                <button 
                  className="edit-profile-btn"
                  onClick={() => navigate('/profile')}
                  type="button"
                >
                  <span className="btn-icon">✏️</span>
                  <span>Edit Profile</span>
                </button>
              </div>
              
              <div className="profile-card-divider"></div>
              
              <div className="profile-card-details">
                <div className="profile-detail-item">
                  <div className="detail-icon">💼</div>
                  <div className="detail-content">
                    <span className="detail-label">Business Type</span>
                    <span className="detail-value">{user?.businessType || 'Not specified'}</span>
                  </div>
                </div>
                <div className="profile-detail-item">
                  <div className="detail-icon">📅</div>
                  <div className="detail-content">
                    <span className="detail-label">Member Since</span>
                    <span className="detail-value">{user?.joinDate}</span>
                  </div>
                </div>
                <div className="profile-detail-item">
                  <div className="detail-icon">📝</div>
                  <div className="detail-content">
                    <span className="detail-label">Posts Created</span>
                    <span className="detail-value">{user?.postsCreated || 0}</span>
                  </div>
                </div>
                <div className="profile-detail-item">
                  <div className="detail-icon">🔗</div>
                  <div className="detail-content">
                    <span className="detail-label">Accounts Connected</span>
                    <span className="detail-value">
                      {Object.values(socialConnections).filter(s => s.connected).length}/3
                    </span>
                  </div>
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