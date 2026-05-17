import { createContext, useContext, useState, ReactNode } from "react";
import { translations, Language, Translations } from "@/i18n/translations";

type LanguageContextValue = {
  language: Language;
  setLanguage: (l: Language) => void;
  t: Translations;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
  const result = { ...target };
  for (const key of Object.keys(source) as (keyof T)[]) {
    const val = source[key];
    if (val !== undefined) {
      if (typeof val === "object" && val !== null && !Array.isArray(val) && key in result) {
        result[key] = deepMerge(result[key] as any, val as any);
      } else {
        result[key] = val as T[keyof T];
      }
    }
  }
  return result;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");
  const t = deepMerge(translations.en, translations[language] ?? {}) as Translations;
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
}
