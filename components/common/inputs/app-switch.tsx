"use client";

import { useId } from "react";

import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

// Labelled switch row: label left, switch right, wired by id so the label
// names the switch for assistive tech and toggles it on click.
interface IProps extends React.ComponentProps<typeof Switch> {
  label: string;
  containerClassName?: string;
}

const AppSwitch = (props: IProps) => {
  const { label, containerClassName, id, ...rest } = props;
  const autoId = useId();
  const switchId = id ?? autoId;

  return (
    <div className={cn("flex items-center justify-between gap-3", containerClassName)}>
      <label htmlFor={switchId} className="text-fg-3 text-xs font-medium">
        {label}
      </label>
      <Switch id={switchId} {...rest} />
    </div>
  );
};

export default AppSwitch;
