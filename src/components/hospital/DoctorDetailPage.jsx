import React, { useState } from 'react';
import { ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
import { hospitalEndpoints } from '../../services/api';
import DoctorHeader from './doctor-detail/DoctorHeader';
import DoctorActionCard from './doctor-detail/DoctorActionCard';
import DoctorInfoGrid from './doctor-detail/DoctorInfoGrid';
import DoctorScheduleView from './doctor-detail/DoctorScheduleView';

export default function DoctorDetailPage({ doctor, onBack, onStatusUpdated }) {
  if (!doctor) return null;

  const profile = doctor.doctorProfile || {};
  const [request, setRequest] = useState(doctor.organisationRequests?.[0] || null);
  const [loading, setLoading] = useState(false);
  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  const handleAdmissionResponse = async (status) => {
    if (!request?.id) {
      setActionError('No request record found for this doctor.');
      return;
    }

    const confirmMsg = status === 'accepted'
      ? `Are you sure you want to ACCEPT Dr. ${doctor.username}?`
      : `Are you sure you want to REJECT / REMOVE Dr. ${doctor.username}?`;

    if (!window.confirm(confirmMsg)) return;

    setLoading(true);
    setActionError('');
    setActionSuccess('');

    try {
      await hospitalEndpoints.reactToAdmission({
        request_id: String(request.id),
        request_status: status
      });

      setRequest(prev => ({ ...prev, request_status: status }));
      setActionSuccess(`Doctor request status changed to ${status}.`);
      if (onStatusUpdated) onStatusUpdated(doctor.id, status);
    } catch (err) {
      setActionError(err.message || 'Failed to update request status.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 font-semibold bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm transition-all"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Staff Registry
      </button>

      {actionError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" /> {actionError}
        </div>
      )}
      {actionSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-700 flex items-center gap-2">
          <CheckCircle className="h-4 w-4 shrink-0" /> {actionSuccess}
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
        <DoctorHeader doctor={doctor} profile={profile} />
        <DoctorActionCard request={request} onAction={handleAdmissionResponse} loading={loading} />
        <DoctorInfoGrid doctor={doctor} profile={profile} />
        <DoctorScheduleView availabilitySchedule={profile.availability_schedule} />
      </div>
    </div>
  );
}