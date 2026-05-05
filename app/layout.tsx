import "./globals.css";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type { ReactNode } from "react";

import AppDialogRoot from "@/components/common/dialogs/app-dialog-root";
import ThemeProvider from "@/components/common/theme-provider";
import { Toaster } from "@/components/ui/sonner";

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

const RootLayout = (props: IProps) => {
  const { children } = props;

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Toaster />
          <AppDialogRoot />
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
