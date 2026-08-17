import React from 'react';
import { CreditCard } from 'lucide-react';

export default function HospitalBankForm({ bank, setBank, onSubmit }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-4">
        <CreditCard className="h-5 w-5 text-blue-600" />
        <h2 className="font-semibold text-slate-800">Bank Account Details</h2>
      </div>
      <form onSubmit={onSubmit} className="space-y-3">
        <div>
          <label className="block text-[10px] font-medium text-slate-600 mb-0.5">Beneficiary / Account Name</label>
          <input type="text" value={bank.beneficiary_name} onChange={e => setBank({...bank, beneficiary_name: e.target.value})} className="w-full px-2 py-1.5 border border-slate-200 rounded text-xs focus:outline-none focus:border-blue-500" required />
        </div>
        <div>
          <label className="block text-[10px] font-medium text-slate-600 mb-0.5">Account Number</label>
          <input type="text" value={bank.account_number} onChange={e => setBank({...bank, account_number: e.target.value})} className="w-full px-2 py-1.5 border border-slate-200 rounded text-xs focus:outline-none focus:border-blue-500" required />
        </div>
        <div>
          <label className="block text-[10px] font-medium text-slate-600 mb-0.5">IFSC Code</label>
          <input type="text" value={bank.ifsc_code} onChange={e => setBank({...bank, ifsc_code: e.target.value})} className="w-full px-2 py-1.5 border border-slate-200 rounded text-xs focus:outline-none focus:border-blue-500" required />
        </div>
        <button type="submit" className="w-full bg-slate-800 hover:bg-slate-900 text-white text-xs font-medium py-2 rounded transition-colors">
          Save Bank Details
        </button>
      </form>
    </div>
  );
}