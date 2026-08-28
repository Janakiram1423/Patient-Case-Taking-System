"""
Clinical Multilingual Patient Discharge & Prescription Instructions Generator
Translates clinical case records, Latin prescription abbreviations, and medical diagnoses
into patient-friendly, visual instructions in English, Hindi, Marathi, Tamil, Telugu, and Bengali.
"""

from typing import Dict, Any, List, Optional

# Language metadata
SUPPORTED_LANGUAGES = {
    "en": {"name": "English", "native": "English", "voice_code": "en-IN"},
    "hi": {"name": "Hindi", "native": "हिंदी", "voice_code": "hi-IN"},
    "mr": {"name": "Marathi", "native": "मराठी", "voice_code": "mr-IN"},
    "ta": {"name": "Tamil", "native": "தமிழ்", "voice_code": "ta-IN"},
    "te": {"name": "Telugu", "native": "తెలుగు", "voice_code": "te-IN"},
    "bn": {"name": "Bengali", "native": "বাংলা", "voice_code": "bn-IN"},
}

# Drug Purpose & Classification mapping
DRUG_CLASSIFICATIONS = {
    "paracetamol": {
        "class": "Antipyretic / Analgesic",
        "purpose": {
            "en": "For relieving pain and reducing fever.",
            "hi": "दर्द कम करने और बुखार उतारने के लिए।",
            "mr": "वेदना कमी करण्यासाठी आणि ताप उतरवण्यासाठी.",
            "ta": "வலி மற்றும் காய்ச்சலைக் குறைக்க.",
            "te": "నొప్పి మరియు జ్వరాన్ని తగ్గించడానికి.",
            "bn": "ব্যথা উপশম এবং জ্বর কমানোর জন্য।"
        },
        "caution": {
            "en": "Do not take more than 4 doses in 24 hours.",
            "hi": "24 घंटे में 4 बार से अधिक न लें।",
            "mr": "24 तासांत 4 पेक्षा जास्त वेळा घेऊ नका.",
            "ta": "24 மணி நேரத்தில் 4 முறைக்கு மேல் எடுக்க வேண்டாம்.",
            "te": "24 గంటల్లో 4 కంటే ఎక్కువ మోతాదులు తీసుకోకండి.",
            "bn": "২৪ ঘণ্টায় ৪ বারের বেশি খাবেন না।"
        }
    },
    "augmentin": {
        "class": "Antibiotic",
        "purpose": {
            "en": "Antibiotic to eliminate bacterial infection. Complete the full course.",
            "hi": "बैक्टीरियल इन्फेक्शन खत्म करने के लिए एंटीबायोटिक। पूरा कोर्स खत्म करें।",
            "mr": "जिवाणू संसर्ग नष्ट करण्यासाठी अँटीबायोटिक. पूर्ण कोर्स संपवा.",
            "ta": "பாக்டீரியா தொற்றை போக்க உதவும் ஆன்டிபயாடிக். முழு படிப்பையும் முடிக்கவும்.",
            "te": "బాక్టీరియల్ ఇన్ఫెక్షన్‌ను నయం చేయడానికి యాంటీబయాటిక్. కోర్సు పూర్తి చేయండి.",
            "bn": "ব্যাকটেরিয়া সংক্রমণ দূর করার অ্যান্টিবায়োটিক। পুরো কোর্স শেষ করুন।"
        },
        "caution": {
            "en": "Take strictly after food. Do not stop midway even if feeling better.",
            "hi": "हमेशा भोजन के बाद लें। ठीक महसूस होने पर भी बीच में बंद न करें।",
            "mr": "नेहमी जेवणानंतर घ्या. बरे वाटले तरी औषध मध्येच थांबवू नका.",
            "ta": "எப்போதும் உணவுக்குப் பின் உட்கொள்ளவும். பாதியில் நிறுத்த வேண்டாம்.",
            "te": "ఎల్లప్పుడూ భోజనం తర్వాత తీసుకోండి. మధ్యలో ఆపకండి.",
            "bn": "সর্বদা খাবারের পর খান। মাঝপথে ওষুধ বন্ধ করবেন না।"
        }
    },
    "amoxicillin": {
        "class": "Antibiotic",
        "purpose": {
            "en": "Antibiotic to fight bacterial infection. Complete the entire course.",
            "hi": "संक्रमण से लड़ने के लिए एंटीबायोटिक दवा। पूरा कोर्स अवश्य लें।",
            "mr": "संसर्गाशी लढण्यासाठी अँटीबायोटिक. पूर्ण कोर्स पूर्ण करा.",
            "ta": "தொற்றை குணப்படுத்தும் ஆன்டிபயாடிக் மருந்து. முழுமையாக உட்கொள்ளவும்.",
            "te": "ఇన్ఫెక్షన్ నయమయ్యేందుకు యాంటీబయాటిక్. పూర్తి కోర్సు వాడండి.",
            "bn": "সংক্রমণ নিরাময়ের অ্যান্টিবায়োটিক। সম্পূর্ণ কোর্স গ্রহণ করুন।"
        },
        "caution": {
            "en": "Take after meals at regular intervals.",
            "hi": "नियमित समय पर खाने के बाद लें।",
            "mr": "वेळेवर जेवणानंतर घ्या.",
            "ta": "சரியான நேர இடைவெளியில் உணவுக்குப் பின் சாப்பிடவும்.",
            "te": "సమయానికి భోజనం తర్వాత తీసుకోండి.",
            "bn": "নিয়মিত সময়ে খাবারের পর খান।"
        }
    },
    "pantocid": {
        "class": "Proton Pump Inhibitor (Acidity)",
        "purpose": {
            "en": "Reduces stomach acid, prevents heartburn and gastric irritation.",
            "hi": "पेट में गैस और एसिडिटी कम करने तथा जलन रोकने के लिए।",
            "mr": "पोटातील ॲसिडिटी आणि जळजळ कमी करण्यासाठी.",
            "ta": "வயிற்று அமிலத்தன்மை மற்றும் நெஞ்செரிச்சலை குறைக்க.",
            "te": "కడుపులో గ్యాస్ మరియు మంటను తగ్గించడానికి.",
            "bn": "পেটের গ্যাস ও অ্যাসিডিটি কমানোর জন্য।"
        },
        "caution": {
            "en": "Take on an empty stomach 30 minutes before breakfast.",
            "hi": "नाश्ते से 30 मिनट पहले खाली पेट लें।",
            "mr": "सकाळच्या नाश्त्याच्या 30 मिनिटे आधी रिकाम्या पोटी घ्या.",
            "ta": "காலை உணவுக்கு 30 நிமிடங்களுக்கு முன் வெறும் வயிற்றில் எடுக்கவும்.",
            "te": "ఉదయం అల్పాహారానికి 30 నిమిషాల ముందు ఖాళీ కడుపుతో తీసుకోండి.",
            "bn": "সকালের নাস্তার ৩০ মিনিট আগে খালি পেটে খান।"
        }
    },
    "pantoprazole": {
        "class": "Proton Pump Inhibitor (Acidity)",
        "purpose": {
            "en": "Reduces stomach acid and protects stomach lining.",
            "hi": "पेट के एसिड को कम करता है और पेट की परत की रक्षा करता है।",
            "mr": "पोटातील ॲसिड कमी करतो आणि पोटाचे संरक्षण करतो.",
            "ta": "வயிற்று அமிலத்தைக் குறைத்து வயிற்றைப் பாதுகாக்கிறது.",
            "te": "కడుపులోని యాసిడ్‌ను తగ్గిస్తుంది.",
            "bn": "পেটের অ্যাসিড কমায় এবং পেটের সুরক্ষা দেয়।"
        },
        "caution": {
            "en": "Take once daily before breakfast on an empty stomach.",
            "hi": "सुबह नाश्ते से पहले खाली पेट एक बार लें।",
            "mr": "सकाळी रिकाम्या पोटी नाश्त्यापूर्वी एक वेळ घ्या.",
            "ta": "காலை உணவுக்கு முன் வெறும் வயிற்றில் எடுக்கவும்.",
            "te": "ఉదయం ఖాళీ కడుపుతో తీసుకోండి.",
            "bn": "সকালে খালি পেটে খান।"
        }
    },
    "azithral": {
        "class": "Macrolide Antibiotic",
        "purpose": {
            "en": "Antibiotic for throat, chest, and respiratory tract infections.",
            "hi": "गले और सीने के संक्रमण के लिए एंटीबायोटिक।",
            "mr": "घसा आणि छातीच्या संसर्गासाठी अँटीबायोटिक.",
            "ta": "தொண்டை மற்றும் நுரையீரல் தொற்றுக்கான ஆன்டிபயாடிக்.",
            "te": "గొంతు మరియు ఊపిరితిత్తుల ఇన్ఫెక్షన్ కోసం యాంటీబయాటిక్.",
            "bn": "গলা এবং বুকের সংক্রমণের জন্য অ্যান্টিবায়োটিক।"
        },
        "caution": {
            "en": "Take at the exact same time every day for prescribed days.",
            "hi": "दवा रोज एक ही समय पर लें।",
            "mr": "दररोज एकाच वेळी औषध घ्या.",
            "ta": "தினமும் ஒரே நேரத்தில் எடுக்கவும்.",
            "te": "రోజూ ఒకే సమయానికి తీసుకోండి.",
            "bn": "প্রতিদিন একই সময়ে ওষুধ খান।"
        }
    },
    "telma": {
        "class": "Antihypertensive (Blood Pressure)",
        "purpose": {
            "en": "Maintains blood pressure within a healthy, normal range.",
            "hi": "ब्लड प्रेशर (रक्तचाप) को सामान्य रखने के लिए।",
            "mr": "रक्तदाब (बीपी) नियंत्रित ठेवण्यासाठी.",
            "ta": "இரத்த அழுத்தத்தை சீராக வைத்திருக்க.",
            "te": "రక్తపోటును అదుపులో ఉంచడానికి.",
            "bn": "রক্তচাপ নিয়ন্ত্রণে রাখার জন্য।"
        },
        "caution": {
            "en": "Do not skip or stop this medicine without doctor's consultation.",
            "hi": "डॉक्टर की सलाह के बिना यह दवा कभी बंद न करें।",
            "mr": "डॉक्टरांच्या सल्ल्याशिवाय हे औषध बंद करू नका.",
            "ta": "மருத்துவர் ஆலோசனை இல்லாமல் நிறுத்த வேண்டாம்.",
            "te": "డాక్టర్ సలహా లేకుండా మందు ఆపవద్దు.",
            "bn": "ডাক্তারের পরামর্শ ছাড়া এই ওষুধ বন্ধ করবেন না।"
        }
    },
    "glycomet": {
        "class": "Antidiabetic (Sugar Control)",
        "purpose": {
            "en": "Lowers blood glucose and manages diabetes.",
            "hi": "ब्लड शुगर नियंत्रित करने और डायबिटीज प्रबंधन के लिए।",
            "mr": "रक्तातील साखर नियंत्रित ठेवण्यासाठी.",
            "ta": "இரத்த சர்க்கரை அளவைக் கட்டுப்படுத்த.",
            "te": "బ్లడ్ షుగర్ నియంత్రణలో ఉంచడానికి.",
            "bn": "রক্তে শর্করা নিয়ন্ত্রণ করতে।"
        },
        "caution": {
            "en": "Always take with or immediately after meals. Monitor for hypoglycemia.",
            "hi": "हमेशा भोजन के साथ या तुरंत बाद लें।",
            "mr": "नेहमी जेवणासोबत किंवा जेवणानंतर लगेच घ्या.",
            "ta": "எப்போதும் உணவோடு அல்லது உணவுக்குப் பின் உட்கொள்ளவும்.",
            "te": "ఎల్లప్పుడూ భోజనంతో పాటు లేదా వెంటనే తీసుకోండి.",
            "bn": "সর্বদা খাবারের সাথে বা পরে অবিলম্বে খান।"
        }
    },
    "metformin": {
        "class": "Antidiabetic (Sugar Control)",
        "purpose": {
            "en": "Controls blood sugar levels effectively.",
            "hi": "ब्लड शुगर के स्तर को नियंत्रित करता है।",
            "mr": "साखरेची पातळी नियंत्रित ठेवतो.",
            "ta": "சர்க்கரை அளவை திறம்பட கட்டுப்படுத்துகிறது.",
            "te": "షుగర్ లెవెల్స్ అదుపులో ఉంచుతుంది.",
            "bn": "রক্তে শর্করার মাত্রা নিয়ন্ত্রণ করে।"
        },
        "caution": {
            "en": "Take with meals to avoid upset stomach.",
            "hi": "पेट की परेशानी से बचने के लिए भोजन के साथ लें।",
            "mr": "पोटाचा त्रास टाळण्यासाठी जेवणासोबत घ्या.",
            "ta": "வயிற்று உபாதையைத் தவிர்க்க உணவோடு உட்கொள்ளவும்.",
            "te": "భోజనంతో పాటు తీసుకోండి.",
            "bn": "খাবারের সাথে গ্রহণ করুন।"
        }
    },
    "combiflam": {
        "class": "NSAID Pain & Inflammation",
        "purpose": {
            "en": "Relieves body aches, muscular pain, headache, and fever.",
            "hi": "बदन दर्द, सिरदर्द, सूजन और बुखार से राहत के लिए।",
            "mr": "अंगदुखी, डोकेदुखी आणि ताप कमी करण्यासाठी.",
            "ta": "உடல் வலி, தலைவலி மற்றும் காய்ச்சலை நீக்க.",
            "te": "శరీర నొప్పులు, తలనొప్పి మరియు జ్వరం నుండి ఉపశమనం కోసం.",
            "bn": "শরীর ব্যথা, মাথাব্যথা ও জ্বর কমানোর জন্য।"
        },
        "caution": {
            "en": "Never take on an empty stomach. Take only as needed.",
            "hi": "खाली पेट कभी न लें। जरूरत पड़ने पर ही लें।",
            "mr": "रिकाम्या पोटी कधीही घेऊ नका. आवश्यकतेनुसारच घ्या.",
            "ta": "வெறும் வயிற்றில் சாப்பிட வேண்டாம்.",
            "te": "ఖాళీ కడుపుతో ఎప్పుడూ తీసుకోకండి.",
            "bn": "কখনও খালি পেটে খাবেন না।"
        }
    }
}

# Timing & Slot Translations
TIMING_DESCRIPTIONS = {
    "en": {
        "morning": "Morning (Breakfast)",
        "afternoon": "Afternoon (Lunch)",
        "night": "Night (Dinner)",
        "sos": "As needed (SOS)",
        "before_food": "Before Food (Empty stomach)",
        "after_food": "After Food",
        "with_food": "With Meals",
        "duration": "Days"
    },
    "hi": {
        "morning": "सुबह (नाश्ते के समय)",
        "afternoon": "दोपहर (खाने के समय)",
        "night": "रात (रात के खाने के समय)",
        "sos": "जरूरत पड़ने पर (दर्द / बुखार होने पर)",
        "before_food": "खाली पेट (खाने से पहले)",
        "after_food": "खाना खाने के बाद",
        "with_food": "भोजन के साथ",
        "duration": "दिन"
    },
    "mr": {
        "morning": "सकाळी (नाश्त्याच्या वेळी)",
        "afternoon": "दुपारी (जेवणाच्या वेळी)",
        "night": "रात्री (जेवणानंतर)",
        "sos": "गरज भासल्यास (त्रास झाल्यावर)",
        "before_food": "जेवणापूर्वी (रिकाम्या पोटी)",
        "after_food": "जेवणानंतर",
        "with_food": "जेवणासोबत",
        "duration": "दिवस"
    },
    "ta": {
        "morning": "காலை (காலை உணவு)",
        "afternoon": "மதியம் (மதிய உணவு)",
        "night": "இரவு (இரவு உணவு)",
        "sos": "தேவைப்படும் போது மட்டும் (SOS)",
        "before_food": "உணவுக்கு முன் (வெறும் வயிற்றில்)",
        "after_food": "உணவுக்குப் பின்",
        "with_food": "உணவுடன்",
        "duration": "நாட்கள்"
    },
    "te": {
        "morning": "ఉదయం (టిఫిన్ తర్వాత)",
        "afternoon": "మధ్యాహ్నం (భోజనం తర్వాత)",
        "night": "రాత్రి (రాత్రి భోజనం తర్వాత)",
        "sos": "అవసరమైనప్పుడు మాత్రమే (SOS)",
        "before_food": "భోజనానికి ముందు (ఖాళీ కడుపుతో)",
        "after_food": "భోజనం తర్వాత",
        "with_food": "భోజనంతో పాటు",
        "duration": "రోజులు"
    },
    "bn": {
        "morning": "সকালে (নাস্তার সময়)",
        "afternoon": "দুপুরে (দুপুরের খাবারের সময়)",
        "night": "রাতে (রাতের খাবারের সময়)",
        "sos": "প্রয়োজনে (SOS)",
        "before_food": "খাবারের আগে (খালি পেটে)",
        "after_food": "খাবারের পরে",
        "with_food": "খাবারের সাথে",
        "duration": "দিন"
    }
}

# Condition-specific Dietary & Lifestyle guidelines
DIETARY_GUIDELINES = {
    "hypertension": {
        "en": [
            "Limit table salt strictly (under 1 teaspoon / 5g per day).",
            "Avoid deep fried snacks, pickles, papads, and processed foods.",
            "Engage in 30 minutes of brisk walking daily.",
            "Stay well hydrated and limit caffeine."
        ],
        "hi": [
            "नमक की मात्रा बहुत कम रखें (दिन भर में 1 चम्मच से कम)।",
            "तले-भुने पकवान, पापड़, अचार और डिब्बाबंद खाद्य पदार्थों से परहेज करें।",
            "प्रतिदिन 30 मिनट तेज गति से टहलें।",
            "पर्याप्त मात्रा में पानी पिएं और चाय/कॉफी कम करें।"
        ],
        "mr": [
            "मिठाचे प्रमाण खूप कमी ठेवा (दिवसाला १ चमच्यापेक्षा कमी).",
            "तळलेले पदार्थ, लोणचे, पापड आणि खारट पदार्थ टाळा.",
            "दररोज ३० मिनिटे वेगाने चालण्याचा व्यायाम करा.",
            "भरपूर पाणी प्या आणि चहा-कॉफी कमी करा."
        ],
        "ta": [
            "உப்பு உட்கொள்ளலை மிகக் குறைவாக வைக்கவும் (ஒரு நாளைக்கு 1 தேக்கரண்டிக்கு கீழ்).",
            "வறுத்த உணவுகள், ஊறுகாய் மற்றும் அப்பளம் ஆகியவற்றைத் தவிர்க்கவும்.",
            "தினமும் 30 நிமிடங்கள் நடைபயிற்சி மேற்கொள்ளவும்.",
            "நிறைய தண்ணீர் குடிக்கவும்."
        ],
        "te": [
            "ఉప్పు వినియోగాన్ని బాగా తగ్గించండి (రోజుకు 1 స్పూన్ కంటే తక్కువ).",
            "నూనెలో వేయించిన పదార్థాలు, పచ్చళ్ళు, అప్పడాలు మానండి.",
            "రోజూ 30 నిమిషాలు వేగంగా నడవండి.",
            "తగినంత నీరు త్రాగండి."
        ],
        "bn": [
            "লবণের পরিমাণ কঠোরভাবে সীমিত রাখুন (দিনে ১ চা চামচের কম)।",
            "ভাজাপোড়া খাবার, আচার এবং প্রক্রিয়াজাত খাবার এড়িয়ে চলুন।",
            "প্রতিদিন ৩০ মিনিট হাঁটুন।",
            "প্রচুর জল পান করুন।"
        ]
    },
    "diabetes": {
        "en": [
            "Avoid direct sugar, sweets, sodas, fruit juices, and refined flour (maida).",
            "Eat whole grains, millets, leafy vegetables, and high-fiber foods.",
            "Do not skip meals; eat at regular fixed intervals to prevent low blood sugar.",
            "Check feet daily for cuts or sores; keep them clean and dry."
        ],
        "hi": [
            "चीनी, मिठाई, कोल्ड ड्रिंक्स, फलों का जूस और मैदा बिल्कुल न लें।",
            "मोटा अनाज (ज्वार, बाजरा), हरी पत्तेदार सब्जियां और फाइबर युक्त भोजन खाएं।",
            "समय पर भोजन करें; भोजन कभी न छोड़ें ताकि शुगर अचानक कम न हो।",
            "रोजाना पैरों की जांच करें और उन्हें साफ व सूखा रखें।"
        ],
        "mr": [
            "साखर, मिठाई, कोल्ड ड्रिंक्स आणि मैद्याचे पदार्थ पूर्णपणे टाळा.",
            "ज्वारी, बाजरी, हिरव्या पालेभाज्या आणि फायबरयुक्त आहार घ्या.",
            "वेळेवर जेवण करा; उपाशी राहू नका.",
            "दररोज पायांची काळजी घ्या आणि ते स्वच्छ ठेवा."
        ],
        "ta": [
            "சர்க்கரை, இனிப்புகள், குளிர்பானங்கள் மற்றும் மைதாவை முற்றிலும் தவிர்க்கவும்.",
            "சிறு தானியங்கள், கீரைகள் மற்றும் நார்ச்சத்துள்ள உணவுகளை அதிகம் உட்கொள்ளவும்.",
            "சரியான நேரத்திற்கு சாப்பிடுங்கள்; உணவைத் தவிர்க்காதீர்கள்.",
            "பாதங்களை தினமும் பரிசோதித்து சுத்தமாக வைத்திருக்கவும்."
        ],
        "te": [
            "చక్కెర, స్వీట్లు, కూల్ డ్రింక్స్ మరియు మైదాను పూర్తిగా నివారించండి.",
            "చిరుధాన్యాలు, ఆకుకూరలు మరియు ఫైబర్ అధికంగా ఉండే ఆహారం తీసుకోండి.",
            "సమయానికి భోజనం చేయండి; భోజనం మానేయకండి.",
            "పాదాలను రోజూ శుభ్రంగా ఉంచుకోండి."
        ],
        "bn": [
            "চিনি, মিষ্টি, কোমল পানীয় এবং ময়দা পরিহার করুন।",
            "শাকসবজি, লাল চালের ভাত এবং ফাইবার সমৃদ্ধ খাবার খান।",
            "নিয়মিত সময়ে খাবার গ্রহণ করুন; খাবার এড়িয়ে যাবেন না।",
            "পায়ের যত্ন নিন এবং পরিষ্কার রাখুন।"
        ]
    },
    "infection": {
        "en": [
            "Drink plenty of warm fluids, soups, and boiled water.",
            "Get adequate bed rest (7-8 hours) for quick immune recovery.",
            "Avoid chilled drinks, street food, and stale meals.",
            "Do steam inhalation 2 times a day if experiencing congestion."
        ],
        "hi": [
            "खूब गुनगुना पानी, सूप और उबला हुआ पानी पिएं।",
            "शरीर को ठीक होने के लिए पर्याप्त आराम (7-8 घंटे की नींद) दें।",
            "ठंडा पानी, बाहर का खुला खाना और बासी भोजन न करें।",
            "गले व नाक में जकड़न होने पर दिन में दो बार भाप लें।"
        ],
        "mr": [
            "कोमट पाणी, सूप आणि उकळलेले पाणी भरपूर प्या.",
            "लवकर बरे होण्यासाठी पुरेशी विश्रांती (७-८ तास झोप) घ्या.",
            "थंड पेये, बाहेरचे उघड्यावरील अन्न खाणे टाळा.",
            "नाक चोंदले असल्यास दिवसातून दोनदा गरम पाण्याची वाफ घ्या."
        ],
        "ta": [
            "ஏராளமான வெதுவெதுப்பான நீர், சூப் மற்றும் கொதிக்கவைத்த நீரைக் குடிக்கவும்.",
            "முழுமையான ஓய்வு (7-8 மணி நேர தூக்கம்) எடுக்கவும்.",
            "குளிர்ந்த பானங்கள் மற்றும் வெளிப்புற உணவுகளைத் தவிர்க்கவும்.",
            "தேவைப்பட்டால் தினமும் 2 முறை ஆவி பிடிக்கவும்."
        ],
        "te": [
            "గోరువెచ్చని నీరు, సూప్‌లు మరియు కాచి చల్లార్చిన నీరు ఎక్కువగా త్రాగండి.",
            "తగినంత విశ్రాంతి తీసుకోండి (7-8 గంటల నిద్ర).",
            "చల్లని పానీయాలు మరియు బయటి ఆహారం తినవద్దు.",
            "జలుబు ఉంటే రోజుకు రెండుసార్లు ఆవిరి పట్టండి."
        ],
        "bn": [
            "প্রচুর হালকা গরম জল, স্যুপ ও ফুটানো জল পান করুন।",
            "পর্যাপ্ত বিশ্রাম নিন (৭-৮ ঘণ্টা ঘুম)।",
            "ঠান্ডা পানীয় এবং বাইরের অস্বাস্থ্যকর খাবার এড়িয়ে চলুন।",
            "নাক বন্ধ থাকলে দিনে দুবার গরম জলের ভাপ নিন।"
        ]
    },
    "general": {
        "en": [
            "Eat light, freshly cooked, easily digestible homemade food.",
            "Drink 2.5 to 3 liters of clean drinking water every day.",
            "Take prescribed medications at the specified hours without skipping.",
            "Avoid alcohol and tobacco products completely."
        ],
        "hi": [
            "घर का बना हल्का, ताजा और सुपाच्य भोजन खाएं।",
            "प्रतिदिन 2.5 से 3 लीटर साफ पीने का पानी अवश्य पिएं।",
            "दवाइयां समय पर लें और कोई भी खुराक न भूलें।",
            "शराब और बीड़ी-सिगरेट/तंबाकू का बिल्कुल सेवन न करें।"
        ],
        "mr": [
            "घरचे ताजे, हलके आणि सहज पचणारे अन्न खा.",
            "दररोज २.५ ते ३ लिटर स्वच्छ पाणी प्या.",
            "औषधे ठरवून दिलेल्या वेळेवरच न चुकता घ्या.",
            "तंबाखू, सिगारेट आणि मद्यपान पूर्णपणे टाळा."
        ],
        "ta": [
            "எளிதில் செரிமானமாகும் வீட்டில் சமைத்த புதிய உணவை உண்ணுங்கள்.",
            "தினமும் 2.5 முதல் 3 லிட்டர் வரை தண்ணீர் அருந்துங்கள்.",
            "மருந்துகளை குறித்த நேரத்தில் தவறாமல் உட்கொள்ளுங்கள்.",
            "புகையிலை மற்றும் மதுபானங்களை முற்றிலும் தவிர்க்கவும்."
        ],
        "te": [
            "ఇంట్లో వండిన తేలికపాటి, శుభ్రమైన ఆహారం తీసుకోండి.",
            "రోజూ 2.5 నుండి 3 లీటర్ల శుభ్రమైన నీరు త్రాగండి.",
            "మందులను నిర్ణీత సమయానికి తప్పకుండా వాడండి.",
            "ధూమపానం మరియు మద్యం పూర్తిగా మానండి."
        ],
        "bn": [
            "সহজপাচ্য, তাজা ও ঘরে তৈরি খাবার গ্রহণ করুন।",
            "প্রতিদিন ২.৫ থেকে ৩ লিটার বিশুদ্ধ জল পান করুন।",
            "সময়মতো এবং নিয়ম মেনে সব ওষুধ খান।",
            "মদ্যপান ও তামাকজাত দ্রব্য সম্পূর্ণ বর্জন করুন।"
        ]
    }
}

# Red Flag Warnings
RED_FLAG_WARNINGS = {
    "en": {
        "title": "EMERGENCY RED FLAGS — Seek Immediate Care If:",
        "items": [
            "Severe chest tightness, heavy pressure, or pain radiating to left arm/jaw.",
            "Sudden severe difficulty in breathing or gasping for air (SpO2 below 93%).",
            "High fever above 103°F (39.4°C) not responding to medication.",
            "Sudden weakness, facial droop, slurred speech, or loss of consciousness.",
            "Persistent repeated vomiting or inability to retain fluids."
        ],
        "helpline": "Hospital Emergency: +91 1800-425-9999 / Ambulance: 108"
    },
    "hi": {
        "title": "आपातकालीन चेतावनी — तुरंत अस्पताल जाएं यदि:",
        "items": [
            "सीने में तेज दर्द, भारीपन या दबाव जो बाएं हाथ या जबड़े तक फैले।",
            "सांस लेने में अचानक बहुत तकलीफ होना या ऑक्सीजन स्तर 93% से कम होना।",
            "दवा लेने के बाद भी 103°F से अधिक तेज बुखार न उतरना।",
            "अचानक चेहरे का टेढ़ा होना, बोलने में लड़खड़ाहट, कमजोरी या बेहोशी।",
            "लगातार उल्टी होना या पानी भी न पच पाना।"
        ],
        "helpline": "अस्पताल आपातकालीन नंबर: +91 1800-425-9999 / एम्बुलेंस: 108"
    },
    "mr": {
        "title": "तातडीची धोक्याची लक्षणे — खालील त्रास झाल्यास त्वरित या:",
        "items": [
            "छातीत तीव्र दुखणे, दाब जाणवणे किंवा डाव्या हाताकडे कळ जाणे.",
            "अचानक तीव्र धाप लागणे किंवा श्वास घेण्यास त्रास होणे (ऑक्सिजन ९३% पेक्षा कमी).",
            "औषध घेऊनही १०३°F पेक्षा जास्त ताप न उतरणे.",
            "तोंड वाकडे होणे, बोलताना अडखळणे, हात-पाय गळणे किंवा चक्कर येणे.",
            "सतत उलट्या होणे किंवा पाणीही पोटात न टिकणे."
        ],
        "helpline": "रुग्णालय आपत्कालीन क्रमांक: +91 1800-425-9999 / रुग्णवाहिका: 108"
    },
    "ta": {
        "title": "அவசர எச்சரிக்கை அறிகுறிகள் — உடனே மருத்துவமனைக்கு வாருங்கள்:",
        "items": [
            "திடீர் கடுமையான நெஞ்சு வலி, அழுத்தம் அல்லது இடது கைக்கு வலி பரவுதல்.",
            "திடீர் கடுமையான மூச்சுத் திணறல் அல்லது ஆக்ஸிஜன் அளவு 93%க்குக் கீழ் குறைதல்.",
            "மருந்து சாப்பிட்டும் 103°Fக்கு மேல் கடுமையான காய்ச்சல் நீடித்தல்.",
            "திடீர் பக்கவாதம், முகம் மாறுதல், பேசுவதில் தடுமாற்றம் அல்லது மயக்கம்.",
            "தொடர்ந்து கடுமையான வாந்தி அல்லது திரவத்தை விழுங்க முடியாமை."
        ],
        "helpline": "அவசர உதவி எண்: +91 1800-425-9999 / ஆம்புலன்ஸ்: 108"
    },
    "te": {
        "title": "అత్యవసర హెచ్చరిక సంకేతాలు — వెంటనే ఆసుపత్రికి రండి:",
        "items": [
            "ఛాతీలో తీవ్రమైన నొప్పి, బరువు లేదా ఎడమ చేతికి నొప్పి వ్యాపించడం.",
            "తీవ్రమైన శ్వాస తీసుకోవడంలో ఇబ్బంది లేదా ఆక్సిజన్ 93% కంటే తగ్గడం.",
            "మందులు వాడినా 103°F కంటే ఎక్కువ జ్వరం తగ్గకపోవడం.",
            "ముఖం వంకరపోవడం, మాట తడబడటం, తీవ్ర బలహీనత లేదా స్పృహ తప్పడం.",
            "నిరంతరం వాంతులు కావడం లేదా నీరు కూడా తాగలేకపోవడం."
        ],
        "helpline": "ఎమర్జెన్సీ హెల్ప్‌లైన్: +91 1800-425-9999 / అంబులెన్స్: 108"
    },
    "bn": {
        "title": "জরুরি সতর্কতা সংকেত — অবিলম্বে হাসপাতালে যান যদি:",
        "items": [
            "বুকে তীব্র ব্যথা, চাপ বা ব্যথা বাম হাত ও চোয়ালে ছড়িয়ে পড়া।",
            "হঠাৎ তীব্র শ্বাসকষ্ট হওয়া বা অক্সিজেনের মাত্রা ৯৩% এর নিচে নামা।",
            "ওষুধ খাওয়ার পরও ১০৩°F এর বেশি জ্বর না কমা।",
            "হঠাৎ মুখ বেঁকে যাওয়া, কথা জড়িয়ে যাওয়া, তীব্র দুর্বলতা বা অজ্ঞান হওয়া।",
            "ক্রমাগত বমি হওয়া বা জল পর্যন্ত পেটে না থাকা।"
        ],
        "helpline": "জরুরি হেল্পলাইন: +91 1800-425-9999 / অ্যাম্বুলেন্স: 108"
    }
}


def _parse_frequency_to_slots(freq_str: str) -> Dict[str, bool]:
    """Parse medical frequency like '1-0-1', 'TDS', 'BD', 'OD', 'QID', 'HS', 'SOS' into slot flags."""
    f = (freq_str or "").strip().upper()
    slots = {"morning": False, "afternoon": False, "night": False, "sos": False}
    
    if "1-0-1" in f or "1-0-1" in f.replace(" ", ""):
        slots["morning"] = True
        slots["night"] = True
    elif "1-1-1" in f:
        slots["morning"] = True
        slots["afternoon"] = True
        slots["night"] = True
    elif "1-0-0" in f or "OD" in f:
        slots["morning"] = True
    elif "0-0-1" in f or "HS" in f:
        slots["night"] = True
    elif "0-1-0" in f:
        slots["afternoon"] = True
    elif "BD" in f or "BID" in f:
        slots["morning"] = True
        slots["night"] = True
    elif "TDS" in f or "TID" in f:
        slots["morning"] = True
        slots["afternoon"] = True
        slots["night"] = True
    elif "QID" in f or "QDS" in f:
        slots["morning"] = True
        slots["afternoon"] = True
        slots["night"] = True
    elif "SOS" in f or "PRN" in f:
        slots["sos"] = True
    else:
        slots["morning"] = True
        
    return slots


def generate_patient_instructions(
    patient_name: str,
    patient_age: int,
    patient_gender: str,
    diagnosis: str,
    medications: List[Dict[str, Any]],
    follow_up_date: Optional[str] = None,
    language: str = "hi"
) -> Dict[str, Any]:
    """
    Generates structured, visual, layperson multilingual discharge instructions.
    """
    lang = language.lower() if language.lower() in SUPPORTED_LANGUAGES else "en"
    t_dict = TIMING_DESCRIPTIONS.get(lang, TIMING_DESCRIPTIONS["en"])
    
    # 1. Process Medications into visual cards
    processed_meds = []
    for idx, med in enumerate(medications):
        raw_name = med.get("name", f"Medicine {idx+1}")
        dosage = med.get("dosage", "1 tab")
        frequency = med.get("frequency", "1-0-1")
        duration = med.get("duration", "5 Days")
        instructions = med.get("instructions", "After Food")
        
        # Check matching drug info
        matched_key = None
        for key in DRUG_CLASSIFICATIONS:
            if key in raw_name.lower():
                matched_key = key
                break
        
        slots = _parse_frequency_to_slots(frequency)
        is_before_food = "before" in instructions.lower() or "ac" in instructions.lower()
        food_timing_text = t_dict["before_food"] if is_before_food else t_dict["after_food"]
        
        if matched_key:
            info = DRUG_CLASSIFICATIONS[matched_key]
            purpose = info["purpose"].get(lang, info["purpose"]["en"])
            caution = info["caution"].get(lang, info["caution"]["en"])
            category = info["class"]
        else:
            category = "Prescribed Medication"
            if lang == "hi":
                purpose = f"डॉक्टर द्वारा सुझाई गई खुराक के अनुसार {raw_name} लें।"
                caution = "दवा समय पर लें और खुद से खुराक न बदलें।"
            elif lang == "mr":
                purpose = f"डॉक्टरांच्या सल्ल्यानुसार {raw_name} वेळेवर घ्या."
                caution = "औषध वेळेवर घ्या आणि स्वतःहून प्रमाण बदलू नका."
            elif lang == "ta":
                purpose = f"மருத்துவர் பரிந்துரைத்தபடி {raw_name} உட்கொள்ளவும்."
                caution = "மருந்தை தவறாமல் சரியான நேரத்தில் எடுக்கவும்."
            elif lang == "te":
                purpose = f"డాక్టర్ సూచించిన ప్రకారం {raw_name} మందును తీసుకోండి."
                caution = "మందులను సరైన సమయానికి వాడండి."
            elif lang == "bn":
                purpose = f"ডাক্তারের পরামর্শ অনুযায়ী {raw_name} নিয়মিত খান।"
                caution = "সময়মতো ওষুধ খান এবং ডোজ পরিবর্তন করবেন না।"
            else:
                purpose = f"Take {raw_name} as directed by your physician."
                caution = "Take on schedule and do not alter the prescribed dose."

        schedule_slots = []
        if slots["morning"]:
            schedule_slots.append({"slot": "Morning", "label": t_dict["morning"], "icon": "sunrise", "time": "08:00 AM"})
        if slots["afternoon"]:
            schedule_slots.append({"slot": "Afternoon", "label": t_dict["afternoon"], "icon": "sun", "time": "01:30 PM"})
        if slots["night"]:
            schedule_slots.append({"slot": "Night", "label": t_dict["night"], "icon": "moon", "time": "08:30 PM"})
        if slots["sos"]:
            schedule_slots.append({"slot": "SOS", "label": t_dict["sos"], "icon": "alert-circle", "time": "When needed"})

        processed_meds.append({
            "id": f"inst-med-{idx+1}",
            "name": raw_name,
            "category": category,
            "dosage": dosage,
            "frequency_raw": frequency,
            "duration": duration,
            "food_timing": food_timing_text,
            "is_before_food": is_before_food,
            "purpose": purpose,
            "caution": caution,
            "schedule_slots": schedule_slots
        })

    # 2. Select condition-specific diet guidelines
    diag_lower = (diagnosis or "").lower()
    if "hyperten" in diag_lower or "bp" in diag_lower:
        diet_items = DIETARY_GUIDELINES["hypertension"].get(lang, DIETARY_GUIDELINES["hypertension"]["en"])
    elif "diabet" in diag_lower or "sugar" in diag_lower:
        diet_items = DIETARY_GUIDELINES["diabetes"].get(lang, DIETARY_GUIDELINES["diabetes"]["en"])
    elif "infect" in diag_lower or "fever" in diag_lower or "urti" in diag_lower or "pneumon" in diag_lower:
        diet_items = DIETARY_GUIDELINES["infection"].get(lang, DIETARY_GUIDELINES["infection"]["en"])
    else:
        diet_items = DIETARY_GUIDELINES["general"].get(lang, DIETARY_GUIDELINES["general"]["en"])

    # 3. Emergency red flags
    red_flags = RED_FLAG_WARNINGS.get(lang, RED_FLAG_WARNINGS["en"])

    # 4. Summary & greeting in selected language
    greeting_map = {
        "en": f"Patient Care & Prescription Guide for {patient_name} ({patient_age}y / {patient_gender})",
        "hi": f"{patient_name} ({patient_age} वर्ष / {patient_gender}) के लिए स्वास्थ्य एवं दवा निर्देश",
        "mr": f"{patient_name} ({patient_age} वर्षे / {patient_gender}) यांच्यासाठी औषध व आरोग्य सूचना",
        "ta": f"{patient_name} ({patient_age} வயது / {patient_gender}) அவர்களுக்கான மருந்து மற்றும் பராமரிப்பு வழிகாட்டி",
        "te": f"{patient_name} ({patient_age} సం. / {patient_gender}) గారి కోసం మందులు మరియు సంరక్షణ మార్గదర్శకాలు",
        "bn": f"{patient_name} ({patient_age} বছর / {patient_gender})-এর জন্য ওষুধ ও স্বাস্থ্য নির্দেশিকা"
    }

    follow_up_map = {
        "en": f"Next Follow-up Visit: {follow_up_date or 'After 5-7 days or if symptoms persist'}",
        "hi": f"अगली जांच (फॉलो-अप): {follow_up_date or '5-7 दिनों बाद या तकलीफ रहने पर तुरंत'}",
        "mr": f"पुढील तपासणी: {follow_up_date or '५-७ दिवसांनंतर किंवा त्रास झाल्यास त्वरित'}",
        "ta": f"அடுத்த பரிசோதனை: {follow_up_date or '5-7 நாட்களுக்குப் பிறகு அல்லது தொந்தரவு இருந்தால் உடனே'}",
        "te": f"తదుపరి సంప్రదింపు: {follow_up_date or '5-7 రోజుల తర్వాత లేదా సమస్య ఉంటే వెంటనే'}",
        "bn": f"পরবর্তী ফলো-আপ: {follow_up_date or '৫-৭ দিন পর অথবা লক্ষণ থাকলে অবিলম্বে'}"
    }

    med_lines = []
    for m in processed_meds:
        slots_str = ", ".join([s["label"] for s in m["schedule_slots"]])
        med_lines.append(f"💊 *{m['name']}* ({m['dosage']})\n   🕒 {slots_str} | {m['food_timing']}\n   ℹ️ _{m['purpose']}_")

    whatsapp_text = (
        f"🏥 *CLINICASE AI — DIGITAL PRESCRIPTION & CARE SLIP*\n\n"
        f"👤 *Patient:* {patient_name} ({patient_age}y / {patient_gender})\n"
        f"🩺 *Diagnosis:* {diagnosis or 'Clinical Consultation'}\n"
        f"📅 *Date:* {follow_up_date or 'Today'}\n\n"
        f"📋 *MEDICATIONS SCHEDULE:*\n" + "\n\n".join(med_lines) + "\n\n"
        f"🥗 *DIET & LIFESTYLE:*\n" + "\n".join([f"• {d}" for d in diet_items[:3]]) + "\n\n"
        f"⚠️ *EMERGENCY:*\n{red_flags['helpline']}\n\n"
        f"🔄 *Follow-up:* {follow_up_map[lang]}"
    )

    return {
        "language": lang,
        "language_name": SUPPORTED_LANGUAGES[lang]["name"],
        "language_native": SUPPORTED_LANGUAGES[lang]["native"],
        "voice_code": SUPPORTED_LANGUAGES[lang]["voice_code"],
        "greeting": greeting_map[lang],
        "diagnosis_display": diagnosis or "General Consultation",
        "medications": processed_meds,
        "diet_guidelines": diet_items,
        "emergency_warnings": red_flags,
        "follow_up_instruction": follow_up_map[lang],
        "whatsapp_share_text": whatsapp_text
    }
