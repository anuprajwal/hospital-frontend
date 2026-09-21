import React, { useState, useEffect } from 'react';
import { 
  CalendarRange, 
  Activity, 
  ShieldCheck, 
  Clipboard, 
  ChevronLeft, 
  ChevronRight, 
  User, 
  Stethoscope, 
  Clock, 
  ArrowLeft, 
  Wrench, 
  Phone, 
  Mail, 
  Search, 
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { hospitalEndpoints } from '../../services/api';

export default function AppointmentManagement() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination States
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Selected Appointment State for Detailed View
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // Stats Counters
  const [stats, setStats] = useState({
    todayCount: 0,
    teleCount: 0,
    physicalCount: 0,
    pendingCount: 0
  });

  // Fetch appointments from API
  const fetchAppointments = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await hospitalEndpoints.getAppointments(limit, offset);
      // Extracts records from standard API response structure
      const data = res?.data?.data || res?.data?.appointments || res?.data || [];
      const list = Array.isArray(data) ? data : [];
      
      setAppointments(list);
      setHasMore(list.length === limit);

      // Dynamic calculation for metric counters
      calculateStats(list);
    } catch (err) {
      console.error('Failed to fetch appointments:', err);
      setError(err.message || 'Failed to sync appointment data from server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [limit, offset]);

  const calculateStats = (list) => {
    const today = new Date().toISOString().split('T')[0];
    let todayCount = 0;
    let teleCount = 0;
    let physicalCount = 0;
    let pendingCount = 0;

    list.forEach((apt) => {
      // Today Check
      if (apt.appointment_date && apt.appointment_date.startsWith(today)) {
        todayCount++;
      }
      
      // Type Check
      const type = (apt.type || apt.appointment_type || '').toLowerCase();
      if (type.includes('tele') || type.includes('online') || apt.is_teleconsult) {
        teleCount++;
      } else {
        physicalCount++;
      }

      // Status Check
      const status = (apt.status || apt.approval_status || '').toLowerCase();
      if (status === 'pending' || status === 'requested') {
        pendingCount++;
      }
    });

    setStats({
      todayCount,
      teleCount,
      physicalCount,
      pendingCount
    });
  };

  const handleNextPage = () => {
    if (hasMore) {
      setOffset((prev) => prev + limit);
    }
  };

  const handlePrevPage = () => {
    if (offset > 0) {
      setOffset((prev) => Math.max(0, prev - limit));
    }
  };

  const currentPage = Math.floor(offset / limit) + 1;

  // Render Under Construction Detailed View
  if (selectedAppointment) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => setSelectedAppointment(null)}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Appointment Queue
        </button>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          {/* Construction Header */}
          <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-6 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-400/30 rounded-xl backdrop-blur-sm">
                <Wrench className="h-6 w-6 text-white animate-bounce" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Detailed Appointment View</h2>
                <p className="text-xs text-amber-100">Module under active development</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-semibold backdrop-blur-sm">
              v2.0 Preview
            </span>
          </div>

          {/* Under Construction Banner */}
          <div className="p-8 text-center border-b border-slate-100 bg-amber-50/50">
            <div className="max-w-md mx-auto space-y-3">
              <h3 className="text-lg font-bold text-slate-800">Feature Under Construction</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Full clinical documentation, live video setup, prescription attachments, and status updates for appointment ID <span className="font-mono text-slate-700 font-bold">#{selectedAppointment.id || 'N/A'}</span> will be fully available in the next release.
              </p>
            </div>
          </div>

          {/* Quick Summary Preview */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/50">
            <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-3 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <User className="h-4 w-4 text-blue-500" /> Patient Info
              </div>
              <div className="space-y-1">
                <p className="text-base font-bold text-slate-800">
                  {selectedAppointment.patient?.username || 'N/A'}
                </p>
                <p className="text-xs text-slate-500 flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-slate-400" />
                  {selectedAppointment.patient?.email || 'N/A'}
                </p>
                <p className="text-xs text-slate-500 flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-slate-400" />
                  {selectedAppointment.patient?.phone_number || 'N/A'}
                </p>
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-3 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <Stethoscope className="h-4 w-4 text-purple-500" /> Doctor Info
              </div>
              <div className="space-y-1">
                <p className="text-base font-bold text-slate-800">
                  Dr. {selectedAppointment.doctor?.username || 'N/A'}
                </p>
                <p className="text-xs text-slate-500">
                  Specialization: {selectedAppointment.doctor?.doctorProfile?.specialization || 'General'}
                </p>
                <p className="text-xs text-slate-500 flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-slate-400" />
                  {selectedAppointment.doctor?.email || 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render Main Workspace
  return (
    <div className="space-y-6">
      {/* Workspace Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Appointment Management Workspace</h1>
          <p className="text-sm text-slate-500 font-normal">
            Track institutional scheduling volumes, consult distributions, and real-time processing queues.
          </p>
        </div>
        <button
          onClick={fetchAppointments}
          disabled={loading}
          className="self-start sm:self-auto inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-colors shadow-sm"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin text-blue-600' : 'text-slate-500'}`} />
          Refresh Workspace
        </button>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Consultations Today</p>
            <p className="text-2xl font-extrabold text-slate-800 mt-1">{stats.todayCount}</p>
          </div>
          <div className="p-2 bg-blue-50 rounded-lg"><CalendarRange className="h-5 w-5 text-blue-600" /></div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Active Tele-Consults</p>
            <p className="text-2xl font-extrabold text-slate-800 mt-1">{stats.teleCount}</p>
          </div>
          <div className="p-2 bg-green-50 rounded-lg"><Activity className="h-5 w-5 text-green-600" /></div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Physical Checkups</p>
            <p className="text-2xl font-extrabold text-slate-800 mt-1">{stats.physicalCount}</p>
          </div>
          <div className="p-2 bg-purple-50 rounded-lg"><ShieldCheck className="h-5 w-5 text-purple-600" /></div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Pending Approvals</p>
            <p className="text-2xl font-extrabold text-slate-800 mt-1">{stats.pendingCount}</p>
          </div>
          <div className="p-2 bg-amber-50 rounded-lg"><Clipboard className="h-5 w-5 text-amber-600" /></div>
        </div>
      </div>

      {/* Error Alert Container */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 text-xs">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Appointment Cards Section */}
      {loading ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
          <RefreshCw className="h-8 w-8 text-blue-600 animate-spin mx-auto mb-3" />
          <p className="text-xs font-semibold text-slate-600">Fetching records from gateway queue...</p>
        </div>
      ) : appointments.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center">
          <CalendarRange className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-700 mb-1">Queue Synchronizer Online</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto font-normal">
            No appointment records found for current parameters. Real-time patient check-in records will populate here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {appointments.map((apt) => {
              const patientName = apt.patient?.username || 'Unknown Patient';
              const doctorName = apt.doctor?.username ? `Dr. ${apt.doctor.username}` : 'Unassigned Doctor';
              const spec = apt.doctor?.doctorProfile?.specialization;
              const dateStr = apt.appointment_date 
                ? new Date(apt.appointment_date).toLocaleDateString(undefined, {
                    month: 'short', day: 'numeric', year: 'numeric'
                  })
                : 'Date Pending';

              return (
                <div
                  key={apt.id || Math.random()}
                  onClick={() => setSelectedAppointment(apt)}
                  className="bg-white border border-slate-200 hover:border-blue-400 rounded-xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
                >
                  <div className="flex items-start justify-between gap-2">
                    {/* Patient Detail */}
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-bold text-sm group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                        {patientName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                          {patientName}
                        </h4>
                        <p className="text-xs text-slate-400 font-normal">
                          {apt.patient?.email || apt.patient?.phone_number || 'No contact specified'}
                        </p>
                      </div>
                    </div>

                    {/* Status Pill */}
                    <span className="px-2.5 py-1 text-[10px] font-bold uppercase rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                      {apt.status || 'Scheduled'}
                    </span>
                  </div>

                  {/* Doctor Info & Date */}
                  <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 text-xs">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Stethoscope className="h-4 w-4 text-slate-400 flex-shrink-0" />
                      <span className="truncate font-medium">{doctorName}</span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-600 justify-end">
                      <Clock className="h-4 w-4 text-slate-400 flex-shrink-0" />
                      <span className="font-medium">{dateStr}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Functional Pagination Bar */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <span>Showing limit per request:</span>
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setOffset(0);
                }}
                className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-slate-700 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <span className="ml-2 font-semibold text-slate-700">Page {currentPage}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevPage}
                disabled={offset === 0 || loading}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-slate-50 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>

              <button
                onClick={handleNextPage}
                disabled={!hasMore || loading}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-slate-50 transition-colors"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}