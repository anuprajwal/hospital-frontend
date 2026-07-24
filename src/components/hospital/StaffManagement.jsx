import React, { useState, useEffect } from 'react';
import { hospitalEndpoints } from '../../services/api';
import Alert from '../ui/Alert';
import Loader from '../ui/Loader';
import { Users, Search, UserCheck, ShieldAlert, ArrowRight } from 'lucide-react';

export default function StaffManagement({ hospitalId, onSelectDoctor }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [staff, setStaff] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (hospitalId) {
      fetchStaffRecords();
    } else {
      // Temporary cluster fallback check for demo initialization loops
      setLoading(false);
    }
  }, [hospitalId]);

  const fetchStaffRecords = async () => {
    setLoading(true);
    try {
      const res = await hospitalEndpoints.getStaff(hospitalId);
      setStaff(res.data?.doctors || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredStaff = staff.filter(doc => 
    doc.user?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.specialization?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Loader size="lg" />;

  return (
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-slate-900">Clinical Practitioners Registry</h1>
          <p class="text-sm text-slate-500 font-normal">Monitor regulatory profiles, verification tracks, and clinical specialties for attached staff.</p>
        </div>
        <div class="relative max-w-xs w-full">
          <span class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search class="h-4 w-4 text-slate-400" />
          </span>
          <input type="text" placeholder="Filter parameters by name or discipline..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} class="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:border-blue-500 transition-colors" />
        </div>
      </div>

      <Alert type="error" message={error} />

      {filteredStaff.length === 0 ? (
        <div class="text-center py-12 bg-white rounded-xl border border-slate-200 shadow-sm">
          <Users class="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <p class="text-sm text-slate-500 font-medium">No registered medical personnel entries match the runtime filter stack.</p>
        </div>
      ) : (
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStaff.map(doc => (
            <div key={doc.id} class="bg-white rounded-xl border border-slate-200 shadow-sm p-5 hover:border-slate-300 transition-all flex flex-col justify-between">
              <div>
                <div class="flex items-center gap-4 mb-4">
                  <img src={doc.profile_picture || 'https://res.cloudinary.com/dwshjkk42/image/upload/v1751270760/doctor_8997187_mgopyu.png'} alt={doc.user?.username} class="h-12 w-12 rounded-full object-cover bg-slate-100 border border-slate-100" />
                  <div>
                    <h3 class="font-semibold text-slate-800 text-sm">{doc.user?.username || 'Practitioner Record'}</h3>
                    <p class="text-xs text-blue-600 font-medium">{doc.specialization || 'General Discipline'}</p>
                  </div>
                </div>
                
                <div class="space-y-1.5 border-t border-slate-50 pt-3 text-xs text-slate-600">
                  <div class="flex justify-between"><span class="text-slate-400">Experience Parameters:</span><span class="font-medium text-slate-700">{doc.experience_years ? `${doc.experience_years} Practice Years` : 'Under Review'}</span></div>
                  <div class="flex justify-between"><span class="text-slate-400">Consultation Tariff:</span><span class="font-medium text-slate-700">INR {doc.consultation_fee || '0.00'}</span></div>
                  <div class="flex justify-between items-center"><span class="text-slate-400">Regulatory Clearance:</span>
                    <span class={`inline-flex items-center gap-1 font-bold ${doc.verified_status ? 'text-green-600' : 'text-amber-600'}`}>
                      {doc.verified_status ? <UserCheck class="h-3 w-3" /> : <ShieldAlert class="h-3 w-3" />}
                      {doc.verified_status ? 'Cleared' : 'Pending Verification'}
                    </span>
                  </div>
                </div>
              </div>

              <div class="mt-4 pt-3 border-t border-slate-100 flex justify-end">
                <button onClick={() => onSelectDoctor(doc)} class="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-semibold transition-colors">
                  Examine Operational Details <ArrowRight class="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}