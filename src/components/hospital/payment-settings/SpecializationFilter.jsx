import React from 'react';
import { Stethoscope } from 'lucide-react';

const COMMON_SPECIALIZATIONS = [
  "Ayurveda",
  "Cardiology",
  "Dentistry",
  "Dermatology",
  "Diabetology",
  "Diet & Nutrition",
  "Endocrinology",
  "ENT",
  "Gastroenterology",
  "General Physician",
  "General Surgery",
  "Gynecology",
  "Homeopathy",
  "Internal Medicine",
  "Nephrology",
  "Neurology",
  "Obstetrics",
  "Oncology",
  "Ophthalmology",
  "Orthopedics",
  "Pediatrics",
  "Physiotherapy",
  "Plastic Surgery",
  "Psychiatry",
  "Psychology",
  "Pulmonology",
  "Rheumatology",
  "Sexology",
  "Siddha",
  "Unani",
  "Urology"
];

export default function SpecializationFilter({ selectedSpecs, toggleSpecialization }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-3">
      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
        Select Specializations
      </label>
      <div className="flex flex-wrap gap-2">
        {COMMON_SPECIALIZATIONS.map((spec) => {
          const isSelected = selectedSpecs.includes(spec);
          return (
            <button
              key={spec}
              type="button"
              onClick={() => toggleSpecialization(spec)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                isSelected
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Stethoscope className="h-3.5 w-3.5" />
              {spec}
            </button>
          );
        })}
      </div>
    </div>
  );
}