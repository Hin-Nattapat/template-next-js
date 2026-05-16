"use client";

import { useFormContext } from "react-hook-form";

import { cn } from "@/lib/utils";

import AppFormLabel from "../common/form/app-form-label";
import { FormField, FormItem, FormMessage } from "../ui/form";
import { Input } from "../ui/input";

interface IProps extends Omit<React.ComponentProps<typeof Input>, "type" | "value" | "onChange"> {
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

// Parse what the user typed into a canonical numeric string.
// Strips commas, blocks non-digit characters, enforces single decimal,
// caps decimal places, and respects allowNegative.
function sanitize(raw: string, allowNegative: boolean, decimals: number): string {
  if (raw === "") return "";

  // Strip commas (thousand separators) so paste of "1,000.50" works.
  let s = raw.replace(/,/g, "");

  // Pull out a leading minus sign if allowed.
  let sign = "";
  if (allowNegative && s.startsWith("-")) {
    sign = "-";
    s = s.slice(1);
  }

  // Drop everything except digits + the first decimal point.
  let seenDot = false;
  let cleaned = "";
  for (const ch of s) {
    if (ch >= "0" && ch <= "9") {
      cleaned += ch;
    } else if (ch === "." && !seenDot && decimals > 0) {
      cleaned += ".";
      seenDot = true;
    }
  }

  // Cap fractional digits.
  if (cleaned.includes(".")) {
    const [intPart, fracPart = ""] = cleaned.split(".");
    cleaned = intPart + "." + fracPart.slice(0, decimals);
  }

  return sign + cleaned;
}

// Render a sanitized numeric string with thousand separators on the
// integer part. Preserves a trailing "." while the user is mid-typing
// and any trailing zeros after the decimal.
function format(value: string): string {
  if (value === "" || value === "-") return value;

  const negative = value.startsWith("-");
  const body = negative ? value.slice(1) : value;
  const [intPart, fracPart] = body.split(".");
  const intFmt = intPart === "" ? "" : Number(intPart).toLocaleString("en-US");

  let out = intFmt;
  if (body.includes(".")) {
    out += "." + (fracPart ?? "");
  }
  return negative ? "-" + out : out;
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
            <Input
              {...rest}
              inputMode={decimals > 0 ? "decimal" : "numeric"}
              type="text"
              autoComplete="off"
              value={format(String(field.value ?? ""))}
              onChange={(e) => {
                // Sanitize → store the plain numeric string in RHF.
                // The display layer renders it back through format().
                field.onChange(sanitize(e.target.value, allowNegative, decimals));
              }}
              onBlur={field.onBlur}
              name={field.name}
              ref={field.ref}
            />
            <FormMessage />
            {remark && <p className="text-fg-4 text-[11px]">{remark}</p>}
          </div>
        </FormItem>
      )}
    />
  );
};

export default FormNumberInput;
