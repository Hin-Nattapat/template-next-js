"use client";

import { useContext } from "react";

import type { TMessageBundle } from "./messages/define-messages";
import { I18nContext } from "./provider";

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return context;
}

export function useMessages<T>(bundle: TMessageBundle<T>) {
  return bundle[useI18n().locale];
}
