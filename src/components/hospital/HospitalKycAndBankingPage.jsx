import React, { useState, useEffect } from 'react';
import { hospitalEndpoints } from '../../services/api';
import { paymentService } from '../../services/paymentApi';
import Alert from '../ui/Alert';
import Loader from '../ui/Loader';
import { Building, ShieldCheck, CreditCard, RefreshCw, CheckCircle, AlertTriangle, XCircle, Clock } from 'lucide-react';

export default function HospitalKycAndBankingPage() {
  const [hospitalId, setHospitalId] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [kycStatus, setKycStatus] = useState('unsubmitted'); // 'unsubmitted' | 'pending' | 'verified' | 'rejected'
  const [actionLoading, setActionLoading] = useState(false);
  const [status, setStatus] = useState({ error: null, success: null });

  // Bank Details State
  const [bankData, setBankData] = useState({
    account_number: '',
    beneficiary_name: '',
    ifsc_code: ''
  });

  // KYC Submission Form State
  const [kycForm, setKycForm] = useState({
    legal_business_name: '',
    contact_name: '',
    business_type: 'hospital',
    subcategory: 'healthcare',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    business_pan: '',
    gst_number: '',
    personal_pan: '',
    beneficiary_name: '',
    account_number: '',
    ifsc_code: ''
  });

  const fetchLiveKycStatus = async (id) => {
    try {
      const res = await paymentService.getHospitalOnboardingStatus(id);
      if (res.data?.success) {
        const currentStatus = res.data.kyc_status || res.data.account?.kyc?.status || 'pending';
        setKycStatus(currentStatus);
      } else {
        setKycStatus('unsubmitted');
      }
    } catch (err) {
      setKycStatus('unsubmitted');
    }
  };

  const loadHospitalData = async () => {
    setPageLoading(true);
    setStatus({ error: null, success: null });
    try {
      // 1. Fetch Profile Info
      const profileRes = await hospitalEndpoints.getProfile();
      const userData = profileRes.data?.userData || {};
      const orgProfile = userData.organisationProfile || {};
      const currentHospitalId = userData.id;

      if (currentHospitalId) {
        setHospitalId(currentHospitalId);

        // Bank data fallback
        const initialBank = {
          account_number: orgProfile.account_number || '',
          beneficiary_name: orgProfile.beneficiary_name || '',
          ifsc_code: orgProfile.ifsc_code || ''
        };
        setBankData(initialBank);

        // 2. Fetch Address for Pre-fill
        let primaryAddress = {};
        try {
          const addrRes = await hospitalEndpoints.getAddress();
          const addrList = addrRes.data?.addresses || addrRes.data?.address || [];
          if (Array.isArray(addrList) && addrList.length > 0) {
            primaryAddress = addrList[0];
          }
        } catch (e) {
          // Fallback to empty address
        }

        // Pre-fill KYC form
        setKycForm(prev => ({
          ...prev,
          legal_business_name: orgProfile.organisation_name || prev.legal_business_name,
          contact_name: userData.username || prev.contact_name,
          business_type: orgProfile.organisation_type || 'hospital',
          address_line1: primaryAddress.street ? `${primaryAddress.house_no ? primaryAddress.house_no + ', ' : ''}${primaryAddress.street}` : prev.address_line1,
          city: primaryAddress.city || prev.city,
          state: primaryAddress.state || prev.state,
          postal_code: primaryAddress.pincode || prev.postal_code,
          beneficiary_name: initialBank.beneficiary_name || prev.beneficiary_name,
          account_number: initialBank.account_number || prev.account_number,
          ifsc_code: initialBank.ifsc_code || prev.ifsc_code
        }));

        await fetchLiveKycStatus(currentHospitalId);
      }
    } catch (err) {
      setStatus({
        error: err.response?.data?.message || 'Failed to retrieve hospital onboarding credentials.',
        success: null
      });
      setKycStatus('unsubmitted');
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    loadHospitalData();
  }, []);

  const handleKycChange = (e) => {
    const { name, value } = e.target;
    setKycForm(prev => ({ ...prev, [name]: value }));
  };

  const handleKycSubmit = async (e) => {
    e.preventDefault();
    if (!hospitalId) return;
    setStatus({ error: null, success: null });
    setActionLoading(true);

    try {
      const res = await paymentService.startHospitalOnboarding(hospitalId, kycForm);
      if (res.data?.success) {
        setKycStatus(res.data.kyc_status || 'pending');
        setStatus({
          error: null,
          success: 'Hospital KYC details submitted successfully! Razorpay compliance review is in progress.'
        });
      }
    } catch (err) {
      setStatus({
        error: err.response?.data?.message || 'KYC submission failed. Please verify your business and bank details.',
        success: null
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleBankSubmit = async (e) => {
    e.preventDefault();
    setStatus({ error: null, success: null });
    setActionLoading(true);
    try {
      await hospitalEndpoints.uploadBankDetails(bankData);
      setStatus({ error: null, success: 'Payout settlement bank account updated successfully.' });
    } catch (err) {
      setStatus({ error: err.response?.data?.message || 'Failed to update bank details.', success: null });
    } finally {
      setActionLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="py-24 flex justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Hospital KYC & Payments Setup</h1>
        <p className="text-sm text-slate-500">
          Connect your hospital with Razorpay to accept online patient bookings and manage automatic settlements.
        </p>
      </div>

      <Alert type={status.success ? 'success' : 'error'} message={status.success || status.error} />

      {/* 1. Settlement Bank Account Form */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 space-y-4">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-blue-600" />
            <div>
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                Payout Settlement Bank Account
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Hospital bank account for receiving completed appointment settlements.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleBankSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end pt-2">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Beneficiary Name</label>
            <input
              type="text"
              required
              value={bankData.beneficiary_name}
              onChange={(e) => setBankData({ ...bankData, beneficiary_name: e.target.value })}
              placeholder="e.g. Apollo Hospitals Ltd"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Account Number</label>
            <input
              type="text"
              required
              value={bankData.account_number}
              onChange={(e) => setBankData({ ...bankData, account_number: e.target.value })}
              placeholder="033325224385037"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">IFSC Code</label>
            <input
              type="text"
              required
              value={bankData.ifsc_code}
              onChange={(e) => setBankData({ ...bankData, ifsc_code: e.target.value })}
              placeholder="HDFC0000123"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500 uppercase"
            />
          </div>
          <div className="sm:col-span-3 flex justify-end">
            <button
              type="submit"
              disabled={actionLoading}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg transition disabled:opacity-50"
            >
              {actionLoading ? 'Updating Bank...' : 'Save Bank Details'}
            </button>
          </div>
        </form>
      </div>

      {/* 2. Razorpay KYC Compliance Card */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <div>
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                Razorpay Merchant KYC
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Complete institutional identity verification to activate live merchant payment routing.
              </p>
            </div>
          </div>
          <div>
            {kycStatus === 'verified' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-full border border-emerald-200">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> KYC Verified
              </span>
            )}
            {kycStatus === 'pending' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-50 text-amber-700 font-bold text-xs rounded-full border border-amber-200">
                <Clock className="w-3.5 h-3.5 text-amber-600" /> Review in Progress
              </span>
            )}
            {kycStatus === 'rejected' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-rose-50 text-rose-700 font-bold text-xs rounded-full border border-rose-200">
                <XCircle className="w-3.5 h-3.5 text-rose-600" /> KYC Rejected
              </span>
            )}
            {kycStatus === 'unsubmitted' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-600 font-bold text-xs rounded-full border border-slate-200">
                Not Submitted
              </span>
            )}
          </div>
        </div>

        {/* State: Verified */}
        {kycStatus === 'verified' && (
          <div className="p-6 bg-emerald-50/50 border border-emerald-200 rounded-xl text-center space-y-1">
            <h3 className="text-sm font-bold text-emerald-800">Hospital Account Verified & Active</h3>
            <p className="text-xs text-emerald-600 max-w-md mx-auto">
              Your organization and banking credentials have been verified by Razorpay. Patient payments and settlements will route automatically.
            </p>
          </div>
        )}

        {/* State: Pending */}
        {kycStatus === 'pending' && (
          <div className="p-6 bg-amber-50/50 border border-amber-200 rounded-xl text-center space-y-3">
            <h3 className="text-sm font-bold text-amber-800">Verification Under Review</h3>
            <p className="text-xs text-amber-600 max-w-md mx-auto">
              Razorpay compliance checks are currently being processed. Verification usually takes 24–48 hours.
            </p>
            <button
              type="button"
              onClick={() => fetchLiveKycStatus(hospitalId)}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg transition"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Check Status
            </button>
          </div>
        )}

        {/* State: Unsubmitted or Rejected */}
        {(kycStatus === 'unsubmitted' || kycStatus === 'rejected') && (
          <form onSubmit={handleKycSubmit} className="space-y-6">
            {/* Section 1: Business Identification */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 pb-1">
                1. Organization Identification
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Legal Business / Hospital Name *</label>
                  <input
                    type="text"
                    required
                    name="legal_business_name"
                    value={kycForm.legal_business_name}
                    onChange={handleKycChange}
                    placeholder="e.g. Prajwal Multi-Specialty Hospital"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Contact Person Name *</label>
                  <input
                    type="text"
                    required
                    name="contact_name"
                    value={kycForm.contact_name}
                    onChange={handleKycChange}
                    placeholder="e.g. Dr. Anup Rajwal"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Business PAN (Organization) *</label>
                  <input
                    type="text"
                    required
                    name="business_pan"
                    value={kycForm.business_pan}
                    onChange={handleKycChange}
                    placeholder="AAACH1234F"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500 uppercase"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Personal PAN (Authorized Signatory) *</label>
                  <input
                    type="text"
                    required
                    name="personal_pan"
                    value={kycForm.personal_pan}
                    onChange={handleKycChange}
                    placeholder="ABCDE1234F"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500 uppercase"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">GST Number (Optional)</label>
                  <input
                    type="text"
                    name="gst_number"
                    value={kycForm.gst_number}
                    onChange={handleKycChange}
                    placeholder="36AAAAA0000A1Z5"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500 uppercase"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Business Type</label>
                  <select
                    name="business_type"
                    value={kycForm.business_type}
                    onChange={handleKycChange}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500"
                  >
                    <option value="private_limited">Private Limited Company</option>
                    <option value="public_limited">Public Limited Company</option>
                    <option value="partnership">Partnership</option>
                    <option value="llp">Limited Liability Partnership (LLP)</option>
                    <option value="trust">Trust / NGO</option>
                    <option value="society">Society</option>
                    <option value="proprietorship">Sole Proprietorship</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 2: Hospital Registered Address */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 pb-1">
                2. Registered Hospital Address
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-3">
                  <label className="block text-xs font-medium text-slate-600 mb-1">Address Line 1 *</label>
                  <input
                    type="text"
                    required
                    name="address_line1"
                    value={kycForm.address_line1}
                    onChange={handleKycChange}
                    placeholder="Main Road, Near City Center"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">City *</label>
                  <input
                    type="text"
                    required
                    name="city"
                    value={kycForm.city}
                    onChange={handleKycChange}
                    placeholder="Warangal"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">State *</label>
                  <input
                    type="text"
                    required
                    name="state"
                    value={kycForm.state}
                    onChange={handleKycChange}
                    placeholder="Telangana"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Postal Code *</label>
                  <input
                    type="text"
                    required
                    name="postal_code"
                    value={kycForm.postal_code}
                    onChange={handleKycChange}
                    placeholder="506332"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Settlement Bank Credentials */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 pb-1">
                3. Settlement Bank Account Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Beneficiary Name *</label>
                  <input
                    type="text"
                    required
                    name="beneficiary_name"
                    value={kycForm.beneficiary_name}
                    onChange={handleKycChange}
                    placeholder="Account holder name"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Account Number *</label>
                  <input
                    type="text"
                    required
                    name="account_number"
                    value={kycForm.account_number}
                    onChange={handleKycChange}
                    placeholder="033325224385037"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">IFSC Code *</label>
                  <input
                    type="text"
                    required
                    name="ifsc_code"
                    value={kycForm.ifsc_code}
                    onChange={handleKycChange}
                    placeholder="NESF0000333"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500 uppercase"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={actionLoading}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-sm transition disabled:opacity-50"
              >
                {actionLoading ? 'Submitting to Razorpay...' : 'Submit Hospital KYC for Activation'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}