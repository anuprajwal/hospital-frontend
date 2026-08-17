import React from 'react';
import { Lock } from 'lucide-react';

export default function HospitalPasswordForm({ password, setPassword, onSubmit }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-4">
        <Lock className="h-5 w-5 text-blue-600" />
        <h2 className="font-semibold text-slate-800">Change Password</h2>
      </div>
      <form onSubmit={onSubmit} className="space-y-3">
        <div>
          <label className="block text-[10px] font-medium text-slate-600 mb-0.5">New Password</label>
          <input 
            type="password" 
            placeholder="Enter new password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            className="w-full px-2 py-1.5 border border-slate-200 rounded text-xs focus:outline-none focus:border-blue-500" 
            required 
          />
        </div>
        <button type="submit" className="w-full bg-slate-800 hover:bg-slate-900 text-white text-xs font-medium py-2 rounded transition-colors">
          Update Password
        </button>
      </form>
    </div>
  );
}