import "./globals.css";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { getLocale, getMessages } from "@/i18n/get-messages";
import { metaMessages } from "@/i18n/messages/meta";

import Providers from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const m = await getMessages(metaMessages);
  return { title: m.title, description: m.description };
}

// Reading the locale cookie opts the tree out of static rendering; the error and
// 404 pages can only speak the chosen language that way.
const RootLayout = async (props: LayoutProps<"/">) => {
  const { children } = props;
  const locale = await getLocale();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers initialLocale={locale}>{children}</Providers>
      </body>
    </html>
  );
};

export default RootLayout;
