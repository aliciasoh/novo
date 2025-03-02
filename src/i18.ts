import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en/translation.json';
import nor from './locales/nor/translation.json';

// Get the language from localStorage or fallback to 'en'
const storedLanguage = localStorage.getItem('language') || 'en';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    nor: { translation: nor },
  },
  lng: storedLanguage, // Set initial language from localStorage
  fallbackLng: 'en', // Fallback language
  interpolation: {
    escapeValue: false, // React already escapes the values
  },
});

export default i18n;
