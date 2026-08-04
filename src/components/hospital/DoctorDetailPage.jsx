import React from 'react';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  Calendar, 
  Stethoscope, 
  ShieldCheck, 
  User,
  CreditCard,
  Clock,
  FileText
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
      year: 'numeric'
    });
  };

  // Safely parse availability_schedule JSON string from DB
  let schedules = [];
  if (profile.availability_schedule) {
    try {
      schedules = typeof profile.availability_schedule === 'string'
        ? JSON.parse(profile.availability_schedule)
        : profile.availability_schedule;
    } catch (e) {
      schedules = [];
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 font-semibold bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm transition-all"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Staff Registry
      </button>

      {/* Main Doctor Profile Header Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
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
                <Stethoscope className="h-4 w-4" /> {profile.specialization || 'General Specialty'}
              </p>
              <p className="text-xs text-slate-400 font-normal mt-0.5">Registered since {formatDate(doctor.created_at)}</p>
            </div>
          </div>

          <div className="flex flex-col items-start sm:items-end gap-1.5">
            <span className={`text-xs font-bold uppercase px-3 py-1 rounded-full border ${
              profile.verified_status ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}>
              Verification: {profile.verified_status ? 'Verified' : 'Pending'}
            </span>
            <span className="text-[11px] text-slate-400">User ID: #{doctor.id} | Profile ID: #{profile.id || 'N/A'}</span>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Professional Credentials */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <User className="h-4 w-4 text-blue-600" /> Professional & Clinical Specs
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">License Number:</span>
                <span className="font-semibold text-slate-800">{profile.license_number || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Years of Experience:</span>
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
                <span className="text-slate-500">Appointment Slot Length:</span>
                <span className="font-semibold text-slate-800">{profile.appointment_time ? `${profile.appointment_time} Mins` : 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Account Security & KYC */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-blue-600" /> Account & KYC Metrics
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
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Email Verified:</span>
                <span className={`font-semibold ${doctor.is_email_verified ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {doctor.is_email_verified ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Account Status:</span>
                <span className="font-semibold capitalize text-slate-800">{doctor.account_status || 'Active'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Banking Details */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <CreditCard className="h-4 w-4 text-blue-600" /> Banking & Payout Parameters
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="block text-slate-400">Beneficiary Title:</span>
              <span className="font-semibold text-slate-800">{profile.beneficiary_name || 'N/A'}</span>
            </div>
            <div>
              <span className="block text-slate-400">Account Number:</span>
              <span className="font-semibold text-slate-800">{profile.account_number || 'N/A'}</span>
            </div>
            <div>
              <span className="block text-slate-400">IFSC Routing Code:</span>
              <span className="font-semibold text-slate-800">{profile.ifsc_code || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Weekly Availability Schedule Table */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-blue-600" /> Weekly Operational Availability
          </h3>
          {schedules.length === 0 ? (
            <p className="text-xs text-slate-400">No schedule parameters published yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {schedules.map((s, idx) => {
                const isActive = s.loginTime && s.logoutTime;
                return (
                  <div key={idx} className={`p-2.5 rounded-lg border text-xs ${isActive ? 'bg-slate-50 border-slate-200' : 'bg-slate-50/50 border-slate-100 opacity-60'}`}>
                    <div className="flex justify-between font-bold text-slate-800 capitalize mb-1">
                      <span>{s.day}</span>
                      {isActive && <span className="text-[10px] uppercase font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">{s.mode || 'Active'}</span>}
                    </div>
                    {isActive ? (
                      <div className="text-[11px] text-slate-600 space-y-0.5">
                        <div>Hours: {s.loginTime} - {s.logoutTime}</div>
                        {s.breaks && s.breaks.length > 0 && (
                          <div className="text-[10px] text-slate-400">Breaks: {s.breaks.join(', ')}</div>
                        )}
                      </div>
                    ) : (
                      <div className="text-[11px] text-slate-400 italic">Off Day</div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}