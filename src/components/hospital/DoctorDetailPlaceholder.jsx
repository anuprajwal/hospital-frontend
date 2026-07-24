import React from 'react';
import { ChevronLeft, Construction, Calendar, Award, FileText } from 'lucide-react';

export default function DoctorDetailPlaceholder({ doctor, onBack }) {
  return (
    <div class="space-y-6">
      <button onClick={onBack} class="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 font-medium">
        <ChevronLeft class="h-4 w-4" /> Return to Staff Workspace
      </button>

      <div class="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div class="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100">
          <img src={doctor.profile_picture || 'https://res.cloudinary.com/dwshjkk42/image/upload/v1751270760/doctor_8997187_mgopyu.png'} alt={doctor.user?.username} class="h-24 w-24 rounded-full object-cover border-2 border-slate-100 shadow-inner" />
          <div class="text-center sm:text-left space-y-1">
            <h2 class="text-xl font-bold text-slate-900">{doctor.user?.username}</h2>
            <p class="text-sm text-blue-600 font-semibold">{doctor.specialization || 'Clinical Specialist'}</p>
            <p class="text-xs text-slate-400 font-normal">System Node Core ID: {doctor.id} | Authentication Link Reference: {doctor.user_id}</p>
          </div>
        </div>

        {/* Phase Notification banner */}
        <div class="my-8 p-6 bg-amber-50 rounded-xl border border-amber-200 flex flex-col items-center text-center max-w-xl mx-auto space-y-3">
          <Construction class="h-10 w-10 text-amber-600 animate-pulse" />
          <h3 class="text-sm font-bold text-amber-800 uppercase tracking-wider">Module Deployment Sub-stage Upcoming</h3>
          <p class="text-xs text-amber-700 max-w-sm font-normal">The deeper analysis engine layer mapping dynamic operations metrics, clinical logs, and availability histories is currently undergoing optimization synchronization. Full pipeline initialization will resume shortly.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div class="p-4 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-3">
            <Calendar class="h-5 w-5 text-slate-400 shrink-0" />
            <div>
              <div class="font-bold text-slate-700 mb-0.5">Availability Shifts Matrix</div>
              <div class="text-slate-500 font-normal">Pruned schedule tracks, consultation modes, and allocation blocks inside runtime review pipelines.</div>
            </div>
          </div>
          <div class="p-4 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-3">
            <Award class="h-5 w-5 text-slate-400 shrink-0" />
            <div>
              <div class="font-bold text-slate-700 mb-0.5">Academic Qualifications</div>
              <div class="text-slate-500 font-normal">Verification checks on degrees, specialty declarations, and registration files.</div>
            </div>
          </div>
          <div class="p-4 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-3">
            <FileText class="h-5 w-5 text-slate-400 shrink-0" />
            <div>
              <div class="font-bold text-slate-700 mb-0.5">Case History Logs</div>
              <div class="text-slate-500 font-normal">Statistical monitoring grids analyzing appointment execution velocity metrics.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}