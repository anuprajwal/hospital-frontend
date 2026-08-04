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
  Filter,
  UserX
} from 'lucide-react';

export default function StaffManagement({ onSelectDoctor }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [doctors, setDoctors] = useState([]);
  
  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [verifiedFilter, setVerifiedFilter] = useState('');
  const [requestStatusFilter, setRequestStatusFilter] = useState('');
  
  // Pagination State
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 9,
    total_records: 0,
    total_pages: 1
  });

  // Debounced search trigger / Effect fetch
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchDoctors(1); // Reset to page 1 on search/filter changes
    }, 300);

    return () => clearTimeout(handler);
  }, [searchTerm, verifiedFilter, requestStatusFilter]);

  const fetchDoctors = async (targetPage = pagination.page) => {
    setLoading(true);
    setError('');
    try {
      const res = await hospitalEndpoints.getDoctors({
        search: searchTerm,
        verified: verifiedFilter,
        request_status: requestStatusFilter,
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
    switch (status) {
      case 'accepted':
        return (
          <span class="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle class="h-3 w-3" /> Accepted
          </span>
        );
      case 'pending':
        return (
          <span class="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
            <Clock class="h-3 w-3" /> Pending
          </span>
        );
      case 'rejected':
        return (
          <span class="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle class="h-3 w-3" /> Rejected
          </span>
        );
      default:
        return (
          <span class="inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
            {status || 'N/A'}
          </span>
        );
    }
  };

  return (
    <div class="space-y-6">
      {/* Page Header */}
      <div>
        <h1 class="text-2xl font-bold text-slate-900">Staff Registry</h1>
        <p class="text-sm text-slate-500">Manage attached medical personnel, request statuses, and clinical specializations.</p>
      </div>

      {/* Filter and Search Bar */}
      <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search Input */}
          <div class="md:col-span-2 relative">
            <span class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
              <Search class="h-4 w-4" />
            </span>
            <input
              type="text"
              placeholder="Search by email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              class="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Verified Filter */}
          <div class="relative">
            <select
              value={verifiedFilter}
              onChange={(e) => setVerifiedFilter(e.target.value)}
              class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 transition-colors"
            >
              <option value="">All Verification Statuses</option>
              <option value="true">Verified Doctors</option>
              <option value="false">Unverified Doctors</option>
            </select>
          </div>

          {/* Request Status Filter */}
          <div class="relative">
            <select
              value={requestStatusFilter}
              onChange={(e) => setRequestStatusFilter(e.target.value)}
              class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 transition-colors"
            >
              <option value="">All Request Statuses</option>
              <option value="accepted">Accepted Requests</option>
              <option value="pending">Pending Requests</option>
              <option value="rejected">Rejected Requests</option>
            </select>
          </div>
        </div>
      </div>

      <Alert type="error" message={error} />

      {/* Main Content Grid */}
      {loading ? (
        <Loader size="lg" />
      ) : doctors.length === 0 ? (
        <div class="text-center py-16 bg-white rounded-xl border border-slate-200 shadow-sm">
          <UserX class="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <p class="text-sm font-semibold text-slate-700">No Doctors Found</p>
          <p class="text-xs text-slate-400 max-w-sm mx-auto mt-1">Try adjusting your search terms or clearing specific status filters.</p>
        </div>
      ) : (
        <>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {doctors.map((doc) => {
              const profile = doc.doctorProfile || {};
              const request = doc.organisationRequests?.[0] || {};

              return (
                <div 
                  key={doc.id} 
                  class="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
                >
                  <div class="p-5 space-y-4">
                    {/* Header Details */}
                    <div class="flex items-start justify-between gap-3">
                      <div>
                        <h3 class="font-bold text-slate-900 text-base">
                          {profile.full_name || doc.username}
                        </h3>
                        <p class="text-xs text-blue-600 font-semibold mt-0.5">
                          {profile.specialization || 'General Physician'}
                        </p>
                      </div>
                      {getRequestBadge(request.request_status)}
                    </div>

                    {/* Metadata List */}
                    <div class="space-y-2 border-t border-slate-100 pt-3 text-xs">
                      <div class="flex justify-between text-slate-600">
                        <span class="text-slate-400">Email:</span>
                        <span class="font-medium truncate max-w-[170px]">{doc.email}</span>
                      </div>
                      <div class="flex justify-between text-slate-600">
                        <span class="text-slate-400">Phone:</span>
                        <span class="font-medium">{doc.phone_number || 'N/A'}</span>
                      </div>
                      <div class="flex justify-between text-slate-600">
                        <span class="text-slate-400">Consultation Fee:</span>
                        <span class="font-semibold text-slate-800">
                          {profile.consultation_fee ? `₹${profile.consultation_fee}` : 'N/A'}
                        </span>
                      </div>
                      <div class="flex justify-between text-slate-600 items-center">
                        <span class="text-slate-400">Doctor Status:</span>
                        <span className={`inline-flex items-center gap-1 font-semibold text-[11px] ${profile.is_verified ? 'text-emerald-600' : 'text-amber-600'}`}>
                          {profile.is_verified ? <UserCheck class="h-3 w-3" /> : <ShieldAlert class="h-3 w-3" />}
                          {profile.is_verified ? 'Verified Profile' : 'Unverified'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Action */}
                  <div class="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    <span class="text-[11px] text-slate-400">ID: #{doc.id}</span>
                    <button
                      onClick={() => onSelectDoctor(doc)}
                      class="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-semibold transition-colors"
                    >
                      View Full Details <ArrowRight class="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {pagination.total_pages > 1 && (
            <div class="flex items-center justify-between bg-white px-4 py-3 rounded-xl border border-slate-200 shadow-sm mt-4">
              <div class="text-xs text-slate-500">
                Showing page <span class="font-bold text-slate-700">{pagination.page}</span> of <span class="font-bold text-slate-700">{pagination.total_pages}</span> ({pagination.total_records} records)
              </div>
              <div class="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  class="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft class="h-4 w-4" />
                </button>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.total_pages}
                  class="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight class="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}