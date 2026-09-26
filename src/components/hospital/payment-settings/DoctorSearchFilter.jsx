import React from 'react';
import { Search, User, X } from 'lucide-react';

export default function DoctorSearchFilter({
  doctorSearchQuery,
  setDoctorSearchQuery,
  selectedEmails,
  setSelectedEmails,
  filteredDoctors,
  toggleDoctorSelection
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
        Search & Select Doctors
      </label>

      {/* Search Box */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={doctorSearchQuery}
          onChange={(e) => setDoctorSearchQuery(e.target.value)}
          placeholder="Search doctor by name, email, or specialization..."
          className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
        />
      </div>

      {/* Selected Doctor Pills */}
      {selectedEmails.length > 0 && (
        <div className="flex flex-wrap gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200">
          {selectedEmails.map((email) => (
            <span
              key={email}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-200 rounded-md text-xs font-semibold text-slate-700 shadow-xs"
            >
              <User className="h-3 w-3 text-blue-500" />
              {email}
              <button
                type="button"
                onClick={() => setSelectedEmails((prev) => prev.filter((e) => e !== email))}
                className="text-slate-400 hover:text-slate-600 ml-1"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Doctor Directory Pick List */}
      <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-lg divide-y divide-slate-100 bg-white">
        {filteredDoctors.length === 0 ? (
          <div className="p-4 text-center text-xs text-slate-400">
            No matching doctors found in registry.
          </div>
        ) : (
          filteredDoctors.map((doc) => {
            const email = doc.email;
            const name = doc.username || `${doc.first_name || ''} ${doc.last_name || ''}`.trim();
            const isSelected = selectedEmails.includes(email);

            return (
              <div
                key={doc.id || email}
                onClick={() => toggleDoctorSelection(doc)}
                className={`p-3 flex items-center justify-between cursor-pointer text-xs transition-colors ${
                  isSelected ? 'bg-blue-50/70' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                    {name ? name.charAt(0).toUpperCase() : 'D'}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">{name || 'Doctor'}</p>
                    <p className="text-[11px] text-slate-400">{email || 'No email'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">
                    {doc.doctorProfile?.specialization || 'General'}
                  </span>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {}}
                    className="h-4 w-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}