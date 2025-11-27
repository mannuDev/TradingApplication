import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitKYC, getKYCStatus } from '../../api';
import Logo from '../../components/Logo';

const KYCForm = () => {
  const [formData, setFormData] = useState({
    pan: '',
    aadhaar: '',
    dob: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India'
    }
  });
  const [kycImage, setKycImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [kycStatus, setKycStatus] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadKYCStatus();
  }, []);

  const loadKYCStatus = async () => {
    try {
      const response = await getKYCStatus();
      setKycStatus(response.data);
      if (response.data.pan) setFormData(prev => ({ ...prev, pan: response.data.pan }));
      if (response.data.aadhaar) setFormData(prev => ({ ...prev, aadhaar: response.data.aadhaar }));
      if (response.data.dob) setFormData(prev => ({ ...prev, dob: response.data.dob.split('T')[0] }));
      if (response.data.address) setFormData(prev => ({ ...prev, address: response.data.address }));
      if (response.data.kycImage) setPreviewImage(`http://localhost:5000${response.data.kycImage}`);
    } catch (err) {
      console.error('Error loading KYC status:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: { ...prev.address, [field]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }
      setKycImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validatePAN = (pan) => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(pan);
  };

  const validateAadhaar = (aadhaar) => {
    const aadhaarRegex = /^[0-9]{12}$/;
    return aadhaarRegex.test(aadhaar);
  };

  const validatePincode = (pincode) => {
    const pincodeRegex = /^[0-9]{6}$/;
    return pincodeRegex.test(pincode);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate PAN
    if (formData.pan && !validatePAN(formData.pan)) {
      setError('Invalid PAN format. Must be in format: ABCDE1234F');
      return;
    }

    // Validate Aadhaar
    if (formData.aadhaar && !validateAadhaar(formData.aadhaar)) {
      setError('Invalid Aadhaar format. Must be 12 digits');
      return;
    }

    // Validate Pincode
    if (formData.address.pincode && !validatePincode(formData.address.pincode)) {
      setError('Invalid pincode format. Must be 6 digits');
      return;
    }

    setLoading(true);

    try {
      const submitData = new FormData();
      submitData.append('pan', formData.pan.toUpperCase());
      if (formData.aadhaar) submitData.append('aadhaar', formData.aadhaar);
      if (formData.dob) submitData.append('dob', formData.dob);
      submitData.append('address', JSON.stringify(formData.address));
      if (kycImage) {
        submitData.append('kycImage', kycImage);
      }

      await submitKYC(submitData);
      setSuccess('KYC submitted successfully! Awaiting admin verification.');
      loadKYCStatus();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit KYC');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="kyc-page">
      <div className="kyc-container glass-card">
        <div className="kyc-header">
          <Logo size="medium" />
          <h2 className="kyc-title">Complete Your KYC</h2>
          <p className="kyc-subtitle">Verify your identity to start trading</p>
        </div>

        {kycStatus?.kycStatus && (
          <div className={`kyc-status-badge ${kycStatus.kycStatus}`}>
            <span>Status: {kycStatus.kycStatus.toUpperCase()}</span>
            {kycStatus.kycRejectionReason && (
              <p className="rejection-reason">Reason: {kycStatus.kycRejectionReason}</p>
            )}
          </div>
        )}

        {error && (
          <div className="error-message-futuristic">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10" strokeWidth="2"/>
              <line x1="12" y1="8" x2="12" y2="12" strokeWidth="2"/>
              <line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="2"/>
            </svg>
            {error}
          </div>
        )}

        {success && (
          <div className="success-message-futuristic">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" strokeWidth="2"/>
              <polyline points="22 4 12 14.01 9 11.01" strokeWidth="2"/>
            </svg>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="kyc-form">
          <div className="form-section">
            <h3 className="section-title">Personal Information</h3>
            
            <div className="form-group-futuristic">
              <label className="form-label">PAN Number *</label>
              <input
                type="text"
                name="pan"
                className="neon-input"
                value={formData.pan}
                onChange={(e) => {
                  const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
                  setFormData(prev => ({ ...prev, pan: value }));
                }}
                placeholder="ABCDE1234F"
                maxLength={10}
                required
              />
              <small className="form-hint">Format: 5 letters, 4 numbers, 1 letter</small>
            </div>

            <div className="form-group-futuristic">
              <label className="form-label">Aadhaar Number *</label>
              <input
                type="text"
                name="aadhaar"
                className="neon-input"
                value={formData.aadhaar}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 12);
                  setFormData(prev => ({ ...prev, aadhaar: value }));
                }}
                placeholder="123456789012"
                maxLength={12}
                required
              />
              <small className="form-hint">12-digit Aadhaar number</small>
            </div>

            <div className="form-group-futuristic">
              <label className="form-label">Date of Birth *</label>
              <input
                type="date"
                name="dob"
                className="neon-input"
                value={formData.dob}
                onChange={handleChange}
                required
                max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
              />
              <small className="form-hint">Must be 18 years or older</small>
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">Address Information</h3>
            
            <div className="form-group-futuristic">
              <label className="form-label">Street Address</label>
              <input
                type="text"
                name="address.street"
                className="neon-input"
                value={formData.address.street}
                onChange={handleChange}
                placeholder="House/Flat No., Building Name"
              />
            </div>

            <div className="form-row">
              <div className="form-group-futuristic">
                <label className="form-label">City *</label>
                <input
                  type="text"
                  name="address.city"
                  className="neon-input"
                  value={formData.address.city}
                  onChange={handleChange}
                  placeholder="City"
                  required
                />
              </div>

              <div className="form-group-futuristic">
                <label className="form-label">State *</label>
                <input
                  type="text"
                  name="address.state"
                  className="neon-input"
                  value={formData.address.state}
                  onChange={handleChange}
                  placeholder="State"
                  required
                />
              </div>
            </div>

            <div className="form-group-futuristic">
              <label className="form-label">Pincode *</label>
              <input
                type="text"
                name="address.pincode"
                className="neon-input"
                value={formData.address.pincode}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
                  setFormData(prev => ({
                    ...prev,
                    address: { ...prev.address, pincode: value }
                  }));
                }}
                placeholder="123456"
                maxLength={6}
                required
              />
              <small className="form-hint">6-digit pincode</small>
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">Identity Proof</h3>
            
            <div className="form-group-futuristic">
              <label className="form-label">Upload ID Proof (Image) *</label>
              <div className="file-upload-area">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="file-input"
                  id="kycImage"
                  required={!previewImage}
                />
                <label htmlFor="kycImage" className="file-label">
                  {previewImage ? 'Change Image' : 'Choose File'}
                </label>
                {previewImage && (
                  <div className="image-preview">
                    <img src={previewImage} alt="KYC Preview" />
                  </div>
                )}
              </div>
              <small className="form-hint">Max size: 5MB. Formats: JPG, PNG</small>
            </div>
          </div>

          <button 
            type="submit" 
            className="neon-button auth-button" 
            disabled={loading || kycStatus?.kycStatus === 'verified'}
          >
            {loading ? (
              <>
                <span className="analyzing-spinner"></span>
                Submitting...
              </>
            ) : (
              'Submit KYC'
            )}
          </button>
        </form>

        <div className="kyc-footer">
          <button
            onClick={() => navigate('/products')}
            className="neon-button secondary-button"
          >
            Continue to Products
          </button>
        </div>
      </div>
    </div>
  );
};

export default KYCForm;
