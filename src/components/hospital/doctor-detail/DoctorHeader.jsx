import React from 'react';
import { Stethoscope } from 'lucide-react';

export default function DoctorHeader({ doctor, profile }) {
  const formatDate = (isoString) => {
    if (!isoString) return 'N/A';
    return new Date(isoString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
      <div className="flex items-center gap-4">
        <img 
          src={profile.profile_picture || 'https://res.cloudinary.com/dwshjkk42/image/upload/v1751270760/doctor_8997187_mgopyu.png'} 
          alt={doctor.username} 
          className="h-20 w-20 rounded-full object-cover border-2 border-slate-100 shadow-inner bg-slate-50"
        />
        <div>
          <h2 className="text-xl font-bold text-slate-900">{doctor.username}</h2>
          <p className="text-sm font-semibold text-blue-600 flex items-center gap-1 mt-0.5">
            <Stethoscope className="h-4 w-4" /> {profile.specialization || 'General Practitioner'}
          </p>
          <p className="text-xs text-slate-400 font-normal mt-0.5">Registered on {formatDate(doctor.created_at)}</p>
        </div>
      </div>

      <div className="flex flex-col items-start sm:items-end gap-1.5">
        <span className={`text-xs font-bold uppercase px-3 py-1 rounded-full border ${
          profile.verified_status ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
        }`}>
          Verification: {profile.verified_status ? 'Verified' : 'Pending'}
        </span>
        <span className="text-[11px] text-slate-400">Doctor ID: #{doctor.id}</span>
      </div>
    </div>
  );
}