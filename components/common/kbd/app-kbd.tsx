import type { VariantProps } from "class-variance-authority";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import { keyHintVariants } from "./app-kbd.constants";

interface IProps extends VariantProps<typeof keyHintVariants> {
  children: ReactNode;
  className?: string;
}

const AppKbd = (props: IProps) => {
  const { tone, children, className } = props;

  return <kbd className={cn(keyHintVariants({ tone }), className)}>{children}</kbd>;
};

export default AppKbd;
