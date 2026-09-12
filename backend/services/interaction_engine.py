from typing import List, Dict, Any

DRUG_DATABASE = [
    {"id": "med-01", "brand": "Augmentin 625", "generic": "Amoxicillin + Clavulanic Acid", "category": "Antibiotic", "forms": ["Tablet", "Syrup", "Injection"], "strengths": ["625mg", "1000mg", "228mg/5ml"]},
    {"id": "med-02", "brand": "Dolo 650", "generic": "Paracetamol", "category": "Antipyretic / Analgesic", "forms": ["Tablet", "Syrup", "Drops"], "strengths": ["650mg", "500mg", "120mg/5ml", "250mg/5ml"]},
    {"id": "med-03", "brand": "Pantocid 40", "generic": "Pantoprazole", "category": "Proton Pump Inhibitor (PPI)", "forms": ["Tablet", "Injection"], "strengths": ["40mg", "20mg"]},
    {"id": "med-04", "brand": "Azithral 500", "generic": "Azithromycin", "category": "Macrolide Antibiotic", "forms": ["Tablet", "Syrup"], "strengths": ["500mg", "250mg", "200mg/5ml"]},
    {"id": "med-05", "brand": "Telma 40", "generic": "Telmisartan", "category": "Antihypertensive (ARB)", "forms": ["Tablet"], "strengths": ["40mg", "20mg", "80mg"]},
    {"id": "med-06", "brand": "Glycomet 500", "generic": "Metformin", "category": "Antidiabetic (Biguanide)", "forms": ["Tablet", "SR Tablet"], "strengths": ["500mg", "850mg", "1000mg"]},
    {"id": "med-07", "brand": "Ecosprin 75", "generic": "Aspirin", "category": "Antiplatelet", "forms": ["Tablet"], "strengths": ["75mg", "150mg"]},
    {"id": "med-08", "brand": "Atorva 20", "generic": "Atorvastatin", "category": "Statin (Lipid Lowering)", "forms": ["Tablet"], "strengths": ["10mg", "20mg", "40mg", "80mg"]},
    {"id": "med-09", "brand": "Combiflam", "generic": "Ibuprofen + Paracetamol", "category": "NSAID", "forms": ["Tablet", "Syrup"], "strengths": ["400mg+325mg"]},
    {"id": "med-10", "brand": "Warf 5", "generic": "Warfarin", "category": "Anticoagulant", "forms": ["Tablet"], "strengths": ["1mg", "2mg", "5mg"]},
    {"id": "med-11", "brand": "Levolin Inhaler", "generic": "Levosalbutamol", "category": "Bronchodilator (SABA)", "forms": ["Inhaler", "Respules"], "strengths": ["50mcg", "0.63mg/2.5ml"]},
    {"id": "med-12", "brand": "Budecort Respules", "generic": "Budesonide", "category": "Inhaled Corticosteroid", "forms": ["Respules", "Inhaler"], "strengths": ["0.5mg/2ml", "1mg/2ml"]}
]

DRUG_INTERACTIONS_RULES = [
    {
        "drug1": "Aspirin",
        "drug2": "Warfarin",
        "severity": "Major",
        "effect": "Markedly increased risk of major gastrointestinal and systemic bleeding.",
        "management": "Avoid co-administration unless specifically indicated (e.g. mechanical heart valves). Monitor INR and signs of hemorrhage closely."
    },
    {
        "drug1": "Aspirin",
        "drug2": "Ibuprofen",
        "severity": "Major",
        "effect": "Additive gastric mucosal ulceration, GI bleeding, and antagonism of aspirin's irreversible antiplatelet effect.",
        "management": "Avoid simultaneous use. If NSAID is required, take Ibuprofen at least 2 hours after immediate-release Aspirin."
    },
    {
        "drug1": "Metformin",
        "drug2": "Contrast Media",
        "severity": "Major",
        "effect": "Risk of severe lactic acidosis in patients with acute renal deterioration following iodinated contrast.",
        "management": "Withhold Metformin 48 hours prior to and 48 hours post-contrast administration. Re-check serum creatinine before resuming."
    },
    {
        "drug1": "Atorvastatin",
        "drug2": "Clarithromycin",
        "severity": "Major",
        "effect": "Strong CYP3A4 inhibition increases statin serum levels, leading to high risk of rhabdomyolysis.",
        "management": "Temporarily suspend Atorvastatin during macrolide therapy or use Azithromycin as an alternative."
    },
    {
        "drug1": "Telmisartan",
        "drug2": "Spironolactone",
        "severity": "Moderate",
        "effect": "Synergistic potassium retention leading to hyperkalemia and cardiac arrhythmias.",
        "management": "Monitor serum potassium and renal function periodically."
    }
]

def check_drug_interactions(drug_names: List[str]) -> List[Dict[str, Any]]:
    normalized = [d.strip().lower() for d in drug_names if d and d.strip()]
    findings = []

    for rule in DRUG_INTERACTIONS_RULES:
        d1 = rule["drug1"].lower()
        d2 = rule["drug2"].lower()

        has_d1 = any(d1 in name for name in normalized)
        has_d2 = any(d2 in name for name in normalized)

        if has_d1 and has_d2:
            findings.append({
                "drug1": rule["drug1"],
                "drug2": rule["drug2"],
                "severity": rule["severity"],
                "effect": rule["effect"],
                "management": rule["management"]
            })

    return findings

def calculate_pediatric_dose(weight_kg: float, age_months: int, drug_key: str) -> Dict[str, Any]:
    if drug_key.lower() == "paracetamol":
        single_dose_mg = round(weight_kg * 15, 1) # 15 mg/kg
        daily_max_mg = round(weight_kg * 60, 1)
        syrup_120_ml = round((single_dose_mg / 120) * 5, 1) # 120mg/5ml
        syrup_250_ml = round((single_dose_mg / 250) * 5, 1) # 250mg/5ml
        return {
            "drug": "Paracetamol (Acetaminophen)",
            "weight_kg": weight_kg,
            "single_dose_mg": f"{single_dose_mg} mg every 4-6 hours (SOS)",
            "max_daily_dose_mg": f"{daily_max_mg} mg / 24 hrs",
            "formulation_guide": [
                f"Syrup (120 mg / 5 mL): Give {syrup_120_ml} mL per dose",
                f"Syrup DS (250 mg / 5 mL): Give {syrup_250_ml} mL per dose",
                f"Infant Drops (100 mg / 1 mL): Give {round(single_dose_mg / 100, 2)} mL per dose"
            ]
        }
    elif drug_key.lower() == "amoxicillin":
        daily_dose_mg = round(weight_kg * 40, 1) # 40 mg/kg/day divided TDS
        single_dose_mg = round(daily_dose_mg / 3, 1)
        syrup_125_ml = round((single_dose_mg / 125) * 5, 1)
        return {
            "drug": "Amoxicillin",
            "weight_kg": weight_kg,
            "total_daily_dose_mg": f"{daily_dose_mg} mg / day divided in 3 doses (TDS)",
            "single_dose_mg": f"{single_dose_mg} mg per dose (Every 8 hours)",
            "formulation_guide": [
                f"Dry Syrup (125 mg / 5 mL): Give {syrup_125_ml} mL thrice daily after food for 5-7 days"
            ]
        }
    else:
        return {
            "error": "Standard formulary dose not found for this compound. Please refer to Indian Academy of Pediatrics (IAP) drug formulary."
        }
