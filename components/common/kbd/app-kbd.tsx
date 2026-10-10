import { cva, type VariantProps } from "class-variance-authority";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

const keyHintVariants = cva("rounded px-1.5 font-mono text-xs", {
  variants: {
    tone: {
      accent: "bg-accent text-accent-foreground",
      muted: "bg-muted",
    },
  },
});

interface IProps extends VariantProps<typeof keyHintVariants> {
  children: ReactNode;
  className?: string;
}

const AppKbd = (props: IProps) => {
  const { tone, children, className } = props;

  return <kbd className={cn(keyHintVariants({ tone }), className)}>{children}</kbd>;
};

export default AppKbd;
