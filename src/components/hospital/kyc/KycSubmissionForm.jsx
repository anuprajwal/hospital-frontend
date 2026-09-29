import React, { useState, useEffect } from 'react';

export default function KycSubmissionForm({ initialForm, onSubmit, loading }) {
  const [kycForm, setKycForm] = useState({
    legal_business_name: '',
    contact_name: '',
    business_type: 'individual',
    subcategory: 'healthcare',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    business_pan: '',
    gst_number: '',
    personal_pan: '',
    beneficiary_name: '',
    account_number: '',
    ifsc_code: ''
  });

  useEffect(() => {
    if (initialForm) {
      setKycForm(prev => ({ ...prev, ...initialForm }));
    }
  }, [initialForm]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setKycForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(kycForm);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Section 1: Business Identification */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 pb-1">
          1. Organization Identification
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Legal Business / Hospital Name *</label>
            <input
              type="text"
              required
              name="legal_business_name"
              value={kycForm.legal_business_name}
              onChange={handleChange}
              placeholder="e.g. Prajwal Multi-Specialty Hospital"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Contact Person Name *</label>
            <input
              type="text"
              required
              name="contact_name"
              value={kycForm.contact_name}
              onChange={handleChange}
              placeholder="e.g. Dr. Anup Rajwal"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Business PAN (Organization) *</label>
            <input
              type="text"
              required
              name="business_pan"
              value={kycForm.business_pan}
              onChange={handleChange}
              placeholder="AAACH1234F"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500 uppercase"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Personal PAN (Authorized Signatory) *</label>
            <input
              type="text"
              required
              name="personal_pan"
              value={kycForm.personal_pan}
              onChange={handleChange}
              placeholder="ABCDE1234F"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500 uppercase"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">GST Number (Optional)</label>
            <input
              type="text"
              name="gst_number"
              value={kycForm.gst_number}
              onChange={handleChange}
              placeholder="36AAAAA0000A1Z5"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500 uppercase"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Business Type</label>
            <select
              name="business_type"
              value={kycForm.business_type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500"
            >
              <option value="private_limited">Private Limited Company</option>
              <option value="public_limited">Public Limited Company</option>
              <option value="partnership">Partnership</option>
              <option value="llp">Limited Liability Partnership (LLP)</option>
              <option value="trust">Trust / NGO</option>
              <option value="society">Society</option>
              <option value="proprietorship">Sole Proprietorship</option>
              <option value="individual">beta testing</option>
            </select>
          </div>
        </div>
      </div>

      {/* Section 2: Hospital Registered Address */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 pb-1">
          2. Registered Hospital Address
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-3">
            <label className="block text-xs font-medium text-slate-600 mb-1">Address Line 1 *</label>
            <input
              type="text"
              required
              name="address_line1"
              value={kycForm.address_line1}
              onChange={handleChange}
              placeholder="Main Road, Near City Center"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">City *</label>
            <input
              type="text"
              required
              name="city"
              value={kycForm.city}
              onChange={handleChange}
              placeholder="Warangal"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">State *</label>
            <input
              type="text"
              required
              name="state"
              value={kycForm.state}
              onChange={handleChange}
              placeholder="Telangana"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Postal Code *</label>
            <input
              type="text"
              required
              name="postal_code"
              value={kycForm.postal_code}
              onChange={handleChange}
              placeholder="506332"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Section 3: Settlement Bank Credentials */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 pb-1">
          3. Settlement Bank Account Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Beneficiary Name *</label>
            <input
              type="text"
              required
              name="beneficiary_name"
              value={kycForm.beneficiary_name}
              onChange={handleChange}
              placeholder="Account holder name"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Account Number *</label>
            <input
              type="text"
              required
              name="account_number"
              value={kycForm.account_number}
              onChange={handleChange}
              placeholder="033325224385037"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">IFSC Code *</label>
            <input
              type="text"
              required
              name="ifsc_code"
              value={kycForm.ifsc_code}
              onChange={handleChange}
              placeholder="NESF0000333"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500 uppercase"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-sm transition disabled:opacity-50"
        >
          {loading ? 'Submitting to Razorpay...' : 'Submit Hospital KYC for Activation'}
        </button>
      </div>
    </form>
  );
}