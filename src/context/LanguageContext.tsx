'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

type Language = 'en' | 'hi' | 'ta' | 'te' | 'bn' | 'mr' | 'es' | 'fr' | 'de' | 'zh' | 'ja' | 'ko' | 'ar' | 'ru' | 'pt' | 'it'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  fontClass: string
}

const translations: Record<Language, Record<string, string>> = {
  en: { home: 'Home', products: 'Products', cart: 'Cart', checkout: 'Checkout', login: 'Login', register: 'Register', addToCart: 'Add to Cart', total: 'Total', placeOrder: 'Place Order' },
  hi: { home: 'होम', products: 'उत्पाद', cart: 'कार्ट', checkout: 'चेकआउट', login: 'लॉगिन', register: 'रजिस्टर', addToCart: 'कार्ट में जोड़ें', total: 'कुल', placeOrder: 'ऑर्डर करें' },
  ta: { home: 'முகப்பு', products: 'தயாரிப்புகள்', cart: 'வண்டி', checkout: 'செக்அவுட்', login: 'உள்நுழைய', register: 'பதிவு', addToCart: 'வண்டியில் சேர்', total: 'மொத்தம்', placeOrder: 'ஆர்டர் செய்' },
  te: { home: 'హోమ్', products: 'ఉత్పత్తులు', cart: 'కార్ట్', checkout: 'చెక్అవుట్', login: 'లాగిన్', register: 'రిజిస్టర్', addToCart: 'కార్ట్కు జోడించు', total: 'మొత్తం', placeOrder: 'ఆర్డర్ చేయి' },
  bn: { home: 'হোম', products: 'পণ্য', cart: 'কার্ট', checkout: 'চেকআউট', login: 'লগইন', register: 'নিবন্ধন', addToCart: 'কার্টে যোগ করুন', total: 'মোট', placeOrder: 'অর্ডার করুন' },
  mr: { home: 'होम', products: 'उत्पादने', cart: 'कार्ट', checkout: 'चेकआउट', login: 'लॉगिन', register: 'नोंदणी', addToCart: 'कार्टमध्ये जोडा', total: 'एकूण', placeOrder: 'ऑर्डर द्या' },
  es: { home: 'Inicio', products: 'Productos', cart: 'Carrito', checkout: 'Pagar', login: 'Iniciar sesión', register: 'Registrarse', addToCart: 'Añadir', total: 'Total', placeOrder: 'Pedir' },
  fr: { home: 'Accueil', products: 'Produits', cart: 'Panier', checkout: 'Commander', login: 'Connexion', register: 'Inscrire', addToCart: 'Ajouter', total: 'Total', placeOrder: 'Commander' },
  de: { home: 'Start', products: 'Produkte', cart: 'Warenkorb', checkout: 'Kasse', login: 'Anmelden', register: 'Registrieren', addToCart: 'Hinzufügen', total: 'Gesamt', placeOrder: 'Bestellen' },
  zh: { home: '首页', products: '产品', cart: '购物车', checkout: '结账', login: '登录', register: '注册', addToCart: '加入购物车', total: '总计', placeOrder: '下订单' },
  ja: { home: 'ホーム', products: '製品', cart: 'カート', checkout: 'チェックアウト', login: 'ログイン', register: '登録', addToCart: 'カートに追加', total: '合計', placeOrder: '注文する' },
  ko: { home: '홈', products: '제품', cart: '장바구니', checkout: '결제', login: '로그인', register: '등록', addToCart: '장바구니에 추가', total: '합계', placeOrder: '주문하기' },
  ar: { home: 'الرئيسية', products: 'المنتجات', cart: 'السلة', checkout: 'الدفع', login: 'تسجيل الدخول', register: 'التسجيل', addToCart: 'أضف إلى السلة', total: 'المجموع', placeOrder: 'تقديم الطلب' },
  ru: { home: 'Главная', products: 'Продукты', cart: 'Корзина', checkout: 'Оформить', login: 'Войти', register: 'Регистрация', addToCart: 'В корзину', total: 'Итого', placeOrder: 'Заказать' },
  pt: { home: 'Início', products: 'Produtos', cart: 'Carrinho', checkout: 'Finalizar', login: 'Entrar', register: 'Registrar', addToCart: 'Adicionar', total: 'Total', placeOrder: 'Pedir' },
  it: { home: 'Home', products: 'Prodotti', cart: 'Carrello', checkout: 'Checkout', login: 'Accedi', register: 'Registrati', addToCart: 'Aggiungi', total: 'Totale', placeOrder: 'Ordina' },
}

const fontClasses: Record<Language, string> = {
  en: 'font-sans', hi: 'font-hindi', ta: 'font-tamil', te: 'font-telugu', bn: 'font-bengali', mr: 'font-marathi',
  es: 'font-sans', fr: 'font-sans', de: 'font-sans', zh: 'font-chinese', ja: 'font-japanese', ko: 'font-korean',
  ar: 'font-arabic', ru: 'font-sans', pt: 'font-sans', it: 'font-sans',
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en')

  useEffect(() => {
    const stored = localStorage.getItem('language') as Language
    if (stored) setLanguage(stored)
  }, [])

  const changeLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem('language', lang)
    document.documentElement.lang = lang
    document.body.className = fontClasses[lang]
  }

  const t = (key: string) => translations[language][key] || key

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t, fontClass: fontClasses[language] }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLanguage must be used within LanguageProvider')
  return context
}
