import React from 'react';
import { MapPin } from 'lucide-react';

export default function HospitalAddressSection({ 
  address, 
  addressForm, 
  setAddressForm, 
  isEditingAddress, 
  setIsEditingAddress, 
  onSubmit, 
  onDelete 
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <MapPin className="h-5 w-5 text-blue-600" />
          <h2 className="font-semibold text-slate-800">Hospital Address</h2>
        </div>
        {address && !isEditingAddress && (
          <div className="flex gap-3">
            <button 
              onClick={() => {
                setAddressForm({
                  street: address.street || '',
                  city: address.city || '',
                  state: address.state || '',
                  pincode: address.pincode || '',
                  country: address.country || 'India',
                  landmark: address.landmark || '',
                  houseNo: address.house_no || address.houseNo || ''
                });
                setIsEditingAddress(true);
              }} 
              className="text-blue-600 hover:text-blue-700 text-xs font-semibold"
            >
              Edit Address
            </button>
            <button onClick={onDelete} className="text-red-600 hover:text-red-700 text-xs font-semibold">
              Delete
            </button>
          </div>
        )}
      </div>

      {!address && !isEditingAddress ? (
        <div className="text-center py-6 border border-dashed border-slate-200 rounded-xl bg-slate-50">
          <p className="text-xs text-slate-500 mb-3">No address added yet.</p>
          <button onClick={() => setIsEditingAddress(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-medium transition-colors">
            Add Address
          </button>
        </div>
      ) : isEditingAddress ? (
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Building / House No.</label>
              <input type="text" value={addressForm.houseNo} onChange={e => setAddressForm({...addressForm, houseNo: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Street Address</label>
              <input type="text" value={addressForm.street} onChange={e => setAddressForm({...addressForm, street: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Landmark</label>
              <input type="text" value={addressForm.landmark} onChange={e => setAddressForm({...addressForm, landmark: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">City</label>
              <input type="text" value={addressForm.city} onChange={e => setAddressForm({...addressForm, city: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Pincode</label>
              <input type="text" value={addressForm.pincode} onChange={e => setAddressForm({...addressForm, pincode: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">State</label>
              <input type="text" value={addressForm.state} onChange={e => setAddressForm({...addressForm, state: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" required />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setIsEditingAddress(false)} className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs px-3 py-2 rounded-lg transition-colors">
              Cancel
            </button>
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs px-4 py-2 rounded-lg transition-colors">
              Save Address
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm space-y-1">
          <div className="font-medium text-slate-800">Current Hospital Address:</div>
          <div className="text-slate-600">
            {address.house_no ? `${address.house_no}, ` : ''}{address.street}
            {address.landmark ? `, Near ${address.landmark}` : ''}
          </div>
          <div className="text-slate-600">{address.city} - {address.pincode}</div>
          <div className="text-slate-600">{address.state}, {address.country || 'India'}</div>
        </div>
      )}
    </div>
  );
}