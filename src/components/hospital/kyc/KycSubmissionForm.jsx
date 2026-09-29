import React, { useState, useEffect } from 'react';

export default function KycSubmissionForm({ initialForm, onSubmit, loading }) {
  const [kycForm, setKycForm] = useState({
    legal_business_name: '',
    contact_name: '',
    business_type: 'individual',
    address_line1: '',
    city: '',
    state: '',
    postal_code: '',
    beneficiary_name: '',
    account_number: '',
    ifsc_code: ''
  });

  useEffect(() => {
    if (initialForm && typeof initialForm === 'object') {
      setKycForm(prev => ({ ...prev, ...initialForm }));
    }
  }, [initialForm]);

  const handleSubmit = (e) => {
    e.preventDefault(); // CRITICAL: Prevents native HTML page submit reload
    if (onSubmit) onSubmit(kycForm);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Legal Business Name</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-lg text-sm"
            value={kycForm.legal_business_name}
            onChange={(e) => setKycForm({ ...kycForm, legal_business_name: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Contact Name</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-lg text-sm"
            value={kycForm.contact_name}
            onChange={(e) => setKycForm({ ...kycForm, contact_name: e.target.value })}
            required
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 disabled:opacity-50"
      >
        {loading ? 'Submitting KYC...' : 'Submit KYC Details'}
      </button>
    </form>
  );
}