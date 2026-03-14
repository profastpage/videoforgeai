import { locales, type Locale } from "@/lib/i18n/messages";

export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_COOKIE_NAME = "vf_locale";

export function isLocale(value: string | null | undefined): value is Locale {
  return value !== undefined && value !== null && locales.includes(value as Locale);
}

export function toLocaleCode(locale: Locale) {
  return locale === "es" ? "es-PE" : "en-US";
}
