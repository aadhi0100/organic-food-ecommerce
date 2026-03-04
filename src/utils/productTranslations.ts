import type { Product } from '@/types'

type Language = 'en' | 'hi' | 'ta' | 'te' | 'bn' | 'mr' | 'gu' | 'kn' | 'ml' | 'pa'

const productTranslations: Record<string, Record<Language, { name: string; description: string }>> = {
  'Organic Apples': {
    en: { name: 'Organic Apples', description: 'Fresh organic apples from local farms' },
    hi: { name: 'जैविक सेब', description: 'स्थानीय खेतों से ताजा जैविक सेब' },
    ta: { name: 'இயற்கை ஆப்பிள்', description: 'உள்ளூர் பண்ணைகளிலிருந்து புதிய இயற்கை ஆப்பிள்' },
    te: { name: 'సేంద్రీయ ఆపిల్స్', description: 'స్థానిక పొలాల నుండి తాజా సేంద్రీయ ఆపిల్స్' },
    bn: { name: 'জৈব আপেল', description: 'স্থানীয় খামার থেকে তাজা জৈব আপেল' },
    mr: { name: 'सेंद्रिय सफरचंद', description: 'स्थानिक शेतातून ताजे सेंद्रिय सफरचंद' },
    gu: { name: 'કાર્બનિક સફરજન', description: 'સ્થાનિક ખેતરોમાંથી તાજા કાર્બનિક સફરજન' },
    kn: { name: 'ಸಾವಯವ ಸೇಬುಗಳು', description: 'ಸ್ಥಳೀಯ ಫಾರ್ಮ್‌ಗಳಿಂದ ತಾಜಾ ಸಾವಯವ ಸೇಬುಗಳು' },
    ml: { name: 'ജൈവ ആപ്പിൾ', description: 'പ്രാദേശിക ഫാമുകളിൽ നിന്നുള്ള പുതിയ ജൈവ ആപ്പിൾ' },
    pa: { name: 'ਜੈਵਿਕ ਸੇਬ', description: 'ਸਥਾਨਕ ਖੇਤਾਂ ਤੋਂ ਤਾਜ਼ੇ ਜੈਵਿਕ ਸੇਬ' },
  },
  'Fresh Bananas': {
    en: { name: 'Fresh Bananas', description: 'Naturally ripened organic bananas' },
    hi: { name: 'ताजा केले', description: 'प्राकृतिक रूप से पके जैविक केले' },
    ta: { name: 'புதிய வாழைப்பழங்கள்', description: 'இயற்கையாக பழுத்த இயற்கை வாழைப்பழங்கள்' },
    te: { name: 'తాజా అరటిపండ్లు', description: 'సహజంగా పండిన సేంద్రీయ అరటిపండ్లు' },
    bn: { name: 'তাজা কলা', description: 'প্রাকৃতিকভাবে পাকা জৈব কলা' },
    mr: { name: 'ताजी केळी', description: 'नैसर्गिकरित्या पिकलेली सेंद्रिय केळी' },
    gu: { name: 'તાજા કેળા', description: 'કુદરતી રીતે પાકેલા કાર્બનિક કેળા' },
    kn: { name: 'ತಾಜಾ ಬಾಳೆಹಣ್ಣುಗಳು', description: 'ನೈಸರ್ಗಿಕವಾಗಿ ಹಣ್ಣಾದ ಸಾವಯವ ಬಾಳೆಹಣ್ಣುಗಳು' },
    ml: { name: 'പുതിയ വാഴപ്പഴം', description: 'സ്വാഭാവികമായി പഴുത്ത ജൈവ വാഴപ്പഴം' },
    pa: { name: 'ਤਾਜ਼ੇ ਕੇਲੇ', description: 'ਕੁਦਰਤੀ ਤੌਰ ਤੇ ਪੱਕੇ ਜੈਵਿਕ ਕੇਲੇ' },
  },
}

export function translateProduct(product: Product, language: Language): Product {
  const translation = productTranslations[product.name]?.[language]
  
  if (translation) {
    return {
      ...product,
      name: translation.name,
      description: translation.description,
    }
  }
  
  return product
}

export function translateProducts(products: Product[], language: Language): Product[] {
  return products.map(product => translateProduct(product, language))
}
