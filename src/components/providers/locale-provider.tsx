"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { LOCALE_COOKIE_NAME } from "@/lib/i18n/locale";
import {
  messages,
  type Locale,
  type LocaleMessages,
} from "@/lib/i18n/messages";

const STORAGE_KEY = "videoforge-locale";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  copy: LocaleMessages;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({
  children,
  initialLocale,
}: {
  children: React.ReactNode;
  initialLocale: Locale;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  useEffect(() => {
    document.documentElement.lang = locale;
    window.localStorage.setItem(STORAGE_KEY, locale);
    document.cookie = `${LOCALE_COOKIE_NAME}=${locale}; path=/; max-age=31536000; samesite=lax`;
  }, [locale]);

  return (
    <LocaleContext.Provider
      value={{
        locale,
        setLocale: setLocaleState,
        copy: messages[locale],
      }}
    >
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);

  if (!context) {
    throw new Error("useLocale must be used inside LocaleProvider.");
  }

  return context;
}
