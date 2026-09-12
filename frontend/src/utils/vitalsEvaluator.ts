export interface VitalsEvaluation {
  bmi: number;
  bmiCategory: string;
  bmiBadgeColor: string;
  bpClassification: 'Normal' | 'Elevated' | 'Stage 1 HTN' | 'Stage 2 HTN' | 'Hypertensive Crisis' | 'Hypotension';
  bpBadgeColor: string;
  feverClassification: 'Normal' | 'Low Grade Fever' | 'Moderate Fever' | 'High Grade Fever' | 'Hypothermia';
  feverBadgeColor: string;
  spo2Classification: 'Normal (95-100%)' | 'Mild Hypoxia (92-94%)' | 'Moderate Hypoxia (88-91%)' | 'Severe Hypoxia (<88%)';
  spo2BadgeColor: string;
  pulseClassification: 'Normal (60-100 bpm)' | 'Bradycardia (<60 bpm)' | 'Tachycardia (>100 bpm)';
  pulseBadgeColor: string;
  hasCriticalAlert: boolean;
  criticalAlerts: string[];
}

export function evaluateVitals(
  heightCm: number,
  weightKg: number,
  tempF: number,
  bpSys: number,
  bpDia: number,
  pulse: number,
  spo2: number,
  respRate?: number
): VitalsEvaluation {
  const criticalAlerts: string[] = [];

  // 1. BMI Calculation (weight in kg / (height in m)^2)
  let bmi = 0;
  let bmiCategory = 'Normal';
  let bmiBadgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-300';

  if (heightCm > 0 && weightKg > 0) {
    const heightM = heightCm / 100;
    bmi = parseFloat((weightKg / (heightM * heightM)).toFixed(1));

    if (bmi < 18.5) {
      bmiCategory = 'Underweight (<18.5)';
      bmiBadgeColor = 'bg-amber-100 text-amber-800 border-amber-300';
    } else if (bmi >= 18.5 && bmi <= 24.9) {
      bmiCategory = 'Normal (18.5 - 24.9)';
      bmiBadgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-300';
    } else if (bmi >= 25 && bmi <= 29.9) {
      bmiCategory = 'Overweight (25.0 - 29.9)';
      bmiBadgeColor = 'bg-amber-100 text-amber-800 border-amber-300';
    } else if (bmi >= 30 && bmi <= 34.9) {
      bmiCategory = 'Obesity Class I (30.0 - 34.9)';
      bmiBadgeColor = 'bg-orange-100 text-orange-800 border-orange-300';
    } else if (bmi >= 35 && bmi <= 39.9) {
      bmiCategory = 'Obesity Class II (35.0 - 39.9)';
      bmiBadgeColor = 'bg-red-100 text-red-800 border-red-300';
    } else if (bmi >= 40) {
      bmiCategory = 'Morbid Obesity (Class III ≥40)';
      bmiBadgeColor = 'bg-red-200 text-red-900 border-red-400 font-semibold';
      criticalAlerts.push('Severe Class III Morbid Obesity (BMI ≥ 40)');
    }
  }

  // 2. Blood Pressure Evaluation (AHA/ACC Guidelines)
  let bpClassification: VitalsEvaluation['bpClassification'] = 'Normal';
  let bpBadgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-300';

  if (bpSys > 0 && bpDia > 0) {
    if (bpSys < 90 || bpDia < 60) {
      bpClassification = 'Hypotension';
      bpBadgeColor = 'bg-blue-100 text-blue-800 border-blue-300';
      criticalAlerts.push(`Hypotension detected (${bpSys}/${bpDia} mmHg) - Check hydration & perfusion`);
    } else if (bpSys > 180 || bpDia > 120) {
      bpClassification = 'Hypertensive Crisis';
      bpBadgeColor = 'bg-red-200 text-red-900 border-red-500 font-bold animate-pulse';
      criticalAlerts.push(`CRITICAL: Hypertensive Crisis (${bpSys}/${bpDia} mmHg) - Urgent intervention required!`);
    } else if (bpSys >= 140 || bpDia >= 90) {
      bpClassification = 'Stage 2 HTN';
      bpBadgeColor = 'bg-red-100 text-red-800 border-red-300 font-semibold';
    } else if ((bpSys >= 130 && bpSys <= 139) || (bpDia >= 80 && bpDia <= 89)) {
      bpClassification = 'Stage 1 HTN';
      bpBadgeColor = 'bg-orange-100 text-orange-800 border-orange-300';
    } else if (bpSys >= 120 && bpSys <= 129 && bpDia < 80) {
      bpClassification = 'Elevated';
      bpBadgeColor = 'bg-yellow-100 text-yellow-800 border-yellow-300';
    } else {
      bpClassification = 'Normal';
      bpBadgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-300';
    }
  }

  // 3. Fever Evaluation
  let feverClassification: VitalsEvaluation['feverClassification'] = 'Normal';
  let feverBadgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-300';

  if (tempF > 0) {
    if (tempF < 95.0) {
      feverClassification = 'Hypothermia';
      feverBadgeColor = 'bg-blue-100 text-blue-800 border-blue-300';
      criticalAlerts.push(`Hypothermia (${tempF}°F)`);
    } else if (tempF >= 103.0) {
      feverClassification = 'High Grade Fever';
      feverBadgeColor = 'bg-red-200 text-red-900 border-red-400 font-bold';
      criticalAlerts.push(`High Grade Fever (${tempF}°F) - Check for severe infection/sepsis`);
    } else if (tempF >= 100.5) {
      feverClassification = 'Moderate Fever';
      feverBadgeColor = 'bg-orange-100 text-orange-800 border-orange-300 font-semibold';
    } else if (tempF >= 99.1) {
      feverClassification = 'Low Grade Fever';
      feverBadgeColor = 'bg-amber-100 text-amber-800 border-amber-300';
    } else {
      feverClassification = 'Normal';
      feverBadgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-300';
    }
  }

  // 4. SpO2 Oxygen Saturation Evaluation
  let spo2Classification: VitalsEvaluation['spo2Classification'] = 'Normal (95-100%)';
  let spo2BadgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-300';

  if (spo2 > 0) {
    if (spo2 < 88) {
      spo2Classification = 'Severe Hypoxia (<88%)';
      spo2BadgeColor = 'bg-red-200 text-red-900 border-red-500 font-bold animate-pulse';
      criticalAlerts.push(`CRITICAL: Severe Hypoxia (SpO2 ${spo2}%) - Supplemental Oxygen STAT!`);
    } else if (spo2 >= 88 && spo2 <= 91) {
      spo2Classification = 'Moderate Hypoxia (88-91%)';
      spo2BadgeColor = 'bg-red-100 text-red-800 border-red-300 font-semibold';
      criticalAlerts.push(`Moderate Hypoxia (SpO2 ${spo2}%) - Respiratory monitoring advised`);
    } else if (spo2 >= 92 && spo2 <= 94) {
      spo2Classification = 'Mild Hypoxia (92-94%)';
      spo2BadgeColor = 'bg-amber-100 text-amber-800 border-amber-300';
    } else {
      spo2Classification = 'Normal (95-100%)';
      spo2BadgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-300';
    }
  }

  // 5. Pulse / Heart Rate Evaluation
  let pulseClassification: VitalsEvaluation['pulseClassification'] = 'Normal (60-100 bpm)';
  let pulseBadgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-300';

  if (pulse > 0) {
    if (pulse < 50) {
      pulseClassification = 'Bradycardia (<60 bpm)';
      pulseBadgeColor = 'bg-purple-100 text-purple-800 border-purple-300 font-semibold';
      criticalAlerts.push(`Marked Bradycardia (${pulse} bpm)`);
    } else if (pulse < 60) {
      pulseClassification = 'Bradycardia (<60 bpm)';
      pulseBadgeColor = 'bg-purple-100 text-purple-800 border-purple-300';
    } else if (pulse > 120) {
      pulseClassification = 'Tachycardia (>100 bpm)';
      pulseBadgeColor = 'bg-red-100 text-red-800 border-red-300 font-semibold';
      criticalAlerts.push(`Severe Tachycardia (${pulse} bpm)`);
    } else if (pulse > 100) {
      pulseClassification = 'Tachycardia (>100 bpm)';
      pulseBadgeColor = 'bg-orange-100 text-orange-800 border-orange-300';
    } else {
      pulseClassification = 'Normal (60-100 bpm)';
      pulseBadgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-300';
    }
  }

  // Respiratory rate alert
  if (respRate && respRate > 28) {
    criticalAlerts.push(`Tachypnea: Respiratory Rate ${respRate}/min`);
  }

  return {
    bmi,
    bmiCategory,
    bmiBadgeColor,
    bpClassification,
    bpBadgeColor,
    feverClassification,
    feverBadgeColor,
    spo2Classification,
    spo2BadgeColor,
    pulseClassification,
    pulseBadgeColor,
    hasCriticalAlert: criticalAlerts.length > 0,
    criticalAlerts
  };
}
