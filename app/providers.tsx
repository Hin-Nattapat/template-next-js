"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useState } from "react";

import AppDialogRoot from "@/components/common/dialogs/app-dialog-root";
import ThemeProvider from "@/components/common/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import type { Locale } from "@/i18n/locale";
import I18nProvider from "@/i18n/provider";
import { createQueryClient } from "@/lib/client/query-client";

interface IProps {
  initialLocale: Locale;
  children: ReactNode;
}

// Every client-side provider and app-wide UI root lives here; app/layout.tsx stays server-only.
const Providers = (props: IProps) => {
  const { initialLocale, children } = props;

  const [queryClient] = useState(() => createQueryClient());

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <I18nProvider initialLocale={initialLocale}>
          {children}
          <Toaster />
          <AppDialogRoot />
        </I18nProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default Providers;
