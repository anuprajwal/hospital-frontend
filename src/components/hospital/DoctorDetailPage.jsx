import React from 'react';
import { 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Mail, 
  Phone, 
  Calendar, 
  Stethoscope, 
  Award, 
  IndianRupee, 
  ShieldCheck, 
  User 
} from 'lucide-react';

export default function DoctorDetailPage({ doctor, onBack }) {
  if (!doctor) return null;

  const profile = doctor.doctorProfile || {};
  const request = doctor.organisationRequests?.[0] || {};

  const formatDate = (isoString) => {
    if (!isoString) return 'N/A';
    return new Date(isoString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div class="max-w-4xl mx-auto space-y-6">
      {/* Navigation Header */}
      <button
        onClick={onBack}
        class="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 font-semibold bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm transition-all"
      >
        <ArrowLeft class="h-4 w-4" /> Back to Staff Registry
      </button>

      {/* Main Profile Header Card */}
      <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div class="flex items-center gap-4">
            <div class="h-16 w-16 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-2xl border border-blue-200 shrink-0">
              {profile.full_name?.charAt(0) || doctor.username?.charAt(0) || 'D'}
            </div>
            <div>
              <h2 class="text-xl font-bold text-slate-900">{profile.full_name || doctor.username}</h2>
              <p class="text-sm font-semibold text-blue-600 flex items-center gap-1 mt-0.5">
                <Stethoscope class="h-4 w-4" /> {profile.specialization || 'General Specialty'}
              </p>
              <p class="text-xs text-slate-400 font-normal mt-0.5">Account Username: @{doctor.username}</p>
            </div>
          </div>

          <div class="flex flex-col items-start sm:items-end gap-1.5">
            <span class={`text-xs font-bold uppercase px-3 py-1 rounded-full border ${
              request.request_status === 'accepted' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
              request.request_status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
              'bg-rose-50 text-rose-700 border-rose-200'
            }`}>
              Request Status: {request.request_status || 'N/A'}
            </span>
            <span class="text-[11px] text-slate-400">User Account ID: #{doctor.id}</span>
          </div>
        </div>

        {/* Detailed Sections Grid */}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Section 1: Doctor Profile Details */}
          <div class="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <h3 class="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <User class="h-4 w-4 text-blue-600" /> Professional Credentials
            </h3>
            <div class="space-y-2 text-xs">
              <div class="flex justify-between py-1 border-b border-slate-200/60">
                <span class="text-slate-500">Full Title Name:</span>
                <span class="font-semibold text-slate-800">{profile.full_name || 'N/A'}</span>
              </div>
              <div class="flex justify-between py-1 border-b border-slate-200/60">
                <span class="text-slate-500">Specialization:</span>
                <span class="font-semibold text-slate-800">{profile.specialization || 'N/A'}</span>
              </div>
              <div class="flex justify-between py-1 border-b border-slate-200/60">
                <span class="text-slate-500">Experience:</span>
                <span class="font-semibold text-slate-800">{profile.experience ? `${profile.experience} Years` : 'N/A'}</span>
              </div>
              <div class="flex justify-between py-1 border-b border-slate-200/60">
                <span class="text-slate-500">Consultation Fee:</span>
                <span class="font-semibold text-slate-800">{profile.consultation_fee ? `₹${profile.consultation_fee}` : 'N/A'}</span>
              </div>
              <div class="flex justify-between py-1">
                <span class="text-slate-500">Medical Verification:</span>
                <span className={`font-semibold ${profile.is_verified ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {profile.is_verified ? 'Verified Practitioner' : 'Unverified'}
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Account & Verification Contacts */}
          <div class="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <h3 class="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck class="h-4 w-4 text-blue-600" /> Account Security & Contacts
            </h3>
            <div class="space-y-2 text-xs">
              <div class="flex justify-between py-1 border-b border-slate-200/60">
                <span class="text-slate-500 flex items-center gap-1"><Mail class="h-3.5 w-3.5" /> Email Address:</span>
                <span class="font-semibold text-slate-800">{doctor.email}</span>
              </div>
              <div class="flex justify-between py-1 border-b border-slate-200/60">
                <span class="text-slate-500 flex items-center gap-1"><Phone class="h-3.5 w-3.5" /> Phone Number:</span>
                <span class="font-semibold text-slate-800">{doctor.phone_number || 'N/A'}</span>
              </div>
              <div class="flex justify-between py-1 border-b border-slate-200/60">
                <span class="text-slate-500">Email Verified:</span>
                <span class={`font-semibold ${doctor.is_email_verified ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {doctor.is_email_verified ? 'Yes' : 'No'}
                </span>
              </div>
              <div class="flex justify-between py-1 border-b border-slate-200/60">
                <span class="text-slate-500">Phone Verified:</span>
                <span class={`font-semibold ${doctor.is_phone_verified ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {doctor.is_phone_verified ? 'Yes' : 'No'}
                </span>
              </div>
              <div class="flex justify-between py-1">
                <span class="text-slate-500">Account System Status:</span>
                <span class="font-semibold capitalize text-slate-800">{doctor.account_status || 'Active'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Organisation Request Record */}
        <div class="bg-white border border-slate-200 rounded-xl p-4 space-y-2 text-xs">
          <h3 class="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 mb-2">
            <Calendar class="h-4 w-4 text-blue-600" /> Organisation Request Metadata
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-slate-600">
            <div>
              <span class="block text-slate-400">Request Record ID:</span>
              <span class="font-semibold text-slate-800">#{request.id || 'N/A'}</span>
            </div>
            <div>
              <span class="block text-slate-400">Organisation ID:</span>
              <span class="font-semibold text-slate-800">#{request.org_id || 'N/A'}</span>
            </div>
            <div>
              <span class="block text-slate-400">Request Initiated At:</span>
              <span class="font-semibold text-slate-800">{formatDate(request.created_at)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}