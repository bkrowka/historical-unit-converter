"use client";

import { useSyncExternalStore, useCallback, useMemo } from 'react';
import { languageStore } from '@/lib/language-service';
import { getTranslation, Language } from '@/lib/localization';

export const useLanguage = () => {
  const language = useSyncExternalStore(
    languageStore.subscribe,
    languageStore.getSnapshot,
    languageStore.getServerSnapshot
  );
  
  const isInitialized = useSyncExternalStore(
    (listener) => languageStore.init()(listener),
    () => languageStore.getSnapshot() !== undefined,
    () => false
  );

  const setLang = useCallback((lang: Language) => {
    languageStore.setLanguage(lang)();
  }, []);

  const t = useMemo(() => getTranslation(language), [language]);

  return { language, setLang, t, isInitialized };
};
