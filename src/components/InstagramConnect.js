import React, { useState } from 'react';

const InstagramConnect = ({ appUser, onConnected, connected, status }) => {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = () => {
    setIsConnecting(true);

    // Your actual Facebook App ID
    const clientId = '1095157869184608'; // Your real App ID
    const redirectUri = encodeURIComponent('https://13.233.45.167:5000/social/instagram/callback');
    const scope = encodeURIComponent('instagram_business_basic,instagram_manage_comments,instagram_business_manage_messages,pages_show_list,pages_read_engagement');
    const state = encodeURIComponent(appUser || 'random_state');

    const url = `https://www.facebook.com/v20.0/dialog/oauth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code&state=${state}`;

    // Open popup for Instagram OAuth
    const popup = window.open(
      url,
      'instagram_oauth',
      'width=600,height=600,scrollbars=yes,resizable=yes'
    );

    // Listen for the OAuth callback
    const handleMessage = (event) => {
      if (event.data.type === 'instagram_callback') {
        setIsConnecting(false);
        popup.close();

        if (event.data.success) {
          console.log('✅ Instagram connected:', event.data);
          alert(`Instagram connected successfully! @${event.data.username} (${event.data.account_type})`);

          // Save token and user ID to DynamoDB via backend API
          saveInstagramData(event.data.access_token, event.data.user_id);
          
          onConnected(); // Refresh status
        } else {
          console.error('❌ Instagram connection failed:', event.data.error);
          alert(`Instagram connection failed: ${event.data.error}`);
        }

        window.removeEventListener('message', handleMessage);
      }
    };

    window.addEventListener('message', handleMessage);

    // Handle popup close without callback
    const checkClosed = setInterval(() => {
      if (popup.closed) {
        setIsConnecting(false);
        window.removeEventListener('message', handleMessage);
        clearInterval(checkClosed);
      }
    }, 1000);
  };

  const saveInstagramData = async (accessToken, userId) => {
    try {
      const response = await fetch('https://your-backend-api.com/save-instagram-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          access_token: accessToken,
        }),
      });

      const result = await response.json();
      if (result.success) {
        console.log('Successfully saved Instagram data to DynamoDB');
      } else {
        console.error('Failed to save Instagram data');
      }
    } catch (error) {
      console.error('Error saving Instagram data:', error);
    }
  };

  const handleDisconnect = async () => {
    try {
      const response = await fetch('/social/instagram/disconnect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          app_user: appUser
        })
      });

      const result = await response.json();

      if (result.success) {
        alert('Instagram disconnected successfully!');
        onConnected(); // Refresh status
      } else {
        alert(`Failed to disconnect Instagram: ${result.error}`);
      }
    } catch (error) {
      console.error('Error disconnecting Instagram:', error);
      alert('Error disconnecting Instagram. Please try again.');
    }
  };

  const getButtonText = () => {
    if (isConnecting) return 'Connecting...';
    if (connected && status?.detail?.username) {
      return `Disconnect @${status.detail.username}`;
    }
    return connected ? 'Disconnect Instagram' : 'Connect Instagram';
  };

  const getStatusText = () => {
    if (!connected) return null;

    const detail = status?.detail;
    if (!detail) return 'Connected';

    return (
      <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
        @{detail.username} ({detail.account_type})
        {detail.page_name && ` via ${detail.page_name}`}
      </div>
    );
  };

  return (
    <div>
      <button
        className={`connect-button ${connected ? 'connected' : 'disconnected'}`}
        onClick={connected ? handleDisconnect : handleConnect}
        disabled={isConnecting}
        style={{
          backgroundColor: connected ? '#dc3545' : '#28a745',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '5px',
          cursor: isConnecting ? 'not-allowed' : 'pointer',
          opacity: isConnecting ? 0.6 : 1
        }}
      >
        {getButtonText()}
      </button>
      {getStatusText()}
    </div>
  );
};

export default InstagramConnect;
