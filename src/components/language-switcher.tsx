"use client";

import { useLanguage } from '@/hooks/use-language';
import { LANGUAGES } from '@/lib/localization';
import { Button } from './ui/button';

export function LanguageSwitcher() {
  const { language, setLang } = useLanguage();

  return (
    <div className="absolute top-4 right-4 flex items-center gap-2">
      {LANGUAGES.map((lang) => (
        <Button
          key={lang}
          variant="ghost"
          size="sm"
          onClick={() => setLang(lang)}
          className={`uppercase text-xs font-bold tracking-wider ${
            language === lang ? 'text-primary' : 'text-muted-foreground'
          }`}
        >
          {lang}
        </Button>
      ))}
    </div>
  );
}
