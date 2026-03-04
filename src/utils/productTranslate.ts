import type { Product } from '@/types'

type Language = 'en' | 'hi' | 'ta' | 'te' | 'bn' | 'mr' | 'gu' | 'kn' | 'ml' | 'pa'

const categoryTranslations: Record<string, Record<Language, string>> = {
  'Fruits': { en: 'Fruits', hi: 'फल', ta: 'பழங்கள்', te: 'పండ్లు', bn: 'ফল', mr: 'फळे', gu: 'ફળો', kn: 'ಹಣ್ಣುಗಳು', ml: 'പഴങ്ങൾ', pa: 'ਫਲ' },
  'Vegetables': { en: 'Vegetables', hi: 'सब्जियां', ta: 'காய்கறிகள்', te: 'కూరగాయలు', bn: 'সবজি', mr: 'भाज्या', gu: 'શાકભાજી', kn: 'ತರಕಾರಿಗಳು', ml: 'പച്ചക്കറികൾ', pa: 'ਸਬਜ਼ੀਆਂ' },
  'Dairy': { en: 'Dairy', hi: 'डेयरी', ta: 'பால் பொருட்கள்', te: 'పాల ఉత్పత్తులు', bn: 'দুগ্ধজাত', mr: 'दुग्धजन्य', gu: 'ડેરી', kn: 'ಡೈರಿ', ml: 'ഡയറി', pa: 'ਡੇਅਰੀ' },
  'Bakery': { en: 'Bakery', hi: 'बेकरी', ta: 'பேக்கரி', te: 'బేకరీ', bn: 'বেকারি', mr: 'बेकरी', gu: 'બેકરી', kn: 'ಬೇಕರಿ', ml: 'ബേക്കറി', pa: 'ਬੇਕਰੀ' },
  'Grains': { en: 'Grains', hi: 'अनाज', ta: 'தானியங்கள்', te: 'ధాన్యాలు', bn: 'শস্য', mr: 'धान्य', gu: 'અનાજ', kn: 'ಧಾನ್ಯಗಳು', ml: 'ധാന്യങ്ങൾ', pa: 'ਅਨਾਜ' },
  'Pantry': { en: 'Pantry', hi: 'पेंट्री', ta: 'சமையலறை', te: 'పాంట్రీ', bn: 'প্যান্ট্রি', mr: 'पॅन्ट्री', gu: 'પેન્ટ્રી', kn: 'ಪ್ಯಾಂಟ್ರಿ', ml: 'പാൻട്രി', pa: 'ਪੈਂਟਰੀ' },
  'Beverages': { en: 'Beverages', hi: 'पेय पदार्थ', ta: 'பானங்கள்', te: 'పానీయాలు', bn: 'পানীয়', mr: 'पेये', gu: 'પીણાં', kn: 'ಪಾನೀಯಗಳು', ml: 'പാനീയങ്ങൾ', pa: 'ਪੀਣ ਵਾਲੇ ਪਦਾਰਥ' },
  'Snacks': { en: 'Snacks', hi: 'स्नैक्स', ta: 'சிற்றுண்டி', te: 'స్నాక్స్', bn: 'স্ন্যাকস', mr: 'स्नॅक्स', gu: 'નાસ્તો', kn: 'ತಿಂಡಿಗಳು', ml: 'ലഘുഭക്ഷണം', pa: 'ਸਨੈਕਸ' },
  'Spices': { en: 'Spices', hi: 'मसाले', ta: 'மசாலா', te: 'మసాలా', bn: 'মশলা', mr: 'मसाले', gu: 'મસાલા', kn: 'ಮಸಾಲೆಗಳು', ml: 'സുഗന്ധവ്യഞ്ജനങ്ങൾ', pa: 'ਮਸਾਲੇ' },
}

const wordTranslations: Record<string, Record<Language, string>> = {
  'Apple': { en: 'Apple', hi: 'सेब', ta: 'ஆப்பிள்', te: 'ఆపిల్', bn: 'আপেল', mr: 'सफरचंद', gu: 'સફરજન', kn: 'ಸೇಬು', ml: 'ആപ്പിൾ', pa: 'ਸੇਬ' },
  'Banana': { en: 'Banana', hi: 'केला', ta: 'வாழைப்பழம்', te: 'అరటిపండు', bn: 'কলা', mr: 'केळी', gu: 'કેળું', kn: 'ಬಾಳೆಹಣ್ಣು', ml: 'വാഴപ്പഴം', pa: 'ਕੇਲਾ' },
  'Orange': { en: 'Orange', hi: 'संतरा', ta: 'ஆரஞ்சு', te: 'నారింజ', bn: 'কমলা', mr: 'संत्रा', gu: 'નારંગી', kn: 'ಕಿತ್ತಳೆ', ml: 'ഓറഞ്ച്', pa: 'ਸੰਤਰਾ' },
  'Mango': { en: 'Mango', hi: 'आम', ta: 'மாம்பழம்', te: 'మామిడి', bn: 'আম', mr: 'आंबा', gu: 'કેરી', kn: 'ಮಾವಿನ ಹಣ್ಣು', ml: 'മാമ്പഴം', pa: 'ਅੰਬ' },
  'Tomato': { en: 'Tomato', hi: 'टमाटर', ta: 'தக்காளி', te: 'టొమాటో', bn: 'টমেটো', mr: 'टोमॅटो', gu: 'ટામેટા', kn: 'ಟೊಮೇಟೊ', ml: 'തക്കാളി', pa: 'ਟਮਾਟਰ' },
  'Potato': { en: 'Potato', hi: 'आलू', ta: 'உருளைக்கிழங்கு', te: 'బంగాళాదుంప', bn: 'আলু', mr: 'बटाटा', gu: 'બટાકા', kn: 'ಆಲೂಗಡ್ಡೆ', ml: 'ഉരുളക്കിഴങ്ങ്', pa: 'ਆਲੂ' },
  'Onion': { en: 'Onion', hi: 'प्याज', ta: 'வெங்காயம்', te: 'ఉల్లిపాయ', bn: 'পেঁয়াজ', mr: 'कांदा', gu: 'ડુંગળી', kn: 'ಈರುಳ್ಳಿ', ml: 'ഉള്ളി', pa: 'ਪਿਆਜ਼' },
  'Carrot': { en: 'Carrot', hi: 'गाजर', ta: 'கேரட்', te: 'క్యారెట్', bn: 'গাজর', mr: 'गाजर', gu: 'ગાજર', kn: 'ಕ್ಯಾರೆಟ್', ml: 'കാരറ്റ്', pa: 'ਗਾਜਰ' },
  'Milk': { en: 'Milk', hi: 'दूध', ta: 'பால்', te: 'పాలు', bn: 'দুধ', mr: 'दूध', gu: 'દૂધ', kn: 'ಹಾಲು', ml: 'പാൽ', pa: 'ਦੁੱਧ' },
  'Bread': { en: 'Bread', hi: 'ब्रेड', ta: 'ரொட்டி', te: 'బ్రెడ్', bn: 'রুটি', mr: 'ब्रेड', gu: 'બ્રેડ', kn: 'ಬ್ರೆಡ್', ml: 'ബ്രെഡ്', pa: 'ਰੋਟੀ' },
  'Rice': { en: 'Rice', hi: 'चावल', ta: 'அரிசி', te: 'బియ్యం', bn: 'চাল', mr: 'तांदूळ', gu: 'ચોખા', kn: 'ಅಕ್ಕಿ', ml: 'അരി', pa: 'ਚੌਲ' },
  'Wheat': { en: 'Wheat', hi: 'गेहूं', ta: 'கோதுமை', te: 'గోధుమ', bn: 'গম', mr: 'गहू', gu: 'ઘઉં', kn: 'ಗೋಧಿ', ml: 'ഗോതമ്പ്', pa: 'ਕਣਕ' },
  'Organic': { en: 'Organic', hi: 'जैविक', ta: 'இயற்கை', te: 'సేంద్రీయ', bn: 'জৈব', mr: 'सेंद्रिय', gu: 'કાર્બનિક', kn: 'ಸಾವಯವ', ml: 'ജൈവ', pa: 'ਜੈਵਿਕ' },
  'Fresh': { en: 'Fresh', hi: 'ताजा', ta: 'புதிய', te: 'తాజా', bn: 'তাজা', mr: 'ताजे', gu: 'તાજા', kn: 'ತಾಜಾ', ml: 'പുതിയ', pa: 'ਤਾਜ਼ਾ' },
  'Apples': { en: 'Apples', hi: 'सेब', ta: 'ஆப்பிள்கள்', te: 'ఆపిల్స్', bn: 'আপেল', mr: 'सफरचंद', gu: 'સફરજન', kn: 'ಸೇಬುಗಳು', ml: 'ആപ്പിൾ', pa: 'ਸੇਬ' },
  'Bananas': { en: 'Bananas', hi: 'केले', ta: 'வாழைப்பழங்கள்', te: 'అరటిపండ్లు', bn: 'কলা', mr: 'केळी', gu: 'કેળાં', kn: 'ಬಾಳೆಹಣ್ಣುಗಳು', ml: 'വാഴപ്പഴം', pa: 'ਕੇਲੇ' },
  'Oranges': { en: 'Oranges', hi: 'संतरे', ta: 'ஆரஞ்சுகள்', te: 'నారింజలు', bn: 'কমলা', mr: 'संत्रे', gu: 'નારંગી', kn: 'ಕಿತ್ತಳೆಗಳು', ml: 'ഓറഞ്ച്', pa: 'ਸੰਤਰੇ' },
  'Mangoes': { en: 'Mangoes', hi: 'आम', ta: 'மாம்பழங்கள்', te: 'మామిడిపండ్లు', bn: 'আম', mr: 'आंबे', gu: 'કેરી', kn: 'ಮಾವಿನ ಹಣ್ಣುಗಳು', ml: 'മാമ്പഴം', pa: 'ਅੰਬ' },
  'Tomatoes': { en: 'Tomatoes', hi: 'टमाटर', ta: 'தக்காளி', te: 'టమోటాలు', bn: 'টমেটো', mr: 'टोमॅटो', gu: 'ટામેટા', kn: 'ಟೊಮೇಟೊಗಳು', ml: 'തക്കാളി', pa: 'ਟਮਾਟਰ' },
  'Potatoes': { en: 'Potatoes', hi: 'आलू', ta: 'உருளைக்கிழங்கு', te: 'బంగాళాదుంపలు', bn: 'আলু', mr: 'बटाटे', gu: 'બટાકા', kn: 'ಆಲೂಗಡ್ಡೆಗಳು', ml: 'ഉരുളക്കിഴങ്ങ്', pa: 'ਆਲੂ' },
  'Onions': { en: 'Onions', hi: 'प्याज', ta: 'வெங்காயம்', te: 'ఉల్లిపాయలు', bn: 'পেঁয়াজ', mr: 'कांदे', gu: 'ડુંગળી', kn: 'ಈರುಳ್ಳಿಗಳು', ml: 'ഉള്ളി', pa: 'ਪਿਆਜ਼' },
  'Carrots': { en: 'Carrots', hi: 'गाजर', ta: 'கேரட்', te: 'క్యారెట్లు', bn: 'গাজর', mr: 'गाजर', gu: 'ગાજર', kn: 'ಕ್ಯಾರೆಟ್ಗಳು', ml: 'കാരറ്റ്', pa: 'ਗਾਜਰ' },
  'from': { en: 'from', hi: 'से', ta: 'இருந்து', te: 'నుండి', bn: 'থেকে', mr: 'पासून', gu: 'થી', kn: 'ಇಂದ', ml: 'നിന്ന്', pa: 'ਤੋਂ' },
  'local': { en: 'local', hi: 'स्थानीय', ta: 'உள்ளூர்', te: 'స్థానిక', bn: 'স্থানীয়', mr: 'स्थानिक', gu: 'સ્થાનિક', kn: 'ಸ್ಥಳೀಯ', ml: 'പ്രാദേശിക', pa: 'ਸਥਾਨਕ' },
  'farms': { en: 'farms', hi: 'खेतों', ta: 'பண்ணைகளிலிருந்து', te: 'పొలాల నుండి', bn: 'খামার থেকে', mr: 'शेतातून', gu: 'ખેતરોમાંથી', kn: 'ಫಾರ್ಮ್ಗಳಿಂದ', ml: 'ഫാമുകളിൽ നിന്ന്', pa: 'ਖੇਤਾਂ ਤੋਂ' },
}

export function translateCategory(category: string, language: Language): string {
  return categoryTranslations[category]?.[language] || category
}

export function translateText(text: string, language: Language): string {
  if (language === 'en') return text
  
  let translated = text
  Object.keys(wordTranslations).forEach(key => {
    const regex = new RegExp(key, 'gi')
    const translation = wordTranslations[key]?.[language]
    if (translation) {
      translated = translated.replace(regex, translation)
    }
  })
  
  return translated
}

export function translateProduct(product: Product, language: Language): Product {
  return {
    ...product,
    name: translateText(product.name, language),
    category: translateCategory(product.category, language),
    description: translateText(product.description, language),
  }
}

export function translateProducts(products: Product[], language: Language): Product[] {
  return products.map(product => translateProduct(product, language))
}
