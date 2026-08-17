import React from 'react';
import { Clock } from 'lucide-react';

export default function DoctorScheduleView({ availabilitySchedule }) {
  let schedules = [];
  if (availabilitySchedule) {
    try {
      schedules = typeof availabilitySchedule === 'string'
        ? JSON.parse(availabilitySchedule)
        : availabilitySchedule;
    } catch (e) {
      schedules = [];
    }
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
        <Clock className="h-4 w-4 text-blue-600" /> Weekly Availability Schedule
      </h3>
      {schedules.length === 0 ? (
        <p className="text-xs text-slate-400">No working hours specified.</p>
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
  );
}