import re
from typing import Dict, Any, List

LAB_REFERENCE_DATABASE = {
    "hemoglobin": {"name": "Hemoglobin (Hb)", "category": "Hematology", "low": 12.0, "high": 16.5, "unit": "g/dL"},
    "wbc": {"name": "Total Leukocyte Count (TLC / WBC)", "category": "Hematology", "low": 4000, "high": 11000, "unit": "cells/cumm"},
    "platelets": {"name": "Platelet Count", "category": "Hematology", "low": 150000, "high": 450000, "unit": "/mcL"},
    "creatinine": {"name": "Serum Creatinine", "category": "Renal Function", "low": 0.6, "high": 1.2, "unit": "mg/dL"},
    "urea": {"name": "Blood Urea", "category": "Renal Function", "low": 15.0, "high": 40.0, "unit": "mg/dL"},
    "sgot": {"name": "SGOT / AST", "category": "Liver Function", "low": 5.0, "high": 40.0, "unit": "U/L"},
    "sgpt": {"name": "SGPT / ALT", "category": "Liver Function", "low": 7.0, "high": 56.0, "unit": "U/L"},
    "bilirubin": {"name": "Total Bilirubin", "category": "Liver Function", "low": 0.2, "high": 1.2, "unit": "mg/dL"},
    "glucose_fasting": {"name": "Fasting Blood Glucose", "category": "Endocrinology", "low": 70.0, "high": 100.0, "unit": "mg/dL"},
    "glucose_pp": {"name": "Post-Prandial Glucose", "category": "Endocrinology", "low": 80.0, "high": 140.0, "unit": "mg/dL"},
    "hba1c": {"name": "Glycated Hemoglobin (HbA1c)", "category": "Endocrinology", "low": 4.0, "high": 5.6, "unit": "%"},
    "total_cholesterol": {"name": "Total Cholesterol", "category": "Lipid Profile", "low": 125.0, "high": 200.0, "unit": "mg/dL"},
    "ldl": {"name": "LDL Cholesterol", "category": "Lipid Profile", "low": 50.0, "high": 100.0, "unit": "mg/dL"},
    "hdl": {"name": "HDL Cholesterol (Good)", "category": "Lipid Profile", "low": 40.0, "high": 60.0, "unit": "mg/dL"},
    "triglycerides": {"name": "Serum Triglycerides", "category": "Lipid Profile", "low": 50.0, "high": 150.0, "unit": "mg/dL"},
    "tsh": {"name": "Thyroid Stimulating Hormone (TSH)", "category": "Endocrinology", "low": 0.4, "high": 4.5, "unit": "uIU/mL"}
}

def analyze_lab_text_or_markers(raw_text: str) -> Dict[str, Any]:
    text = (raw_text or "").lower()
    extracted_tests: List[Dict[str, Any]] = []
    clinical_flags = []

    # Patterns for regex test matching
    patterns = {
        "hemoglobin": [r'(?:hb|hemoglobin)\s*[:=-]?\s*(\d+(?:\.\d+)?)'],
        "wbc": [r'(?:wbc|tlc|total count|leukocytes?)\s*[:=-]?\s*(\d+(?:,\d+)?|\d+)'],
        "platelets": [r'(?:platelets?|plt)\s*[:=-]?\s*(\d+(?:,\d+)?|\d+)'],
        "creatinine": [r'(?:creatinine|serum creat)\s*[:=-]?\s*(\d+(?:\.\d+)?)'],
        "urea": [r'(?:blood urea|urea)\s*[:=-]?\s*(\d+(?:\.\d+)?)'],
        "sgot": [r'(?:sgot|ast)\s*[:=-]?\s*(\d+(?:\.\d+)?)'],
        "sgpt": [r'(?:sgpt|alt)\s*[:=-]?\s*(\d+(?:\.\d+)?)'],
        "bilirubin": [r'(?:bilirubin|total bili)\s*[:=-]?\s*(\d+(?:\.\d+)?)'],
        "glucose_fasting": [r'(?:fasting blood sugar|fbs|fbg)\s*[:=-]?\s*(\d+(?:\.\d+)?)'],
        "hba1c": [r'(?:hba1c|glycated hb)\s*[:=-]?\s*(\d+(?:\.\d+)?)'],
        "total_cholesterol": [r'(?:cholesterol|total chol)\s*[:=-]?\s*(\d+(?:\.\d+)?)'],
        "ldl": [r'(?:ldl|ldl-c)\s*[:=-]?\s*(\d+(?:\.\d+)?)'],
        "tsh": [r'(?:tsh|thyroid)\s*[:=-]?\s*(\d+(?:\.\d+)?)']
    }

    test_idx = 1
    for key, p_list in patterns.items():
        ref = LAB_REFERENCE_DATABASE[key]
        for pattern in p_list:
            match = re.search(pattern, text)
            if match:
                val_str = match.group(1).replace(",", "")
                try:
                    val = float(val_str)
                    status = "Normal"
                    if val < ref["low"]:
                        status = "Low"
                        if val < (ref["low"] * 0.6):
                            status = "Critical Low"
                            clinical_flags.append(f"Critical Low: {ref['name']} ({val} {ref['unit']})")
                    elif val > ref["high"]:
                        status = "High"
                        if val > (ref["high"] * 1.5):
                            status = "Critical High"
                            clinical_flags.append(f"Critical High: {ref['name']} ({val} {ref['unit']})")

                    extracted_tests.append({
                        "test_id": f"OCR-{test_idx:03d}",
                        "category": ref["category"],
                        "test_name": ref["name"],
                        "result_value": str(val),
                        "unit": ref["unit"],
                        "reference_range": f"{ref['low']} - {ref['high']} {ref['unit']}",
                        "status": status,
                        "notes": "Extracted via Diagnostic OCR Analyzer"
                    })
                    test_idx += 1
                    break
                except ValueError:
                    pass

    # AI Diagnostic Differential Insights
    diagnostic_insights = []
    if any(t["test_name"] == "Hemoglobin (Hb)" and t["status"] in ["Low", "Critical Low"] for t in extracted_tests):
        diagnostic_insights.append("Microcytic / Normocytic Anemia detected. Suggest Iron profile (Serum Ferritin, TIBC) & stool occult blood.")
    if any(t["test_name"] == "Platelet Count" and t["status"] in ["Low", "Critical Low"] for t in extracted_tests):
        diagnostic_insights.append("Thrombocytopenia detected. Rule out acute Viral / Dengue fever, ITP, or drug-induced marrow suppression.")
    if any(t["test_name"] == "Serum Creatinine" and t["status"] in ["High", "Critical High"] for t in extracted_tests):
        diagnostic_insights.append("Renal impairment / Azotemia detected. Adjust renally cleared drugs and evaluate eGFR.")
    if any(t["test_name"] == "Glycated Hemoglobin (HbA1c)" and float(t["result_value"]) >= 6.5 for t in extracted_tests):
        diagnostic_insights.append("Diagnostic for Type 2 Diabetes Mellitus (HbA1c >= 6.5%). Initiate glycemic control protocol.")

    return {
        "extracted_tests": extracted_tests,
        "abnormal_count": sum(1 for t in extracted_tests if t["status"] != "Normal"),
        "critical_flags": clinical_flags,
        "diagnostic_insights": diagnostic_insights
    }
