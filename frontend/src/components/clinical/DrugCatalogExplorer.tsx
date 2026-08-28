import React, { useState } from 'react';
import { Pill, Search, ShieldCheck, AlertTriangle, BookOpen, Check } from 'lucide-react';
import { DRUG_CATALOG, DrugCatalogItem } from '../../data/drugDatabase';
import { KNOWN_DRUG_INTERACTIONS } from '../../data/drugInteractions';
import { Badge } from '../common/Badge';

export const DrugCatalogExplorer: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDrug, setSelectedDrug] = useState<DrugCatalogItem | null>(DRUG_CATALOG[0]);

  const categories = ['All', ...Array.from(new Set(DRUG_CATALOG.map(d => d.category)))];

  const filteredDrugs = DRUG_CATALOG.filter(d => {
    const matchesSearch =
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.generic_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.commonIndications.some(i => i.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCat = selectedCategory === 'All' || d.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-lg border border-teal-200 shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Verified Pharmacopeia & Drug Formulary
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Standard dosages, clinical indications, routes of administration, and safety parameters.
            </p>
          </div>
        </div>

        <Badge variant="primary" size="lg">
          {DRUG_CATALOG.length} Standard Formulations
        </Badge>
      </div>

      {/* Search & Category Filter */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search medicine name, generic molecule, or indication (e.g. Paracetamol, Asthma, Pain)..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-teal-500 font-medium"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          className="p-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl outline-none w-full sm:w-auto"
        >
          {categories.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Drug List & Detailed Monograph Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
        {/* Drug Catalog List */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-2 max-h-[600px] overflow-y-auto">
          {filteredDrugs.map(drug => {
            const isSelected = selectedDrug?.id === drug.id;
            return (
              <button
                key={drug.id}
                type="button"
                onClick={() => setSelectedDrug(drug)}
                className={`w-full text-left p-3 rounded-xl border transition-all ${
                  isSelected
                    ? 'bg-teal-50 border-teal-400 shadow-2xs'
                    : 'bg-slate-50/70 border-slate-100 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{drug.name}</span>
                  <Badge variant="neutral" size="sm">{drug.form}</Badge>
                </div>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">{drug.generic_name}</p>
                <span className="text-[10px] text-teal-800 font-bold block mt-1">
                  {drug.strength} • {drug.defaultFrequency}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Drug Detailed Monograph */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          {selectedDrug ? (
            <>
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-lg font-black text-slate-900">{selectedDrug.name}</h3>
                  <p className="text-xs font-semibold text-teal-700">{selectedDrug.generic_name}</p>
                  <p className="text-[11px] text-slate-400 mt-1">Category: {selectedDrug.category}</p>
                </div>
                <span className="px-3 py-1 rounded-xl bg-teal-100 text-teal-900 font-black text-xs">
                  {selectedDrug.strength}
                </span>
              </div>

              {/* Grid of Attributes */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Form</span>
                  <span className="font-bold text-slate-900 text-xs">{selectedDrug.form}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Route</span>
                  <span className="font-bold text-slate-900 text-xs">{selectedDrug.route}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Standard Frequency</span>
                  <span className="font-bold text-sky-800 text-xs font-mono">{selectedDrug.defaultFrequency}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Meal Timing</span>
                  <span className="font-bold text-slate-900 text-xs">{selectedDrug.defaultInstruction}</span>
                </div>
              </div>

              {/* Indications */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wide text-teal-900">
                  Common Clinical Indications
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedDrug.commonIndications.map((ind, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-semibold">
                      ✓ {ind}
                    </span>
                  ))}
                </div>
              </div>

              {/* Standard Duration */}
              <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-teal-950 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold block">Standard Recommended Course:</span>
                  <span className="text-xs font-medium">{selectedDrug.defaultDurationValue} {selectedDrug.defaultDurationUnit} ({selectedDrug.defaultInstruction})</span>
                </div>
                <Badge variant="success" size="sm">Verified Form</Badge>
              </div>
            </>
          ) : (
            <p className="text-slate-500">Select a drug to view monograph.</p>
          )}
        </div>
      </div>
    </div>
  );
};
