"use client";

import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

import { Checkbox } from "../../ui/checkbox";

interface IProps extends ComponentProps<typeof Checkbox> {
  label?: string;
  labelClassName?: string;
}

const AppCheckbox = (props: IProps) => {
  const { label, labelClassName, className, ...checkboxProps } = props;

  if (!label) {
    return <Checkbox className={className} {...checkboxProps} />;
  }

  return (
    <label className={cn("flex cursor-pointer items-center gap-2", labelClassName)}>
      <Checkbox className={className} {...checkboxProps} />
      <span>{label}</span>
    </label>
  );
};

export default AppCheckbox;
