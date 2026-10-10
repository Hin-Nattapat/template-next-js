import { cva } from "class-variance-authority";

export const keyHintVariants = cva("rounded px-1.5 font-mono text-xs", {
  variants: {
    tone: {
      accent: "bg-accent text-accent-foreground",
      muted: "bg-muted",
    },
  },
});
