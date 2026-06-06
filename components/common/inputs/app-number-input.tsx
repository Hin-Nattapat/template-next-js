"use client";

import { useId } from "react";

import { cn } from "@/lib/utils";

import { Input } from "../../ui/input";
import { formatNumber, sanitizeNumber } from "./number-input-format";

// AppNumberInput is the controlled, numeric-only sibling of AppInput for use
// OUTSIDE react-hook-form (use FormNumberInput when inside RHF). It stores a
// canonical numeric string ("1000.50"), displays it with thousand separators,
// and rejects non-numeric keystrokes/paste.
interface IProps extends Omit<
  React.ComponentProps<typeof Input>,
  "type" | "value" | "onChange"
> {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  required?: boolean;
  /** Max digits after the decimal point. Default 2; set 0 for whole numbers. */
  decimals?: number;
  /** Allow a leading minus sign. Default false. */
  allowNegative?: boolean;
  remark?: React.ReactNode;
  containerClassName?: string;
}

const AppNumberInput = (props: IProps) => {
  const {
    value,
    onChange,
    label,
    required,
    decimals = 2,
    allowNegative = false,
    remark,
    containerClassName,
    id,
    className,
    ...inputProps
  } = props;
  const autoId = useId();
  const fieldId = id ?? autoId;

  const field = (
    <Input
      {...inputProps}
      id={fieldId}
      className={className}
      type="text"
      inputMode={decimals > 0 ? "decimal" : "numeric"}
      autoComplete="off"
      value={formatNumber(value)}
      onChange={e => onChange(sanitizeNumber(e.target.value, allowNegative, decimals))}
    />
  );

  if (!label && !remark) {
    return field;
  }

  return (
    <div className={cn("flex flex-col gap-1", containerClassName)}>
      {label && (
        <label htmlFor={fieldId} className="text-fg-3 text-xs font-medium">
          {label}
          {required && <span className="text-destructive ml-0.5">*</span>}
        </label>
      )}
      {field}
      {remark && <p className="text-fg-4 text-[11px]">{remark}</p>}
    </div>
  );
};

export default AppNumberInput;
