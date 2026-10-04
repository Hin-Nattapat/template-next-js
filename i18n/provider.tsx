"use client";

import { useRouter } from "next/navigation";
import { createContext, type ReactNode, useState } from "react";

import type { Locale } from "./locale";
import { localeTag, serializeLocaleCookie } from "./locale";
import { commonMessages } from "./messages/common";
import { navMessages } from "./messages/nav";

export interface II18nContext {
  locale: Locale;
  localeTag: string;
  common: (typeof commonMessages)[Locale];
  nav: (typeof navMessages)[Locale];
  setLocale: (locale: Locale) => void;
}

export const I18nContext = createContext<II18nContext | null>(null);

interface IProps {
  initialLocale: Locale;
  children: ReactNode;
}

const I18nProvider = (props: IProps) => {
  const { initialLocale, children } = props;

  const router = useRouter();

  const [locale, setCurrentLocale] = useState(initialLocale);

  const handleSetLocale = (next: Locale) => {
    setCurrentLocale(next);
    document.cookie = serializeLocaleCookie(next);
    document.documentElement.lang = next;
    router.refresh();
  };

  const value: II18nContext = {
    locale,
    localeTag: localeTag(locale),
    common: commonMessages[locale],
    nav: navMessages[locale],
    setLocale: handleSetLocale,
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export default I18nProvider;
