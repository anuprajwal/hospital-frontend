import React, { useState } from 'react';
import ProfileManagement from './components/hospital/ProfileManagement';
import StaffManagement from './components/hospital/StaffManagement';
import DoctorDetailPlaceholder from './components/hospital/DoctorDetailPlaceholder';
import AppointmentManagement from './components/hospital/AppointmentManagement';
import { Building2, Users2, CalendarDays, LogOut } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('profile'); // profile | staff | appointments
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  
  // Simulated macro instance ID for fallback parameters
  const [hospitalId, setHospitalId] = useState(42); 

  const handleLogout = () => {
    document.cookie = 'auth_token=; path=/; domain=.docapp.co.in; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    window.location.reload();
  };

  return (
    <div class="min-h-screen flex flex-col bg-slate-50">
      {/* Top Header Sticky Bar */}
      <header class="sticky top-0 z-40 bg-slate-900 text-white shadow-md border-b border-slate-800">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div class="flex items-center gap-2.5">
            <div class="p-2 bg-blue-600 rounded-lg text-white">
              <Building2 class="h-5 w-5" />
            </div>
            <div>
              <span class="font-black text-sm tracking-tight uppercase block">DocApp</span>
              <span class="text-[10px] tracking-widest text-slate-400 font-bold uppercase block -mt-1">Hospital Console</span>
            </div>
          </div>
          
          <nav class="flex h-full items-center">
            <button onClick={() => { setActiveTab('profile'); setSelectedDoctor(null); }} class={`px-4 h-16 flex items-center gap-2 text-xs font-semibold border-b-2 transition-all ${activeTab === 'profile' ? 'border-blue-500 text-white bg-slate-800/50' : 'border-transparent text-slate-400 hover:text-white'}`}>
              <Building2 class="h-4 w-4" /> Company Profile
            </button>
            <button onClick={() => { setActiveTab('staff'); setSelectedDoctor(null); }} class={`px-4 h-16 flex items-center gap-2 text-xs font-semibold border-b-2 transition-all ${activeTab === 'staff' ? 'border-blue-500 text-white bg-slate-800/50' : 'border-transparent text-slate-400 hover:text-white'}`}>
              <Users2 class="h-4 w-4" /> Staff Registry
            </button>
            <button onClick={() => { setActiveTab('appointments'); setSelectedDoctor(null); }} class={`px-4 h-16 flex items-center gap-2 text-xs font-semibold border-b-2 transition-all ${activeTab === 'appointments' ? 'border-blue-500 text-white bg-slate-800/50' : 'border-transparent text-slate-400 hover:text-white'}`}>
              <CalendarDays class="h-4 w-4" /> Shift Logures
            </button>
          </nav>

          <div class="flex items-center">
            <button onClick={handleLogout} class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
              <LogOut class="h-4 w-4" /> Clear Session
            </button>
          </div>
        </div>
      </header>

      {/* Main View Workspace Panels */}
      <main class="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'profile' && <ProfileManagement />}
        
        {activeTab === 'staff' && (
          selectedDoctor ? (
            <DoctorDetailPlaceholder doctor={selectedDoctor} onBack={() => setSelectedDoctor(null)} />
          ) : (
            <StaffManagement hospitalId={hospitalId} onSelectDoctor={setSelectedDoctor} />
          )
        )}
        
        {activeTab === 'appointments' && <AppointmentManagement />}
      </main>
    </div>
  );
}