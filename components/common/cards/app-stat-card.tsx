import type { ReactNode } from "react";

import AppButton from "@/components/common/buttons/app-button";
import AppTooltip from "@/components/common/overlays/app-tooltip";
import { cn } from "@/lib/utils";

import AppCard from "./app-card";

// A labelled stat in a card: uppercase label (+ optional ⓘ tooltip and a
// right-aligned `action` slot), a big value, and a muted hint underneath.
// Consolidates per-feature stat cards into one shared component. `emphasized`
// is the one visual variant (a primary-tinted highlight).
interface IProps {
  label: string;
  value: string;
  hint?: string;
  tooltip?: string;
  action?: ReactNode;
  emphasized?: boolean;
  valueClassName?: string;
  className?: string;
}

const AppStatCard = (props: IProps) => {
  const { label, value, hint, tooltip, action, emphasized, valueClassName, className } =
    props;

  return (
    <AppCard
      className={cn(
        "p-4",
        emphasized && "border-primary ring-primary/20 ring-1",
        className,
      )}
    >
      <div className="flex items-baseline justify-between gap-2">
        <div className="flex items-center gap-1">
          <p className="text-fg-4 text-[11px] font-medium tracking-wide uppercase">
            {label}
          </p>
          {tooltip && (
            <AppTooltip content={tooltip}>
              <AppButton
                variant="unstyled"
                size="fit"
                aria-label="More info"
                className="text-fg-4 cursor-help text-[11px]"
              >
                {"ⓘ"}
              </AppButton>
            </AppTooltip>
          )}
        </div>
        {action}
      </div>
      <p
        className={cn(
          "mt-1 text-xl font-semibold",
          emphasized && "text-primary",
          valueClassName,
        )}
      >
        {value}
      </p>
      {hint && <p className="text-fg-4 mt-0.5 text-[11px]">{hint}</p>}
    </AppCard>
  );
};

export default AppStatCard;
