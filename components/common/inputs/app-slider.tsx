"use client";

import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

// Labelled slider: label + current-value text on one row, slider below.
// The label reaches the thumb (role="slider") via aria-label — htmlFor
// can't target a Radix slider.
interface IProps extends React.ComponentProps<typeof Slider> {
  label: string;
  /** Current value rendered at the row's right edge (e.g. "20 yr"). */
  valueText?: string;
  containerClassName?: string;
}

const AppSlider = (props: IProps) => {
  const { label, valueText, containerClassName, ...rest } = props;

  return (
    <div className={cn("flex flex-col gap-2", containerClassName)}>
      <div className="flex items-center justify-between">
        <span className="text-fg-3 text-xs font-medium">{label}</span>
        {valueText && <span className="text-fg-2 text-sm font-medium">{valueText}</span>}
      </div>
      <Slider aria-label={label} {...rest} />
    </div>
  );
};

export default AppSlider;
