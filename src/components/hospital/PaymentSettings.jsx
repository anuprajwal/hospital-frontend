import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  IndianRupee, 
  Clock, 
  Award, 
  Building2, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Save, 
  ShieldCheck,
  Building,
  Calendar
} from 'lucide-react';


const calculateExperience = (establishmentYearString) => {
  if (!establishmentYearString) return 'N/A';
  
  const estDate = new Date(establishmentYearString);
  const now = new Date();

  if (isNaN(estDate.getTime())) return 'N/A';

  let years = now.getFullYear() - estDate.getFullYear();
  let months = now.getMonth() - estDate.getMonth();

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const yearText = years > 0 ? `${years} ${years === 1 ? 'year' : 'years'}` : '';
  const monthText = months > 0 ? `${months} ${months === 1 ? 'month' : 'months'}` : '';

  if (!yearText && !monthText) return '0 months';
  return [yearText, monthText].filter(Boolean).join(' ');
};

// ==========================================
// MAIN PAYMENTS & SETUP COMPONENT
// ==========================================
export default function PaymentsSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Profile and Form States
  const [profile, setProfile] = useState(null);
  const [consultationFee, setConsultationFee] = useState('');
  const [slotDuration, setSlotDuration] = useState('15'); // default duration
  const [calculatedExperience, setCalculatedExperience] = useState('');

  const slotOptions = [
    { label: '15 mins', value: '15' },
    { label: '30 mins', value: '30' },
    { label: '45 mins', value: '45' },
    { label: '60 mins', value: '60' },
  ];

  const fetchUserData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await paymentsEndpoints.getProfileData();
      const userData = res?.data?.userData;

      if (userData) {
        setProfile(userData);
        
        const orgProfile = userData.organisationProfile || {};
        
        // Populate Consultation Fee from API
        if (orgProfile.consultation_fee !== undefined && orgProfile.consultation_fee !== null) {
          setConsultationFee(orgProfile.consultation_fee.toString());
        }

        // Set Slot Duration from response if present, otherwise keep default
        if (orgProfile.slot_duration) {
          setSlotDuration(orgProfile.slot_duration.toString());
        }

        // Compute experience dynamically using establishment_year
        if (orgProfile.establishment_year) {
          const expString = calculateExperience(orgProfile.establishment_year);
          setCalculatedExperience(expString);
        }
      }
    } catch (err) {
      console.error('Failed to load user payment details:', err);
      setError(err.message || 'Unable to retrieve user details from server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccessMessage('');

    try {
      const payload = {
        consultation_fee: Number(consultationFee),
        slot_duration: Number(slotDuration)
      };

      await paymentsEndpoints.updateProfile(payload);
      setSuccessMessage('Payment settings updated successfully!');
      
      // Auto dismiss success toast
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      console.error('Failed to update payment settings:', err);
      setError(err.message || 'Failed to save updated settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center my-8">
        <RefreshCw className="h-8 w-8 text-blue-600 animate-spin mx-auto mb-3" />
        <p className="text-xs font-semibold text-slate-600">Loading payment configurations...</p>
      </div>
    );
  }

  const org = profile?.organisationProfile || {};

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Payments & Consultation Setup</h1>
          <p className="text-sm text-slate-500 font-normal">
            Configure consultation fees, time slots, and verify payout ledger integrations.
          </p>
        </div>
        <button
          onClick={fetchUserData}
          className="self-start sm:self-auto inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
        >
          <RefreshCw className="h-3.5 w-3.5 text-slate-500" />
          Refresh
        </button>
      </div>

      {/* Alerts */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 text-xs">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-700 text-xs font-medium">
          <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Form Container */}
      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Practice & Pricing Parameters */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
            <CreditCard className="h-5 w-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-800">Consultation & Scheduling Parameters</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Consultation Fee Input */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Consultation Fee
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 font-bold">
                  ₹
                </div>
                <input
                  type="number"
                  min="0"
                  value={consultationFee}
                  onChange={(e) => setConsultationFee(e.target.value)}
                  placeholder="0"
                  className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  required
                />
              </div>
              <p className="text-[11px] text-slate-400">Default base rate per consultation session.</p>
            </div>

            {/* Slot Duration Dropdown */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Slot Duration
              </label>
              <div className="relative">
                <select
                  value={slotDuration}
                  onChange={(e) => setSlotDuration(e.target.value)}
                  className="w-full pl-3 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer"
                >
                  {slotOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                  <Clock className="h-4 w-4" />
                </div>
              </div>
              <p className="text-[11px] text-slate-400">Time window allocated per patient booking.</p>
            </div>

            {/* Calculated Experience */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Experience
              </label>
              <div className="p-2.5 bg-slate-100/70 border border-slate-200 rounded-lg flex items-center gap-2.5">
                <Award className="h-4 w-4 text-amber-500 flex-shrink-0" />
                <span className="text-sm font-bold text-slate-800">
                  {calculatedExperience || 'N/A'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Calculated from establishment year ({org.establishment_year ? new Date(org.establishment_year).getFullYear() : 'N/A'}).
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm disabled:opacity-50 transition-colors"
            >
              {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save Configuration
            </button>
          </div>
        </div>
      </form>

      {/* Linked Account & Payout Details */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Building className="h-5 w-5 text-purple-600" />
            <h2 className="text-base font-bold text-slate-800">Payout Ledger & Razorpay Integration</h2>
          </div>
          <span className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-full border ${
            org.kyc_status === 'verified'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-amber-50 text-amber-700 border-amber-200'
          }`}>
            KYC {org.kyc_status || 'Pending'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Beneficiary Name</p>
            <p className="text-sm font-bold text-slate-800">{org.beneficiary_name || 'N/A'}</p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Bank Account Number</p>
            <p className="text-sm font-bold text-slate-800 font-mono">
              {org.account_number ? `•••• •••• ${org.account_number.slice(-4)}` : 'N/A'}
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">IFSC Code</p>
            <p className="text-sm font-bold text-slate-800 font-mono">{org.ifsc_code || 'N/A'}</p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Razorpay Merchant ID</p>
            <p className="text-sm font-bold text-slate-800 font-mono">{org.rzp_account_id || 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}