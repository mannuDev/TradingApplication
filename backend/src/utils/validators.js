// PAN Card validation
exports.validatePAN = (pan) => {
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  if (!pan || !panRegex.test(pan)) {
    return {
      valid: false,
      message: 'Invalid PAN format. PAN must be in format: ABCDE1234F'
    };
  }
  return { valid: true };
};

// Aadhaar validation
exports.validateAadhaar = (aadhaar) => {
  const aadhaarRegex = /^[0-9]{12}$/;
  if (!aadhaar || !aadhaarRegex.test(aadhaar)) {
    return {
      valid: false,
      message: 'Invalid Aadhaar format. Must be 12 digits'
    };
  }
  return { valid: true };
};

// Pincode validation
exports.validatePincode = (pincode) => {
  const pincodeRegex = /^[0-9]{6}$/;
  if (!pincode || !pincodeRegex.test(pincode)) {
    return {
      valid: false,
      message: 'Invalid pincode format. Must be 6 digits'
    };
  }
  return { valid: true };
};

// Date of Birth validation (must be 18+)
exports.validateDOB = (dob) => {
  if (!dob) {
    return { valid: false, message: 'Date of birth is required' };
  }
  const birthDate = new Date(dob);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (age < 18 || (age === 18 && monthDiff < 0)) {
    return {
      valid: false,
      message: 'You must be at least 18 years old to register'
    };
  }
  return { valid: true };
};

