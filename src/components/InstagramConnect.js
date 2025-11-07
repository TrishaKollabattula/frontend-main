// InstagramConnect.js - FINAL FIX FOR POPUP CALLBACK

import React, { useState, useEffect } from 'react';

const InstagramConnect = ({ appUser, onConnected, connected, status }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isCallback, setIsCallback] = useState(false);
  const [callbackStatus, setCallbackStatus] = useState('processing');
  const [callbackMessage, setCallbackMessage] = useState('Connecting to Instagram...');

  // ✅ Check if this is an OAuth callback on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const error = urlParams.get('error');
    const errorDescription = urlParams.get('error_description');

    // If we have OAuth parameters AND we're in a popup, handle callback
    if ((code || error) && window.opener) {
      setIsCallback(true);
      handleOAuthCallback(code, state, error, errorDescription);
    }
  }, []);

  const handleOAuthCallback = async (code, state, error, errorDescription) => {
    setCallbackStatus('processing');
    setCallbackMessage('Connecting to Instagram...');

    // Handle error from Facebook
    if (error) {
      const errorMsg = errorDescription || error;
      console.error('❌ Instagram OAuth error:', errorMsg);
      setCallbackStatus('error');
      setCallbackMessage(errorMsg);
      
      if (window.opener) {
        window.opener.postMessage({
          type: 'instagram_callback',
          success: false,
          error: errorMsg
        }, '*');
      }
      
      setTimeout(() => window.close(), 3000);
      return;
    }

    // Check if we have required parameters
    if (!code || !state) {
      console.error('❌ Missing OAuth parameters');
      setCallbackStatus('error');
      setCallbackMessage('Missing parameters');
      
      if (window.opener) {
        window.opener.postMessage({
          type: 'instagram_callback',
          success: false,
          error: 'Missing parameters'
        }, '*');
      }
      
      setTimeout(() => window.close(), 3000);
      return;
    }

    // Call backend to exchange code for token
    try {
      console.log('📞 Calling backend to exchange code...');
      setCallbackMessage('Exchanging authorization code...');
      
      const response = await fetch('http://13.233.45.167:5000/social/instagram/callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: code,
          state: state
        })
      });

      const result = await response.json();

      if (result.success) {
        console.log('✅ Instagram connected:', result);
        setCallbackStatus('success');
        setCallbackMessage(`Connected Instagram account: @${result.instagram_username || 'your account'}`);
        
        // Send success message to parent window
        if (window.opener) {
          window.opener.postMessage({
            type: 'instagram_callback',
            success: true,
            instagram_username: result.instagram_username,
            instagram_user_id: result.instagram_user_id,
            app_user: state
          }, '*');
        }
        
        setTimeout(() => window.close(), 2000);
      } else {
        console.error('❌ Backend returned error:', result.error);
        setCallbackStatus('error');
        setCallbackMessage(result.error || 'Connection failed');
        
        if (window.opener) {
          window.opener.postMessage({
            type: 'instagram_callback',
            success: false,
            error: result.error || 'Connection failed'
          }, '*');
        }
        
        setTimeout(() => window.close(), 3000);
      }
    } catch (err) {
      console.error('❌ Network error:', err);
      setCallbackStatus('error');
      setCallbackMessage('Network error. Please try again.');
      
      if (window.opener) {
        window.opener.postMessage({
          type: 'instagram_callback',
          success: false,
          error: 'Network error'
        }, '*');
      }
      
      setTimeout(() => window.close(), 3000);
    }
  };

  const handleConnect = () => {
    setIsConnecting(true);

    // Instagram OAuth via Facebook Graph API
    const clientId = '1095157869184608';
    const redirectUri = encodeURIComponent('https://postingexpert.com/connect');
    const scope = encodeURIComponent('instagram_business_content_publish,instagram_business_basic,pages_show_list,pages_read_engagement');
    const state = encodeURIComponent(appUser || 'default_user');

    const url = `https://www.facebook.com/v21.0/dialog/oauth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code&state=${state}`;

    console.log('🔗 Opening OAuth URL:', url);

    // Open popup
    const popup = window.open(
      url,
      'instagram_oauth',
      'width=600,height=700,scrollbars=yes,resizable=yes'
    );

    if (!popup) {
      alert('Popup blocked! Please allow popups for this site.');
      setIsConnecting(false);
      return;
    }

    // Listen for callback message
    const handleMessage = (event) => {
      if (event.data.type === 'instagram_callback') {
        console.log('📩 Received callback message:', event.data);
        setIsConnecting(false);
        
        if (popup && !popup.closed) {
          popup.close();
        }

        if (event.data.success) {
          console.log('✅ Instagram connected:', event.data);
          alert(`Instagram connected successfully! @${event.data.instagram_username}`);
          
          if (onConnected) {
            onConnected();
          }
        } else {
          console.error('❌ Instagram connection failed:', event.data.error);
          alert(`Instagram connection failed: ${event.data.error}`);
        }

        window.removeEventListener('message', handleMessage);
      }
    };

    window.addEventListener('message', handleMessage);

    // Check if popup closed
    const checkClosed = setInterval(() => {
      if (popup && popup.closed) {
        console.log('⚠️ Popup was closed');
        setIsConnecting(false);
        window.removeEventListener('message', handleMessage);
        clearInterval(checkClosed);
      }
    }, 1000);
  };

  const handleDisconnect = async () => {
    try {
      const response = await fetch('http://13.233.45.167:5000/social/instagram/disconnect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          app_user: appUser
        })
      });

      const result = await response.json();

      if (result.success) {
        alert('Instagram disconnected successfully!');
        if (onConnected) {
          onConnected();
        }
      } else {
        alert(`Failed to disconnect Instagram: ${result.error}`);
      }
    } catch (error) {
      console.error('Error disconnecting Instagram:', error);
      alert('Error disconnecting Instagram. Please try again.');
    }
  };

  // ✅ If this is a callback, show callback UI instead of button
  if (isCallback) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px'
      }}>
        <div style={{
          background: 'white',
          padding: '40px',
          borderRadius: '16px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          textAlign: 'center',
          maxWidth: '400px',
          width: '100%'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '600',
            margin: '0 0 20px 0',
            color: callbackStatus === 'success' ? '#4caf50' : callbackStatus === 'error' ? '#f44336' : '#333'
          }}>
            {callbackStatus === 'processing' && '⏳ Connecting...'}
            {callbackStatus === 'success' && '✅ Connected!'}
            {callbackStatus === 'error' && '❌ Failed'}
          </h2>
          
          {callbackStatus === 'processing' && (
            <div style={{
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #E1306C',
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              animation: 'spin 1s linear infinite',
              margin: '20px auto'
            }}></div>
          )}
          
          <p style={{
            fontSize: '16px',
            color: callbackStatus === 'error' ? '#f44336' : '#666',
            margin: '20px 0',
            lineHeight: '1.5'
          }}>
            {callbackMessage}
          </p>
          
          {callbackStatus !== 'processing' && (
            <p style={{
              fontSize: '13px',
              color: '#999',
              marginTop: '20px',
              fontStyle: 'italic'
            }}>
              This window will close automatically...
            </p>
          )}
        </div>
      </div>
    );
  }

  // ✅ Normal button UI
  const getButtonText = () => {
    if (isConnecting) return 'Connecting...';
    if (connected && status?.username) {
      return `Disconnect @${status.username}`;
    }
    return connected ? 'Disconnect Instagram' : 'Connect Instagram';
  };

  const getStatusText = () => {
    if (!connected) return null;
    if (!status) return 'Connected';

    return (
      <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
        {status.username && `@${status.username}`}
        {status.page_name && ` via ${status.page_name}`}
        <br />
        {status.connected_at && `Connected: ${new Date(status.connected_at).toLocaleDateString()}`}
      </div>
    );
  };

  return (
    <div style={{ marginBottom: '15px' }}>
      <button
        className={`connect-button ${connected ? 'connected' : 'disconnected'}`}
        onClick={connected ? handleDisconnect : handleConnect}
        disabled={isConnecting}
        style={{
          backgroundColor: connected ? '#dc3545' : '#E1306C',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '5px',
          cursor: isConnecting ? 'not-allowed' : 'pointer',
          opacity: isConnecting ? 0.6 : 1,
          fontSize: '14px',
          fontWeight: 'bold'
        }}
      >
        {getButtonText()}
      </button>
      {getStatusText()}
    </div>
  );
};

export default InstagramConnect;