// src/components/Survey.js - Enhanced with futuristic effects
import React, { useState, useEffect } from 'react';
import './Survey.css';
import { useNavigate } from 'react-router-dom';

const Survey = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState('business-type');
  const [businessType, setBusinessType] = useState('');
  const [surveyAnswers, setSurveyAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark mode
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [numColors, setNumColors] = useState(2);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  // Initialize theme
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'light') {
      setIsDarkMode(false);
      document.body.classList.remove('dark');
    } else {
      setIsDarkMode(true);
      document.body.classList.add('dark');
    }
  }, []);

  // Apply theme class to body
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]);

  // const toggleTheme = () => {
  //   const newMode = !isDarkMode;
  //   setIsDarkMode(newMode);
  //   localStorage.setItem('theme', newMode ? 'dark' : 'light');
  // };

  const businessTypes = [
    { value: 'other', label: 'Other', icon: '🏢', desc: 'Any other business type' },
    { value: 'finance', label: 'Finance', icon: '💰', desc: 'Banking & Financial Services' },
    { value: 'education', label: 'Education', icon: '🎓', desc: 'Schools & Learning' },
    { value: 'technology', label: 'Technology', icon: '💻', desc: 'Tech & Software' },
    { value: 'real-estate', label: 'Real Estate', icon: '🏠', desc: 'Property & Housing' },
    { value: 'healthcare', label: 'Healthcare', icon: '🏥', desc: 'Medical & Wellness' },
    { value: 'ecommerce', label: 'E-commerce', icon: '🛒', desc: 'Online Retail' },
    { value: 'restaurant', label: 'Restaurant', icon: '🍽️', desc: 'Food & Dining' }
  ];

  // Logo upload question
  const logoQuestion = {
    id: 'business_logo',
    question: 'Upload your business logo (optional but recommended)',
    type: 'file',
    placeholder: 'Choose your logo file',
    hint: 'PNG, JPG, or SVG format. Max size: 5MB. This will be used on your promotional content.',
    accept: 'image/png,image/jpeg,image/jpg,image/svg+xml'
  };

  const commonQuestions = [
    logoQuestion,
    { 
      id: 'contact_details', 
      question: 'Please provide your contact details for promotional image footers', 
      type: 'textarea', 
      placeholder: 'Website: www.example.com\nContact: +1234567890',
      hint: 'This will appear on your promotional content'
    },
    { 
      id: 'color_theme', 
      question: 'Choose your brand color theme for promotional images', 
      type: 'multi-color', 
      placeholder: 'Select colors',
      hint: 'Pick 2-5 colors that represent your brand'
    },
    { 
      id: 'post_schedule_time', 
      question: 'What time should we schedule your daily social media posts?', 
      type: 'time', 
      placeholder: 'Select time',
      hint: 'Choose the best time to reach your audience'
    }
  ];

  const getQuestionsForBusinessType = (type) => {
    const questionSets = {
      'finance': [
        { id: 'financial_products', question: 'What financial products/services do you offer?', type: 'textarea', placeholder: 'e.g., Loans, Investment, Insurance...', hint: 'Be specific about your main offerings' },
        { id: 'target_audience', question: 'Who is your target audience?', type: 'text', placeholder: 'e.g., individuals, businesses, investors', hint: 'This helps us tailor your content' },
        { id: 'social_tone', question: 'What tone should your content convey?', type: 'checkbox', options: ['Trustworthy', 'Professional', 'Approachable'], hint: 'You can select multiple' },
        { id: 'image_focus', question: 'What should your visuals emphasize?', type: 'checkbox', options: ['Trust and security', 'Growth and success', 'Expert advice'] },
        { id: 'visual_style', question: 'Visual style preference:', type: 'checkbox', options: ['Professional corporate settings', 'Personal customer stories'] },
        { id: 'include_data_visuals', question: 'Include infographics or data visualizations?', type: 'radio', options: ['Yes', 'No', 'Sometimes'] },
        ...commonQuestions
      ],
      'education': [
        { id: 'educational_services', question: 'What educational programs do you offer?', type: 'textarea', placeholder: 'Describe your courses, degrees, training...', hint: 'Help us understand your offerings' },
        { id: 'primary_audience', question: 'Who are your primary audiences?', type: 'checkbox', options: ['Students', 'Parents', 'Faculty', 'Alumni', 'Community'] },
        { id: 'key_messages', question: 'Key messages about your institution:', type: 'textarea', placeholder: 'What makes your institution special?' },
        { id: 'image_showcase', question: 'What should visuals showcase?', type: 'checkbox', options: ['Student achievements', 'Campus life', 'Faculty expertise'] },
        { id: 'learning_format', question: 'Highlight which format?', type: 'checkbox', options: ['In-person activities', 'Online learning platforms'] },
        { id: 'feature_content', question: 'Feature in your content:', type: 'checkbox', options: ['Events', 'Guest lectures', 'Community involvement'] },
        ...commonQuestions
      ],
      'technology': [
        { id: 'tech_products', question: 'Main tech products/services:', type: 'textarea', placeholder: 'SaaS, Hardware, Apps, Consulting...', hint: 'What technology solutions do you provide?' },
        { id: 'target_audience', question: 'Target audience:', type: 'checkbox', options: ['Tech professionals', 'Consumers', 'Businesses', 'Startups', 'Enterprise'] },
        { id: 'brand_values', question: 'Brand values to convey:', type: 'checkbox', options: ['Innovation', 'Reliability', 'User-friendliness', 'Cutting-edge', 'Trustworthy'] },
        { id: 'design_preference', question: 'Design style preference:', type: 'checkbox', options: ['Futuristic, sleek designs', 'Practical, real-world visuals'] },
        { id: 'image_focus', question: 'Image focus:', type: 'checkbox', options: ['Product demonstrations', 'Conceptual innovation'] },
        { id: 'include_interactive_content', question: 'Include animated/interactive visuals?', type: 'radio', options: ['Yes', 'No', 'Sometimes'] },
        ...commonQuestions
      ],
      'real-estate': [
        { id: 'property_specialization', question: 'Property specialization:', type: 'checkbox', options: ['Residential', 'Commercial', 'Luxury', 'Rental', 'Investment'] },
        { id: 'main_clients', question: 'Main clients:', type: 'checkbox', options: ['Buyers', 'Renters', 'Investors', 'First-time buyers', 'Commercial clients'] },
        { id: 'selling_points', question: 'Key selling points:', type: 'textarea', placeholder: 'Location, pricing, amenities...' },
        { id: 'image_showcase', question: 'Showcase in visuals:', type: 'checkbox', options: ['Property interiors', 'Neighborhood lifestyles', 'Renovations'] },
        { id: 'feature_client_stories', question: 'Feature client testimonials?', type: 'radio', options: ['Yes', 'No', 'Sometimes'] },
        ...commonQuestions
      ],
      'healthcare': [
        { id: 'healthcare_services', question: 'Healthcare services/specialties:', type: 'textarea', placeholder: 'General care, Surgery, Pediatrics...', hint: 'List your main services' },
        { id: 'primary_audience', question: 'Primary audience:', type: 'checkbox', options: ['Patients', 'Families', 'Healthcare professionals', 'Community', 'Insurance providers'] },
        { id: 'core_values', question: 'Core values to communicate:', type: 'checkbox', options: ['Trust', 'Care', 'Innovation', 'Expertise', 'Compassion'] },
        { id: 'image_highlight', question: 'Highlight in images:', type: 'checkbox', options: ['Medical staff', 'Patient care', 'Healthcare technology'] },
        { id: 'visual_focus', question: 'Visual focus:', type: 'checkbox', options: ['Wellness campaigns', 'Testimonials', 'Facilities'] },
        { id: 'include_treatment_visuals', question: 'Include treatment visuals/case studies?', type: 'radio', options: ['Yes', 'No', 'With patient consent only'] },
        ...commonQuestions
      ],
      'ecommerce': [
        { id: 'product_types', question: 'Main product categories:', type: 'textarea', placeholder: 'Fashion, Electronics, Home goods...', hint: 'What do you sell?' },
        { id: 'main_customers', question: 'Main customer segments:', type: 'text', placeholder: 'Young adults, professionals, families...' },
        { id: 'brand_personality', question: 'Brand personality:', type: 'checkbox', options: ['Fun', 'Professional', 'Creative', 'Trendy', 'Trustworthy'] },
        { id: 'image_style', question: 'Image style:', type: 'checkbox', options: ['Product-focused images', 'Lifestyle shots'] },
        { id: 'content_highlight', question: 'Highlight in content:', type: 'checkbox', options: ['Seasonal sales', 'New arrivals', 'Behind-the-scenes'] },
        { id: 'ugc_strategy', question: 'User-generated content strategy?', type: 'radio', options: ['Yes', 'No', 'Considering it'] },
        ...commonQuestions
      ],
      'restaurant': [
        { id: 'cuisine_experience', question: 'Cuisine & dining experience:', type: 'textarea', placeholder: 'Italian fine dining, casual cafe...', hint: 'Describe your restaurant concept' },
        { id: 'typical_customers', question: 'Typical customers:', type: 'text', placeholder: 'Families, couples, business professionals...' },
        { id: 'unique_qualities', question: 'Unique qualities/atmosphere:', type: 'textarea', placeholder: 'What makes your restaurant special?' },
        { id: 'image_preference', question: 'Image preferences:', type: 'checkbox', options: ['Food presentation', 'Dining ambiance', 'Kitchen activity'] },
        { id: 'content_highlight', question: 'Highlight in content:', type: 'checkbox', options: ['Seasonal menus', 'Special events', 'Customer interactions'] },
        { id: 'sustainability', question: 'Promote sustainable sourcing/dietary options?', type: 'radio', options: ['Yes', 'No', 'Sometimes'] },
        ...commonQuestions
      ],
      'other': [
        { id: 'business_description', question: 'Business type & description:', type: 'textarea', placeholder: 'Tell us about your business...', hint: 'Be as detailed as possible' },
        { id: 'target_audience', question: 'Target audience:', type: 'text', placeholder: 'Who are your customers?' },
        { id: 'key_messages', question: 'Key messages/values:', type: 'textarea', placeholder: 'What do you want to communicate?', hint: 'Your brand message' },
        { id: 'image_style', question: 'Preferred image style:', type: 'checkbox', options: ['Professional', 'Casual', 'Artistic', 'Modern', 'Traditional'] },
        { id: 'visual_focus', question: 'Visual focus:', type: 'checkbox', options: ['Products', 'Services', 'Customer stories'] },
        { id: 'preferred_themes', question: 'Preferred colors/moods/themes:', type: 'textarea', placeholder: 'Describe your visual preferences...' },
        ...commonQuestions
      ]
    };

    return questionSets[type] || questionSets['other'];
  };

  const handleBusinessTypeSelect = (type) => {
    setBusinessType(type);
    setCurrentStep('questions');
    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAnswerChange = (questionId, value) => {
    setSurveyAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleNumColorsChange = (e) => {
    const count = parseInt(e.target.value, 10);
    setNumColors(count);
    
    const existingColors = surveyAnswers['color_theme'] || [];
    const colors = [];
    
    for (let i = 0; i < count; i++) {
      colors[i] = existingColors[i] || '#000000';
    }
    
    handleAnswerChange('color_theme', colors);
  };

  const handleColorChange = (index, value) => {
    const existingColors = surveyAnswers['color_theme'] || [];
    const colors = [];
    
    for (let i = 0; i < numColors; i++) {
      colors[i] = existingColors[i] || '#000000';
    }
    
    colors[index] = value;
    handleAnswerChange('color_theme', colors);
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    
    if (!file) return;

    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a PNG, JPG, or SVG file');
      setTimeout(() => setError(''), 3000);
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('Logo file size must be less than 5MB');
      setTimeout(() => setError(''), 3000);
      return;
    }

    setLogoFile(file);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result);
    };
    reader.readAsDataURL(file);
    
    setError('');
  };

  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
    handleAnswerChange('business_logo', null);
  };

  const convertLogoToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmitSurvey = async () => {
    setIsSubmitting(true);
    setError('');

    try {
      const registeredUserId = localStorage.getItem('registeredUserId') || 
                              localStorage.getItem('username') || 
                              null;
      
      console.log('Survey submission - userId from localStorage:', registeredUserId);

      if (!registeredUserId) {
        setError('Please complete registration first before submitting survey');
        setTimeout(() => setError(''), 3000);
        setIsSubmitting(false);
        return;
      }

      let logoData = null;
      if (logoFile) {
        setUploadingLogo(true);
        try {
          const base64Data = await convertLogoToBase64(logoFile);
          logoData = {
            fileName: logoFile.name,
            fileType: logoFile.type,
            fileSize: logoFile.size,
            data: base64Data
          };
          console.log('Logo converted to base64, size:', logoFile.size, 'bytes');
        } catch (error) {
          console.error('Error converting logo:', error);
          setError('Failed to process logo. Continuing without it...');
          setTimeout(() => setError(''), 3000);
        } finally {
          setUploadingLogo(false);
        }
      }

      const finalAnswers = {
        ...surveyAnswers,
        business_logo: logoData
      };

      const surveyData = {
        userId: registeredUserId,
        businessType,
        answers: finalAnswers,
        timestamp: new Date().toISOString()
      };

      console.log('Submitting survey data:', {
        userId: surveyData.userId,
        businessType: surveyData.businessType,
        hasLogo: !!logoData,
        logoFileName: logoData?.fileName
      });

      const response = await fetch(
        'https://4fqbpp1yya.execute-api.ap-south-1.amazonaws.com/prod/user/register',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ surveyData })
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to submit survey: ${errorText}`);
      }

      const result = await response.json();
      console.log('Survey submission result:', result);
      
      setSuccess('Survey completed successfully! Redirecting to login...');
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (error) {
      console.error('Error processing survey:', error);
      setError('Error processing survey. Please try again.');
      setTimeout(() => setError(''), 3000);
    } finally {
      setIsSubmitting(false);
      setUploadingLogo(false);
    }
  };

  const renderQuestionInput = (question) => {
    switch (question.type) {
      case 'file':
        return (
          <div className="logo-upload-section">
            <div className="logo-upload-container">
              {!logoPreview ? (
                <label className="logo-upload-box">
                  <input
                    type="file"
                    accept={question.accept}
                    onChange={handleLogoChange}
                    style={{ display: 'none' }}
                  />
                  <div className="upload-prompt">
                    <span className="upload-icon">📤</span>
                    <p className="upload-text">Click to upload or drag and drop</p>
                    <p className="upload-hint">PNG, JPG, SVG (max. 5MB)</p>
                  </div>
                </label>
              ) : (
                <div className="logo-preview-container">
                  <img 
                    src={logoPreview} 
                    alt="Logo preview" 
                    className="logo-preview"
                  />
                  <div className="logo-info">
                    <p className="logo-filename">{logoFile?.name}</p>
                    <p className="logo-filesize">
                      {(logoFile?.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                  <button 
                    type="button"
                    onClick={handleRemoveLogo}
                    className="remove-logo-btn"
                  >
                    ✕ Remove
                  </button>
                </div>
              )}
            </div>
            {question.hint && <small className="field-hint">{question.hint}</small>}
          </div>
        );
      
      case 'text':
        return (
          <>
            <input
              type="text"
              placeholder={question.placeholder}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              value={surveyAnswers[question.id] || ''}
            />
            {question.hint && <small className="field-hint">{question.hint}</small>}
          </>
        );
      
      case 'textarea':
        return (
          <>
            <textarea
              placeholder={question.placeholder}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              value={surveyAnswers[question.id] || ''}
              rows="4"
            />
            {question.hint && <small className="field-hint">{question.hint}</small>}
          </>
        );
      
      case 'time':
        return (
          <>
            <input
              type="time"
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              value={surveyAnswers[question.id] || ''}
            />
            {question.hint && <small className="field-hint">{question.hint}</small>}
          </>
        );
      
      case 'multi-color':
        return (
          <div className="color-picker-section">
            <label className="color-count-label">
              Number of colors (2-5):
            </label>
            <input
              type="number"
              min="2"
              max="5"
              value={numColors}
              onChange={handleNumColorsChange}
              className="color-count-input"
            />
            <div className="color-inputs-grid">
              {Array.from({ length: numColors }, (_, index) => (
                <div key={index} className="color-input-row">
                  <label className="color-label">Color {index + 1}:</label>
                  <input
                    type="color"
                    value={(surveyAnswers['color_theme'] && surveyAnswers['color_theme'][index]) || '#000000'}
                    onChange={(e) => handleColorChange(index, e.target.value)}
                    className="color-picker"
                  />
                  <div
                    className="color-preview"
                    style={{
                      backgroundColor: (surveyAnswers['color_theme'] && surveyAnswers['color_theme'][index]) || '#000000'
                    }}
                  ></div>
                  <span className="color-hex">
                    {(surveyAnswers['color_theme'] && surveyAnswers['color_theme'][index]) || '#000000'}
                  </span>
                </div>
              ))}
            </div>
            {question.hint && <small className="field-hint">{question.hint}</small>}
          </div>
        );
      
      case 'radio':
        return (
          <>
            <div className="radio-group">
              {question.options.map(option => (
                <label key={option} className="radio-option">
                  <input
                    type="radio"
                    name={question.id}
                    value={option}
                    checked={surveyAnswers[question.id] === option}
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
            {question.hint && <small className="field-hint">{question.hint}</small>}
          </>
        );
      
      case 'checkbox':
        return (
          <>
            <div className="checkbox-group">
              {question.options.map(option => (
                <label key={option} className="checkbox-option">
                  <input
                    type="checkbox"
                    value={option}
                    checked={(surveyAnswers[question.id] || []).includes(option)}
                    onChange={(e) => {
                      const currentAnswers = surveyAnswers[question.id] || [];
                      let newAnswers;
                      if (e.target.checked) {
                        newAnswers = [...currentAnswers, option];
                      } else {
                        newAnswers = currentAnswers.filter(a => a !== option);
                      }
                      handleAnswerChange(question.id, newAnswers);
                    }}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
            {question.hint && <small className="field-hint">{question.hint}</small>}
          </>
        );
      
      default:
        return null;
    }
  };

  const questions = businessType ? getQuestionsForBusinessType(businessType) : [];
  const selectedBusiness = businessTypes.find(t => t.value === businessType);

  return (
    <div className={`survey-container ${isDarkMode ? 'dark' : 'light'}`}>
      {/* <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
        {isDarkMode ? '☀️' : '🌙'}
      </button> */}
      <button className="skip-button" onClick={() => navigate('/login')}>
        Skip Survey →
      </button>

      <div className="survey-box">
        <div className="survey-header">
          <img src="/123.png" alt="CraftingBrain Logo" className="survey-logo" />
          <h1 className="survey-title">Tell Us About Your Business</h1>
          <p className="survey-subtitle">Help us craft content that truly represents your brand</p>
          <div className="header-decoration"></div>
        </div>

        {currentStep === 'business-type' && (
          <div className="business-type-section">
            <div className="info-banner">
              <span className="info-icon">✨</span>
              <div className="info-content">
                <strong>Why we're asking:</strong> Your industry shapes everything—from visuals to tone. 
                This helps our AI create content that feels authentic to your business.
              </div>
            </div>

            <h2 className="section-heading">What industry are you in?</h2>
            
            <div className="business-grid">
              {businessTypes.map(type => (
                <button
                  key={type.value}
                  onClick={() => handleBusinessTypeSelect(type.value)}
                  className="business-card"
                  aria-label={`Select ${type.label}`}
                >
                  <span className="business-emoji">{type.icon}</span>
                  <h3>{type.label}</h3>
                  <p>{type.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {currentStep === 'questions' && (
          <div className="questions-section">
            <div className="business-badge">
              <span className="badge-icon">{selectedBusiness?.icon}</span>
              <div className="badge-info">
                <h3>{selectedBusiness?.label}</h3>
                <p>{questions.length} quick questions • ~3 minutes</p>
              </div>
            </div>

            <form onSubmit={(e) => e.preventDefault()}>
              {questions.map((question, index) => (
                <div key={question.id} className="question-group">
                  <label className="question-label">
                    <span className="question-number">{index + 1}</span>
                    <span className="question-text">{question.question}</span>
                  </label>
                  {renderQuestionInput(question)}
                </div>
              ))}

              {error && (
                <div className="alert alert-error">
                  <span className="alert-icon">⚠️</span>
                  <p>{error}</p>
                </div>
              )}
              
              {success && (
                <div className="alert alert-success">
                  <span className="alert-icon">✓</span>
                  <p>{success}</p>
                </div>
              )}

              <div className="action-buttons">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentStep('business-type');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="btn-secondary"
                >
                  ← Back
                </button>
                
                <button
                  type="button"
                  onClick={handleSubmitSurvey}
                  disabled={isSubmitting || uploadingLogo}
                  className="btn-primary"
                >
                  {(isSubmitting || uploadingLogo) ? (
                    <>
                      <span className="spinner"></span>
                      {uploadingLogo ? 'Processing logo...' : 'Submitting...'}
                    </>
                  ) : (
                    <>
                      Complete Survey
                      <span className="btn-arrow">→</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Survey;