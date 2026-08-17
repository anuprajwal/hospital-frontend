import React from 'react';
import { Building, Check } from 'lucide-react';

export default function HospitalInfoForm({ profileForm, setProfileForm, onSubmit }) {
  const serviceOptions = ["physiotherapy", "psycology", "cardiology", "pediatrition", "neurology", "orthopedics"];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
        <Building className="h-5 w-5 text-blue-600" />
        <h2 className="font-semibold text-slate-800">Hospital Information</h2>
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Organization Type</label>
            <select 
              value={profileForm.org_type} 
              onChange={e => setProfileForm({...profileForm, org_type: e.target.value})} 
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="hospital">Hospital</option>
              <option value="clinic">Clinic</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Hospital / Clinic Name</label>
            <input 
              type="text" 
              value={profileForm.org_name} 
              onChange={e => setProfileForm({...profileForm, org_name: e.target.value})} 
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" 
              required 
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Registration / License Number</label>
            <input 
              type="text" 
              value={profileForm.org_license} 
              onChange={e => setProfileForm({...profileForm, org_license: e.target.value})} 
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" 
              required 
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Year Established</label>
            <input 
              type="number" 
              value={profileForm.org_establishment} 
              onChange={e => setProfileForm({...profileForm, org_establishment: e.target.value})} 
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" 
              required 
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Website URL</label>
            <input 
              type="text" 
              placeholder="https://example.com"
              value={profileForm.org_url} 
              onChange={e => setProfileForm({...profileForm, org_url: e.target.value})} 
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" 
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Ambulance Service</label>
            <select 
              value={profileForm.org_ambulance} 
              onChange={e => setProfileForm({...profileForm, org_ambulance: e.target.value})} 
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="true">Available</option>
              <option value="false">Not Available</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-2">Specializations & Services Offered</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {serviceOptions.map(srv => {
              const isChecked = profileForm.org_services.includes(srv);
              return (
                <label key={srv} className={`flex items-center gap-2 p-2 border rounded-lg text-xs cursor-pointer select-none ${isChecked ? 'bg-blue-50 border-blue-200 text-blue-700 font-medium' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                  <input 
                    type="checkbox" 
                    checked={isChecked} 
                    onChange={() => {
                      const nextArr = isChecked 
                        ? profileForm.org_services.filter(x => x !== srv) 
                        : [...profileForm.org_services, srv];
                      setProfileForm({ ...profileForm, org_services: nextArr });
                    }} 
                    className="hidden" 
                  />
                  {isChecked && <Check className="h-3.5 w-3.5 shrink-0" />}
                  {srv.charAt(0).toUpperCase() + srv.slice(1)}
                </label>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs px-4 py-2 rounded-lg transition-colors">
            Save Hospital Details
          </button>
        </div>
      </form>
    </div>
  );
}