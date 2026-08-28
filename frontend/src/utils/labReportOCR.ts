import {
  LAB_TEST_CATALOG,
  AnalyteReportItem,
  InterpretedLabReport,
  LabTestDefinition
} from '../data/labReportKnowledge';

export function parseLabReportText(
  rawText: string,
  gender: 'Male' | 'Female' = 'Male',
  patientName: string = 'Patient'
): InterpretedLabReport {
  const lines = rawText.split('\n');
  const analytes: AnalyteReportItem[] = [];

  for (const def of LAB_TEST_CATALOG) {
    const range = gender === 'Female' ? def.femaleRange : def.maleRange;

    // Search for match in rawText
    for (const pattern of def.aliasRegex) {
      const match = rawText.match(new RegExp(`(?:${pattern.source})[\\s\\:\\-\\=]*([0-9]+(?:\\.[0-9]+)?)`, 'i'));
      if (match) {
        const val = parseFloat(match[1]);
        if (!isNaN(val)) {
          let status: AnalyteReportItem['status'] = 'Normal';
          let isPanic = false;

          if (def.criticalLow !== undefined && val <= def.criticalLow) {
            status = 'Critical Low';
            isPanic = true;
          } else if (def.criticalHigh !== undefined && val >= def.criticalHigh) {
            status = 'Critical High';
            isPanic = true;
          } else if (val > range.max) {
            status = 'High';
          } else if (val < range.min) {
            status = 'Low';
          }

          let interp = 'Within normal reference parameters.';
          if (status === 'High' || status === 'Critical High') {
            interp = def.clinicalSignificanceHigh;
          } else if (status === 'Low' || status === 'Critical Low') {
            interp = def.clinicalSignificanceLow;
          }

          analytes.push({
            definitionId: def.id,
            testName: def.name,
            category: def.category,
            measuredValue: val,
            measuredUnit: def.standardUnit,
            referenceRange: `${range.min} - ${range.max} ${def.standardUnit}`,
            status,
            clinicalInterpretation: interp,
            isPanicAlert: isPanic
          });
          break;
        }
      }
    }
  }

  const panicAlertCount = analytes.filter(a => a.isPanicAlert).length;
  const abnormalCount = analytes.filter(a => a.status !== 'Normal').length;

  // Generate impression
  let impression = 'All measured laboratory analytes are within normal expected limits.';
  let suggestedAction = 'Routine follow-up as clinically indicated.';
  const differentialsUpdated: string[] = [];

  const hasCritPlatelets = analytes.some(a => a.definitionId === 'lab-plt' && a.status.includes('Critical'));
  const hasCritTroponin = analytes.some(a => a.definitionId === 'lab-trop-i' && (a.status === 'High' || a.status === 'Critical High'));
  const hasCritCreat = analytes.some(a => a.definitionId === 'lab-creat' && a.status.includes('High'));
  const hasHighK = analytes.some(a => a.definitionId === 'lab-potassium' && a.status.includes('High'));
  const hasHighSGPT = analytes.some(a => a.definitionId === 'lab-sgpt' && a.status.includes('High'));

  if (hasCritPlatelets) {
    impression = 'CRITICAL PANIC: Severe Thrombocytopenia (< 50,000/cu.mm). High risk for spontaneous bleeding / Dengue Hemorrhagic shock.';
    suggestedAction = 'Strict bed rest, isotonic crystalloid fluid resuscitation, cross-match platelets, avoid all IM injections/NSAIDs.';
    differentialsUpdated.push('Dengue Fever with Severe Thrombocytopenia (A97.2)', 'Immune Thrombocytopenic Purpura');
  } else if (hasCritTroponin) {
    impression = 'CRITICAL CARDIAC ALERT: Significant Troponin I elevation confirming Acute Coronary Syndrome / Myocardial Infarction.';
    suggestedAction = 'Urgent 12-lead ECG, Dual Antiplatelet loading (Aspirin + Clopidogrel), statin loading, urgent Cath Lab mobilization.';
    differentialsUpdated.push('Acute Myocardial Infarction (I21.9)', 'Acute Coronary Syndrome');
  } else if (hasCritCreat || hasHighK) {
    impression = 'CRITICAL RENAL: Acute Kidney Injury with Impaired Electrolyte Clearance / Hyperkalemia.';
    suggestedAction = 'Immediate ECG monitoring for peaked T waves, Insulin-Dextrose, stop nephrotoxic drugs, urgent nephrology consult.';
    differentialsUpdated.push('Acute Kidney Injury (N17.9)', 'Hyperkalemia (E87.5)');
  } else if (hasHighSGPT) {
    impression = 'Hepatic transaminitis indicating acute hepatocellular injury or viral hepatitis.';
    suggestedAction = 'Viral hepatitis serology (HBsAg, Anti-HCV), liver ultrasound, avoid hepatotoxic medications.';
    differentialsUpdated.push('Acute Viral Hepatitis', 'Drug-Induced Liver Injury');
  } else if (abnormalCount > 0) {
    impression = `Identified ${abnormalCount} abnormal laboratory parameter(s) requiring physician review.`;
    suggestedAction = 'Correlate with clinical presentation and repeat testing as indicated.';
  }

  return {
    id: `ocr-${Date.now()}`,
    reportTitle: `Diagnostic Report Analysis — ${new Date().toLocaleDateString()}`,
    patientName,
    sampleDate: new Date().toISOString().split('T')[0],
    analytes,
    panicAlertCount,
    abnormalCount,
    aiClinicalImpression: impression,
    suggestedAction,
    differentialsUpdated
  };
}
