import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en/translation.json';
import nor from './locales/nor/translation.json';

const storedLanguage = localStorage.getItem('language') || 'en';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    nor: { translation: nor },
  },
  lng: storedLanguage,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
