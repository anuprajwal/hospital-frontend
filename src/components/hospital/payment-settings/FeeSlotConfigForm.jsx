import React from 'react';
import { Sliders, Clock, Award, Save, RefreshCw } from 'lucide-react';

const slotOptions = [
  { label: '15 mins', value: '15' },
  { label: '20 mins', value: '20' },
  { label: '30 mins', value: '30' },
  { label: '45 mins', value: '45' },
  { label: '60 mins', value: '60' },
];

export default function FeeSlotConfigForm({
  slotFee,
  setSlotFee,
  slotTime,
  setSlotTime,
  calculatedExperience,
  establishmentYear,
  saving
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
      <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
        <Sliders className="h-5 w-5 text-blue-600" />
        <h2 className="text-base font-bold text-slate-800">2. Configure Fee & Slot Parameters</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Consultation Fee Input */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Consultation Fee
          </label>
          <div className="relative rounded-lg shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 font-bold">
              ₹
            </div>
            <input
              type="number"
              min="0"
              value={slotFee}
              onChange={(e) => setSlotFee(e.target.value)}
              placeholder="0"
              className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              required
            />
          </div>
          <p className="text-[11px] text-slate-400">Consultation fee in INR for target selection.</p>
        </div>

        {/* Slot Duration Select */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Slot Duration
          </label>
          <div className="relative">
            <select
              value={slotTime}
              onChange={(e) => setSlotTime(e.target.value)}
              className="w-full pl-3 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer"
            >
              {slotOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <p className="text-[11px] text-slate-400">Time window allocated per patient booking.</p>
        </div>

        {/* Calculated Experience Display */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Hospital Experience
          </label>
          <div className="p-2.5 bg-slate-100/70 border border-slate-200 rounded-lg flex items-center gap-2.5">
            <Award className="h-4 w-4 text-amber-500 flex-shrink-0" />
            <span className="text-sm font-bold text-slate-800">
              {calculatedExperience || 'N/A'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            Auto-calculated from establishment year ({establishmentYear ? new Date(establishmentYear).getFullYear() : 'N/A'}).
          </p>
        </div>
      </div>

      {/* Action Button */}
      <div className="pt-4 border-t border-slate-100 flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm disabled:opacity-50 transition-colors"
        >
          {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Apply & Save Configuration
        </button>
      </div>
    </div>
  );
}