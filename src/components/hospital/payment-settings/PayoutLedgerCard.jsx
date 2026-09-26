import React from 'react';
import { Building } from 'lucide-react';

export default function PayoutLedgerCard({ org }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Building className="h-5 w-5 text-purple-600" />
          <h2 className="text-base font-bold text-slate-800">Payout Ledger & Verification Details</h2>
        </div>
        <span className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-full border ${
          org.kyc_status === 'verified'
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
            : 'bg-amber-50 text-amber-700 border-amber-200'
        }`}>
          KYC {org.kyc_status || 'Pending'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Beneficiary Name</p>
          <p className="font-bold text-slate-800">{org.beneficiary_name || 'N/A'}</p>
        </div>

        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Bank Account Number</p>
          <p className="font-bold text-slate-800 font-mono">
            {org.account_number ? `•••• •••• ${org.account_number.slice(-4)}` : 'N/A'}
          </p>
        </div>

        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">IFSC Code</p>
          <p className="font-bold text-slate-800 font-mono">{org.ifsc_code || 'N/A'}</p>
        </div>

        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Razorpay Account ID</p>
          <p className="font-bold text-slate-800 font-mono">{org.rzp_account_id || 'N/A'}</p>
        </div>
      </div>
    </div>
  );
}