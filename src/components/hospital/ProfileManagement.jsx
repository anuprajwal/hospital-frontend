import React, { useState, useEffect } from 'react';
import { hospitalEndpoints } from '../../services/api';
import Alert from '../ui/Alert';
import Loader from '../ui/Loader';
import HospitalInfoForm from './profile/HospitalInfoForm';
import HospitalAddressSection from './profile/HospitalAddressSection';
import HospitalVerificationCard from './profile/HospitalVerificationCard';
import HospitalBankForm from './profile/HospitalBankForm';
import HospitalPasswordForm from './profile/HospitalPasswordForm';

export default function ProfileManagement() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [profileForm, setProfileForm] = useState({
    org_type: 'hospital',
    org_name: '',
    org_license: '',
    org_establishment: '',
    org_url: '',
    org_ambulance: 'false',
    org_services: []
  });

  const [password, setPassword] = useState('');
  const [address, setAddress] = useState(null);
  const [addressForm, setAddressForm] = useState({
    street: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    landmark: '',
    houseNo: ''
  });
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [bank, setBank] = useState({ account_number: '', beneficiary_name: '', ifsc_code: '' });
  const [verification, setVerification] = useState({
    emailVerified: false,
    phoneVerified: false,
    emailOtp: '',
    phoneOtp: '',
    emailMsg: '',
    phoneMsg: ''
  });

  useEffect(() => {
    fetchCoreData();
  }, []);

  const fetchCoreData = async () => {
    setLoading(true);
    try {
      const userRes = await hospitalEndpoints.getProfile();
      const userData = userRes.data?.userData;
      if (userData) {
        setVerification(prev => ({
          ...prev,
          emailVerified: userData.is_email_verified,
          phoneVerified: userData.is_phone_verified
        }));

        const orgProfile = userData.organisationProfile || userData.hospitalOrganisation || {};
        
        let parsedServices = [];
        if (orgProfile.specializations_provided) {
          try {
            parsedServices = typeof orgProfile.specializations_provided === 'string'
              ? JSON.parse(orgProfile.specializations_provided)
              : orgProfile.specializations_provided;
          } catch (e) {
            parsedServices = [];
          }
        } else if (orgProfile.org_services) {
          parsedServices = orgProfile.org_services;
        }

        let estYear = '';
        if (orgProfile.establishment_year) {
          estYear = String(orgProfile.establishment_year).substring(0, 4);
        } else if (orgProfile.org_establishment) {
          estYear = String(orgProfile.org_establishment);
        }

        setProfileForm({
          org_type: orgProfile.organisation_type || orgProfile.org_type || 'hospital',
          org_name: orgProfile.organisation_name || orgProfile.org_name || '',
          org_license: orgProfile.regestration_number || orgProfile.org_license || '',
          org_establishment: estYear,
          org_url: orgProfile.website_url || orgProfile.org_url || '',
          org_ambulance: String(orgProfile.ambulance_available ?? orgProfile.org_ambulance ?? 'false'),
          org_services: parsedServices
        });

        if (orgProfile.account_number) {
          setBank({
            account_number: orgProfile.account_number || '',
            beneficiary_name: orgProfile.beneficiary_name || '',
            ifsc_code: orgProfile.ifsc_code || ''
          });
        }
      }

      const addrRes = await hospitalEndpoints.getAddress();
      const addrList = addrRes.data?.addresses || addrRes.data?.address || [];
      if (Array.isArray(addrList) && addrList.length > 0) {
        const primaryAddr = addrList[0];
        setAddress(primaryAddr);
        setAddressForm({
          street: primaryAddr.street || '',
          city: primaryAddr.city || '',
          state: primaryAddr.state || '',
          pincode: primaryAddr.pincode || '',
          country: primaryAddr.country || 'India',
          landmark: primaryAddr.landmark || '',
          houseNo: primaryAddr.house_no || primaryAddr.houseNo || ''
        });
      } else {
        setAddress(null);
      }

      try {
        const bankRes = await hospitalEndpoints.getBankDetails();
        if (bankRes.data?.bankDetails) {
          setBank(bankRes.data.bankDetails);
        }
      } catch (e) {
        // Handled via organisationProfile fallback
      }
    } catch (err) {
      setError(err.message || 'Failed to load profile data.');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      await hospitalEndpoints.updateProfile(profileForm);
      setSuccess('Hospital profile updated successfully.');
    } catch (err) { setError(err.message); }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      await hospitalEndpoints.changePassword(password);
      setSuccess('Password changed successfully.');
      setPassword('');
    } catch (err) { setError(err.message); }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      if (address) {
        await hospitalEndpoints.updateAddress({ ...addressForm, addressId: String(address.id) });
        setSuccess('Address updated successfully.');
      } else {
        await hospitalEndpoints.addAddress(addressForm);
        setSuccess('Address added successfully.');
      }
      setIsEditingAddress(false);
      fetchCoreData();
    } catch (err) { setError(err.message); }
  };

  const handleAddressDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    setError(''); setSuccess('');
    try {
      await hospitalEndpoints.deleteAddress(String(address.id));
      setSuccess('Address deleted successfully.');
      setAddress(null);
      setAddressForm({ street: '', city: '', state: '', pincode: '', country: 'India', landmark: '', houseNo: '' });
    } catch (err) { setError(err.message); }
  };

  const handleBankSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      await hospitalEndpoints.uploadBankDetails(bank);
      setSuccess('Bank details saved successfully.');
    } catch (err) { setError(err.message); }
  };

  const triggerOtp = async (channel) => {
    try {
      if (channel === 'email') {
        await hospitalEndpoints.sendEmailOtp();
        setVerification(p => ({ ...p, emailMsg: 'OTP sent to your email.' }));
      } else {
        await hospitalEndpoints.sendMobileOtp();
        setVerification(p => ({ ...p, phoneMsg: 'OTP sent to your phone number.' }));
      }
    } catch (err) { setError(err.message); }
  };

  const verifyOtpToken = async (channel) => {
    try {
      const payload = channel === 'email' 
        ? { userOtp: verification.emailOtp, email: 'true' }
        : { userOtp: verification.phoneOtp, phoneNumber: 'true' };
      await hospitalEndpoints.verifyOtp(payload);
      setSuccess(`${channel === 'email' ? 'Email' : 'Phone'} verified successfully.`);
      fetchCoreData();
    } catch (err) { setError(err.message); }
  };

  if (loading) return <Loader size="lg" />;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Hospital Profile</h1>
        <p className="text-sm text-slate-500">Manage your hospital details, location, bank account, and security settings.</p>
      </div>

      <Alert type="error" message={error} />
      <Alert type="success" message={success} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <HospitalInfoForm 
            profileForm={profileForm} 
            setProfileForm={setProfileForm} 
            onSubmit={handleProfileSubmit} 
          />
          <HospitalAddressSection 
            address={address} 
            addressForm={addressForm} 
            setAddressForm={setAddressForm} 
            isEditingAddress={isEditingAddress} 
            setIsEditingAddress={setIsEditingAddress} 
            onSubmit={handleAddressSubmit} 
            onDelete={handleAddressDelete} 
          />
        </div>

        <div className="space-y-8">
          <HospitalVerificationCard 
            verification={verification} 
            setVerification={setVerification} 
            onSendOtp={triggerOtp} 
            onVerifyOtp={verifyOtpToken} 
          />
          <HospitalBankForm 
            bank={bank} 
            setBank={setBank} 
            onSubmit={handleBankSubmit} 
          />
          <HospitalPasswordForm 
            password={password} 
            setPassword={setPassword} 
            onSubmit={handlePasswordSubmit} 
          />
        </div>
      </div>
    </div>
  );
}