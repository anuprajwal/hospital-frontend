import React from 'react';
import { User, ShieldCheck, Mail, Phone, CreditCard } from 'lucide-react';

export default function DoctorInfoGrid({ doctor, profile }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Professional Details */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <User className="h-4 w-4 text-blue-600" /> Professional Details
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-200/60">
              <span className="text-slate-500">Medical License:</span>
              <span className="font-semibold text-slate-800">{profile.license_number || 'N/A'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200/60">
              <span className="text-slate-500">Experience:</span>
              <span className="font-semibold text-slate-800">{profile.experience_years ? `${profile.experience_years} Years` : 'N/A'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200/60">
              <span className="text-slate-500">Consultation Fee:</span>
              <span className="font-semibold text-slate-800">{profile.consultation_fee ? `₹${parseFloat(profile.consultation_fee).toFixed(2)}` : 'N/A'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200/60">
              <span className="text-slate-500">Gender:</span>
              <span className="font-semibold text-slate-800">{profile.gender || 'N/A'}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Appointment Duration:</span>
              <span className="font-semibold text-slate-800">{profile.appointment_time ? `${profile.appointment_time} Mins` : 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Contact Details */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-blue-600" /> Contact & Account Status
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-200/60">
              <span className="text-slate-500 flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> Email:</span>
              <span className="font-semibold text-slate-800">{doctor.email}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200/60">
              <span className="text-slate-500 flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> Phone:</span>
              <span className="font-semibold text-slate-800">{doctor.phone_number || 'N/A'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200/60">
              <span className="text-slate-500">KYC Status:</span>
              <span className={`font-bold capitalize ${profile.kyc_status === 'verified' ? 'text-emerald-600' : 'text-amber-600'}`}>
                {profile.kyc_status || 'Pending'}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Account Status:</span>
              <span className="font-semibold capitalize text-slate-800">{doctor.account_status || 'Active'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bank Info */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <CreditCard className="h-4 w-4 text-blue-600" /> Bank & Payout Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="block text-slate-400">Account Holder:</span>
            <span className="font-semibold text-slate-800">{profile.beneficiary_name || 'N/A'}</span>
          </div>
          <div>
            <span className="block text-slate-400">Account Number:</span>
            <span className="font-semibold text-slate-800">{profile.account_number || 'N/A'}</span>
          </div>
          <div>
            <span className="block text-slate-400">IFSC Code:</span>
            <span className="font-semibold text-slate-800">{profile.ifsc_code || 'N/A'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}