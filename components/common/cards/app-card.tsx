import type { ComponentProps, ReactNode } from "react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// The app's standard card surface. Wraps the shadcn `Card` primitive (per
// CLAUDE.md §3.6 — wrap ui/ rather than re-roll) and tunes its defaults to the
// flat look features were hand-rolling across ~33 sites: rounded-lg / p-6 /
// shadow-xs with no inter-row gap, instead of shadcn's rounded-xl / py-6 /
// shadow-sm. Override anything via className (tailwind-merge wins); all div
// props (onClick, etc.) pass straight through.
//
// `title` renders the app's uppercase micro-label as a real <h2> — screen
// readers can navigate card-to-card, and tracking-wider keeps all-caps
// legible. `description` is the muted line under it; `actions` sits
// right-aligned on the title row.
interface IProps extends ComponentProps<typeof Card> {
  title?: string;
  titleClassName?: string;
  description?: string;
  descriptionClassName?: string;
  actions?: ReactNode;
}

const AppCard = (props: IProps) => {
  const {
    className,
    title,
    titleClassName,
    description,
    descriptionClassName,
    actions,
    children,
    ...rest
  } = props;

  return (
    <Card
      className={cn("border-border gap-0 rounded-lg p-6 shadow-xs", className)}
      {...rest}
    >
      {(title || actions) && (
        <div className="flex items-start justify-between gap-4">
          {title && (
            <h2
              className={cn(
                "text-fg-4 text-[11px] font-medium tracking-wider uppercase",
                titleClassName,
              )}
            >
              {title}
            </h2>
          )}
          {actions}
        </div>
      )}
      {description && (
        <p className={cn("text-fg-3 mt-1 text-sm", descriptionClassName)}>
          {description}
        </p>
      )}
      {children}
    </Card>
  );
};

export default AppCard;
