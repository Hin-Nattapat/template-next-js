import "./globals.css";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type { ReactNode } from "react";

import AppDialogRoot from "@/components/common/dialogs/app-dialog-root";
import ThemeProvider from "@/components/common/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { getLocale } from "@/i18n/get-messages";
import I18nProvider from "@/i18n/provider";

import Providers from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Next.js Template",
  description: "Next.js template",
};

interface IProps {
  children: ReactNode;
}

// Reading the locale cookie opts the tree out of static rendering; the error and
// 404 pages can only speak the chosen language that way.
const RootLayout = async (props: IProps) => {
  const { children } = props;
  const locale = await getLocale();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Providers>
            <I18nProvider initialLocale={locale}>
              {children}
              <Toaster />
              <AppDialogRoot />
            </I18nProvider>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
