import React, { useState, useEffect } from 'react';
import { RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { hospitalEndpoints as paymentsEndpoints } from '../../services/api';

import ScopeSelector from './ScopeSelector';
import SpecializationFilter from './SpecializationFilter';
import DoctorSearchFilter from './DoctorSearchFilter';
import FeeSlotConfigForm from './FeeSlotConfigForm';
import PayoutLedgerCard from './PayoutLedgerCard';
import ExistingSlotConfigsList from './ExistingSlotConfigsList';

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

export default function PaymentsSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Hospital Profile Meta
  const [profile, setProfile] = useState(null);
  const [calculatedExperience, setCalculatedExperience] = useState('');

  // Doctor List for Direct Selection
  const [doctorsList, setDoctorsList] = useState([]);
  const [doctorSearchQuery, setDoctorSearchQuery] = useState('');

  // Config Core Inputs
  const [slotFee, setSlotFee] = useState('200');
  const [slotTime, setSlotTime] = useState('15');

  // Active Raw Slot Config Response State
  const [slotConfigResponse, setSlotConfigResponse] = useState(null);

  // Filter Mode Strategy: 'all' | 'specialization' | 'doctors'
  const [targetScope, setTargetScope] = useState('all');

  // Selected Filter States
  const [selectedSpecs, setSelectedSpecs] = useState([]);
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [selectedNames, setSelectedNames] = useState([]);

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

      // 2. Fetch Doctors List
      const doctorsRes = await paymentsEndpoints.getDoctors();
      const docs = doctorsRes?.data?.doctors || doctorsRes?.data?.data || doctorsRes?.data || [];
      if (Array.isArray(docs)) {
        setDoctorsList(docs);
      }

      // 3. Fetch Doctor Slot Config & Apply CASE 1 Defaults
      if (typeof paymentsEndpoints.getDoctorSlotConfig === 'function') {
        const slotConfigRes = await paymentsEndpoints.getDoctorSlotConfig();
        setSlotConfigResponse(slotConfigRes);

        const overall = slotConfigRes?.data?.overall;
        if (overall) {
          let parsedOverall = typeof overall === 'string' ? JSON.parse(overall) : overall;
          if (Array.isArray(parsedOverall) && parsedOverall.length > 0) {
            parsedOverall = parsedOverall[0];
          }
          if (parsedOverall?.slot_fee !== undefined) setSlotFee(String(parsedOverall.slot_fee));
          if (parsedOverall?.slot_time !== undefined) setSlotTime(String(parsedOverall.slot_time));
        }
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

  const toggleSpecialization = (spec) => {
    setSelectedSpecs((prev) =>
      prev.includes(spec) ? prev.filter((s) => s !== spec) : [...prev, spec]
    );
  };

  const toggleDoctorSelection = (doc) => {
    const email = doc.email;
    const name = doc.username || `${doc.first_name || ''} ${doc.last_name || ''}`.trim();

    if (email) {
      setSelectedEmails((prev) =>
        prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email]
      );
    }

    if (name) {
      setSelectedNames((prev) =>
        prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
      );
    }
  };

  const filteredDoctors = doctorsList.filter((doc) => {
    const q = doctorSearchQuery.toLowerCase();
    const username = (doc.username || '').toLowerCase();
    const email = (doc.email || '').toLowerCase();
    const spec = (doc.doctorProfile?.specialization || '').toLowerCase();
    return username.includes(q) || email.includes(q) || spec.includes(q);
  });

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
      fetchInitialData();
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

      <ExistingSlotConfigsList configResponse={slotConfigResponse} />

      <form onSubmit={handleSaveConfig} className="space-y-6">
        <ScopeSelector
          targetScope={targetScope}
          setTargetScope={setTargetScope}
          setSelectedSpecs={setSelectedSpecs}
          setSelectedEmails={setSelectedEmails}
          setSelectedNames={setSelectedNames}
        />

        {targetScope === 'specialization' && (
          <SpecializationFilter
            selectedSpecs={selectedSpecs}
            toggleSpecialization={toggleSpecialization}
          />
        )}

        {targetScope === 'doctors' && (
          <DoctorSearchFilter
            doctorSearchQuery={doctorSearchQuery}
            setDoctorSearchQuery={setDoctorSearchQuery}
            selectedEmails={selectedEmails}
            setSelectedEmails={setSelectedEmails}
            filteredDoctors={filteredDoctors}
            toggleDoctorSelection={toggleDoctorSelection}
          />
        )}

        <FeeSlotConfigForm
          slotFee={slotFee}
          setSlotFee={setSlotFee}
          slotTime={slotTime}
          setSlotTime={setSlotTime}
          calculatedExperience={calculatedExperience}
          establishmentYear={org.establishment_year}
          saving={saving}
        />
      </form>

      <PayoutLedgerCard org={org} />
    </div>
  );
}