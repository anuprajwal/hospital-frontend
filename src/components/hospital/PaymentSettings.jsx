import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Clock, 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Save, 
  ShieldCheck,
  Building,
  Search,
  Filter,
  Stethoscope,
  User,
  X,
  Sliders,
  Check
} from 'lucide-react';
import { hospitalEndpoints as paymentsEndpoints } from '../../services/api';
/**
 * Calculates experience duration dynamically from an establishment date string.
 * Output Format: "X years Y months"
 */
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

const COMMON_SPECIALIZATIONS = [
  "General Medicine",
  "Cardiology",
  "Neurology",
  "Physiotherapy",
  "Pediatrics",
  "Dermatology",
  "Orthopedics",
  "Gynecology",
  "ENT",
  "Ophthalmology",
  "Psychiatry"
];

// ==========================================
// MAIN PAYMENTS & SLOT CONFIGURATION COMPONENT
// ==========================================
export default function PaymentsSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Hospital Profile Meta
  const [profile, setProfile] = useState(null);
  const [calculatedExperience, setCalculatedExperience] = useState('');

  // Doctor List for Direct Doctor Selection
  const [doctorsList, setDoctorsList] = useState([]);
  const [doctorSearchQuery, setDoctorSearchQuery] = useState('');

  // Config Core Inputs
  const [slotFee, setSlotFee] = useState('200');
  const [slotTime, setSlotTime] = useState('15');

  // Filter Mode Strategy: 'all' | 'specialization' | 'doctors'
  const [targetScope, setTargetScope] = useState('all');

  // Selected Filter States
  const [selectedSpecs, setSelectedSpecs] = useState([]);
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [selectedNames, setSelectedNames] = useState([]);

  const slotOptions = [
    { label: '15 mins', value: '15' },
    { label: '20 mins', value: '20' },
    { label: '30 mins', value: '30' },
    { label: '45 mins', value: '45' },
    { label: '60 mins', value: '60' },
  ];

  const fetchInitialData = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch User Profile Data
      const profileRes = await paymentsEndpoints.getProfile();
      const userData = profileRes?.data?.userData;

      if (userData) {
        setProfile(userData);
        const orgProfile = userData.organisationProfile || {};

        if (orgProfile.consultation_fee !== undefined && orgProfile.consultation_fee !== null) {
          setSlotFee(orgProfile.consultation_fee.toString());
        }

        if (orgProfile.establishment_year) {
          const expString = calculateExperience(orgProfile.establishment_year);
          setCalculatedExperience(expString);
        }
      }

      // 2. Fetch Doctors List for Direct Doctor Selection
      const doctorsRes = await paymentsEndpoints.getDoctors();
      const docs = doctorsRes?.data?.doctors || doctorsRes?.data?.data || doctorsRes?.data || [];
      if (Array.isArray(docs)) {
        setDoctorsList(docs);
      }
    } catch (err) {
      console.error('Failed to load initial data:', err);
      setError(err.message || 'Unable to retrieve workspace data from server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  // Filter Handlers for Specializations
  const toggleSpecialization = (spec) => {
    setSelectedSpecs((prev) =>
      prev.includes(spec) ? prev.filter((s) => s !== spec) : [...prev, spec]
    );
  };

  // Filter Handlers for Doctor Items
  const toggleDoctorSelection = (doc) => {
    const email = doc.email;
    const name = doc.username || `${doc.first_name || ''} ${doc.last_name || ''}`.trim();

    if (email) {
      if (selectedEmails.includes(email)) {
        setSelectedEmails((prev) => prev.filter((e) => e !== email));
      } else {
        setSelectedEmails((prev) => [...prev, email]);
      }
    }

    if (name) {
      if (selectedNames.includes(name)) {
        setSelectedNames((prev) => prev.filter((n) => n !== name));
      } else {
        setSelectedNames((prev) => [...prev, name]);
      }
    }
  };

  // Filtered Doctors for direct search input
  const filteredDoctors = doctorsList.filter((doc) => {
    const q = doctorSearchQuery.toLowerCase();
    const username = (doc.username || '').toLowerCase();
    const email = (doc.email || '').toLowerCase();
    const spec = (doc.doctorProfile?.specialization || '').toLowerCase();
    return username.includes(q) || email.includes(q) || spec.includes(q);
  });

  // Construct Payload & Dispatch API Call
  const handleSaveConfig = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccessMessage('');

    let filtersObj = {};

    if (targetScope === 'specialization') {
      if (selectedSpecs.length === 0) {
        setError('Please select at least one specialization for this filter rule.');
        setSaving(false);
        return;
      }
      filtersObj.specializations = selectedSpecs;
    } else if (targetScope === 'doctors') {
      if (selectedEmails.length === 0 && selectedNames.length === 0) {
        setError('Please search and select at least one doctor.');
        setSaving(false);
        return;
      }
      if (selectedEmails.length > 0) filtersObj.emails = selectedEmails;
      if (selectedNames.length > 0) filtersObj.names = selectedNames;
    }

    const payload = {
      slot_fee: Number(slotFee),
      slot_time: String(slotTime),
      filters: filtersObj
    };

    try {
      await paymentsEndpoints.setDoctorsSlotConfig(payload);
      setSuccessMessage('Doctor slot configuration and fees updated successfully!');
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      console.error('Failed to update slot config:', err);
      setError(err.message || 'Failed to update doctor slot configuration.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center my-8">
        <RefreshCw className="h-8 w-8 text-blue-600 animate-spin mx-auto mb-3" />
        <p className="text-xs font-semibold text-slate-600">Loading payment configurations & doctor registry...</p>
      </div>
    );
  }

  const org = profile?.organisationProfile || {};

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Payments & Slot Configuration</h1>
          <p className="text-sm text-slate-500 font-normal">
            Configure custom consultation fees and slot durations globally, by specialization, or for specific doctors.
          </p>
        </div>
        <button
          onClick={fetchInitialData}
          className="self-start sm:self-auto inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
        >
          <RefreshCw className="h-3.5 w-3.5 text-slate-500" />
          Refresh Registry
        </button>
      </div>

      {/* Notifications */}
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

      <form onSubmit={handleSaveConfig} className="space-y-6">
        {/* Step 1: Select Target Scope / Filter Strategy */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Filter className="h-5 w-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-800">1. Select Target Doctors Filter</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => {
                setTargetScope('all');
                setSelectedSpecs([]);
                setSelectedEmails([]);
                setSelectedNames([]);
              }}
              className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all ${
                targetScope === 'all'
                  ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Global</span>
                {targetScope === 'all' && <Check className="h-4 w-4 text-blue-600" />}
              </div>
              <p className="text-sm font-bold text-slate-800 mt-2">All Doctors</p>
              <p className="text-[11px] text-slate-400 mt-1">Apply fee & slot duration across the entire hospital network.</p>
            </button>

            <button
              type="button"
              onClick={() => {
                setTargetScope('specialization');
                setSelectedEmails([]);
                setSelectedNames([]);
              }}
              className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all ${
                targetScope === 'specialization'
                  ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Department</span>
                {targetScope === 'specialization' && <Check className="h-4 w-4 text-blue-600" />}
              </div>
              <p className="text-sm font-bold text-slate-800 mt-2">By Specialization</p>
              <p className="text-[11px] text-slate-400 mt-1">Target specific departments like Neurology or Cardiology.</p>
            </button>

            <button
              type="button"
              onClick={() => {
                setTargetScope('doctors');
                setSelectedSpecs([]);
              }}
              className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all ${
                targetScope === 'doctors'
                  ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Individual</span>
                {targetScope === 'doctors' && <Check className="h-4 w-4 text-blue-600" />}
              </div>
              <p className="text-sm font-bold text-slate-800 mt-2">Search Doctor Name / Email</p>
              <p className="text-[11px] text-slate-400 mt-1">Set customized pricing for selected doctors specifically.</p>
            </button>
          </div>

          {/* Conditional Scope Filters */}
          {targetScope === 'specialization' && (
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Select Specializations
              </label>
              <div className="flex flex-wrap gap-2">
                {COMMON_SPECIALIZATIONS.map((spec) => {
                  const isSelected = selectedSpecs.includes(spec);
                  return (
                    <button
                      key={spec}
                      type="button"
                      onClick={() => toggleSpecialization(spec)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <Stethoscope className="h-3.5 w-3.5" />
                      {spec}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {targetScope === 'doctors' && (
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Search & Select Doctors
              </label>

              {/* Search Box */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={doctorSearchQuery}
                  onChange={(e) => setDoctorSearchQuery(e.target.value)}
                  placeholder="Search doctor by name, email, or specialization..."
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>

              {/* Selected Doctor Pills */}
              {(selectedEmails.length > 0 || selectedNames.length > 0) && (
                <div className="flex flex-wrap gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200">
                  {selectedEmails.map((email) => (
                    <span
                      key={email}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-200 rounded-md text-xs font-semibold text-slate-700 shadow-xs"
                    >
                      <User className="h-3 w-3 text-blue-500" />
                      {email}
                      <button
                        type="button"
                        onClick={() => setSelectedEmails((prev) => prev.filter((e) => e !== email))}
                        className="text-slate-400 hover:text-slate-600 ml-1"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Doctor Directory Pick List */}
              <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-lg divide-y divide-slate-100 bg-white">
                {filteredDoctors.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-400">
                    No matching doctors found in registry.
                  </div>
                ) : (
                  filteredDoctors.map((doc) => {
                    const email = doc.email;
                    const name = doc.username || `${doc.first_name || ''} ${doc.last_name || ''}`.trim();
                    const isSelected = selectedEmails.includes(email) || selectedNames.includes(name);

                    return (
                      <div
                        key={doc.id || email}
                        onClick={() => toggleDoctorSelection(doc)}
                        className={`p-3 flex items-center justify-between cursor-pointer text-xs transition-colors ${
                          isSelected ? 'bg-blue-50/70' : 'hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                            {name ? name.charAt(0).toUpperCase() : 'D'}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800">{name || 'Doctor'}</p>
                            <p className="text-[11px] text-slate-400">{email || 'No email'}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">
                            {doc.doctorProfile?.specialization || 'General'}
                          </span>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}} // handled by row click
                            className="h-4 w-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* Step 2: Configure Fee & Time Slot Inputs */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
            <Sliders className="h-5 w-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-800">2. Configure Fee & Slot Parameters</h2>
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
                  value={slotFee}
                  onChange={(e) => setSlotFee(e.target.value)}
                  placeholder="0"
                  className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  required
                />
              </div>
              <p className="text-[11px] text-slate-400">Consultation fee in INR for target selection.</p>
            </div>

            {/* Slot Duration Select */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Slot Duration
              </label>
              <div className="relative">
                <select
                  value={slotTime}
                  onChange={(e) => setSlotTime(e.target.value)}
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

            {/* Calculated Experience Display */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Hospital Experience
              </label>
              <div className="p-2.5 bg-slate-100/70 border border-slate-200 rounded-lg flex items-center gap-2.5">
                <Award className="h-4 w-4 text-amber-500 flex-shrink-0" />
                <span className="text-sm font-bold text-slate-800">
                  {calculatedExperience || 'N/A'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Auto-calculated from establishment year ({org.establishment_year ? new Date(org.establishment_year).getFullYear() : 'N/A'}).
              </p>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm disabled:opacity-50 transition-colors"
            >
              {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Apply & Save Configuration
            </button>
          </div>
        </div>
      </form>

      {/* Payout & Razorpay Ledger Summary */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Building className="h-5 w-5 text-purple-600" />
            <h2 className="text-base font-bold text-slate-800">Payout Ledger & Verification Details</h2>
          </div>
          <span className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-full border ${
            org.kyc_status === 'verified'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-amber-50 text-amber-700 border-amber-200'
          }`}>
            KYC {org.kyc_status || 'Pending'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Beneficiary Name</p>
            <p className="font-bold text-slate-800">{org.beneficiary_name || 'N/A'}</p>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Bank Account Number</p>
            <p className="font-bold text-slate-800 font-mono">
              {org.account_number ? `•••• •••• ${org.account_number.slice(-4)}` : 'N/A'}
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">IFSC Code</p>
            <p className="font-bold text-slate-800 font-mono">{org.ifsc_code || 'N/A'}</p>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Razorpay Account ID</p>
            <p className="font-bold text-slate-800 font-mono">{org.rzp_account_id || 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}