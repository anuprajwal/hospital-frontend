import React, { useState, useEffect, useCallback } from 'react';
import { hospitalEndpoints } from '../../services/api';
import { paymentService } from '../../services/paymentApi';
import Alert from '../ui/Alert';
import Loader from '../ui/Loader';
import BankDetailsForm from './kyc/BankDetailsForm';
import KycStatusBanner from './kyc/KycStatusBanner';
import KycSubmissionForm from './kyc/KycSubmissionForm';
import { ShieldCheck, CheckCircle, Clock, XCircle } from 'lucide-react';

export default function HospitalKycAndBankingPage() {
  const [hospitalId, setHospitalId] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [kycStatus, setKycStatus] = useState('unsubmitted'); // 'unsubmitted' | 'pending' | 'verified' | 'rejected'
  const [actionLoading, setActionLoading] = useState(false);
  const [status, setStatus] = useState({ error: null, success: null });

  const [initialBankData, setInitialBankData] = useState({
    account_number: '',
    beneficiary_name: '',
    ifsc_code: ''
  });

  const [initialKycForm, setInitialKycForm] = useState({});

  // Fix infinite scroll re-render trigger: scroll on status change safely
  useEffect(() => {
    if (status.error || status.success) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [status]);

  const fetchLiveKycStatus = useCallback(async (id) => {
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
  }, []);

  const loadHospitalData = useCallback(async () => {
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
        setInitialBankData(initialBank);

        // 2. Fetch Address for Pre-fill
        let primaryAddress = {};
        try {
          const addrRes = await hospitalEndpoints.getAddress();
          const addrList = addrRes.data?.addresses || addrRes.data?.address || [];
          if (Array.isArray(addrList) && addrList.length > 0) {
            primaryAddress = addrList[0];
          }
        } catch (e) {
          console.log(e);
        }

        // Pre-fill KYC form object
        setInitialKycForm({
          legal_business_name: orgProfile.organisation_name || '',
          contact_name: userData.username || '',
          business_type: 'individual',
          address_line1: primaryAddress.street ? `${primaryAddress.house_no ? primaryAddress.house_no + ', ' : ''}${primaryAddress.street}` : '',
          city: primaryAddress.city || '',
          state: primaryAddress.state || '',
          postal_code: primaryAddress.pincode || '',
          beneficiary_name: initialBank.beneficiary_name || '',
          account_number: initialBank.account_number || '',
          ifsc_code: initialBank.ifsc_code || ''
        });

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
  }, [fetchLiveKycStatus]);

  useEffect(() => {
    loadHospitalData();
  }, [loadHospitalData]);

  const handleBankSubmit = async (bankData) => {
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

  const handleKycSubmit = async (kycForm) => {
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
        error: err.response?.data?.error?.error?.description || 'KYC submission failed. Please verify your business and bank details.',
        success: null
      });
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

      {/* 1. Settlement Bank Account Form Module */}
      <BankDetailsForm
        initialBankData={initialBankData}
        onSubmit={handleBankSubmit}
        loading={actionLoading}
      />

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

        {/* Status Messages */}
        <KycStatusBanner
          kycStatus={kycStatus}
          onCheckStatus={() => fetchLiveKycStatus(hospitalId)}
        />

        {/* Submission Form Component */}
        {(kycStatus === 'unsubmitted' || kycStatus === 'rejected') && (
          <KycSubmissionForm
            initialForm={initialKycForm}
            onSubmit={handleKycSubmit}
            loading={actionLoading}
          />
        )}
      </div>
    </div>
  );
}