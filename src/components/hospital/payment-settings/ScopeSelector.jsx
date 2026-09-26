import React from 'react';
import { Filter, Check } from 'lucide-react';

export default function ScopeSelector({ targetScope, setTargetScope, setSelectedSpecs, setSelectedEmails, setSelectedNames }) {
  const scopes = [
    {
      id: 'all',
      badge: 'Global',
      title: 'All Doctors',
      description: 'Apply fee & slot duration across the entire hospital network.',
    },
    {
      id: 'specialization',
      badge: 'Department',
      title: 'By Specialization',
      description: 'Target specific departments like Neurology or Cardiology.',
    },
    {
      id: 'doctors',
      badge: 'Individual',
      title: 'Search Doctor Name / Email',
      description: 'Set customized pricing for selected doctors specifically.',
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
        <Filter className="h-5 w-5 text-blue-600" />
        <h2 className="text-base font-bold text-slate-800">1. Select Target Doctors Filter</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {scopes.map((scope) => {
          const isSelected = targetScope === scope.id;
          return (
            <button
              key={scope.id}
              type="button"
              onClick={() => {
                setTargetScope(scope.id);
                if (scope.id === 'all') {
                  setSelectedSpecs([]);
                  setSelectedEmails([]);
                  setSelectedNames([]);
                } else if (scope.id === 'specialization') {
                  setSelectedEmails([]);
                  setSelectedNames([]);
                } else if (scope.id === 'doctors') {
                  setSelectedSpecs([]);
                }
              }}
              className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all ${
                isSelected
                  ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{scope.badge}</span>
                {isSelected && <Check className="h-4 w-4 text-blue-600" />}
              </div>
              <p className="text-sm font-bold text-slate-800 mt-2">{scope.title}</p>
              <p className="text-[11px] text-slate-400 mt-1">{scope.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}