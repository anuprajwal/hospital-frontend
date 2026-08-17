import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

export default function DoctorActionCard({ request, onAction, loading }) {
  if (!request) return null;

  const currentStatus = (request.request_status || 'no_request').toLowerCase();

  const formatDate = (isoString) => {
    if (!isoString) return 'N/A';
    return new Date(isoString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Hospital Request Status:</span>
        <div className="flex items-center gap-2 mt-1">
          <span className={`text-xs font-bold uppercase px-2.5 py-0.5 rounded-full ${
            currentStatus === 'accepted' ? 'bg-emerald-100 text-emerald-800' :
            currentStatus === 'rejected' ? 'bg-rose-100 text-rose-800' :
            'bg-amber-100 text-amber-800'
          }`}>
            {currentStatus}
          </span>
          <span className="text-xs text-slate-500">Requested: {formatDate(request.created_at)}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {currentStatus === 'pending' && (
          <>
            <button
              disabled={loading}
              onClick={() => onAction('accepted')}
              className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors"
            >
              <CheckCircle className="h-4 w-4" /> Accept Request
            </button>
            <button
              disabled={loading}
              onClick={() => onAction('rejected')}
              className="inline-flex items-center gap-1 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors"
            >
              <XCircle className="h-4 w-4" /> Reject Request
            </button>
          </>
        )}

        {currentStatus === 'accepted' && (
          <button
            disabled={loading}
            onClick={() => onAction('rejected')}
            className="inline-flex items-center gap-1 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors"
          >
            <XCircle className="h-4 w-4" /> Reject / Remove Doctor
          </button>
        )}

        {currentStatus === 'rejected' && (
          <button
            disabled={loading}
            onClick={() => onAction('accepted')}
            className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors"
          >
            <CheckCircle className="h-4 w-4" /> Accept Doctor
          </button>
        )}
      </div>
    </div>
  );
}