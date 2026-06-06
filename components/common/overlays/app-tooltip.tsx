"use client";

import type { ReactNode } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

// App* wrapper over the shadcn Tooltip. Self-contained — bakes in its own
// TooltipProvider so callers don't need one at the app root. `children` is the
// (single, focusable) trigger; `content` is the hover/focus copy.
interface IProps {
  content: ReactNode;
  children: ReactNode;
  className?: string;
}

const AppTooltip = (props: IProps) => {
  const { content, children, className } = props;

  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent className={cn("max-w-xs", className)}>{content}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default AppTooltip;
