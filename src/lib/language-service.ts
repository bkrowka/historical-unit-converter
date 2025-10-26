import { IO } from 'fp-ts/IO';
import { Language, LANGUAGES } from './localization';

const STORAGE_KEY = 'language';

export const getLanguageIO: IO<Language> = () => {
  if (typeof window === 'undefined') return 'en';
  const lang = localStorage.getItem(STORAGE_KEY);
  return lang && LANGUAGES.includes(lang as Language) ? (lang as Language) : 'en';
};

export const setLanguageIO = (lang: Language): IO<void> => () => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, lang);
  }
};

let currentLang: Language = 'en';
const listeners = new Set<() => void>();

export const languageStore = {
  getSnapshot: (): Language => currentLang,
  getServerSnapshot: (): Language => 'en',

  subscribe: (listener: () => void): (() => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  setLanguage: (lang: Language): IO<void> => () => {
    currentLang = lang;
    setLanguageIO(lang)();
    listeners.forEach((fn) => fn());
  },
  init: (): ((onInitialized: () => void) => () => void) => (onInitialized) => {
    const notifyListenersIO: IO<void> = () => {
      listeners.forEach((fn) => fn());
    };

    const addStorageListenerIO = (handler: (e: StorageEvent) => void): IO<void> => () => {
      if (typeof window !== 'undefined') {
        window.addEventListener('storage', handler as EventListener);
      }
    };

    const removeStorageListenerIO = (handler: (e: StorageEvent) => void): IO<void> => () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('storage', handler as EventListener);
      }
    };

    const onStoreUpdate = () => {
      const newLang = getLanguageIO();
      if (newLang !== currentLang) {
        currentLang = newLang;
        notifyListenersIO();
      }
      onInitialized();
    };

    currentLang = getLanguageIO();
    notifyListenersIO();
    onInitialized();

    addStorageListenerIO(onStoreUpdate)();

    return () => {
      removeStorageListenerIO(onStoreUpdate)();
    };
  },
};
