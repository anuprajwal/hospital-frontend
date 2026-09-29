import React from 'react';
import { CheckCircle, Clock, XCircle, RefreshCw } from 'lucide-react';

export default function KycStatusBanner({ kycStatus, onCheckStatus }) {
  if (kycStatus === 'verified') {
    return (
      <div className="p-6 bg-emerald-50/50 border border-emerald-200 rounded-xl text-center space-y-1">
        <h3 className="text-sm font-bold text-emerald-800">Hospital Account Verified & Active</h3>
        <p className="text-xs text-emerald-600 max-w-md mx-auto">
          Your organization and banking credentials have been verified by Razorpay. Patient payments and settlements will route automatically.
        </p>
      </div>
    );
  }

  if (kycStatus === 'pending') {
    return (
      <div className="p-6 bg-amber-50/50 border border-amber-200 rounded-xl text-center space-y-3">
        <h3 className="text-sm font-bold text-amber-800">Verification Under Review</h3>
        <p className="text-xs text-amber-600 max-w-md mx-auto">
          Razorpay compliance checks are currently being processed. Verification usually takes 24–48 hours.
        </p>
        <button
          type="button"
          onClick={onCheckStatus}
          className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg transition"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Check Status
        </button>
      </div>
    );
  }

  return null;
}