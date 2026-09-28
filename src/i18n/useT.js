// useT — returns a translator function bound to the current language
import useAppStore from '../store/useAppStore.js';
import translations from './translations.js';

export default function useT() {
  const language = useAppStore(s => s.language);
  const dict = translations[language] || translations.en;

  // t('key') → translated string, falls back to English, then the key itself
  return (key) => dict[key] ?? translations.en[key] ?? key;
}
