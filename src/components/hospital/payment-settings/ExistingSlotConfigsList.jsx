import React from 'react';
import { Stethoscope, User, Globe, Clock, IndianRupee } from 'lucide-react';

/**
 * Robust JSON parser that handles null, undefined, plain arrays/objects,
 * and double-stringified/escaped JSON strings.
 */
const parseConfigData = (rawData) => {
  if (!rawData || rawData === 'null' || rawData === '[]' || rawData === '{}') return [];
  console.log('Parsing rawData:', rawData);
  let current = rawData;


  // Unroll double-stringified JSON if necessary
  while (typeof current === 'string') {
    try {
      const parsed = JSON.parse(current);
      if (parsed === current) break;
      current = parsed;
    } catch (err) {
      console.error('Error parsing JSON string in parseConfigData:', err);
      return [];
    }
  }

  if (Array.isArray(current)) return current;
  if (typeof current === 'object' && current !== null) return [current];

  return [];
};

export default function ExistingSlotConfigsList({ configResponse }) {
  const configData = configResponse.data.data

  const overallConfigs = parseConfigData(configData.overall);
  const specialisationConfigs = parseConfigData(configData.specialisation);
  const individualConfigs = parseConfigData(configData.individual);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
      <div className="border-b border-slate-100 pb-3">
        <h2 className="text-base font-bold text-slate-800">Active Slot & Fee Configurations</h2>
        <p className="text-xs text-slate-500 font-normal">
          Overview of global settings, specialization rules, and individual doctor configurations.
        </p>
      </div>

      <div className="space-y-6">
        {/* CASE 1: Overall / Global Settings */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-blue-600" />
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              1. Global Default (All Doctors)
            </h3>
          </div>

          {overallConfigs ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <div className="p-3 bg-blue-50/50 border border-blue-200 rounded-lg flex justify-between items-center text-xs">
                  <div>
                    <p className="font-semibold text-slate-700">Hospital Global Default</p>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <Clock className="h-3 w-3" /> {overallConfigs.slot_time || overallConfigs.slotTime || 'N/A'} mins
                    </p>
                  </div>
                  <span className="font-bold text-blue-700 flex items-center text-sm">
                    <IndianRupee className="h-3.5 w-3.5" />
                    {overallConfigs.slot_fee ?? overallConfigs.slotFee ?? '0'}
                  </span>
                </div>
            </div>
          ) : (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-400">
              No global fallback fee configured. Default workspace pricing applies.
            </div>
          )}
        </div>

        {/* CASE 2: Specializations Line-by-Line Breakdown */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Stethoscope className="h-4 w-4 text-emerald-600" />
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              2. Specialization Pricing Breakdown
            </h3>
          </div>

          {specialisationConfigs.length > 0 ? (
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg bg-slate-50/50">
              {specialisationConfigs.map((spec, index) => (
                <div key={index} className="p-3 flex items-center justify-between text-xs hover:bg-white transition-colors">
                  <div className="flex items-center gap-2.5">
                    <div className="h-7 w-7 rounded-lg bg-emerald-100/70 text-emerald-700 flex items-center justify-center font-bold">
                      <Stethoscope className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">
                        {spec.name || spec.specialisation || spec.department || 'Specialization'}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Duration: {spec.slot_time || spec.slotTime || '15'} mins
                      </p>
                    </div>
                  </div>
                  <div className="font-bold text-slate-800 flex items-center text-sm bg-white px-2.5 py-1 rounded-md border border-slate-200">
                    <IndianRupee className="h-3.5 w-3.5 text-slate-500" />
                    {spec.slot_fee ?? spec.slotFee ?? '0'}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-400">
              No department-level custom fees configured.
            </div>
          )}
        </div>

        {/* CASE 3: Individual Doctors Override List */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-purple-600" />
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              3. Individual Doctor Overrides
            </h3>
          </div>

          {individualConfigs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {individualConfigs.map((doc, index) => (
                <div key={doc.email || index} className="p-3.5 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-xs shadow-2xs">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                      {doc.name ? doc.name.charAt(0).toUpperCase() : 'D'}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{doc.name || 'Doctor'}</p>
                      <p className="text-[11px] text-slate-400">{doc.email}</p>
                      <div className="flex items-center gap-1.5 mt-1 text-[10px] text-slate-500 font-medium">
                        <Clock className="h-3 w-3 text-slate-400" />
                        <span>Slot: {doc.slot_time} mins</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Fee</span>
                    <span className="font-bold text-purple-700 text-sm flex items-center justify-end">
                      <IndianRupee className="h-3.5 w-3.5" />
                      {doc.slot_fee}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-400">
              No individual doctor fee overrides set.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}