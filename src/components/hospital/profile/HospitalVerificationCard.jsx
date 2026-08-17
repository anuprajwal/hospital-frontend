import React from 'react';
import { Shield } from 'lucide-react';

export default function HospitalVerificationCard({ verification, setVerification, onSendOtp, onVerifyOtp }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-4">
        <Shield className="h-5 w-5 text-blue-600" />
        <h2 className="font-semibold text-slate-800">Verify Email & Phone</h2>
      </div>
      
      <div className="space-y-4">
        {/* Email */}
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-700">Email Address</span>
            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${verification.emailVerified ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
              {verification.emailVerified ? 'Verified' : 'Unverified'}
            </span>
          </div>
          {!verification.emailVerified && (
            <div className="space-y-2 mt-2">
              {verification.emailMsg ? (
                <div className="flex gap-1.5">
                  <input type="text" placeholder="Enter OTP" value={verification.emailOtp} onChange={e => setVerification({...verification, emailOtp: e.target.value})} className="w-full px-2 py-1 text-xs border rounded focus:outline-none" />
                  <button onClick={() => onVerifyOtp('email')} className="bg-blue-600 text-white px-2 py-1 text-xs font-medium rounded hover:bg-blue-700">Verify</button>
                </div>
              ) : (
                <button onClick={() => onSendOtp('email')} className="text-xs text-blue-600 hover:text-blue-700 font-medium">Send Email OTP</button>
              )}
              {verification.emailMsg && <p className="text-[10px] text-slate-500 mt-1">{verification.emailMsg}</p>}
            </div>
          )}
        </div>

        {/* Phone */}
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-700">Phone Number</span>
            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${verification.phoneVerified ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
              {verification.phoneVerified ? 'Verified' : 'Unverified'}
            </span>
          </div>
          {!verification.phoneVerified && (
            <div className="space-y-2 mt-2">
              {verification.phoneMsg ? (
                <div className="flex gap-1.5">
                  <input type="text" placeholder="Enter OTP" value={verification.phoneOtp} onChange={e => setVerification({...verification, phoneOtp: e.target.value})} className="w-full px-2 py-1 text-xs border rounded focus:outline-none" />
                  <button onClick={() => onVerifyOtp('phone')} className="bg-blue-600 text-white px-2 py-1 text-xs font-medium rounded hover:bg-blue-700">Verify</button>
                </div>
              ) : (
                <button onClick={() => onSendOtp('phone')} className="text-xs text-blue-600 hover:text-blue-700 font-medium">Send Phone OTP</button>
              )}
              {verification.phoneMsg && <p className="text-[10px] text-slate-500 mt-1">{verification.phoneMsg}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}