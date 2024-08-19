import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import fr from './locales/fr.json';
import { DEFAULT_LOCALE } from './config/config';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: en,
      },
      fr: {
        translation: fr,
      },
    },
    fallbackLng: DEFAULT_LOCALE,
    debug: true,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
