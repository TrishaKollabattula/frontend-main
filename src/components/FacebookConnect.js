// src/components/FacebookConnect.js
import React, { useState } from 'react';

const FacebookConnect = ({ appUser, onConnected, connected, status }) => {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = () => {
    setIsConnecting(true);
    
    // Same Facebook App ID as Instagram (your Meta app)
    const clientId = '1095157869184608';
    const redirectUri = encodeURIComponent('https://13.233.45.167:5000/social/facebook/callback');
    // Use pages_manage_posts instead of pages_manage_content
    const scope = encodeURIComponent('pages_show_list,pages_read_engagement,pages_manage_posts');
    const state = encodeURIComponent(appUser || 'random_state');
    
    const url = `https://www.facebook.com/v20.0/dialog/oauth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code&state=${state}`;
    
    console.log('[FACEBOOK] Opening OAuth popup...');
    console.log('[FACEBOOK] URL:', url);
    
    // Open popup for Facebook OAuth
    const popup = window.open(
      url,
      'facebook_oauth',
      'width=600,height=600,scrollbars=yes,resizable=yes'
    );

    if (!popup) {
      alert('Popup blocked! Please allow popups for this site.');
      setIsConnecting(false);
      return;
    }

    // Listen for the OAuth callback
    const handleMessage = (event) => {
      console.log('[FACEBOOK] Received message:', event.data);
      
      if (event.data.type === 'facebook_callback') {
        setIsConnecting(false);
        
        if (popup && !popup.closed) {
          popup.close();
        }
        
        if (event.data.success) {
          console.log('✅ Facebook connected:', event.data);
          alert(`Facebook connected successfully!\nPage: ${event.data.page_name}`);
          onConnected(); // Refresh status
        } else {
          console.error('❌ Facebook connection failed:', event.data.error);
          alert(`Facebook connection failed: ${event.data.error}`);
        }
        
        window.removeEventListener('message', handleMessage);
      }
    };

    window.addEventListener('message', handleMessage);

    // Handle popup close without callback
    const checkClosed = setInterval(() => {
      if (popup.closed) {
        console.log('[FACEBOOK] Popup closed');
        setIsConnecting(false);
        window.removeEventListener('message', handleMessage);
        clearInterval(checkClosed);
      }
    }, 1000);
  };

  const handleDisconnect = async () => {
    if (!window.confirm('Are you sure you want to disconnect Facebook?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://13.233.45.167:5000/social/facebook/disconnect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          app_user: appUser
        })
      });

      const result = await response.json();
      
      if (response.ok && result.success) {
        alert('Facebook disconnected successfully!');
        onConnected(); // Refresh status
      } else {
        alert(`Failed to disconnect Facebook: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error disconnecting Facebook:', error);
      alert('Error disconnecting Facebook. Please try again.');
    }
  };

  const getButtonText = () => {
    if (isConnecting) return 'Connecting...';
    if (connected && status?.page_name) {
      return `Disconnect ${status.page_name}`;
    }
    return connected ? 'Disconnect Facebook' : 'Connect Facebook';
  };

  const getStatusText = () => {
    if (!connected) return null;
    
    if (status?.page_name) {
      return (
        <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
          Page: {status.page_name}
        </div>
      );
    }
    
    return 'Connected';
  };

  return (
    <div>
      <button 
        className={`connect-button ${connected ? 'connected' : 'disconnected'}`}
        onClick={connected ? handleDisconnect : handleConnect}
        disabled={isConnecting}
        style={{
          backgroundColor: connected ? '#dc3545' : '#1877f2',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '5px',
          cursor: isConnecting ? 'not-allowed' : 'pointer',
          opacity: isConnecting ? 0.6 : 1,
          fontSize: '14px',
          fontWeight: '500'
        }}
      >
        {getButtonText()}
      </button>
      {getStatusText()}
    </div>
  );
};

export default FacebookConnect;