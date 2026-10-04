"use client";

import { useId } from "react";

import { cn } from "@/lib/utils";

import { Input } from "../../ui/input";

// AppInput is the canonical text-input used everywhere in the app.
// Wrap reasons (per CLAUDE.md §3.6):
//
//   1. Typed `label` prop bakes the "label + input" pair into one call
//      site — same DX as `AppButton`'s typed `label` / `icon` props.
//      No more loose <label> + <Input> pairs scattered across features.
//   2. `required` / `remark` slots cover the standard form-control
//      shape without forcing RHF (use FormInput when you do need RHF).
//   3. One seam for app-wide tweaks (focus ring, size variants, etc.).
//   4. Pass-throughs (`value`, `onChange`, `placeholder`, `disabled`,
//      `className`, `id`, …) flow straight to shadcn Input.
//
// Falls back to a bare <Input /> when no `label`/`remark` is provided —
// keeps it usable as a drop-in shadcn replacement.
interface IProps extends React.ComponentProps<typeof Input> {
  label?: string;
  required?: boolean;
  /** Inline helper text rendered under the field. Use for hints, not
   *  validation errors (those live on FormInput via FormMessage). */
  remark?: React.ReactNode;
  /** Optional wrapper class — only applied when label/remark renders
   *  the wrapping <div>. */
  containerClassName?: string;
}

const AppInput = (props: IProps) => {
  const { label, required, remark, containerClassName, id, className, ...inputProps } =
    props;
  const autoId = useId();
  const fieldId = id ?? autoId;

  if (!label && !remark) {
    return <Input id={fieldId} className={className} {...inputProps} />;
  }

  return (
    <div className={cn("flex flex-col gap-1", containerClassName)}>
      {label && (
        <label htmlFor={fieldId} className="text-fg-3 text-xs font-medium">
          {label}
          {required && <span className="text-destructive ml-0.5">*</span>}
        </label>
      )}
      <Input id={fieldId} className={className} {...inputProps} />
      {remark && <p className="text-fg-4 text-[11px]">{remark}</p>}
    </div>
  );
};

export default AppInput;
