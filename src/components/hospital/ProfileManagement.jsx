import React, { useState, useEffect } from 'react';
import { hospitalEndpoints } from '../../services/api';
import Alert from '../ui/Alert';
import Loader from '../ui/Loader';
import { Shield, MapPin, Building, Lock, Check } from 'lucide-react';

export default function ProfileManagement() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Module Independent State Engines
  const [profileForm, setProfileForm] = useState({ org_type: 'hospital', org_name: '', org_license: '', org_establishment: '', org_url: '', org_ambulance: 'false', org_services: [] });
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState(null);
  const [addressForm, setAddressForm] = useState({ street: '', city: '', state: '', pincode: '', country: 'India', landmark: '', houseNo: '' });
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [bank, setBank] = useState({ account_number: '', beneficiary_name: '', ifsc_code: '' });
  const [verification, setVerification] = useState({ emailVerified: false, phoneVerified: false, emailOtp: '', phoneOtp: '', emailMsg: '', phoneMsg: '' });
  const [hospitalId, setHospitalId] = useState(null);

  const serviceOptions = ["physiotherapy", "psycology", "cardiology", "pediatrition", "neurology", "orthopedics"];

  useEffect(() => {
    fetchCoreData();
  }, []);

  const fetchCoreData = async () => {
    setLoading(true);
    try {
      const userRes = await hospitalEndpoints.getProfile();
      const userData = userRes.data?.userData;
      if (userData) {
        setHospitalId(userData.id);
        setVerification(prev => ({ ...prev, emailVerified: userData.is_email_verified, phoneVerified: userData.is_phone_verified }));
        if (userData.hospitalOrganisation) {
          setProfileForm({
            org_type: userData.hospitalOrganisation.org_type || 'hospital',
            org_name: userData.hospitalOrganisation.org_name || '',
            org_license: userData.hospitalOrganisation.org_license || '',
            org_establishment: userData.hospitalOrganisation.org_establishment || '',
            org_url: userData.hospitalOrganisation.org_url || '',
            org_ambulance: String(userData.hospitalOrganisation.org_ambulance) || 'false',
            org_services: userData.hospitalOrganisation.org_services || []
          });
        }
      }
      const addrRes = await hospitalEndpoints.getAddress();
      if (addrRes.data?.address && addrRes.data.address.length > 0) {
        setAddress(addrRes.data.address[0]);
      } else {
        setAddress(null);
      }
      const bankRes = await hospitalEndpoints.getBankDetails();
      if (bankRes.data?.bankDetails) {
        setBank(bankRes.data.bankDetails);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      await hospitalEndpoints.updateProfile(profileForm);
      setSuccess('Operational Profile updated successfully.');
    } catch (err) { setError(err.message); }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      await hospitalEndpoints.changePassword(password);
      setSuccess('Security credentials updated successfully.');
      setPassword('');
    } catch (err) { setError(err.message); }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      if (address) {
        await hospitalEndpoints.updateAddress({ ...addressForm, addressId: String(address.id) });
        setSuccess('Practice location data reconfigured.');
      } else {
        await hospitalEndpoints.addAddress(addressForm);
        setSuccess('Practice location token written.');
      }
      setIsEditingAddress(false);
      fetchCoreData();
    } catch (err) { setError(err.message); }
  };

  const handleAddressDelete = async () => {
    if (!window.confirm('Erase active clinical location ledger key entry?')) return;
    setError(''); setSuccess('');
    try {
      await hospitalEndpoints.deleteAddress(String(address.id));
      setSuccess('Clinical location ledger slot cleared.');
      setAddress(null);
      setAddressForm({ street: '', city: '', state: '', pincode: '', country: 'India', landmark: '', houseNo: '' });
    } catch (err) { setError(err.message); }
  };

  const handleBankSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      await hospitalEndpoints.uploadBankDetails(bank);
      setSuccess('Financial settlement profiles synced.');
    } catch (err) { setError(err.message); }
  };

  const triggerOtp = async (channel) => {
    try {
      if (channel === 'email') {
        await hospitalEndpoints.sendEmailOtp();
        setVerification(p => ({ ...p, emailMsg: 'OTP code streamed to registered mail context.' }));
      } else {
        await hospitalEndpoints.sendMobileOtp();
        setVerification(p => ({ ...p, phoneMsg: 'OTP token sent to hardware transceiver lines.' }));
      }
    } catch (err) { setError(err.message); }
  };

  const verifyOtpToken = async (channel) => {
    try {
      const payload = channel === 'email' 
        ? { userOtp: verification.emailOtp, email: 'true' }
        : { userOtp: verification.phoneOtp, phoneNumber: 'true' };
      await hospitalEndpoints.verifyOtp(payload);
      setSuccess(`${channel === 'email' ? 'Email' : 'Mobile'} parameter set validated successfully.`);
      fetchCoreData();
    } catch (err) { setError(err.message); }
  };

  if (loading) return <Loader size="lg" />;

  return (
    <div class="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">Hospital Structural Configurations</h1>
        <p class="text-sm text-slate-500">Manage institutional attributes, locations, financial setups, and compliance workflows.</p>
      </div>

      <Alert type="error" message={error} />
      <Alert type="success" message={success} />

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-8">
          {/* Main Organizational Form */}
          <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div class="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
              <Building class="h-5 w-5 text-blue-600" />
              <h2 class="font-semibold text-slate-800">General Registration Parameters</h2>
            </div>
            <form onSubmit={handleProfileSubmit} class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-medium text-slate-600 mb-1">Entity Profile Category</label>
                  <select value={profileForm.org_type} onChange={e => setProfileForm({...profileForm, org_type: e.target.value})} class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500">
                    <option value="hospital">Hospital Matrix Instance</option>
                    <option value="clinic">Clinical Complex Setup</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-medium text-slate-600 mb-1">Corporate Branding Title</label>
                  <input type="text" value={profileForm.org_name} onChange={e => setProfileForm({...profileForm, org_name: e.target.value})} class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" required />
                </div>
                <div>
                  <label class="block text-xs font-medium text-slate-600 mb-1">State Regulatory License Registry Hash</label>
                  <input type="text" value={profileForm.org_license} onChange={e => setProfileForm({...profileForm, org_license: e.target.value})} class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" required />
                </div>
                <div>
                  <label class="block text-xs font-medium text-slate-600 mb-1">Establishment Calendar Year</label>
                  <input type="number" value={profileForm.org_establishment} onChange={e => setProfileForm({...profileForm, org_establishment: e.target.value})} class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" required />
                </div>
                <div>
                  <label class="block text-xs font-medium text-slate-600 mb-1">Institutional Web Portal Reference</label>
                  <input type="text" value={profileForm.org_url} onChange={e => setProfileForm({...profileForm, org_url: e.target.value})} class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label class="block text-xs font-medium text-slate-600 mb-1">Emergency Ambulance Fleet Active</label>
                  <select value={profileForm.org_ambulance} onChange={e => setProfileForm({...profileForm, org_ambulance: e.target.value})} class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500">
                    <option value="true">Ambulance Fleet Active Ready</option>
                    <option value="false">No Fleet Operational Block</option>
                  </select>
                </div>
              </div>
              <div>
                <label class="block text-xs font-medium text-slate-600 mb-2">Clinical Specialization Matrices Enclosed</label>
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {serviceOptions.map(srv => {
                    const isChecked = profileForm.org_services.includes(srv);
                    return (
                      <label key={srv} class={`flex items-center gap-2 p-2 border rounded-lg text-xs cursor-pointer select-none ${isChecked ? 'bg-blue-50 border-blue-200 text-blue-700 font-medium' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                        <input type="checkbox" checked={isChecked} onChange={() => {
                          const nextArr = isChecked ? profileForm.org_services.filter(x => x !== srv) : [...profileForm.org_services, srv];
                          setProfileForm({ ...profileForm, org_services: nextArr });
                        }} class="hidden" />
                        {isChecked && <Check class="h-3.5 w-3.5 shrink-0" />}
                        {srv.charAt(0).toUpperCase() + srv.slice(1)}
                      </label>
                    );
                  })}
                </div>
              </div>
              <div class="flex justify-end pt-2">
                <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs px-4 py-2 rounded-lg transition-colors">Commit Structural Settings</button>
              </div>
            </form>
          </div>

          {/* Single Address Node Block */}
          <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div class="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <div class="flex items-center gap-3">
                <MapPin class="h-5 w-5 text-blue-600" />
                <h2 class="font-semibold text-slate-800">Clinical Address Instance Matrix</h2>
              </div>
              {address && !isEditingAddress && (
                <div class="flex gap-2">
                  <button onClick={() => {
                    setAddressForm(address);
                    setIsEditingAddress(true);
                  }} class="text-blue-600 hover:text-blue-700 text-xs font-medium">Reconfigure Address</button>
                  <button onClick={handleAddressDelete} class="text-red-600 hover:text-red-700 text-xs font-medium">Erase Node</button>
                </div>
              )}
            </div>

            {!address && !isEditingAddress ? (
              <div class="text-center py-6 border border-dashed border-slate-200 rounded-xl bg-slate-50">
                <p class="text-xs text-slate-500 mb-3">No verified practice location coordinates found inside registry metrics.</p>
                <button onClick={() => setIsEditingAddress(true)} class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-medium transition-colors">Provision Location Node</button>
              </div>
            ) : isEditingAddress ? (
              <form onSubmit={handleAddressSubmit} class="space-y-4">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-medium text-slate-600 mb-1">House/Building Block ID</label>
                    <input type="text" value={addressForm.houseNo} onChange={e => setAddressForm({...addressForm, houseNo: e.target.value})} class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-slate-600 mb-1">Street Avenue Ledger Name</label>
                    <input type="text" value={addressForm.street} onChange={e => setAddressForm({...addressForm, street: e.target.value})} class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" required />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-slate-600 mb-1">Landmark Vector Pointer</label>
                    <input type="text" value={addressForm.landmark} onChange={e => setAddressForm({...addressForm, landmark: e.target.value})} class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-slate-600 mb-1">City Hub Territory</label>
                    <input type="text" value={addressForm.city} onChange={e => setAddressForm({...addressForm, city: e.target.value})} class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" required />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-slate-600 mb-1">Postal Pincode Token Boundary</label>
                    <input type="text" value={addressForm.pincode} onChange={e => setAddressForm({...addressForm, pincode: e.target.value})} class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" required />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-slate-600 mb-1">State Province Territory</label>
                    <input type="text" value={addressForm.state} onChange={e => setAddressForm({...addressForm, state: e.target.value})} class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" required />
                  </div>
                </div>
                <div class="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setIsEditingAddress(false)} class="bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs px-3 py-2 rounded-lg transition-colors">Abort</button>
                  <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs px-4 py-2 rounded-lg transition-colors">Commit Physical Node</button>
                </div>
              </form>
            ) : (
              <div class="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm space-y-1">
                <div class="font-medium text-slate-800">Active Practice Hub Coordinates:</div>
                <div class="text-slate-600">{address.houseNo} {address.street}, {address.landmark ? `Near ${address.landmark},` : ''}</div>
                <div class="text-slate-600">{address.city} - {address.pincode}</div>
                <div class="text-slate-600">{address.state}, {address.country}</div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Configuration Blocks */}
        <div class="space-y-8">
          {/* Identity Regulatory Compliance Check desk */}
          <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div class="flex items-center gap-3 border-b border-slate-100 pb-4 mb-4">
              <Shield class="h-5 w-5 text-blue-600" />
              <h2 class="font-semibold text-slate-800">Verification Lifecycle</h2>
            </div>
            
            <div class="space-y-4">
              {/* Mail Segment */}
              <div class="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-xs font-medium text-slate-700">Electronic Mail Channel</span>
                  <span class={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${verification.emailVerified ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                    {verification.emailVerified ? 'Verified Account' : 'Pending OTP validation'}
                  </span>
                </div>
                {!verification.emailVerified && (
                  <div class="space-y-2 mt-2">
                    {verification.emailMsg ? (
                      <div class="flex gap-1.5">
                        <input type="text" placeholder="OTP Key String" value={verification.emailOtp} onChange={e => setVerification({...verification, emailOtp: e.target.value})} class="w-full px-2 py-1 text-xs border rounded focus:outline-none" />
                        <button onClick={() => verifyOtpToken('email')} class="bg-blue-600 text-white px-2 py-1 text-xs font-medium rounded hover:bg-blue-700">Apply</button>
                      </div>
                    ) : (
                      <button onClick={() => triggerOtp('email')} class="text-xs text-blue-600 hover:text-blue-700 font-medium">Transmit Mail Authorization OTP</button>
                    )}
                    {verification.emailMsg && <p class="text-[10px] text-slate-500 mt-1">{verification.emailMsg}</p>}
                  </div>
                )}
              </div>

              {/* Mobile Segment */}
              <div class="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-xs font-medium text-slate-700">Hardware Transceiver Line</span>
                  <span class={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${verification.phoneVerified ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                    {verification.phoneVerified ? 'Verified Connection' : 'Pending OTP verification'}
                  </span>
                </div>
                {!verification.phoneVerified && (
                  <div class="space-y-2 mt-2">
                    {verification.phoneMsg ? (
                      <div class="flex gap-1.5">
                        <input type="text" placeholder="OTP Token" value={verification.phoneOtp} onChange={e => setVerification({...verification, phoneOtp: e.target.value})} class="w-full px-2 py-1 text-xs border rounded focus:outline-none" />
                        <button onClick={() => verifyOtpToken('phone')} class="bg-blue-600 text-white px-2 py-1 text-xs font-medium rounded hover:bg-blue-700">Verify</button>
                      </div>
                    ) : (
                      <button onClick={() => triggerOtp('phone')} class="text-xs text-blue-600 hover:text-blue-700 font-medium">Transmit Transceiver Cellular OTP</button>
                    )}
                    {verification.phoneMsg && <p class="text-[10px] text-slate-500 mt-1">{verification.phoneMsg}</p>}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Financial Settlements Allocations */}
          <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div class="flex items-center gap-3 border-b border-slate-100 pb-4 mb-4">
              <Building class="h-5 w-5 text-blue-600" />
              <h2 class="font-semibold text-slate-800">Financial Settlements Setup</h2>
            </div>
            <form onSubmit={handleBankSubmit} class="space-y-3">
              <div>
                <label class="block text-[10px] font-medium text-slate-600 mb-0.5">Corporate Beneficiary Title</label>
                <input type="text" value={bank.beneficiary_name} onChange={e => setBank({...bank, beneficiary_name: e.target.value})} class="w-full px-2 py-1.5 border border-slate-200 rounded text-xs focus:outline-none focus:border-blue-500" required />
              </div>
              <div>
                <label class="block text-[10px] font-medium text-slate-600 mb-0.5">Account Identification Ledger String</label>
                <input type="text" value={bank.account_number} onChange={e => setBank({...bank, account_number: e.target.value})} class="w-full px-2 py-1.5 border border-slate-200 rounded text-xs focus:outline-none focus:border-blue-500" required />
              </div>
              <div>
                <label class="block text-[10px] font-medium text-slate-600 mb-0.5">IFSC Routing Protocol Code</label>
                <input type="text" value={bank.ifsc_code} onChange={e => setBank({...bank, ifsc_code: e.target.value})} class="w-full px-2 py-1.5 border border-slate-200 rounded text-xs focus:outline-none focus:border-blue-500" required />
              </div>
              <button type="submit" class="w-full bg-slate-800 hover:bg-slate-900 text-white text-xs font-medium py-2 rounded transition-colors">Sync Settlement Profile</button>
            </form>
          </div>

          {/* Security Credentials Layer */}
          <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div class="flex items-center gap-3 border-b border-slate-100 pb-4 mb-4">
              <Lock class="h-5 w-5 text-blue-600" />
              <h2 class="font-semibold text-slate-800">Access Key Alteration</h2>
            </div>
            <form onSubmit={handlePasswordSubmit} class="space-y-3">
              <div>
                <label class="block text-[10px] font-medium text-slate-600 mb-0.5">Target Absolute New Password Key</label>
                <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} class="w-full px-2 py-1.5 border border-slate-200 rounded text-xs focus:outline-none focus:border-blue-500" required />
              </div>
              <button type="submit" class="w-full bg-slate-800 hover:bg-slate-900 text-white text-xs font-medium py-2 rounded transition-colors">Override Keys</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}