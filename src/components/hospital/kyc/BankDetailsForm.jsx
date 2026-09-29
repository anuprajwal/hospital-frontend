import React, { useState, useEffect } from 'react';
import { CreditCard } from 'lucide-react';

export default function BankDetailsForm({ initialBankData, onSubmit, loading }) {
  const [bankData, setBankData] = useState({
    account_number: '',
    beneficiary_name: '',
    ifsc_code: ''
  });

  useEffect(() => {
    if (initialBankData) {
      setBankData(initialBankData);
    }
  }, [initialBankData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(bankData);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 space-y-4">
      <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-blue-600" />
          <div>
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
              Payout Settlement Bank Account
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Hospital bank account for receiving completed appointment settlements.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end pt-2">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Beneficiary Name</label>
          <input
            type="text"
            required
            value={bankData.beneficiary_name}
            onChange={(e) => setBankData({ ...bankData, beneficiary_name: e.target.value })}
            placeholder="e.g. Apollo Hospitals Ltd"
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Account Number</label>
          <input
            type="text"
            required
            value={bankData.account_number}
            onChange={(e) => setBankData({ ...bankData, account_number: e.target.value })}
            placeholder="033325224385037"
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">IFSC Code</label>
          <input
            type="text"
            required
            value={bankData.ifsc_code}
            onChange={(e) => setBankData({ ...bankData, ifsc_code: e.target.value })}
            placeholder="HDFC0000123"
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500 uppercase"
          />
        </div>
        <div className="sm:col-span-3 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg transition disabled:opacity-50"
          >
            {loading ? 'Updating Bank...' : 'Save Bank Details'}
          </button>
        </div>
      </form>
    </div>
  );
}