import React from 'react';
import { CalendarRange, Activity, ShieldCheck, Clipboard } from 'lucide-react';

export default function AppointmentManagement() {
  return (
    <div class="space-y-6">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">Appointment Management Workspace</h1>
        <p class="text-sm text-slate-500 font-normal">Track institutional scheduling volumes, consult distributions, and real-time processing queues.</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div><p class="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Consultations Today</p><p class="text-2xl font-extrabold text-slate-800 mt-1">0</p></div>
          <div class="p-2 bg-blue-50 rounded-lg"><CalendarRange class="h-5 w-5 text-blue-600" /></div>
        </div>
        <div class="p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div><p class="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Active Tele-Consults</p><p class="text-2xl font-extrabold text-slate-800 mt-1">0</p></div>
          <div class="p-2 bg-green-50 rounded-lg"><Activity class="h-5 w-5 text-green-600" /></div>
        </div>
        <div class="p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div><p class="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Physical Checkups</p><p class="text-2xl font-extrabold text-slate-800 mt-1">0</p></div>
          <div class="p-2 bg-purple-50 rounded-lg"><ShieldCheck class="h-5 w-5 text-purple-600" /></div>
        </div>
        <div class="p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div><p class="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Pending Approvals</p><p class="text-2xl font-extrabold text-slate-800 mt-1">0</p></div>
          <div class="p-2 bg-amber-50 rounded-lg"><Clipboard class="h-5 w-5 text-amber-600" /></div>
        </div>
      </div>

      <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center">
        <CalendarRange class="h-12 w-12 text-slate-300 mx-auto mb-3" />
        <h3 class="text-sm font-bold text-slate-700 mb-1">Queue Synchronizer Online</h3>
        <p class="text-xs text-slate-400 max-w-sm mx-auto font-normal">Real-time patient check-in records and automated allocation logs will populate here as workflows register via the patient gateway.</p>
      </div>
    </div>
  );
}