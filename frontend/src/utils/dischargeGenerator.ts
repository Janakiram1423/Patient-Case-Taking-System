/**
 * Client-Side Multilingual Discharge & Patient Instruction Generator
 * Provides instantaneous, zero-latency clinical instruction rendering in 6 languages.
 */

export interface MedicationScheduleSlot {
  slot: 'Morning' | 'Afternoon' | 'Night' | 'SOS';
  label: string;
  icon: string;
  time: string;
}

export interface PatientInstructionMedication {
  id: string;
  name: string;
  category: string;
  dosage: string;
  frequency_raw: string;
  duration: string;
  food_timing: string;
  is_before_food: boolean;
  purpose: string;
  caution: string;
  schedule_slots: MedicationScheduleSlot[];
}

export interface PatientDischargePlan {
  language: string;
  language_name: string;
  language_native: string;
  voice_code: string;
  greeting: string;
  diagnosis_display: string;
  medications: PatientInstructionMedication[];
  diet_guidelines: string[];
  emergency_warnings: {
    title: string;
    items: string[];
    helpline: string;
  };
  follow_up_instruction: string;
  whatsapp_share_text: string;
}

export const SUPPORTED_LANGUAGES = [
  { code: 'hi', name: 'Hindi', native: 'हिंदी', voice_code: 'hi-IN' },
  { code: 'en', name: 'English', native: 'English', voice_code: 'en-IN' },
  { code: 'mr', name: 'Marathi', native: 'मराठी', voice_code: 'mr-IN' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்', voice_code: 'ta-IN' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు', voice_code: 'te-IN' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা', voice_code: 'bn-IN' }
];

const DRUG_CLASSIFICATIONS: Record<string, {
  class: string;
  purpose: Record<string, string>;
  caution: Record<string, string>;
}> = {
  paracetamol: {
    class: 'Antipyretic / Analgesic',
    purpose: {
      en: 'For relieving pain and reducing fever.',
      hi: 'दर्द कम करने और बुखार उतारने के लिए।',
      mr: 'वेदना कमी करण्यासाठी आणि ताप उतरवण्यासाठी.',
      ta: 'வலி மற்றும் காய்ச்சலைக் குறைக்க.',
      te: 'నొప్పి మరియు జ్వరాన్ని తగ్గించడానికి.',
      bn: 'ব্যথা উপশম এবং জ্বর কমানোর জন্য।'
    },
    caution: {
      en: 'Do not take more than 4 doses in 24 hours.',
      hi: '24 घंटे में 4 बार से अधिक न लें।',
      mr: '24 तासांत 4 पेक्षा जास्त वेळा घेऊ नका.',
      ta: '24 மணி நேரத்தில் 4 முறைக்கு மேல் எடுக்க வேண்டாம்.',
      te: '24 గంటల్లో 4 కంటే ఎక్కువ మోతాదులు తీసుకోకండి.',
      bn: '২৪ ঘণ্টায় ৪ বারের বেশি খাবেন না।'
    }
  },
  dolo: {
    class: 'Antipyretic / Analgesic',
    purpose: {
      en: 'Relieves body pain, headache, and controls fever spikes.',
      hi: 'शरीर दर्द, सिरदर्द और बुखार को नियंत्रित करने के लिए।',
      mr: 'अंगदुखी, डोकेदुखी आणि ताप नियंत्रणात आणण्यासाठी.',
      ta: 'உடல் வலி, தலைவலி மற்றும் காய்ச்சலைக் கட்டுப்படுத்த.',
      te: 'శరీర నొప్పి, తలనొప్పి మరియు జ్వరాన్ని తగ్గించడానికి.',
      bn: 'শরীর ব্যথা, মাথাব্যথা ও জ্বর নিয়ন্ত্রণের জন্য।'
    },
    caution: {
      en: 'Keep 6 hours gap between two doses.',
      hi: 'दो खुराकों के बीच कम से कम 6 घंटे का अंतर रखें।',
      mr: 'दोन डोसमध्ये किमान ६ तासांचे अंतर ठेवा.',
      ta: 'இரண்டு மாத்திரைகளுக்கு இடையே 6 மணி நேர இடைவெளி விடவும்.',
      te: 'రెండు మోతాదుల మధ్య 6 గంటల విరామం ఉంచండి.',
      bn: 'দুটি ডোজের মধ্যে ৬ ঘণ্টার ব্যবধান রাখুন।'
    }
  },
  augmentin: {
    class: 'Antibiotic (Penicillin/Clavulanate)',
    purpose: {
      en: 'Antibiotic to eliminate bacterial infection. Complete the full course.',
      hi: 'बैक्टीरियल इन्फेक्शन खत्म करने के लिए एंटीबायोटिक। पूरा कोर्स खत्म करें।',
      mr: 'जिवाणू संसर्ग नष्ट करण्यासाठी अँटीबायोटिक. पूर्ण कोर्स संपवा.',
      ta: 'பாக்டீரியா தொற்றை போக்க உதவும் ஆன்டிபயாடிக். முழு படிப்பையும் முடிக்கவும்.',
      te: 'బాక్టీరియల్ ఇన్ఫెక్షన్‌ను నయం చేయడానికి యాంటీబయాటిక్. కోర్సు పూర్తి చేయండి.',
      bn: 'ব্যাকটেরিয়া সংক্রমণ দূর করার অ্যান্টিবায়োটিক। পুরো কোর্স শেষ করুন।'
    },
    caution: {
      en: 'Take strictly after food. Do not stop midway even if feeling better.',
      hi: 'हमेशा भोजन के बाद लें। ठीक महसूस होने पर भी बीच में बंद न करें।',
      mr: 'नेहमी जेवणानंतर घ्या. बरे वाटले तरी औषध मध्येच थांबवू नका.',
      ta: 'எப்போதும் உணவுக்குப் பின் உட்கொள்ளவும். பாதியில் நிறுத்த வேண்டாம்.',
      te: 'ఎల్లప్పుడూ భోజనం తర్వాత తీసుకోండి. మధ్యలో ఆపకండి.',
      bn: 'সর্বদা খাবারের পর খান। মাঝপথে ওষুধ বন্ধ করবেন না।'
    }
  },
  amoxicillin: {
    class: 'Antibiotic',
    purpose: {
      en: 'Antibiotic to fight bacterial infection. Complete the entire course.',
      hi: 'संक्रमण से लड़ने के लिए एंटीबायोटिक दवा। पूरा कोर्स अवश्य लें।',
      mr: 'संसर्गाशी लढण्यासाठी अँटीबायोटिक. पूर्ण कोर्स पूर्ण करा.',
      ta: 'தொற்றை குணப்படுத்தும் ஆன்டிபயாடிக் மருந்து. முழுமையாக உட்கொள்ளவும்.',
      te: 'ఇన్ఫెక్షన్ నయమయ్యేందుకు యాంటీబయాటిక్. పూర్తి కోర్సు వాడండి.',
      bn: 'সংক্রমণ নিরাময়ের অ্যান্টিবায়োটিক। সম্পূর্ণ কোর্স গ্রহণ করুন।'
    },
    caution: {
      en: 'Take after meals at regular intervals.',
      hi: 'नियमित समय पर खाने के बाद लें।',
      mr: 'वेळेवर जेवणानंतर घ्या.',
      ta: 'சரியான நேர இடைவெளியில் உணவுக்குப் பின் சாப்பிடவும்.',
      te: 'సమయానికి భోజనం తర్వాత తీసుకోండి.',
      bn: 'নিয়মিত সময়ে খাবারের পর খান।'
    }
  },
  pantocid: {
    class: 'Proton Pump Inhibitor (Acidity)',
    purpose: {
      en: 'Reduces stomach acid, prevents heartburn and gastric irritation.',
      hi: 'पेट में गैस और एसिडिटी कम करने तथा जलन रोकने के लिए।',
      mr: 'पोटातील ॲसिडिटी आणि जळजळ कमी करण्यासाठी.',
      ta: 'வயிற்று அமிலத்தன்மை மற்றும் நெஞ்செரிச்சலை குறைக்க.',
      te: 'కడుపులో గ్యాస్ మరియు మంటను తగ్గించడానికి.',
      bn: 'পেটের গ্যাস ও অ্যাসিডিটি কমানোর জন্য।'
    },
    caution: {
      en: 'Take on an empty stomach 30 minutes before breakfast.',
      hi: 'नाश्ते से 30 मिनट पहले खाली पेट लें।',
      mr: 'सकाळच्या नाश्त्याच्या 30 मिनिटे आधी रिकाम्या पोटी घ्या.',
      ta: 'காலை உணவுக்கு 30 நிமிடங்களுக்கு முன் வெறும் வயிற்றில் எடுக்கவும்.',
      te: 'ఉదయం అల్పాహారానికి 30 నిమిషాల ముందు ఖాళీ కడుపుతో తీసుకోండి.',
      bn: 'সকালের নাস্তার ৩০ মিনিট আগে খালি পেটে খান।'
    }
  },
  pantoprazole: {
    class: 'Proton Pump Inhibitor (Acidity)',
    purpose: {
      en: 'Reduces stomach acid and protects stomach lining.',
      hi: 'पेट के एसिड को कम करता है और पेट की परत की रक्षा करता है।',
      mr: 'पोटातील ॲसिड कमी करतो आणि पोटाचे संरक्षण करतो.',
      ta: 'வயிற்று அமிலத்தைக் குறைத்து வயிற்றைப் பாதுகாக்கிறது.',
      te: 'కడుపులోని యాసిడ్‌ను తగ్గిస్తుంది.',
      bn: 'পেটের অ্যাসিড কমায় এবং পেটের সুরক্ষা দেয়।'
    },
    caution: {
      en: 'Take once daily before breakfast on an empty stomach.',
      hi: 'सुबह नाश्ते से पहले खाली पेट एक बार लें।',
      mr: 'सकाळी रिकाम्या पोटी नाश्त्यापूर्वी एक वेळ घ्या.',
      ta: 'காலை உணவுக்கு முன் வெறும் வயிற்றில் எடுக்கவும்.',
      te: 'ఉదయం ఖాళీ కడుపుతో తీసుకోండి.',
      bn: 'সকালে খালি পেটে খান।'
    }
  },
  azithral: {
    class: 'Macrolide Antibiotic',
    purpose: {
      en: 'Antibiotic for throat, chest, and respiratory tract infections.',
      hi: 'गले और सीने के संक्रमण के लिए एंटीबायोटिक।',
      mr: 'घसा आणि छातीच्या संसर्गासाठी अँटीबायोटिक.',
      ta: 'தொண்டை மற்றும் நுரையீரல் தொற்றுக்கான ஆன்டிபயாடிக்.',
      te: 'గొంతు మరియు ఊపిరితిత్తుల ఇన్ఫెక్షన్ కోసం యాంటీబయాటిక్.',
      bn: 'গলা এবং বুকের সংক্রমণের জন্য অ্যান্টিবায়োটিক।'
    },
    caution: {
      en: 'Take at the exact same time every day for prescribed days.',
      hi: 'दवा रोज एक ही समय पर लें।',
      mr: 'दररोज एकाच वेळी औषध घ्या.',
      ta: 'தினமும் ஒரே நேரத்தில் எடுக்கவும்.',
      te: 'రోజూ ఒకే సమయానికి తీసుకోండి.',
      bn: 'প্রতিদিন একই সময়ে ওষুধ খান।'
    }
  },
  telma: {
    class: 'Antihypertensive (Blood Pressure)',
    purpose: {
      en: 'Maintains blood pressure within a healthy, normal range.',
      hi: 'ब्लड प्रेशर (रक्तचाप) को सामान्य रखने के लिए।',
      mr: 'रक्तदाब (बीपी) नियंत्रित ठेवण्यासाठी.',
      ta: 'இரத்த அழுத்தத்தை சீராக வைத்திருக்க.',
      te: 'రక్తపోటును అదుపులో ఉంచడానికి.',
      bn: 'রক্তচাপ নিয়ন্ত্রণে রাখার জন্য।'
    },
    caution: {
      en: 'Do not skip or stop this medicine without doctor\'s consultation.',
      hi: 'डॉक्टर की सलाह के बिना यह दवा कभी बंद न करें।',
      mr: 'डॉक्टरांच्या सल्ल्याशिवाय हे औषध बंद करू नका.',
      ta: 'மருத்துவர் ஆலோசனை இல்லாமல் நிறுத்த வேண்டாம்.',
      te: 'డాక్టర్ సలహా లేకుండా మందు ఆపవద్దు.',
      bn: 'ডাক্তারের পরামর্শ ছাড়া এই ওষুধ বন্ধ করবেন না।'
    }
  },
  glycomet: {
    class: 'Antidiabetic (Sugar Control)',
    purpose: {
      en: 'Lowers blood glucose and manages diabetes.',
      hi: 'ब्लड शुगर नियंत्रित करने और डायबिटीज प्रबंधन के लिए।',
      mr: 'रक्तातील साखर नियंत्रित ठेवण्यासाठी.',
      ta: 'இரத்த சர்க்கரை அளவைக் கட்டுப்படுத்த.',
      te: 'బ్లడ్ షుగర్ నియంత్రణలో ఉంచడానికి.',
      bn: 'রক্তে শর্করা নিয়ন্ত্রণ করতে।'
    },
    caution: {
      en: 'Always take with or immediately after meals. Monitor for hypoglycemia.',
      hi: 'हमेशा भोजन के साथ या तुरंत बाद लें।',
      mr: 'नेहमी जेवणासोबत किंवा जेवणानंतर लगेच घ्या.',
      ta: 'எப்போதும் உணவோடு அல்லது உணவுக்குப் பின் உட்கொள்ளவும்.',
      te: 'ఎల్లప్పుడూ భోజనంతో పాటు లేదా వెంటనే తీసుకోండి.',
      bn: 'সর্বদা খাবারের সাথে বা পরে অবিলম্বে খান।'
    }
  },
  combiflam: {
    class: 'NSAID Pain & Inflammation',
    purpose: {
      en: 'Relieves body aches, muscular pain, headache, and fever.',
      hi: 'बदन दर्द, सिरदर्द, सूजन और बुखार से राहत के लिए।',
      mr: 'अंगदुखी, डोकेदुखी आणि ताप कमी करण्यासाठी.',
      ta: 'உடல் வலி, தலைவலி மற்றும் காய்ச்சலை நீக்க.',
      te: 'శరీర నొప్పులు, తలనొప్పి మరియు జ్వరం నుండి ఉపశమనం కోసం.',
      bn: 'শরীর ব্যথা, মাথাব্যথা ও জ্বর কমানোর জন্য।'
    },
    caution: {
      en: 'Never take on an empty stomach. Take only as needed.',
      hi: 'खाली पेट कभी न लें। जरूरत पड़ने पर ही लें।',
      mr: 'रिकाम्या पोटी कधीही घेऊ नका. आवश्यकतेनुसारच घ्या.',
      ta: 'வெறும் வயிற்றில் சாப்பிட வேண்டாம்.',
      te: 'ఖాళీ కడుపుతో ఎప్పుడూ తీసుకోకండి.',
      bn: 'কখনও খালি পেটে খাবেন না।'
    }
  }
};

const TIMING_DESCRIPTIONS: Record<string, Record<string, string>> = {
  en: {
    morning: 'Morning (Breakfast)',
    afternoon: 'Afternoon (Lunch)',
    night: 'Night (Dinner)',
    sos: 'As needed (SOS)',
    before_food: 'Before Food (Empty stomach)',
    after_food: 'After Food',
    with_food: 'With Meals',
    duration: 'Days'
  },
  hi: {
    morning: 'सुबह (नाश्ते के समय)',
    afternoon: 'दोपहर (खाने के समय)',
    night: 'रात (रात के खाने के समय)',
    sos: 'जरूरत पड़ने पर (दर्द / बुखार होने पर)',
    before_food: 'खाली पेट (खाने से पहले)',
    after_food: 'खाना खाने के बाद',
    with_food: 'भोजन के साथ',
    duration: 'दिन'
  },
  mr: {
    morning: 'सकाळी (नाश्त्याच्या वेळी)',
    afternoon: 'दुपारी (जेवणाच्या वेळी)',
    night: 'रात्री (जेवणानंतर)',
    sos: 'गरज भासल्यास (त्रास झाल्यावर)',
    before_food: 'जेवणापूर्वी (रिकाम्या पोटी)',
    after_food: 'जेवणानंतर',
    with_food: 'जेवणासोबत',
    duration: 'दिवस'
  },
  ta: {
    morning: 'காலை (காலை உணவு)',
    afternoon: 'மதியம் (மதிய உணவு)',
    night: 'இரவு (இரவு உணவு)',
    sos: 'தேவைப்படும் போது மட்டும் (SOS)',
    before_food: 'உணவுக்கு முன் (வெறும் வயிற்றில்)',
    after_food: 'உணவுக்குப் பின்',
    with_food: 'உணவுடன்',
    duration: 'நாட்கள்'
  },
  te: {
    morning: 'ఉదయం (టిఫిన్ తర్వాత)',
    afternoon: 'మధ్యాహ్నం (భోజనం తర్వాత)',
    night: 'రాత్రి (రాత్రి భోజనం తర్వాత)',
    sos: 'అవసరమైనప్పుడు మాత్రమే (SOS)',
    before_food: 'భోజనానికి ముందు (ఖాళీ కడుపుతో)',
    after_food: 'భోజనం తర్వాత',
    with_food: 'భోజనంతో పాటు',
    duration: 'రోజులు'
  },
  bn: {
    morning: 'সকালে (নাস্তার সময়)',
    afternoon: 'দুপুরে (দুপুরের খাবারের সময়)',
    night: 'রাতে (রাতের খাবারের সময়)',
    sos: 'প্রয়োজনে (SOS)',
    before_food: 'খাবারের আগে (খালি পেটে)',
    after_food: 'খাবারের পরে',
    with_food: 'খাবারের সাথে',
    duration: 'দিন'
  }
};

const DIETARY_GUIDELINES: Record<string, Record<string, string[]>> = {
  hypertension: {
    en: [
      'Limit table salt strictly (under 1 teaspoon / 5g per day).',
      'Avoid deep fried snacks, pickles, papads, and processed foods.',
      'Engage in 30 minutes of brisk walking daily.',
      'Stay well hydrated and limit caffeine.'
    ],
    hi: [
      'नमक की मात्रा बहुत कम रखें (दिन भर में 1 चम्मच से कम)।',
      'तले-भुने पकवान, पापड़, अचार और डिब्बाबंद खाद्य पदार्थों से परहेज करें।',
      'प्रतिदिन 30 मिनट तेज गति से टहलें।',
      'पर्याप्त मात्रा में पानी पिएं और चाय/कॉफी कम करें।'
    ],
    mr: [
      'मिठाचे प्रमाण खूप कमी ठेवा (दिवसाला १ चमच्यापेक्षा कमी).',
      'तळलेले पदार्थ, लोणचे, पापड आणि खारट पदार्थ टाळा.',
      'दररोज ३० मिनिटे वेगाने चालण्याचा व्यायाम करा.',
      'भरपूर पाणी प्या आणि चहा-कॉफी कमी करा.'
    ],
    ta: [
      'உப்பு உட்கொள்ளலை மிகக் குறைவாக வைக்கவும் (ஒரு நாளைக்கு 1 தேக்கரண்டிக்கு கீழ்).',
      'வறுத்த உணவுகள், ஊறுகாய் மற்றும் அப்பளம் ஆகியவற்றைத் தவிர்க்கவும்.',
      'தினமும் 30 நிமிடங்கள் நடைபயிற்சி மேற்கொள்ளவும்.',
      'நிறைய தண்ணீர் குடிக்கவும்.'
    ],
    te: [
      'ఉప్పు వినియోగాన్ని బాగా తగ్గించండి (రోజుకు 1 స్పూన్ కంటే తక్కువ).',
      'నూనెలో వేయించిన పదార్థాలు, పచ్చళ్ళు, అప్పడాలు మానండి.',
      'రోజూ 30 నిమిషాలు వేగంగా నడవండి.',
      'తగినంత నీరు త్రాగండి.'
    ],
    bn: [
      'লবণের পরিমাণ কঠোরভাবে সীমিত রাখুন (দিনে ১ চা চামচের কম)।',
      'ভাজাপোড়া খাবার, আচার এবং প্রক্রিয়াজাত খাবার এড়িয়ে চলুন।',
      'প্রতিদিন ৩০ মিনিট হাঁটুন।',
      'প্রচুর জল পান করুন।'
    ]
  },
  diabetes: {
    en: [
      'Avoid direct sugar, sweets, sodas, fruit juices, and refined flour (maida).',
      'Eat whole grains, millets, leafy vegetables, and high-fiber foods.',
      'Do not skip meals; eat at regular fixed intervals to prevent low blood sugar.',
      'Check feet daily for cuts or sores; keep them clean and dry.'
    ],
    hi: [
      'चीनी, मिठाई, कोल्ड ड्रिंक्स, फलों का जूस और मैदा बिल्कुल न लें।',
      'मोटा अनाज (ज्वार, बाजरा), हरी पत्तेदार सब्जियां और फाइबर युक्त भोजन खाएं।',
      'समय पर भोजन करें; भोजन कभी न छोड़ें ताकि शुगर अचानक कम न हो।',
      'रोजाना पैरों की जांच करें और उन्हें साफ व सूखा रखें।'
    ],
    mr: [
      'साखर, मिठाई, कोल्ड ड्रिंक्स आणि मैद्याचे पदार्थ पूर्णपणे टाळा.',
      'ज्वारी, बाजरी, हिरव्या पालेभाज्या आणि फायबरयुक्त आहार घ्या.',
      'वेळेवर जेवण करा; उपाशी राहू नका.',
      'दररोज पायांची काळजी घ्या आणि ते स्वच्छ ठेवा.'
    ],
    ta: [
      'சர்க்கரை, இனிப்புகள், குளிர்பானங்கள் மற்றும் மைதாவை முற்றிலும் தவிர்க்கவும்.',
      'சிறு தானியங்கள், கீரைகள் மற்றும் நார்ச்சத்துள்ள உணவுகளை அதிகம் உட்கொள்ளவும்.',
      'சரியான நேரத்திற்கு சாப்பிடுங்கள்; உணவைத் தவிர்க்காதீர்கள்.',
      'பாதங்களை தினமும் பரிசோதித்து சுத்தமாக வைத்திருக்கவும்.'
    ],
    te: [
      'చక్కెర, స్వీట్లు, కూల్ డ్రింక్స్ మరియు మైదాను పూర్తిగా నివారించండి.',
      'చిరుధాన్యాలు, ఆకుకూరలు మరియు ఫైబర్ అధికంగా ఉండే ఆహారం తీసుకోండి.',
      'సమయానికి భోజనం చేయండి; భోజనం మానేయకండి.',
      'పాదాలను రోజూ శుభ్రంగా ఉంచుకోండి.'
    ],
    bn: [
      'চিনি, মিষ্টি, কোমল পানীয় এবং ময়দা পরিহার করুন।',
      'শাকসবজি, লাল চালের ভাত এবং ফাইবার সমৃদ্ধ খাবার খান।',
      'নিয়মিত সময়ে খাবার গ্রহণ করুন; খাবার এড়িয়ে যাবেন না।',
      'পায়ের যত্ন নিন এবং পরিষ্কার রাখুন।'
    ]
  },
  infection: {
    en: [
      'Drink plenty of warm fluids, soups, and boiled water.',
      'Get adequate bed rest (7-8 hours) for quick immune recovery.',
      'Avoid chilled drinks, street food, and stale meals.',
      'Do steam inhalation 2 times a day if experiencing congestion.'
    ],
    hi: [
      'खूब गुनगुना पानी, सूप और उबला हुआ पानी पिएं।',
      'शरीर को ठीक होने के लिए पर्याप्त आराम (7-8 घंटे की नींद) दें।',
      'ठंडा पानी, बाहर का खुला खाना और बासी भोजन न करें।',
      'गले व नाक में जकड़न होने पर दिन में दो बार भाप लें।'
    ],
    mr: [
      'कोमट पाणी, सूप आणि उकळलेले पाणी भरपूर प्या.',
      'लवकर बरे होण्यासाठी पुरेशी विश्रांती (७-८ तास झोप) घ्या.',
      'थंड पेये, बाहेरचे उघड्यावरील अन्न खाणे टाळा.',
      'नाक चोंदले असल्यास दिवसातून दोनदा गरम पाण्याची वाफ घ्या.'
    ],
    ta: [
      'ஏராளமான வெதுவெதுப்பான நீர், சூப் மற்றும் கொதிக்கவைத்த நீரைக் குடிக்கவும்.',
      'முழுமையான ஓய்வு (7-8 மணி நேர தூக்கம்) எடுக்கவும்.',
      'குளிர்ந்த பானங்கள் மற்றும் வெளிப்புற உணவுகளைத் தவிர்க்கவும்.',
      'தேவைப்பட்டால் தினமும் 2 முறை ஆவி பிடிக்கவும்.'
    ],
    te: [
      'గోరువెచ్చని నీరు, సూప్‌లు మరియు కాచి చల్లార్చిన నీరు ఎక్కువగా త్రాగండి.',
      'తగినంత విశ్రాంతి తీసుకోండి (7-8 గంటల నిద్ర).',
      'చల్లని పానీయాలు మరియు బయటి ఆహారం తినవద్దు.',
      'జలుబు ఉంటే రోజుకు రెండుసార్లు ఆవిరి పట్టండి.'
    ],
    bn: [
      'প্রচুর হালকা গরম জল, স্যুপ ও ফুটানো জল পান করুন।',
      'পর্যাপ্ত বিশ্রাম নিন (৭-৮ ঘণ্টা ঘুম)।',
      'ঠান্ডা পানীয় এবং বাইরের অস্বাস্থ্যকর খাবার এড়িয়ে চলুন।',
      'নাক বন্ধ থাকলে দিনে দুবার গরম জলের ভাপ নিন।'
    ]
  },
  general: {
    en: [
      'Eat light, freshly cooked, easily digestible homemade food.',
      'Drink 2.5 to 3 liters of clean drinking water every day.',
      'Take prescribed medications at the specified hours without skipping.',
      'Avoid alcohol and tobacco products completely.'
    ],
    hi: [
      'घर का बना हल्का, ताजा और सुपाच्य भोजन खाएं।',
      'प्रतिदिन 2.5 से 3 लीटर साफ पीने का पानी अवश्य पिएं।',
      'दवाइयां समय पर लें और कोई भी खुराक न भूलें।',
      'शराब और बीड़ी-सिगरेट/तंबाकू का बिल्कुल सेवन न करें।'
    ],
    mr: [
      'घरचे ताजे, हलके आणि सहज पचणारे अन्न खा.',
      'दररोज २.५ ते ३ लिटर स्वच्छ पाणी प्या.',
      'औषधे ठरवून दिलेल्या वेळेवरच न चुकता घ्या.',
      'तंबाखू, सिगारेट आणि मद्यपान पूर्णपणे टाळा.'
    ],
    ta: [
      'எளிதில் செரிமானமாகும் வீட்டில் சமைத்த புதிய உணவை உண்ணுங்கள்.',
      'தினமும் 2.5 முதல் 3 லிட்டர் வரை தண்ணீர் அருந்துங்கள்.',
      'மருந்துகளை குறித்த நேரத்தில் தவறாமல் உட்கொள்ளுங்கள்.',
      'புகையிலை மற்றும் மதுபானங்களை முற்றிலும் தவிர்க்கவும்.'
    ],
    te: [
      'ఇంట్లో వండిన తేలికపాటి, శుభ్రమైన ఆహారం తీసుకోండి.',
      'రోజూ 2.5 నుండి 3 లీటర్ల శుభ్రమైన నీరు త్రాగండి.',
      'మందులను నిర్ణీత సమయానికి తప్పకుండా వాడండి.',
      'ధూమపానం మరియు మద్యం పూర్తిగా మానండి.'
    ],
    bn: [
      'সহজপাচ্য, তাজা ও ঘরে তৈরি খাবার গ্রহণ করুন।',
      'প্রতিদিন ২.৫ থেকে ৩ লিটার বিশুদ্ধ জল পান করুন।',
      'সময়মতো এবং নিয়ম মেনে সব ওষুধ খান।',
      'মদ্যপান ও তামাকজাত দ্রব্য সম্পূর্ণ বর্জন করুন।'
    ]
  }
};

const RED_FLAG_WARNINGS: Record<string, { title: string; items: string[]; helpline: string }> = {
  en: {
    title: 'EMERGENCY RED FLAGS — Seek Immediate Care If:',
    items: [
      'Severe chest tightness, heavy pressure, or pain radiating to left arm/jaw.',
      'Sudden severe difficulty in breathing or gasping for air (SpO2 below 93%).',
      'High fever above 103°F (39.4°C) not responding to medication.',
      'Sudden weakness, facial droop, slurred speech, or loss of consciousness.',
      'Persistent repeated vomiting or inability to retain fluids.'
    ],
    helpline: 'Hospital Emergency: +91 1800-425-9999 / Ambulance: 108'
  },
  hi: {
    title: 'आपातकालीन चेतावनी — तुरंत अस्पताल जाएं यदि:',
    items: [
      'सीने में तेज दर्द, भारीपन या दबाव जो बाएं हाथ या जबड़े तक फैले।',
      'सांस लेने में अचानक बहुत तकलीफ होना या ऑक्सीजन स्तर 93% से कम होना।',
      'दवा लेने के बाद भी 103°F से अधिक तेज बुखार न उतरना।',
      'अचानक चेहरे का टेढ़ा होना, बोलने में लड़खड़ाहट, कमजोरी या बेहोशी।',
      'लगातार उल्टी होना या पानी भी न पच पाना।'
    ],
    helpline: 'अस्पताल आपातकालीन नंबर: +91 1800-425-9999 / एम्बुलेंस: 108'
  },
  mr: {
    title: 'तातडीची धोक्याची लक्षणे — खालील त्रास झाल्यास त्वरित या:',
    items: [
      'छातीत तीव्र दुखणे, दाब जाणवणे किंवा डाव्या हाताकडे कळ जाणे.',
      'अचानक तीव्र धाप लागणे किंवा श्वास घेण्यास त्रास होणे (ऑक्सिजन ९३% पेक्षा कमी).',
      'औषध घेऊनही १०३°F पेक्षा जास्त ताप न उतरणे.',
      'तोंड वाकडे होणे, बोलताना अडखळणे, हात-पाय गळणे किंवा चक्कर येणे.',
      'सतत उलट्या होणे किंवा पाणीही पोटात न टिकणे.'
    ],
    helpline: 'रुग्णालय आपत्कालीन क्रमांक: +91 1800-425-9999 / रुग्णवाहिका: 108'
  },
  ta: {
    title: 'அவசர எச்சரிக்கை அறிகுறிகள் — உடனே மருத்துவமனைக்கு வாருங்கள்:',
    items: [
      'திடீர் கடுமையான நெஞ்சு வலி, அழுத்தம் அல்லது இடது கைக்கு வலி பரவுதல்.',
      'திடீர் கடுமையான மூச்சுத் திணறல் அல்லது ஆக்ஸிஜன் அளவு 93%க்குக் கீழ் குறைதல்.',
      'மருந்து சாப்பிட்டும் 103°Fக்கு மேல் கடுமையான காய்ச்சல் நீடித்தல்.',
      'திடீர் பக்கவாதம், முகம் மாறுதல், பேசுவதில் தடுமாற்றம் அல்லது மயக்கம்.',
      'தொடர்ந்து கடுமையான வாந்தி அல்லது திரவத்தை விழுங்க முடியாமை.'
    ],
    helpline: 'அவசர உதவி எண்: +91 1800-425-9999 / ஆம்புலன்ஸ்: 108'
  },
  te: {
    title: 'అత్యవసర హెచ్చరిక సంకేతాలు — వెంటనే ఆసుపత్రికి రండి:',
    items: [
      'ఛాతీలో తీవ్రమైన నొప్పి, బరువు లేదా ఎడమ చేతికి నొప్పి వ్యాపించడం.',
      'తీవ్రమైన శ్వాస తీసుకోవడంలో ఇబ్బంది లేదా ఆక్సిజన్ 93% కంటే తగ్గడం.',
      'మందులు వాడినా 103°F కంటే ఎక్కువ జ్వరం తగ్గకపోవడం.',
      'ముఖం వంకరపోవడం, మాట తడబడటం, తీవ్ర బలహీనత లేదా స్పృహ తప్పడం.',
      'నిరంతరం వాంతులు కావడం లేదా నీరు కూడా తాగలేకపోవడం.'
    ],
    helpline: 'ఎమర్జెన్సీ హెల్ప్‌లైన్: +91 1800-425-9999 / అంబులెన్స్: 108'
  },
  bn: {
    title: 'জরুরি সতর্কতা সংকেত — অবিলম্বে হাসপাতালে যান যদি:',
    items: [
      'বুকে তীব্র ব্যথা, চাপ বা ব্যথা বাম হাত ও চোয়ালে ছড়িয়ে পড়া।',
      'হঠাৎ তীব্র শ্বাসকষ্ট হওয়া বা অক্সিজেনের মাত্রা ৯৩% এর নিচে নামা।',
      'ওষুধ খাওয়ার পরও ১০৩°F এর বেশি জ্বর না কমা।',
      'হঠাৎ মুখ বেঁকে যাওয়া, কথা জড়িয়ে যাওয়া, তীব্র দুর্বলতা বা অজ্ঞান হওয়া।',
      'ক্রমাগত বমি হওয়া বা জল পর্যন্ত পেটে না থাকা।'
    ],
    helpline: 'জরুরি হেল্পলাইন: +91 1800-425-9999 / অ্যাম্বুলেন্স: 108'
  }
};

function parseFrequencyToSlots(freqStr: string): { morning: boolean; afternoon: boolean; night: boolean; sos: boolean } {
  const f = (freqStr || '').trim().toUpperCase();
  const slots = { morning: false, afternoon: false, night: false, sos: false };

  if (f.includes('1-0-1') || f.replace(/\s+/g, '').includes('1-0-1')) {
    slots.morning = true;
    slots.night = true;
  } else if (f.includes('1-1-1')) {
    slots.morning = true;
    slots.afternoon = true;
    slots.night = true;
  } else if (f.includes('1-0-0') || f.includes('OD') || f.includes('ONCE')) {
    slots.morning = true;
  } else if (f.includes('0-0-1') || f.includes('HS') || f.includes('BEDTIME')) {
    slots.night = true;
  } else if (f.includes('0-1-0')) {
    slots.afternoon = true;
  } else if (f.includes('BD') || f.includes('BID')) {
    slots.morning = true;
    slots.night = true;
  } else if (f.includes('TDS') || f.includes('TID')) {
    slots.morning = true;
    slots.afternoon = true;
    slots.night = true;
  } else if (f.includes('QID') || f.includes('QDS')) {
    slots.morning = true;
    slots.afternoon = true;
    slots.night = true;
  } else if (f.includes('SOS') || f.includes('PRN')) {
    slots.sos = true;
  } else {
    slots.morning = true;
  }

  return slots;
}

export function generateClientDischargePlan(
  patientName: string,
  patientAge: number,
  patientGender: string,
  diagnosis: string,
  medications: any[],
  followUpDate?: string,
  language: string = 'hi'
): PatientDischargePlan {
  const langKey = SUPPORTED_LANGUAGES.some(l => l.code === language) ? language : 'en';
  const langMeta = SUPPORTED_LANGUAGES.find(l => l.code === langKey) || SUPPORTED_LANGUAGES[0];
  const tDict = TIMING_DESCRIPTIONS[langKey] || TIMING_DESCRIPTIONS.en;

  const processedMeds: PatientInstructionMedication[] = (medications || []).map((med, idx) => {
    const rawName = med.name || `Medicine ${idx + 1}`;
    const dosage = med.dosage || '1 tab';
    const frequency = med.frequency || '1-0-1';
    const duration = med.duration || '5 Days';
    const instructions = med.instructions || med.instruction || 'After Food';

    let matchedKey: string | null = null;
    for (const key of Object.keys(DRUG_CLASSIFICATIONS)) {
      if (rawName.toLowerCase().includes(key)) {
        matchedKey = key;
        break;
      }
    }

    const slots = parseFrequencyToSlots(frequency);
    const isBeforeFood = instructions.toLowerCase().includes('before') || instructions.toLowerCase().includes('ac');
    const foodTimingText = isBeforeFood ? tDict.before_food : tDict.after_food;

    let category = 'Prescribed Medication';
    let purpose = '';
    let caution = '';

    if (matchedKey) {
      const info = DRUG_CLASSIFICATIONS[matchedKey];
      category = info.class;
      purpose = info.purpose[langKey] || info.purpose.en;
      caution = info.caution[langKey] || info.caution.en;
    } else {
      if (langKey === 'hi') {
        purpose = `डॉक्टर के निर्देशानुसार ${rawName} की खुराक लें।`;
        caution = 'दवा सही समय पर लें और खुद से मात्रा न बदलें।';
      } else if (langKey === 'mr') {
        purpose = `डॉक्टरांच्या सल्ल्यानुसार ${rawName} वेळेवर घ्या.`;
        caution = 'औषध वेळेवर घ्या आणि स्वतःहून प्रमाण बदलू नका.';
      } else if (langKey === 'ta') {
        purpose = `மருத்துவர் பரிந்துரைத்தபடி ${rawName} உட்கொள்ளவும்.`;
        caution = 'மருந்தை தவறாமல் சரியான நேரத்தில் எடுக்கவும்.';
      } else if (langKey === 'te') {
        purpose = `డాక్టర్ సూచించిన ప్రకారం ${rawName} మందును తీసుకోండి.`;
        caution = 'మందులను సరైన సమయానికి వాడండి.';
      } else if (langKey === 'bn') {
        purpose = `ডাক্তারের পরামর্শ অনুযায়ী ${rawName} নিয়মিত খান।`;
        caution = 'সময়মতো ওষুধ খান এবং ডোজ পরিবর্তন করবেন না।';
      } else {
        purpose = `Take ${rawName} as directed by your physician.`;
        caution = 'Take on schedule and do not alter the prescribed dose.';
      }
    }

    const scheduleSlots: MedicationScheduleSlot[] = [];
    if (slots.morning) {
      scheduleSlots.push({ slot: 'Morning', label: tDict.morning, icon: 'sunrise', time: '08:00 AM' });
    }
    if (slots.afternoon) {
      scheduleSlots.push({ slot: 'Afternoon', label: tDict.afternoon, icon: 'sun', time: '01:30 PM' });
    }
    if (slots.night) {
      scheduleSlots.push({ slot: 'Night', label: tDict.night, icon: 'moon', time: '08:30 PM' });
    }
    if (slots.sos) {
      scheduleSlots.push({ slot: 'SOS', label: tDict.sos, icon: 'alert-circle', time: 'When needed' });
    }

    return {
      id: `inst-med-${idx + 1}`,
      name: rawName,
      category,
      dosage,
      frequency_raw: frequency,
      duration,
      food_timing: foodTimingText,
      is_before_food: isBeforeFood,
      purpose,
      caution,
      schedule_slots: scheduleSlots
    };
  });

  const diagLower = (diagnosis || '').toLowerCase();
  let dietItems: string[];
  if (diagLower.includes('hyperten') || diagLower.includes('bp')) {
    dietItems = DIETARY_GUIDELINES.hypertension[langKey] || DIETARY_GUIDELINES.hypertension.en;
  } else if (diagLower.includes('diabet') || diagLower.includes('sugar')) {
    dietItems = DIETARY_GUIDELINES.diabetes[langKey] || DIETARY_GUIDELINES.diabetes.en;
  } else if (diagLower.includes('infect') || diagLower.includes('fever') || diagLower.includes('urti')) {
    dietItems = DIETARY_GUIDELINES.infection[langKey] || DIETARY_GUIDELINES.infection.en;
  } else {
    dietItems = DIETARY_GUIDELINES.general[langKey] || DIETARY_GUIDELINES.general.en;
  }

  const redFlags = RED_FLAG_WARNINGS[langKey] || RED_FLAG_WARNINGS.en;

  const greetingMap: Record<string, string> = {
    en: `Patient Care & Prescription Guide for ${patientName} (${patientAge}y / ${patientGender})`,
    hi: `${patientName} (${patientAge} वर्ष / ${patientGender}) के लिए स्वास्थ्य एवं दवा निर्देश`,
    mr: `${patientName} (${patientAge} वर्षे / ${patientGender}) यांच्यासाठी औषध व आरोग्य सूचना`,
    ta: `${patientName} (${patientAge} வயது / ${patientGender}) அவர்களுக்கான மருந்து மற்றும் பராமரிப்பு வழிகாட்டி`,
    te: `${patientName} (${patientAge} సం. / ${patientGender}) గారి కోసం మందులు మరియు సంరక్షణ మార్గదర్శకాలు`,
    bn: `${patientName} (${patientAge} বছর / ${patientGender})-এর জন্য ওষুধ ও স্বাস্থ্য নির্দেশিকা`
  };

  const followUpMap: Record<string, string> = {
    en: `Next Follow-up Visit: ${followUpDate || 'After 5-7 days or if symptoms persist'}`,
    hi: `अगली जांच (फॉलो-अप): ${followUpDate || '5-7 दिनों बाद या तकलीफ रहने पर तुरंत'}`,
    mr: `पुढील तपासणी: ${followUpDate || '५-७ दिवसांनंतर किंवा त्रास झाल्यास त्वरित'}`,
    ta: `அடுத்த பரிசோதனை: ${followUpDate || '5-7 நாட்களுக்குப் பிறகு அல்லது தொந்தரவு இருந்தால் உடனே'}`,
    te: `తదుపరి సంప్రదింపు: ${followUpDate || '5-7 రోజుల తర్వాత లేదా సమస్య ఉంటే వెంటనే'}`,
    bn: `পরবর্তী ফলো-আপ: ${followUpDate || '৫-৭ দিন পর অথবা লক্ষণ থাকলে অবিলম্বে'}`
  };

  const medLines = processedMeds.map(m => {
    const slotsStr = m.schedule_slots.map(s => s.label).join(', ');
    return `💊 *${m.name}* (${m.dosage})\n   🕒 ${slotsStr} | ${m.food_timing}\n   ℹ️ _${m.purpose}_`;
  });

  const whatsappText = `🏥 *CLINICASE AI — DIGITAL PRESCRIPTION & CARE SLIP*\n\n` +
    `👤 *Patient:* ${patientName} (${patientAge}y / ${patientGender})\n` +
    `🩺 *Diagnosis:* ${diagnosis || 'Clinical Consultation'}\n` +
    `📅 *Date:* ${followUpDate || 'Today'}\n\n` +
    `📋 *MEDICATIONS SCHEDULE:*\n` + medLines.join('\n\n') + `\n\n` +
    `🥗 *DIET & LIFESTYLE:*\n` + dietItems.slice(0, 3).map(d => `• ${d}`).join('\n') + `\n\n` +
    `⚠️ *EMERGENCY:*\n${redFlags.helpline}\n\n` +
    `🔄 *Follow-up:* ${followUpMap[langKey]}`;

  return {
    language: langKey,
    language_name: langMeta.name,
    language_native: langMeta.native,
    voice_code: langMeta.voice_code,
    greeting: greetingMap[langKey] || greetingMap.en,
    diagnosis_display: diagnosis || 'General Consultation',
    medications: processedMeds,
    diet_guidelines: dietItems,
    emergency_warnings: redFlags,
    follow_up_instruction: followUpMap[langKey] || followUpMap.en,
    whatsapp_share_text: whatsappText
  };
}
