import React, { useState, useEffect } from 'react';

export default function BankDetailsForm({ initialBankData, onSubmit, loading }) {
  const [bankData, setBankData] = useState({
    account_number: '',
    beneficiary_name: '',
    ifsc_code: ''
  });

  // Sync props to state ONLY when incoming fields change
  useEffect(() => {
    if (initialBankData && initialBankData.account_number) {
      setBankData(prev => {
        if (
          prev.account_number === initialBankData.account_number &&
          prev.beneficiary_name === initialBankData.beneficiary_name &&
          prev.ifsc_code === initialBankData.ifsc_code
        ) {
          return prev; // Prevent duplicate state triggers
        }
        return { ...initialBankData };
      });
    }
  }, [initialBankData?.account_number, initialBankData?.beneficiary_name, initialBankData?.ifsc_code]);

  const handleSubmit = (e) => {
    e.preventDefault(); // CRITICAL: Prevents native HTML page submit reload
    if (onSubmit) onSubmit(bankData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
      <h3 className="font-semibold text-slate-800">Settlement Bank Account</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Beneficiary Name</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-lg text-sm"
            value={bankData.beneficiary_name}
            onChange={(e) => setBankData({ ...bankData, beneficiary_name: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Account Number</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-lg text-sm"
            value={bankData.account_number}
            onChange={(e) => setBankData({ ...bankData, account_number: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">IFSC Code</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-lg text-sm"
            value={bankData.ifsc_code}
            onChange={(e) => setBankData({ ...bankData, ifsc_code: e.target.value })}
            required
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Saving...' : 'Save Bank Details'}
      </button>
    </form>
  );
}