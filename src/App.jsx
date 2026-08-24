// src/App.jsx

import React, { useState, useEffect } from 'react';
import ProfileManagement from './components/hospital/ProfileManagement';
import StaffManagement from './components/hospital/StaffManagement';
import DoctorDetailPage from './components/hospital/DoctorDetailPage';
import AppointmentManagement from './components/hospital/AppointmentManagement';
import HospitalKycAndBankingPage from './components/hospital/HospitalKycAndBankingPage';
import { Building2, Users2, CalendarDays, ShieldCheck, LogOut } from 'lucide-react';

export default function App() {
  // 1. Read initial view and selection parameters from URL query string
  const getUrlState = () => {
    const params = new URLSearchParams(window.location.search);
    return {
      activeTab: params.get('tab') || 'staff',
      selectedDoctor: params.get('doctorId') ? { id: params.get('doctorId') } : null,
    };
  };

  const initialUrlState = getUrlState();
  const [activeTab, setActiveTab] = useState(initialUrlState.activeTab);
  const [selectedDoctor, setSelectedDoctor] = useState(initialUrlState.selectedDoctor);

  // 2. Synchronize navigation state changes directly to the URL query string
  const navigateTo = (newTab, data = {}) => {
    const params = new URLSearchParams();
    params.set('tab', newTab);

    if (data.doctor) {
      params.set('doctorId', data.doctor.id || data.doctor);
      setSelectedDoctor(data.doctor);
    } else {
      setSelectedDoctor(null);
    }

    setActiveTab(newTab);
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState({}, '', newUrl);
  };

  // 3. Listen for browser Back/Forward navigation actions
  useEffect(() => {
    const handlePopState = () => {
      const state = getUrlState();
      setActiveTab(state.activeTab);
      setSelectedDoctor(state.selectedDoctor);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleLogout = () => {
    document.cookie = 'auth_token=; path=/; domain=.docapp.co.in; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    window.location.href = 'https://auth.docapp.co.in';
  };

  const navItems = [
    { id: 'profile', label: 'Hospital Profile', icon: Building2 },
    { id: 'staff', label: 'Staff Registry', icon: Users2 },
    { id: 'appointments', label: 'Appointments', icon: CalendarDays },
    { id: 'kyc', label: 'KYC & Banking', icon: ShieldCheck },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-slate-900 text-white shadow-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div 
            className="flex items-center gap-2.5 cursor-pointer"
            onClick={() => navigateTo('staff')}
          >
            <div className="p-2 bg-blue-600 rounded-lg text-white">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <span className="font-black text-sm tracking-tight uppercase block">DocApp</span>
              <span className="text-[10px] tracking-widest text-slate-400 font-bold uppercase block -mt-1">
                Hospital Console
              </span>
            </div>
          </div>
          
          <nav className="flex h-full items-center">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button 
                  key={item.id}
                  onClick={() => navigateTo(item.id)} 
                  className={`px-4 h-16 flex items-center gap-2 text-xs font-semibold border-b-2 transition-all ${
                    isActive 
                      ? 'border-blue-500 text-white bg-slate-800/50' 
                      : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4" /> {item.label}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center">
            <button 
              onClick={handleLogout} 
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-rose-400 hover:text-white hover:bg-rose-600/20 border border-rose-500/20 transition-all"
            >
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'profile' && <ProfileManagement />}
        
        {activeTab === 'staff' && (
          selectedDoctor ? (
            <DoctorDetailPage 
              doctor={selectedDoctor} 
              onBack={() => navigateTo('staff')}
              onStatusUpdated={() => navigateTo('staff')}
            />
          ) : (
            <StaffManagement onSelectDoctor={(doc) => navigateTo('staff', { doctor: doc })} />
          )
        )}
        
        {activeTab === 'appointments' && <AppointmentManagement />}

        {activeTab === 'kyc' && <HospitalKycAndBankingPage />}
      </main>
    </div>
  );
}