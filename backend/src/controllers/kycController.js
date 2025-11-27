const User = require('../models/User');
const { validatePAN, validateAadhaar, validatePincode, validateDOB } = require('../utils/validators');

exports.submitKYC = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { pan, aadhaar, dob, address } = req.body;

    // Validate PAN
    if (pan) {
      const panValidation = validatePAN(pan);
      if (!panValidation.valid) {
        return res.status(400).json({ message: panValidation.message });
      }
      user.pan = pan.toUpperCase();
    }

    // Validate Aadhaar
    if (aadhaar) {
      const aadhaarValidation = validateAadhaar(aadhaar);
      if (!aadhaarValidation.valid) {
        return res.status(400).json({ message: aadhaarValidation.message });
      }
      user.aadhaar = aadhaar;
    }

    // Validate DOB
    if (dob) {
      const dobValidation = validateDOB(dob);
      if (!dobValidation.valid) {
        return res.status(400).json({ message: dobValidation.message });
      }
      user.dob = new Date(dob);
    }

    // Validate and save address
    if (address) {
      if (address.pincode) {
        const pincodeValidation = validatePincode(address.pincode);
        if (!pincodeValidation.valid) {
          return res.status(400).json({ message: pincodeValidation.message });
        }
      }
      user.address = {
        street: address.street || user.address?.street,
        city: address.city || user.address?.city,
        state: address.state || user.address?.state,
        pincode: address.pincode || user.address?.pincode,
        country: address.country || 'India'
      };
    }

    // Handle file upload
    if (req.file) {
      user.kycImage = `/uploads/kyc/${req.file.filename}`;
    }

    // Set KYC status to pending if all required fields are present
    if (user.pan && user.aadhaar && user.dob && user.address?.pincode && user.kycImage) {
      user.kycStatus = 'pending';
    }

    await user.save();
    res.json({ 
      message: 'KYC submitted successfully. Awaiting admin verification.', 
      user: {
        pan: user.pan,
        kycStatus: user.kycStatus,
        kycImage: user.kycImage
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getKYCStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('pan aadhaar dob address kycImage kycStatus kycRejectionReason');
    res.json({
      pan: user.pan,
      aadhaar: user.aadhaar,
      dob: user.dob,
      address: user.address,
      kycImage: user.kycImage,
      kycStatus: user.kycStatus,
      kycRejectionReason: user.kycRejectionReason
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};