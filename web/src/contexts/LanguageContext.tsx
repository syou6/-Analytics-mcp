'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, t } from '@/lib/i18n';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('ja');

  useEffect(() => {
    // ローカルストレージから言語設定を読み込み
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang && (savedLang === 'en' || savedLang === 'ja')) {
      setLanguageState(savedLang);
      // Set html lang attribute
      document.documentElement.lang = savedLang;
    } else {
      // ブラウザの言語設定を確認
      const browserLang = navigator.language.toLowerCase();
      const detectedLang = browserLang.startsWith('ja') ? 'ja' : 'en';
      setLanguageState(detectedLang);
      document.documentElement.lang = detectedLang;
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
  };

  const translate = (key: string) => t(key, language);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translate }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}