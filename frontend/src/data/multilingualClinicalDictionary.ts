import { LanguageOption, VoiceScribeScenario } from '../types';

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  {
    code: 'en-IN',
    speechCode: 'en-IN',
    name: 'English (India)',
    nativeName: 'English (India)',
    flag: '🇮🇳',
    samplePrompt: 'Patient has high grade fever for 3 days with productive cough and mild breathlessness. BP 130/85, Pulse 92, SpO2 96%.'
  },
  {
    code: 'hi-IN',
    speechCode: 'hi-IN',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    flag: '🇮🇳',
    samplePrompt: 'मरीज को 3 दिन से तेज बुखार, सूखी खांसी और गले में दर्द है। रक्तचाप 130/80, पल्स 88, SpO2 98 प्रतिशत है।'
  },
  {
    code: 'hinglish',
    speechCode: 'hi-IN',
    name: 'Hinglish (Colloquial Hindi-English)',
    nativeName: 'Hinglish',
    flag: '🇮🇳',
    samplePrompt: 'Patient ko 4 din se severe sir dard aur ulti ka man ho raha hai. BP 140/90, Pulse 94, Temp 101.5 F.'
  },
  {
    code: 'ta-IN',
    speechCode: 'ta-IN',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    flag: '🇮🇳',
    samplePrompt: 'நோயாளிக்கு 3 நாட்களாக கடுமையான காய்ச்சல் மற்றும் இருமல் உள்ளது. இரத்த அழுத்தம் 120/80, பல்ஸ் 84.'
  },
  {
    code: 'te-IN',
    speechCode: 'te-IN',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    flag: '🇮🇳',
    samplePrompt: 'రోగికి 4 రోజులుగా తీవ్రమైన జ్వరం మరియు దగ్గు ఉంది. రక్తపోటు 130/85, పల్స్ 90.'
  },
  {
    code: 'bn-IN',
    speechCode: 'bn-IN',
    name: 'Bengali',
    nativeName: 'বাংলা',
    flag: '🇮🇳',
    samplePrompt: 'রোগীর ৩ দিন ধরে তীব্র জ্বর এবং কাশি হচ্ছে। রক্তচাপ ১২০/৮০, নাড়ির গতি ৮৬।'
  },
  {
    code: 'mr-IN',
    speechCode: 'mr-IN',
    name: 'Marathi',
    nativeName: 'मराठी',
    flag: '🇮🇳',
    samplePrompt: 'रुग्णाला ३ दिवसांपासून तीव्र ताप आणि डोकेदुखी आहे. रक्तदाब १३०/८०, नाडी ८८.'
  },
  {
    code: 'gu-IN',
    speechCode: 'gu-IN',
    name: 'Gujarati',
    nativeName: 'ગુજરાતી',
    flag: '🇮🇳',
    samplePrompt: 'દર્દીને ૩ દિવસથી સખત તાવ અને ઉધરસ છે. બ્લડ પ્રેશર ૧૨૫/૮૦, પલ્સ ૮૨.'
  },
  {
    code: 'kn-IN',
    speechCode: 'kn-IN',
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    flag: '🇮🇳',
    samplePrompt: 'ರೋಗಿಗೆ 3 ದಿನಗಳಿಂದ ತೀವ್ರ ಜ್ವರ ಮತ್ತು ತಲೆನೋವು ಇದೆ. ರಕ್ತದೊತ್ತಡ 120/80, ನಾಡಿ 86.'
  },
  {
    code: 'ml-IN',
    speechCode: 'ml-IN',
    name: 'Malayalam',
    nativeName: 'മലയാളം',
    flag: '🇮🇳',
    samplePrompt: 'രോഗിക്ക് 3 ദിവസമായി കടുത്ത പനിയും തലവേദനയും ഉണ്ട്. രക്തസമ്മർദ്ദം 120/80.'
  },
  {
    code: 'pa-IN',
    speechCode: 'pa-IN',
    name: 'Punjabi',
    nativeName: 'ਪੰਜਾਬੀ',
    flag: '🇮🇳',
    samplePrompt: 'ਮਰੀਜ਼ ਨੂੰ 3 ਦਿਨਾਂ ਤੋਂ ਤੇਜ਼ ਬੁਖਾਰ ਅਤੇ ਖੰਘ ਹੈ। ਬੀਪੀ 130/80, ਨਬਜ਼ 88.'
  },
  {
    code: 'en-US',
    speechCode: 'en-US',
    name: 'English (US / Global)',
    nativeName: 'English (US)',
    flag: '🌐',
    samplePrompt: 'Patient presents with severe crushing retrosternal chest pain radiating to left arm for 2 hours with diaphoresis.'
  }
];

export interface SymptomTranslationEntry {
  canonicalEnglish: string;
  category: string;
  icdCode?: string;
  patterns: RegExp[];
  severityDefault?: 'Mild' | 'Moderate' | 'Severe' | 'Critical';
}

export const MULTILINGUAL_SYMPTOM_LEXICON: SymptomTranslationEntry[] = [
  // 1. Fever / Pyrexia
  {
    canonicalEnglish: 'Acute Fever with Chills',
    category: 'Infectious Disease',
    icdCode: 'R50.9',
    patterns: [
      /fever|pyrexia|chills|shivering|high temp/i,
      /बुखार|बुख़ार|तेज बुखार|ठंड लगकर बुखार|जाड़ा|तप/i,
      /bukhar|bukhaar|tez bukhar|thand lagna|thandi lag rahi/i,
      /காய்ச்சல்|குளிர் காய்ச்சல்/i,
      /kaichal|kulir kaichal/i,
      /జ్వరం|చలి జ్వరం/i,
      /jwaram|chali jwaram/i,
      /জ্বর|ঠান্ডা লাগা/i,
      /jwor|thand lagche/i,
      /ताप|थंडी वाजून ताप/i,
      /taap|thandi vaajun taap/i,
      /તાવ|ઠંડી લાગવી/i,
      /taav/i,
      /ಜ್ವರ/i,
      /പനി/i,
      /pani/i,
      /ਬੁਖਾਰ/i
    ]
  },
  // 2. Headache / Cephalea
  {
    canonicalEnglish: 'Severe Throbbing Headache',
    category: 'Neurology',
    icdCode: 'R51',
    patterns: [
      /headache|head pain|migraine|cephalea/i,
      /सिर दर्द|सर दर्द|माइग्रेन|सिर घूमना|आधा शीशी/i,
      /sir dard|sar dard|sar me dard|migraine/i,
      /தலைவலி|தலை பாரம்/i,
      /thalai vali|thalai vali irukku/i,
      /తలనొప్పి/i,
      /talanopii|tala noppi/i,
      /মাথাব্যথা|মাথা ধরা/i,
      /matha byatha/i,
      /डोकेदुखी|डोकं दुखणे/i,
      /dokedukhi/i,
      /માથાનો દુખાવો/i,
      /ತಲೆನೋವು/i,
      /തലവേദന/i,
      /thalavedana/i,
      /ਸਿਰ ਦਰਦ/i
    ]
  },
  // 3. Cough & Respiratory Symptoms
  {
    canonicalEnglish: 'Cough with Phlegm & Throat Irritation',
    category: 'Pulmonology',
    icdCode: 'R05',
    patterns: [
      /cough|coughing|phlegm|sputum|wheezing|sore throat/i,
      /खांसी|खाँसी|बलगम|कफ|गले में खराश|गले में दर्द/i,
      /khasi|khaasi|balgam|cough|galey me dard|kharash/i,
      /இருமல்|சளி|தொண்டை வலி/i,
      /irumal|sali|thondai vali/i,
      /దగ్గు|కఫం|గొంతు నొప్పి/i,
      /daggu|kaphum|gonthu noppi/i,
      /কাশি|কফ|গলা ব্যথা/i,
      /kashi|kof|gola betha/i,
      /खोकला|घसा दुखणे/i,
      /khokla|ghasa dukhne/i,
      /ઉધરસ|કફ/i,
      /ಕೆಮ್ಮು/i,
      /ചുമ|കഫം/i,
      /chuma/i,
      /ਖੰਘ/i
    ]
  },
  // 4. Chest Pain / Angina
  {
    canonicalEnglish: 'Retrosternal Chest Pain with Tightness',
    category: 'Cardiology',
    icdCode: 'R07.9',
    severityDefault: 'Critical',
    patterns: [
      /chest pain|angina|chest heaviness|tightness in chest|heart pain/i,
      /छाती में दर्द|सीने में दर्द|छाती में भारीपन|दिल में दर्द|घबराहट/i,
      /chhati me dard|seene me dard|chhati me bharipan|seena dard|heart me dard/i,
      /நெஞ்சு வலி|மார்பு வலி/i,
      /nenju vali|marbu vali/i,
      /ఛాతీ నొప్పి|గుండె నొప్పి/i,
      /chathi noppi|gunde noppi/i,
      /বুকে ব্যথা|বুক ধড়ফড়/i,
      /buke betha/i,
      /छातीत दुखणे|छातीवर दडपण/i,
      /chhatit dukhne/i,
      /છાતીમાં દુખાવો/i,
      /ಎದೆ ನೋವು/i,
      /നെഞ്ചുവേദന/i,
      /nenjuvedana/i,
      /ਛਾਤੀ ਵਿੱਚ ਦਰਦ/i
    ]
  },
  // 5. Shortness of Breath / Dyspnea
  {
    canonicalEnglish: 'Dyspnea / Shortness of Breath',
    category: 'Pulmonology',
    icdCode: 'R06.0',
    severityDefault: 'Severe',
    patterns: [
      /breathless|shortness of breath|dyspnea|difficulty breathing|gasping/i,
      /सांस फूलना|सांस लेने में तकलीफ|दम घुटना|सांस नहीं आ रही/i,
      /saas lene me dikkat|saans foolna|dam ghutna|breathless ho raha hai/i,
      /மூச்சுத்திணறல்|மூச்சு வாங்குதல்/i,
      /moochu thinarthal|moochu vanguthu/i,
      /శ్వాస తీసుకోవడంలో ఇబ్బంది|ఆయాసం/i,
      /swasa ibbandi|aayasam/i,
      /শ্বাসকষ্ট|দম বন্ধ হওয়া/i,
      /shwas koshto/i,
      /श्वास घेण्यास त्रास|दम लागणे/i,
      /shwas ghenyala tras|dam lagne/i,
      /શ્વાસ લેવામાં તકલીફ/i,
      /ಉಸಿರಾಟದ ತೊಂದರೆ/i,
      /ശ്വാസംമുട്ടൽ/i,
      /shwasam muttal/i,
      /ਸਾਹ ਲੈਣ ਵਿੱਚ ਤਕਲੀਫ਼/i
    ]
  },
  // 6. Abdominal Pain / Gastric Distress
  {
    canonicalEnglish: 'Acute Abdominal Pain & Dyspepsia',
    category: 'Gastroenterology',
    icdCode: 'R10.9',
    patterns: [
      /abdominal pain|stomach pain|belly ache|cramps|acid reflux|heartburn|gas/i,
      /पेट दर्द|पेट में मरोड़|पेट खराब|गैस|एसिडिटी|खट्टी डकार/i,
      /pet dard|pet me dard|pet me marod|acidity|gas ban rahi hai|pet kharab/i,
      /வயிற்று வலி|வயிற்றுப்போக்கு/i,
      /vayiru vali|vayitru vali/i,
      /கడుపు నొప్పి/i,
      /kadupu noppi/i,
      /পেট ব্যথা|গ্যাস/i,
      /pet byatha/i,
      /पोटदुखी|पोटात दुखणे/i,
      /potdukhi/i,
      /પેટમાં દુખાવો/i,
      /ಹೊಟ್ಟೆ ನೋವು/i,
      /വയറുവേദന/i,
      /vayaruvidana/i,
      /ਢਿੱਡ ਪੀੜ/i
    ]
  },
  // 7. Vomiting & Nausea
  {
    canonicalEnglish: 'Nausea and Repeated Vomiting',
    category: 'Gastroenterology',
    icdCode: 'R11.2',
    patterns: [
      /vomit|vomiting|nausea|queasy|emesis/i,
      /उल्टी|जी मिचलाना|उल्टी जैसा लगना|कै होना/i,
      /ulti|ulti aana|ji michlana|vomiting ho rahi hai/i,
      /வாந்தி|குமட்டல்/i,
      /vaanthi|kumattal/i,
      /వాంతులు|వికారం/i,
      /vaanthulu|vikaaram/i,
      /বমি|বমি বমি ভাব/i,
      /bomi/i,
      /उलटी|मळमळ/i,
      /ulti|malmal/i,
      /ઊલટી|ઉબકા/i,
      /ವಾಂತಿ/i,
      /ഛർദ്ദി/i,
      /chardhi/i,
      /ਉਲਟੀ/i
    ]
  },
  // 8. Diarrhea / Loose Stools
  {
    canonicalEnglish: 'Acute Diarrhea / Watery Stools',
    category: 'Gastroenterology',
    icdCode: 'A09',
    patterns: [
      /diarrhea|loose stool|loose motion|watery stool|dysentery/i,
      /दस्त|पतले दस्त|लूज मोशन|पेचिश/i,
      /dast|loose motion|patle dast|dast lag gaye/i,
      /வயிற்றுப்போக்கு|பேதி/i,
      /vayitru pokku/i,
      /విరేచనాలు/i,
      /virechanalu/i,
      /পাতলা পায়খানা|ডায়রিয়া/i,
      /patla paikhana/i,
      /जुलाब|संडास होणे/i,
      /julab/i,
      /ઝાડા/i,
      /ಭೇದಿ/i,
      /വയറിളക്കം/i,
      /vayarilakkam/i,
      /ਦਸਤ/i
    ]
  },
  // 9. Burning Urination / Dysuria
  {
    canonicalEnglish: 'Dysuria & Urinary Burning (UTI)',
    category: 'Urology',
    icdCode: 'R30.0',
    patterns: [
      /burning urination|dysuria|painful micturition|urine burning/i,
      /पेशाब में जलन|पेशाब में दर्द|रुक-रुक कर पेशाब/i,
      /peshab me jalan|peshab me dard|burning urination/i,
      /சிறுநீர் எரிச்சல்/i,
      /siruneer erichal/i,
      /మూత్రంలో మంట/i,
      /mootramlo manta/i,
      /প্রস্রাবে জ্বালাপোড়া/i,
      /prosrabe jwala/i,
      /लघवी करताना जळजळ/i,
      /laghavi jaljal/i,
      /પેશાબમાં બળતરા/i,
      /ಮೂತ್ರದಲ್ಲಿ ಉರಿ/i,
      /മൂത്രമൊഴിക്കുമ്പോൾ പുകച്ചിൽ/i,
      /ਪਿਸ਼ਾਬ ਵਿੱਚ ਜਲਣ/i
    ]
  },
  // 10. Generalized Body Pain & Fatigue
  {
    canonicalEnglish: 'Generalized Body Ache & Myalgia',
    category: 'General Medicine',
    icdCode: 'M79.1',
    patterns: [
      /body pain|body ache|myalgia|weakness|lethargy|fatigue/i,
      /बदन दर्द|हाथ पैर में दर्द|थकान|कमजोरी|सुस्ती/i,
      /badan dard|badan me dard|body pain|kamzori|thakan/i,
      /உடல் வலி|அசதி/i,
      /udal vali|asathi/i,
      /ఒంటి నొప్పులు|నీరసం/i,
      /onti noppulu|neerasam/i,
      /গা ব্যথা|দুর্বলতা/i,
      /gaa byatha/i,
      /अंगदुखी|थकवा/i,
      /angdukhi|thakva/i,
      /શરીરનો દુખાવો/i,
      /ಮೈಕೈ ನೋವು/i,
      /ശരീരവേദന/i,
      /shareeravedana/i,
      /ਸਰੀਰ ਵਿੱਚ ਦਰਦ/i
    ]
  }
];

// Multi-lingual Duration Normalization Mapping
export function parseMultilingualDuration(text: string): { value: number; unit: 'Hours' | 'Days' | 'Weeks' | 'Months' | 'Years' } | null {
  const lower = text.toLowerCase();

  // 1. Number words in English / Hindi / Indic
  const wordToNum: Record<string, number> = {
    'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5, 'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
    'ek': 1, 'do': 2, 'teen': 3, 'tin': 3, 'char': 4, 'paanch': 5, 'panch': 5, 'chhe': 6, 'saat': 7, 'aath': 8, 'nau': 9, 'das': 10,
    'एक': 1, 'दो': 2, 'तीन': 3, 'चार': 4, 'पाँच': 5, 'पांच': 5, 'छह': 6, 'सात': 7, 'आठ': 8, 'नौ': 9, 'दस': 10,
    'ஒன்று': 1, 'இரண்டு': 2, 'மூன்று': 3, 'நான்கு': 4, 'ஐந்து': 5,
    'ఒకటి': 1, 'రెండు': 2, 'మూడు': 3, 'నాలుగు': 4, 'ఐదు': 5,
    'এক': 1, 'দুই': 2, 'তিন': 3, 'চার': 4, 'পাঁচ': 5,
    'दोन': 2, 'पाच': 5
  };

  // Check digit patterns (e.g., "3 days", "3 din", "3 நாட்கள்", "3 ദിവസമായി", "3 দিন ধরে")
  const regexPatterns: { pattern: RegExp; unit: 'Hours' | 'Days' | 'Weeks' | 'Months' | 'Years'; numGroup: number }[] = [
    // Days
    { pattern: /(\d+|ek|do|teen|tin|char|paanch|panch|chhe|saat|एक|दो|तीन|चार|पाँच|पांच|மூன்று|మూడు|তিন|दोन)\s*(?:days?|din|devis|divas|roj|roju|natkal|rojulu|দিন|दिवस|દિવસ|ದಿನ|ദിവസം|ਦਿਨ)/i, unit: 'Days', numGroup: 1 },
    // Hours
    { pattern: /(\d+|ek|do|teen|tin|char|paanch|panch)\s*(?:hours?|ghante|ghanta|mani|ganthalu|ঘণ্টা|तास|કલાક|ಗಂಟೆ|മണിക്കൂർ|ਘੰਟੇ)/i, unit: 'Hours', numGroup: 1 },
    // Weeks
    { pattern: /(\d+|ek|do|teen|tin|char)\s*(?:weeks?|hafte|hafta|varam|vaaram|வாரங்கள்|వారాలు|সপ্তাহ|आठवडे|અઠવાડિયા|ವಾರ|ആഴ്ച|ਹਫ਼ਤੇ)/i, unit: 'Weeks', numGroup: 1 },
    // Months
    { pattern: /(\d+|ek|do|teen|tin|char|chhe)\s*(?:months?|mahine|mahina|maasam|மாதங்கள்|నెలలు|মাস|महिने|મહિના|ತಿಂಗಳು|മാസം|ਮਹੀਨੇ)/i, unit: 'Months', numGroup: 1 },
    // Years
    { pattern: /(\d+|ek|do|teen|tin)\s*(?:years?|saal|varsham|வருடங்கள்|సంవత్సరాలు|বছর|वर्षੇ|વર્ષ)/i, unit: 'Years', numGroup: 1 }
  ];

  for (const { pattern, unit, numGroup } of regexPatterns) {
    const match = lower.match(pattern);
    if (match) {
      const rawNum = match[numGroup].toLowerCase();
      const val = wordToNum[rawNum] || parseInt(rawNum, 10);
      if (!isNaN(val) && val > 0) {
        return { value: val, unit };
      }
    }
  }

  return null;
}

// Multi-lingual Vitals Extraction Helper
export function parseMultilingualVitals(text: string): {
  temp?: number;
  bpSys?: number;
  bpDia?: number;
  pulse?: number;
  spo2?: number;
  respRate?: number;
  bloodSugar?: number;
} {
  const lower = text.toLowerCase();
  const vitals: {
    temp?: number;
    bpSys?: number;
    bpDia?: number;
    pulse?: number;
    spo2?: number;
    respRate?: number;
    bloodSugar?: number;
  } = {};

  // 1. Temperature: "101.4", "102 F", "बुखार 101", "ताप 102", "temp 99.8"
  const tempMatch = lower.match(/(?:temp|temperature|fever of|बुखार|ताप|તાવ|പനി|ಜ್ವರ)\s*(?:is|hai|ho|of|:)?\s*(\d{2,3}(?:\.\d)?)\s*(?:f|c|degree|डिग्री)?/i) ||
    lower.match(/(\d{2,3}(?:\.\d)?)\s*(?:f|°f|degrees f|degree fahrenheit)/i);
  if (tempMatch) {
    const t = parseFloat(tempMatch[1]);
    if (t >= 95 && t <= 107) vitals.temp = t;
  }

  // 2. Blood Pressure: "BP 130/85", "BP 130 over 85", "रक्तचाप 120/80", "ರಕ್ತದೊತ್ತಡ 120/80", "130 by 90"
  const bpMatch = lower.match(/(?:bp|blood pressure|रक्तचाप|रक्तदाब|இரத்த அழுத்தம்|రక్తపోటు|রক্তচাপ|ರಕ್ತದೊತ್ತಡ|രക്തസമ്മർദ്ദം)\s*(?:is|hai|of|:)?\s*(\d{2,3})\s*(?:\/|over|by|slash|-|se)\s*(\d{2,3})/i) ||
    lower.match(/(\d{2,3})\s*\/\s*(\d{2,3})\s*(?:mmhg|bp)?/i);
  if (bpMatch) {
    const s = parseInt(bpMatch[1], 10);
    const d = parseInt(bpMatch[2], 10);
    if (s >= 60 && s <= 260 && d >= 30 && d <= 160) {
      vitals.bpSys = s;
      vitals.bpDia = d;
    }
  }

  // 3. Pulse / Heart Rate: "Pulse 88", "पल्स 92", "నాడి 86", "নাড়ির গতি 80", "Heart rate 78 bpm"
  const pulseMatch = lower.match(/(?:pulse|heart rate|hr|पल्स|नाड़ी|नाडी|நாடி|పల్స్|নাড়ি|ਨਾੜੀ)\s*(?:is|hai|rate|of|:)?\s*(\d{2,3})\s*(?:bpm|per min|\/min)?/i);
  if (pulseMatch) {
    const p = parseInt(pulseMatch[1], 10);
    if (p >= 35 && p <= 220) vitals.pulse = p;
  }

  // 4. SpO2 / Oxygen Saturation: "SpO2 98%", "oxygen 96", "सेचुरेशन 97"
  const spo2Match = lower.match(/(?:spo2|oxygen|saturation|o2|ऑक्सीजन|சாச்சுரேஷன்)\s*(?:is|hai|level|of|:)?\s*(\d{2,3})\s*%?/i);
  if (spo2Match) {
    const sp = parseInt(spo2Match[1], 10);
    if (sp >= 50 && sp <= 100) vitals.spo2 = sp;
  }

  // 5. Respiratory Rate: "RR 18", "Respiratory rate 22"
  const rrMatch = lower.match(/(?:rr|resp rate|respiratory rate|respiration)\s*(?:is|hai|of|:)?\s*(\d{1,2})/i);
  if (rrMatch) {
    const r = parseInt(rrMatch[1], 10);
    if (r >= 8 && r <= 60) vitals.respRate = r;
  }

  // 6. Blood Sugar: "Sugar 140", "RBS 180", "रैंडम शुगर 160"
  const sugarMatch = lower.match(/(?:sugar|rbs|fbs|blood sugar|शुगर)\s*(?:is|hai|level|of|:)?\s*(\d{2,3})/i);
  if (sugarMatch) {
    const b = parseInt(sugarMatch[1], 10);
    if (b >= 40 && b <= 600) vitals.bloodSugar = b;
  }

  return vitals;
}

// Multi-lingual Prescription Voice Extraction Helper
export function parseVoicePrescriptions(text: string): {
  medicine_name: string;
  generic_name: string;
  dosage: string;
  frequency: string;
  duration_value: number;
  duration_unit: 'Days' | 'Weeks' | 'Months';
  instruction: string;
}[] {
  const prescriptions: {
    medicine_name: string;
    generic_name: string;
    dosage: string;
    frequency: string;
    duration_value: number;
    duration_unit: 'Days' | 'Weeks' | 'Months';
    instruction: string;
  }[] = [];

  const knownDrugPatterns = [
    { name: 'Tab Paracetamol', generic: 'Paracetamol', dosage: '650 mg', regex: /paracetamol|dolo|calpol|क्रोसिन|पैरासिटामोल/i },
    { name: 'Cap Amoxicillin-Clav', generic: 'Amoxicillin + Clavulanate', dosage: '625 mg', regex: /amoxyclav|augmentin|amoxicillin|clav/i },
    { name: 'Tab Azithromycin', generic: 'Azithromycin', dosage: '500 mg', regex: /azithromycin|azithral|एज़िथ्रोमाइसिन/i },
    { name: 'Tab Pantoprazole', generic: 'Pantoprazole', dosage: '40 mg', regex: /pantoprazole|pantocid|pan 40|पेंटोप्रजोल/i },
    { name: 'Tab Cetirizine', generic: 'Cetirizine', dosage: '10 mg', regex: /cetirizine|cetzine|अलर्ट/i },
    { name: 'Tab Metformin', generic: 'Metformin HCl', dosage: '500 mg', regex: /metformin|glycomet/i },
    { name: 'Tab Amlodipine', generic: 'Amlodipine', dosage: '5 mg', regex: /amlodipine|stamlo/i },
    { name: 'Syp Benadryl Expectorant', generic: 'Diphenhydramine + Ammonium Cl', dosage: '10 ml', regex: /cough syrup|benadryl|ascoril/i },
    { name: 'Tab Ondansetron', generic: 'Ondansetron', dosage: '4 mg', regex: /ondansetron|emset|vomikind/i },
    { name: 'ORS Sachet', generic: 'Oral Rehydration Salts', dosage: '1 Sachet in 1L water', regex: /ors|oral rehydration|इलेक्ट्रोलाइट/i }
  ];

  for (const drug of knownDrugPatterns) {
    if (drug.regex.test(text)) {
      // Extract frequency
      let freq = '1-0-1 (BD Twice daily)';
      if (/thrice|tds|3 times|तीन बार|दिन में तीन बार|మూడు సార్లు|மூன்று முறை/i.test(text)) freq = '1-1-1 (TDS Thrice daily)';
      if (/once|od|single dose|एक बार|रोज एक बार/i.test(text)) freq = '1-0-0 (OD Morning)';
      if (/night|bedtime|hs|रात को|தூங்குவதற்கு முன்/i.test(text)) freq = '0-0-1 (HS At Bedtime)';
      if (/sos|as needed|जब दर्द हो|जरूरत पड़ने पर/i.test(text)) freq = 'SOS (As needed)';

      // Extract duration
      let durVal = 5;
      const durMatch = text.match(/for\s*(\d+)\s*(days?|दिन|రోజులు)/i);
      if (durMatch) durVal = parseInt(durMatch[1], 10);

      // Extract instructions
      let inst = 'Take with a glass of water after food';
      if (/before food|khali pet|empty stomach|खाली पेट|ಊಟಕ್ಕೆ ಮುಂಚೆ/i.test(text)) {
        inst = 'Take on empty stomach 30 mins before breakfast';
      }

      prescriptions.push({
        medicine_name: drug.name,
        generic_name: drug.generic,
        dosage: drug.dosage,
        frequency: freq,
        duration_value: durVal,
        duration_unit: 'Days',
        instruction: inst
      });
    }
  }

  return prescriptions;
}

// Ready-to-Demo Multi-Lingual Presets for Hackathon Presentations
export const DEMO_VOICE_SCENARIOS: VoiceScribeScenario[] = [
  {
    id: 'sc-hi-1',
    title: 'Hindi: Acute Viral Fever & Pharyngitis',
    language: 'hi-IN',
    languageLabel: 'हिन्दी (Hindi)',
    category: 'General Medicine / OPD',
    patientName: 'Ramesh Kumar',
    patientAgeGender: '38 yrs, Male',
    mode: 'ambient',
    audioScript: 'डॉक्टर: रमेश जी, क्या तकलीफ हो रही है आपको? \nमरीज: डॉक्टर साहब, मुझे ३ दिन से बहुत तेज बुखार और गले में भयानक दर्द है। सूखी खांसी भी आ रही है। \nडॉक्टर: ठंड लग कर कंपकंपी होती है क्या? \nमरीज: हाँ, रात को बहुत ठंड लगती है। \nडॉक्टर: ठीक है, जांच करते हैं। तापमान 101.8 डिग्री फारेनहाइट है, बीपी 126/82, पल्स 92 और ऑक्सीजन 98% सामान्य है। आपको एक्यूट वायरल फेरिंजाइटिस है। हम पैरासिटामोल 650 दिन में तीन बार और पैंटोप्रजोल 40 खाली पेट शुरू कर रहे हैं।',
    turns: [
      { id: 't1', speaker: 'Doctor', timestamp: '00:02', originalText: 'रमेश जी, क्या तकलीफ हो रही है आपको?' },
      { id: 't2', speaker: 'Patient', timestamp: '00:07', originalText: 'मुझे ३ दिन से बहुत तेज बुखार और गले में भयानक दर्द है। सूखी खांसी भी आ रही है।' },
      { id: 't3', speaker: 'Doctor', timestamp: '00:14', originalText: 'तापमान 101.8 F है, बीपी 126/82, पल्स 92, ऑक्सीजन 98%। पैरासिटामोल 650 तीन बार और पैंटोप्रजोल 40 लें।' }
    ],
    expectedExtractionSummary: {
      chiefComplaint: 'Acute Fever with Chills & Sore Throat',
      duration: '3 Days',
      vitals: 'Temp: 101.8°F | BP: 126/82 | Pulse: 92 | SpO2: 98%',
      rxCount: 2
    }
  },
  {
    id: 'sc-hinglish-1',
    title: 'Hinglish: Emergency Chest Pain & Diaphoresis',
    language: 'hinglish',
    languageLabel: 'Hinglish (Colloquial)',
    category: 'Cardiology / Emergency',
    patientName: 'Patient',
    patientAgeGender: '52 yrs, Male',
    mode: 'dictation',
    audioScript: 'Patient 52-year-old male presenting with acute severe retrosternal crushing chest pain radiating to left arm for 2 hours with cold sweating and breathless. BP is 150 over 95, pulse rate 104, SpO2 is 94 percent. High risk for acute coronary syndrome. Order immediate 12-lead ECG and Troponin I.',
    expectedExtractionSummary: {
      chiefComplaint: 'Retrosternal Chest Pain with Tightness',
      duration: '2 Hours',
      vitals: 'BP: 150/95 | Pulse: 104 | SpO2: 94%',
      rxCount: 0,
      redFlagAlert: 'CRITICAL: Crushing retrosternal chest pain radiating to arm - Rule out ACS/STEMI'
    }
  },
  {
    id: 'sc-ta-1',
    title: 'Tamil: Acute Gastroenteritis & Dehydration',
    language: 'ta-IN',
    languageLabel: 'தமிழ் (Tamil)',
    category: 'Gastroenterology',
    patientName: 'Anitha Selvam',
    patientAgeGender: '29 yrs, Female',
    mode: 'ambient',
    audioScript: 'மருத்துவர்: என்ன பிரச்சனை அம்மா? \nநோயாளி: டாக்டர், எனக்கு 2 நாட்களாக கடுமையான வயிற்று வலி, வாந்தி மற்றும் வயிற்றுப்போக்கு உள்ளது. \nமருத்துவர்: இரத்த அழுத்தம் 110/70, நாடி துடிப்பு 88, வெப்பநிலை 99.4 F. கடுமையான நீர்ச்சத்து இழப்பைத் தடுக்க ORS கரைசல் மற்றும் Ondansetron மாத்திரை கொடுக்கப்படுகிறது.',
    expectedExtractionSummary: {
      chiefComplaint: 'Acute Abdominal Pain & Vomiting / Diarrhea',
      duration: '2 Days',
      vitals: 'Temp: 99.4°F | BP: 110/70 | Pulse: 88',
      rxCount: 2
    }
  },
  {
    id: 'sc-te-1',
    title: 'Telugu: Migraine Headache with Visual Aura',
    language: 'te-IN',
    languageLabel: 'తెలుగు (Telugu)',
    category: 'Neurology',
    patientName: 'Srinivas Rao',
    patientAgeGender: '34 yrs, Male',
    mode: 'dictation',
    audioScript: 'రోగికి 4 రోజులుగా ఒక వైపు తీవ్రమైన తలనొప్పి మరియు వికారం ఉంది. కాంతి చూస్తే తలనొప్పి పెరుగుతుంది. రక్తపోటు 120/80, పల్స్ 76, ఉష్ணోగ్రత 98.6 F. మైగ్రేన్ నిర్ధారణ. పారాసిటమాల్ 650 మరియు విశ్రాంతి సూచించబడింది.',
    expectedExtractionSummary: {
      chiefComplaint: 'Severe Throbbing Headache with Aura',
      duration: '4 Days',
      vitals: 'BP: 120/80 | Pulse: 76 | Temp: 98.6°F',
      rxCount: 1
    }
  },
  {
    id: 'sc-bn-1',
    title: 'Bengali: Pediatric Viral Infection with Cough',
    language: 'bn-IN',
    languageLabel: 'বাংলা (Bengali)',
    category: 'Pediatrics / OPD',
    patientName: 'Subir Mondal',
    patientAgeGender: '6 yrs, Male',
    mode: 'ambient',
    audioScript: 'ডাক্তার: বাচ্চার কী হয়েছে? \nঅভিভাবক: ডাক্তারবাবু, ৩ দিন ধরে প্রচণ্ড জ্বর ১০২ ডিগ্রি এবং খসখসে কাশি হচ্ছে। \nডাক্তার: বুক পরীক্ষা করে দেখলাম। রক্তচাপ ১০০/৭০, পালস ১০০, স্পো২ ৯৮%। প্যারাসিটামল সিরাপ এবং কাশির ওষুধ প্রেসক্রাইব করা হলো।',
    expectedExtractionSummary: {
      chiefComplaint: 'Acute Fever with Chills & Cough',
      duration: '3 Days',
      vitals: 'Temp: 102.0°F | BP: 100/70 | Pulse: 100 | SpO2: 98%',
      rxCount: 2
    }
  }
];
