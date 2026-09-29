import React, { useState, useEffect, useRef, useCallback } from 'react';
import { hospitalEndpoints } from '../../services/api';
import { paymentService } from '../../services/paymentApi';
import Alert from '../ui/Alert';
import Loader from '../ui/Loader';
import BankDetailsForm from './kyc/BankDetailsForm';
import KycStatusBanner from './kyc/KycStatusBanner';
import KycSubmissionForm from './kyc/KycSubmissionForm';
import { ShieldCheck, CheckCircle, Clock, XCircle } from 'lucide-react';

export default function HospitalKycAndBankingPage() {
  console.log('[CHECKPOINT 1] Component Rendered');

  const [hospitalId, setHospitalId] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [kycStatus, setKycStatus] = useState('unsubmitted');
  const [actionLoading, setActionLoading] = useState(false);
  const [status, setStatus] = useState({ error: null, success: null });

  
  const [initialBankData, setInitialBankData] = useState({
    account_number: '',
    beneficiary_name: '',
    ifsc_code: ''
  });

  const [initialKycForm, setInitialKycForm] = useState(null);

  // Hard Guard: Ensures mount effect runs EXACTLY ONCE
  const isFetchedRef = useRef(false);

  // Checkpoint 2: Check window scroll triggers
  useEffect(() => {
    if (status.error || status.success) {
      console.log('[CHECKPOINT 2] Status alert triggered smooth scroll');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [status.error, status.success]);

  const fetchLiveKycStatus = useCallback(async (id) => {
    console.log('[CHECKPOINT 3] fetchLiveKycStatus called with ID:', id);
    try {
      const res = await paymentService.getHospitalOnboardingStatus(id);
      if (res.data?.success) {
        const currentStatus = res.data.kyc_status || res.data.account?.kyc?.status || 'pending';
        setKycStatus(currentStatus);
      } else {
        setKycStatus('unsubmitted');
      }
    } catch (err) {
      console.error('[CHECKPOINT 3 - ERROR] KYC status fetch error:', err);
      setKycStatus('unsubmitted');
    }
  }, []);

  // Checkpoint 4: Data Loader Effect (Strict single-run guard)
  useEffect(() => {
    if (isFetchedRef.current) {
      console.log('[CHECKPOINT 4] Data already fetched, skipping duplicate load');
      return;
    }
    isFetchedRef.current = true;
    console.log('[CHECKPOINT 4] Starting initial data load execution');

    const loadHospitalData = async () => {
      setPageLoading(true);
      setStatus({ error: null, success: null });
      try {
        console.log('[CHECKPOINT 5] Fetching Hospital Profile...');
        const profileRes = await hospitalEndpoints.getProfile();
        const userData = profileRes.data?.userData || {};
        const orgProfile = userData.organisationProfile || {};
        const currentHospitalId = userData.id;

        if (currentHospitalId) {
          setHospitalId(currentHospitalId);

          const initialBank = {
            account_number: orgProfile.account_number || '',
            beneficiary_name: orgProfile.beneficiary_name || '',
            ifsc_code: orgProfile.ifsc_code || ''
          };
          console.log('[CHECKPOINT 6] Setting Bank Details State');
          setInitialBankData(initialBank);

          let primaryAddress = {};
          try {
            console.log('[CHECKPOINT 7] Fetching Address...');
            const addrRes = await hospitalEndpoints.getAddress();
            const addrList = addrRes.data?.addresses || addrRes.data?.address || [];
            if (Array.isArray(addrList) && addrList.length > 0) {
              primaryAddress = addrList[0];
            }
          } catch (e) {
            console.warn('[CHECKPOINT 7 - WARN] Address fetch skipped/failed', e);
          }

          console.log('[CHECKPOINT 8] Setting Initial KYC Form State');
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
        console.error('[CHECKPOINT 9 - ERROR] Primary load caught error:', err);
        setStatus({
          error: err.response?.data?.message || 'Failed to retrieve hospital onboarding credentials.',
          success: null
        });
        setKycStatus('unsubmitted');
      } finally {
        console.log('[CHECKPOINT 10] Finishing load - setPageLoading(false)');
        setPageLoading(false);
      }
    };

    loadHospitalData();
  }, [fetchLiveKycStatus]);

  const handleBankSubmit = async (bankData) => {
    console.log('[CHECKPOINT 11] Bank form submitted', bankData);
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
    console.log('[CHECKPOINT 12] KYC form submitted', kycForm);
    if (!hospitalId) return;
    setStatus({ error: null, success: null });
    setActionLoading(true);

    try {
      const res = await paymentService.startHospitalOnboarding(hospitalId, kycForm);
      if (res.data?.success) {
        setKycStatus(res.data.kyc_status || 'pending');
        setStatus({
          error: null,
          success: 'Hospital KYC details submitted successfully!'
        });
      }
    } catch (err) {
      setStatus({
        error: err.response?.data?.error?.error?.description || 'KYC submission failed.',
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


  // Correct place for async operations or delays
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('[CHECKPOINT 1] Component Rendered - 2 Second Timeout Completed');
    }, 2000);

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, []);

    return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Hospital KYC & Payments Setup</h1>
        <p className="text-sm text-slate-500">
          Connect your hospital with Razorpay to accept online patient bookings and manage automatic settlements.
        </p>
      </div>

      <Alert type={status.success ? 'success' : 'error'} message={status.success || status.error} />

      <BankDetailsForm
        initialBankData={initialBankData}
        onSubmit={handleBankSubmit}
        loading={actionLoading}
      />

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <div>
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                Razorpay Merchant KYC
              </h2>
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

        <KycStatusBanner
          kycStatus={kycStatus}
          onCheckStatus={() => fetchLiveKycStatus(hospitalId)}
        />

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