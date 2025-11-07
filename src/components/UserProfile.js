import React, { useState, useEffect, useRef } from 'react';
import './UserProfile.css';

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    business_type: '',
    scheduled_time: '',
    color_theme: []
  });
  const [saveLoading, setSaveLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [businessLogo, setBusinessLogo] = useState(null);
  const [businessLogoPreview, setBusinessLogoPreview] = useState(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const fileInputRef = useRef(null);
  const logoInputRef = useRef(null);

  const API_BASE_URL = 'http://13.233.45.167:5000';

  useEffect(() => {
    fetchUserProfile();
    
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.className = savedTheme;
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token') || 
                    localStorage.getItem('authToken') || 
                    localStorage.getItem('auth_token');
      
      if (!token) {
        setError('Not authenticated - Please log in again');
        setLoading(false);
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/user/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      console.log('Profile data:', data);
      setUserData(data);
      
      let colorTheme = data.color_theme || [];
      if (typeof colorTheme === 'string' && colorTheme !== 'Not set') {
        try {
          colorTheme = JSON.parse(colorTheme);
        } catch (e) {
          colorTheme = [];
        }
      } else if (colorTheme === 'Not set') {
        colorTheme = [];
      }
      
      if (data.has_logo && data.logo_s3_url) {
        setBusinessLogoPreview(data.logo_s3_url);
      }
      
      setEditForm({
        name: data.name || '',
        email: data.email || '',
        business_type: data.business_type || 'Not specified',
        scheduled_time: data.scheduled_time && data.scheduled_time !== 'Not set' ? data.scheduled_time : '',
        color_theme: Array.isArray(colorTheme) ? colorTheme : []
      });
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      let colorTheme = userData.color_theme || [];
      if (typeof colorTheme === 'string' && colorTheme !== 'Not set') {
        try {
          colorTheme = JSON.parse(colorTheme);
        } catch (e) {
          colorTheme = [];
        }
      } else if (colorTheme === 'Not set') {
        colorTheme = [];
      }
      
      setEditForm({
        name: userData.name || '',
        email: userData.email || '',
        business_type: userData.business_type || 'Not specified',
        scheduled_time: userData.scheduled_time && userData.scheduled_time !== 'Not set' ? userData.scheduled_time : '',
        color_theme: Array.isArray(colorTheme) ? colorTheme : []
      });
      setProfileImage(null);
      setProfileImagePreview(null);
      setBusinessLogo(null);
      setBusinessLogoPreview(userData.logo_s3_url || null);
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleColorChange = (index, value) => {
    const newColors = [...editForm.color_theme];
    newColors[index] = value;
    setEditForm(prev => ({
      ...prev,
      color_theme: newColors
    }));
  };

  const addColorSlot = () => {
    if (editForm.color_theme.length < 5) {
      setEditForm(prev => ({
        ...prev,
        color_theme: [...prev.color_theme, '#000000']
      }));
    }
  };

  const removeColorSlot = (index) => {
    const newColors = editForm.color_theme.filter((_, i) => i !== index);
    setEditForm(prev => ({
      ...prev,
      color_theme: newColors
    }));
  };

  const handleProfileImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a PNG or JPG file');
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('Image size must be less than 5MB');
      return;
    }

    setProfileImage(file);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleLogoSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a PNG or JPG file for logo');
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('Logo size must be less than 5MB');
      return;
    }

    setBusinessLogo(file);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setBusinessLogoPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const uploadProfileImage = async (imageFile) => {
    try {
      const token = localStorage.getItem('token') || 
                    localStorage.getItem('authToken') || 
                    localStorage.getItem('auth_token');
      
      const reader = new FileReader();
      return new Promise((resolve, reject) => {
        reader.onloadend = async () => {
          try {
            const base64Data = reader.result;
            const response = await fetch(`${API_BASE_URL}/user/upload-profile-image`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                image_data: base64Data,
                file_name: imageFile.name,
                file_type: imageFile.type,
                file_size: imageFile.size
              })
            });

            if (!response.ok) {
              throw new Error('Failed to upload profile image');
            }

            const result = await response.json();
            resolve(result.image_url);
          } catch (err) {
            reject(err);
          }
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(imageFile);
      });
    } catch (err) {
      throw err;
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(parseInt(timestamp) * 1000);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const handleSaveProfile = async () => {
    try {
      setSaveLoading(true);
      const token = localStorage.getItem('token') || 
                    localStorage.getItem('authToken') || 
                    localStorage.getItem('auth_token');
      
      if (!token) {
        alert('Authentication token not found. Please log in again.');
        window.location.href = '/login';
        return;
      }
      
      // Upload profile image if selected
      if (profileImage) {
        setUploadingImage(true);
        try {
          await uploadProfileImage(profileImage);
          console.log('Profile image uploaded successfully');
        } catch (err) {
          console.error('Failed to upload profile image:', err);
          alert('Failed to upload profile image: ' + err.message);
        } finally {
          setUploadingImage(false);
        }
      }
      
      // Prepare profile update data (name and email only)
      const profileUpdateData = {};
      if (editForm.name !== userData.name) {
        profileUpdateData.name = editForm.name;
      }
      if (editForm.email !== userData.email) {
        profileUpdateData.email = editForm.email;
      }

      // Prepare preferences update data (business_type, scheduled_time, color_theme, logo)
      const preferencesUpdateData = {};
      
      // Business type goes to preferences/survey
      if (editForm.business_type !== userData.business_type) {
        preferencesUpdateData.business_type = editForm.business_type;
      }
      
      if (editForm.scheduled_time !== userData.scheduled_time && editForm.scheduled_time !== '') {
        preferencesUpdateData.scheduled_time = editForm.scheduled_time;
      }
      
      let currentColorTheme = userData.color_theme || [];
      if (typeof currentColorTheme === 'string' && currentColorTheme !== 'Not set') {
        try {
          currentColorTheme = JSON.parse(currentColorTheme);
        } catch (e) {
          currentColorTheme = [];
        }
      } else if (currentColorTheme === 'Not set') {
        currentColorTheme = [];
      }
      
      if (JSON.stringify(editForm.color_theme) !== JSON.stringify(currentColorTheme)) {
        preferencesUpdateData.color_theme = editForm.color_theme;
      }

      // Handle logo upload
      if (businessLogo) {
        setUploadingLogo(true);
        try {
          const reader = new FileReader();
          const logoData = await new Promise((resolve, reject) => {
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(businessLogo);
          });

          preferencesUpdateData.logo_data = {
            data: logoData,
            fileName: businessLogo.name,
            fileType: businessLogo.type,
            fileSize: businessLogo.size
          };
        } catch (err) {
          console.error('Failed to process logo:', err);
          alert('Failed to process logo: ' + err.message);
        } finally {
          setUploadingLogo(false);
        }
      }

      // Update profile if there are changes
      if (Object.keys(profileUpdateData).length > 0) {
        const profileResponse = await fetch(`${API_BASE_URL}/user/profile`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(profileUpdateData)
        });

        if (!profileResponse.ok) {
          throw new Error('Failed to update profile');
        }
      }

      // Update preferences if there are changes
      if (Object.keys(preferencesUpdateData).length > 0) {
        console.log('Updating preferences with:', preferencesUpdateData);
        const preferencesResponse = await fetch(`${API_BASE_URL}/user/preferences`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(preferencesUpdateData)
        });

        if (!preferencesResponse.ok) {
          const errorData = await preferencesResponse.json();
          throw new Error(errorData.error || 'Failed to update preferences');
        }
      }
      
      alert('Profile updated successfully!');
      await fetchUserProfile();
      setIsEditing(false);
      setProfileImage(null);
      setProfileImagePreview(null);
      setBusinessLogo(null);
      
    } catch (err) {
      alert('Error updating profile: ' + err.message);
      console.error('Save error:', err);
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-container">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="profile-container">
        <div className="error">No user data found</div>
      </div>
    );
  }

  let displayColorTheme = userData.color_theme || [];
  if (typeof displayColorTheme === 'string' && displayColorTheme !== 'Not set') {
    try {
      displayColorTheme = JSON.parse(displayColorTheme);
    } catch (e) {
      displayColorTheme = [];
    }
  } else if (displayColorTheme === 'Not set') {
    displayColorTheme = [];
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar" onClick={() => isEditing && fileInputRef.current?.click()}>
          {profileImagePreview ? (
            <img src={profileImagePreview} alt="Profile" className="avatar-image" />
          ) : userData.profile_image ? (
            <img src={userData.profile_image} alt="Profile" className="avatar-image" />
          ) : (
            <span>{userData.username?.charAt(0).toUpperCase()}</span>
          )}
          {isEditing && (
            <div className="avatar-overlay">
              <span>📷</span>
            </div>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg"
          onChange={handleProfileImageSelect}
          style={{ display: 'none' }}
        />
        <div className="profile-info">
          <h2>{userData.username}</h2>
          <p className="email">{userData.email}</p>
        </div>
        <button 
          className="edit-profile-btn"
          onClick={handleEditToggle}
          disabled={saveLoading || uploadingImage || uploadingLogo}
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      <div className="profile-stats">
        <div className="stat-card">
          <h3>Business Type</h3>
          {isEditing ? (
            <select
              name="business_type"
              value={editForm.business_type}
              onChange={handleInputChange}
            >
              <option value="Not specified">Not specified</option>
              <option value="finance">Finance</option>
              <option value="education">Education</option>
              <option value="technology">Technology</option>
              <option value="real-estate">Real Estate</option>
              <option value="healthcare">Healthcare</option>
              <option value="ecommerce">E-commerce</option>
              <option value="restaurant">Restaurant</option>
              <option value="other">Other</option>
            </select>
          ) : (
            <p>{userData.business_type || 'Not specified'}</p>
          )}
        </div>

        <div className="stat-card">
          <h3>Member Since</h3>
          <p>{userData.created_at ? formatDate(userData.created_at) : 'Recently'}</p>
        </div>

        <div className="stat-card">
          <h3>Posts Created</h3>
          <p>{userData.posts_created || 0}</p>
        </div>

        <div className="stat-card">
          <h3>Accounts Connected</h3>
          <p>{userData.connected_accounts || 0}/4</p>
        </div>

        <div className="stat-card">
          <h3>Scheduled Time</h3>
          {isEditing ? (
            <input
              type="time"
              name="scheduled_time"
              value={editForm.scheduled_time}
              onChange={handleInputChange}
              className="time-input"
            />
          ) : (
            <div className="scheduled-time-display">
              <span className="time-icon">🕐</span>
              <p>{userData.scheduled_time || 'Not set'}</p>
            </div>
          )}
        </div>

        <div className="stat-card color-theme-card">
          <h3>Brand Colors</h3>
          {isEditing ? (
            <div className="color-editor">
              {editForm.color_theme.map((color, index) => (
                <div key={index} className="color-input-row">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => handleColorChange(index, e.target.value)}
                    className="color-picker"
                  />
                  <span className="color-hex">{color}</span>
                  <button 
                    type="button"
                    onClick={() => removeColorSlot(index)}
                    className="remove-color-btn"
                  >
                    ✕
                  </button>
                </div>
              ))}
              {editForm.color_theme.length < 5 && (
                <button 
                  type="button"
                  onClick={addColorSlot}
                  className="add-color-btn"
                >
                  + Add Color
                </button>
              )}
            </div>
          ) : (
            <div className="color-theme-display">
              {Array.isArray(displayColorTheme) && displayColorTheme.length > 0 ? (
                displayColorTheme.map((color, index) => (
                  <div 
                    key={index}
                    className="color-preview" 
                    style={{ background: color }}
                    title={color}
                  ></div>
                ))
              ) : (
                <p>Not set</p>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="business-logo-section">
        <h3>Business Logo</h3>
        {isEditing ? (
          <div className="logo-upload-area">
            <div 
              className="logo-preview-box" 
              onClick={() => logoInputRef.current?.click()}
            >
              {businessLogoPreview ? (
                <img src={businessLogoPreview} alt="Business Logo" className="logo-preview-image" />
              ) : (
                <div className="logo-placeholder">
                  <span className="upload-icon">📷</span>
                  <p>Click to upload logo</p>
                </div>
              )}
            </div>
            <input
              ref={logoInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              onChange={handleLogoSelect}
              style={{ display: 'none' }}
            />
            {businessLogoPreview && (
              <button 
                type="button"
                className="remove-logo-btn"
                onClick={() => {
                  setBusinessLogo(null);
                  setBusinessLogoPreview(null);
                }}
              >
                Remove Logo
              </button>
            )}
          </div>
        ) : businessLogoPreview ? (
          <div className="logo-display">
            <img src={businessLogoPreview} alt="Business Logo" />
            <p>{userData.logo_filename || 'Your business logo'}</p>
          </div>
        ) : (
          <p>No logo uploaded</p>
        )}
      </div>

      <div className="profile-details">
        <h3>Profile Details</h3>
        
        <div className="detail-row">
          <label>Full Name</label>
          {isEditing ? (
            <input
              type="text"
              name="name"
              value={editForm.name}
              onChange={handleInputChange}
              placeholder="Enter your full name"
            />
          ) : (
            <p>{userData.name || 'Not provided'}</p>
          )}
        </div>

        <div className="detail-row">
          <label>Email Address</label>
          {isEditing ? (
            <input
              type="email"
              name="email"
              value={editForm.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
            />
          ) : (
            <p>{userData.email}</p>
          )}
        </div>

        <div className="detail-row">
          <label>Username</label>
          <p>{userData.username}</p>
        </div>

        <div className="detail-row">
          <label>Last Updated</label>
          <p>{userData.updated_at ? formatDate(userData.updated_at) : 'Never'}</p>
        </div>

        {isEditing && (
          <button 
            className="save-btn" 
            onClick={handleSaveProfile}
            disabled={saveLoading || uploadingImage || uploadingLogo}
          >
            {uploadingLogo ? 'Uploading Logo...' : uploadingImage ? 'Uploading Image...' : saveLoading ? 'Saving...' : 'Save Changes'}
          </button>
        )}
      </div>
    </div>
  );
};

export default UserProfile;