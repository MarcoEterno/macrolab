'use client';
import { createContext, useContext, useMemo, useEffect } from 'react';
import type { ReactNode } from 'react';
import { createI18n } from './locale';
import type { Language } from './locale';
const LocaleContext = createContext(createI18n('en'));
export function I18nProvider({
  language,
  children,
}: {
  language: Language;
  children: ReactNode;
}) {
  const value = useMemo(() => createI18n(language), [language]);
  useEffect(() => {
    document.documentElement.lang = language;
    document.title =
      language === 'it'
        ? 'MacroLab — Simulatore economico'
        : 'MacroLab — Economy Simulator';
  }, [language]);
  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}
export const useI18n = () => useContext(LocaleContext);
