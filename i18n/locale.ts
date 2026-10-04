export enum Locale {
  Th = "th",
  En = "en",
}

export const DEFAULT_LOCALE = Locale.Th;
export const LOCALE_COOKIE = "locale";

const LOCALE_TAGS: Record<Locale, string> = {
  [Locale.Th]: "th-TH-u-ca-gregory-nu-latn",
  [Locale.En]: "en-GB",
};

export function resolveLocale(value?: string): Locale {
  if (value === Locale.En || value === Locale.Th) {
    return value;
  }
  return DEFAULT_LOCALE;
}

export function localeTag(locale: Locale): string {
  return LOCALE_TAGS[locale];
}

export function serializeLocaleCookie(locale: Locale): string {
  return `${LOCALE_COOKIE}=${locale}; Path=/; Max-Age=31536000; SameSite=Lax`;
}
