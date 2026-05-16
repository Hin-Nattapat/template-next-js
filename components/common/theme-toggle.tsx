"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import AppButton from "@/components/common/buttons/app-button";

const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // next-themes can't know which theme to render until after hydration,
  // so we render a same-size transparent placeholder on the server pass
  // and on the first client render to avoid a hydration mismatch — only
  // the second render shows the real icon. This is the documented
  // next-themes pattern; the cascading-render rule doesn't fit here.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <span aria-hidden className="inline-block size-9" />;
  }

  const isDark = resolvedTheme === "dark";
  const Icon = isDark ? Sun : Moon;

  return (
    <AppButton
      variant="ghost"
      size="icon"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      <Icon className="size-4" />
    </AppButton>
  );
};

export default ThemeToggle;
