"use client";

import { useId } from "react";

import { cn } from "@/lib/utils";
import type { IOption } from "@/types/global";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";

interface IProps extends React.ComponentProps<typeof Select> {
  options?: IOption[];
  placeholder?: string;
  /** Wraps the trigger in a labelled flex-col group — matches `AppInput`'s
   *  shape so the two read at the same visual height. */
  label?: string;
  required?: boolean;
  /** Inline helper text rendered under the trigger. Use for hints, not
   *  validation errors. */
  remark?: React.ReactNode;
  containerClassName?: string;
  /** Land on the trigger so an external label (e.g. FormControl's htmlFor
   *  wiring) can target and describe it. */
  id?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: React.AriaAttributes["aria-invalid"];
  "aria-required"?: React.AriaAttributes["aria-required"];
}

const AppSelect = (props: IProps) => {
  const {
    options = [],
    value,
    placeholder = "Select…",
    label,
    required,
    remark,
    containerClassName,
    id,
    "aria-describedby": ariaDescribedBy,
    "aria-invalid": ariaInvalid,
    "aria-required": ariaRequired,
    ...rest
  } = props;
  const autoId = useId();
  const triggerId = id ?? autoId;
  // Radix Select's SelectValue reads the selected item's text from the
  // SelectItem registry — but items only register after SelectContent
  // mounts, which only happens when the dropdown opens. For controlled
  // values that arrive on mount (e.g., RHF form.reset on an edit page),
  // the trigger silently shows the placeholder until the user opens it
  // once. Bridge the gap by forwarding the ref to a leaf <span> via
  // asChild and rendering the looked-up label ourselves — this dodges
  // React 19's "ref on a container with text children" diagnostic.
  const selectedLabel = options.find(o => String(o.value) === String(value))?.label;

  const trigger = (
    <Select {...rest} value={value}>
      <SelectTrigger
        id={triggerId}
        aria-describedby={ariaDescribedBy}
        aria-invalid={ariaInvalid}
        aria-required={ariaRequired}
        className="w-full"
      >
        {selectedLabel != null ? (
          <SelectValue asChild>
            <span>{selectedLabel}</span>
          </SelectValue>
        ) : (
          <SelectValue placeholder={placeholder} />
        )}
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {options.map(option => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );

  if (!label && !remark) {
    return trigger;
  }

  return (
    <div className={cn("flex flex-col gap-1", containerClassName)}>
      {label && (
        <label htmlFor={triggerId} className="text-fg-3 text-xs font-medium">
          {label}
          {required && <span className="text-destructive ml-0.5">*</span>}
        </label>
      )}
      {trigger}
      {remark && <p className="text-fg-4 text-[11px]">{remark}</p>}
    </div>
  );
};

export default AppSelect;
