import React, { useState, useEffect } from 'react';
import { hospitalEndpoints } from '../../services/api';
import Alert from '../ui/Alert';
import Loader from '../ui/Loader';
import { 
  Search, 
  CheckCircle, 
  XCircle, 
  Clock, 
  UserCheck, 
  ShieldAlert, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight,
  UserX
} from 'lucide-react';

export default function StaffManagement({ onSelectDoctor }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [doctors, setDoctors] = useState([]);
  
  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination State
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 9,
    total_records: 0,
    total_pages: 1
  });

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchDoctors(1);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  const fetchDoctors = async (targetPage = pagination.page) => {
    setLoading(true);
    setError('');
    try {
      const res = await hospitalEndpoints.getDoctors({
        search: searchTerm,
        page: targetPage,
        limit: pagination.limit
      });

      if (res.data) {
        setDoctors(res.data.doctors || []);
        if (res.data.pagination) {
          setPagination(res.data.pagination);
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch doctor registry.');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.total_pages) {
      fetchDoctors(newPage);
    }
  };

  const getRequestBadge = (status) => {
    if (!status) {
      return (
        <span className="inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
          No Direct Request
        </span>
      );
    }
    switch (status) {
      case 'accepted':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle className="h-3 w-3" /> Accepted
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="h-3 w-3" /> Pending
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="h-3 w-3" /> Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Staff Registry</h1>
        <p className="text-sm text-slate-500">Manage attached medical personnel, verification statuses, and clinical parameters.</p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="md:col-span-2 relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              placeholder="Search by email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          
        </div>
      </div>

      <Alert type="error" message={error} />

      {/* Doctor Cards Grid */}
      {loading ? (
        <Loader size="lg" />
      ) : doctors.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200 shadow-sm">
          <UserX className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-700">No Doctors Found</p>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">Try adjusting your search terms or filters.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {doctors.map((doc) => {
              const profile = doc.doctorProfile || {};
              const request = doc.organisationRequests?.[0] || {};
              const isVerified = profile.verified_status;

              return (
                <div 
                  key={doc.id} 
                  className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
                >
                  <div className="p-5 space-y-4">
                    {/* Header Details */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img 
                          src={profile.profile_picture || 'https://res.cloudinary.com/dwshjkk42/image/upload/v1751270760/doctor_8997187_mgopyu.png'} 
                          alt={doc.username} 
                          className="h-12 w-12 rounded-full object-cover border border-slate-200 bg-slate-100 shrink-0"
                        />
                        <div>
                          <h3 className="font-bold text-slate-900 text-base">
                            {doc.username}
                          </h3>
                          <p className="text-xs text-blue-600 font-semibold mt-0.5">
                            {profile.specialization || 'General Practitioner'}
                          </p>
                        </div>
                      </div>
                      {getRequestBadge(request.request_status)}
                    </div>

                    {/* Metadata List mapped to actual payload */}
                    <div className="space-y-2 border-t border-slate-100 pt-3 text-xs">
                      <div className="flex justify-between text-slate-600">
                        <span className="text-slate-400">Email:</span>
                        <span className="font-medium truncate max-w-[170px]">{doc.email}</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span className="text-slate-400">Phone:</span>
                        <span className="font-medium">{doc.phone_number || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span className="text-slate-400">Experience:</span>
                        <span className="font-medium">
                          {profile.experience_years ? `${profile.experience_years} Years` : 'Not specified'}
                        </span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span className="text-slate-400">Consultation Fee:</span>
                        <span className="font-semibold text-slate-800">
                          {profile.consultation_fee ? `₹${parseFloat(profile.consultation_fee).toFixed(2)}` : 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between text-slate-600 items-center">
                        <span className="text-slate-400">Doctor Verification:</span>
                        <span className={`inline-flex items-center gap-1 font-semibold text-[11px] ${isVerified ? 'text-emerald-600' : 'text-amber-600'}`}>
                          {isVerified ? <UserCheck className="h-3 w-3" /> : <ShieldAlert className="h-3 w-3" />}
                          {isVerified ? 'Verified' : 'Pending Verification'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Action */}
                  <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">ID: #{doc.id}</span>
                    <button
                      onClick={() => onSelectDoctor(doc)}
                      className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-semibold transition-colors"
                    >
                      View Full Details <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {pagination.total_pages > 1 && (
            <div className="flex items-center justify-between bg-white px-4 py-3 rounded-xl border border-slate-200 shadow-sm mt-4">
              <div className="text-xs text-slate-500">
                Page <span className="font-bold text-slate-700">{pagination.page}</span> of <span className="font-bold text-slate-700">{pagination.total_pages}</span> ({pagination.total_records} records)
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.total_pages}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}