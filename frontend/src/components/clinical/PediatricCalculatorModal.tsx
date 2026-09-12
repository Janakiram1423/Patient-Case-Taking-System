import React, { useState } from 'react';
import { Baby, Calculator, AlertTriangle, Pill, CheckCircle2 } from 'lucide-react';
import { PEDIATRIC_DOSE_RULES, calculatePediatricDose } from '../../data/pediatricDosing';
import { Modal } from '../common/Modal';

interface PediatricCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultWeightKg?: number;
}

export const PediatricCalculatorModal: React.FC<PediatricCalculatorModalProps> = ({
  isOpen,
  onClose,
  defaultWeightKg = 14
}) => {
  const [weightKg, setWeightKg] = useState<number>(defaultWeightKg);
  const [selectedRuleIndex, setSelectedRuleIndex] = useState<number>(0);

  const selectedRule = PEDIATRIC_DOSE_RULES[selectedRuleIndex];
  const calculation = calculatePediatricDose(selectedRule, weightKg);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Pediatric Weight-Based Dosage Calculator"
      subtitle="Accurate mg/kg pediatric syrup volume calculator"
      maxWidth="lg"
      icon={<Baby className="w-5 h-5 text-sky-600" />}
    >
      <div className="space-y-4 text-xs">
        {/* Weight Input Box */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-50 to-teal-50 border border-sky-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <label className="block text-xs font-bold text-sky-950 mb-1">
              Child's Body Weight (kg):
            </label>
            <p className="text-[11px] text-sky-700">Enter accurate weight measured on clinic scale</p>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={2}
              max={60}
              step={0.5}
              value={weightKg}
              onChange={e => setWeightKg(Math.max(2, parseFloat(e.target.value) || 10))}
              className="w-24 p-2 text-base font-black text-slate-900 bg-white border border-sky-300 rounded-xl outline-none text-center shadow-xs"
            />
            <span className="font-extrabold text-sky-900">kg</span>
          </div>
        </div>

        {/* Drug Selection Tabs */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Select Pediatric Medication:
          </label>
          <div className="flex flex-wrap gap-1.5">
            {PEDIATRIC_DOSE_RULES.map((rule, idx) => (
              <button
                key={rule.drugName}
                type="button"
                onClick={() => setSelectedRuleIndex(idx)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedRuleIndex === idx
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {rule.drugName.split('(')[0].trim()}
              </button>
            ))}
          </div>
        </div>

        {/* Calculated Result Card */}
        <div className="p-5 rounded-2xl bg-white border-2 border-sky-500 shadow-md space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <h4 className="font-black text-sm text-slate-900">{selectedRule.drugName}</h4>
              <p className="text-[11px] text-slate-500">{selectedRule.indication}</p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-sky-100 text-sky-800 text-[10px] font-extrabold">
              {selectedRule.recommendedMgPerKgPerDose} mg/kg/dose
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 py-1">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Single Dose (mg)</span>
              <span className="text-xl font-black text-sky-900">{calculation.calculatedMg} mg</span>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-center">
              <span className="text-[10px] font-bold text-emerald-700 uppercase block">Syrup Volume (ml)</span>
              <span className="text-xl font-black text-emerald-800">{calculation.volumeMl} ml</span>
            </div>
          </div>

          <div className="text-[11px] text-slate-600 space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
            <p><span className="font-bold text-slate-800">Frequency:</span> {calculation.frequency}</p>
            <p><span className="font-bold text-slate-800">Syrup Strength:</span> {calculation.concentration}</p>
            <p><span className="font-bold text-slate-800">Physician Note:</span> {calculation.instructions}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors"
        >
          Close Calculator
        </button>
      </div>
    </Modal>
  );
};
