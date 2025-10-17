"use client";

import { useSyncExternalStore, useEffect, useCallback, useMemo, useState } from 'react';
import { languageStore } from '@/lib/language-service';
import { getTranslation, Language } from '@/lib/localization';

export const useLanguage = () => {
  const language = useSyncExternalStore(
    languageStore.subscribe,
    languageStore.getSnapshot,
    languageStore.getServerSnapshot
  );
  
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const unsubscribe = languageStore.init()(() => {
      setIsInitialized(true);
    });
    return unsubscribe;
  }, []);

  const setLang = useCallback((lang: Language) => {
    languageStore.setLanguage(lang)();
  }, []);

  const t = useMemo(() => getTranslation(language), [language]);

  return { language, setLang, t, isInitialized };
};
