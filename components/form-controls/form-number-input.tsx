"use client";

import { useFormContext } from "react-hook-form";

import { cn } from "@/lib/utils";

import AppFormLabel from "../common/form/app-form-label";
import { formatNumber, sanitizeNumber } from "../common/inputs/number-input-format";
import { FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Input } from "../ui/input";

interface IProps extends Omit<
  React.ComponentProps<typeof Input>,
  "type" | "value" | "onChange"
> {
  label?: string;
  name: string;
  required?: boolean;
  layout?: "horizontal" | "vertical";
  /** Allow a leading minus sign. Default false (quantity/price/fee can't be negative). */
  allowNegative?: boolean;
  /** Max digits after the decimal point. Default 8 (matches BE numeric(_, 8)). */
  decimals?: number;
  /** Inline helper text rendered under the field. Use for source/format
   *  hints that aren't validation errors (those go through FormMessage). */
  remark?: React.ReactNode;
}

const FormNumberInput = (props: IProps) => {
  const {
    label,
    name,
    required,
    layout = "vertical",
    allowNegative = false,
    decimals = 8,
    remark,
    ...rest
  } = props;
  const { control } = useFormContext();

  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem className="w-full">
          <div
            className={cn(
              "flex gap-1",
              layout === "horizontal" ? "flex-row items-start" : "flex-col",
            )}
          >
            {label && <AppFormLabel label={label} required={required} layout={layout} />}
            <FormControl>
              <Input
                {...rest}
                aria-required={required || undefined}
                inputMode={decimals > 0 ? "decimal" : "numeric"}
                type="text"
                autoComplete="off"
                value={formatNumber(String(field.value ?? ""))}
                onChange={e => {
                  // Sanitize → store the plain numeric string in RHF.
                  // The display layer renders it back through formatNumber().
                  field.onChange(sanitizeNumber(e.target.value, allowNegative, decimals));
                }}
                onBlur={field.onBlur}
                name={field.name}
                ref={field.ref}
              />
            </FormControl>
            <FormMessage />
            {remark && <p className="text-fg-4 text-[11px]">{remark}</p>}
          </div>
        </FormItem>
      )}
    />
  );
};

export default FormNumberInput;
