"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ComponentProps } from "react";

type TProps = ComponentProps<typeof NextThemesProvider>;

const ThemeProvider = (props: TProps) => {
  return <NextThemesProvider {...props} />;
};

export default ThemeProvider;
