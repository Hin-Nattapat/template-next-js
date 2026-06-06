"use client";

import { useFormContext } from "react-hook-form";

import { cn } from "@/lib/utils";

import AppFormLabel from "../common/form/app-form-label";
import AppCombobox from "../common/inputs/app-combobox";
import { FormControl, FormField, FormItem, FormMessage } from "../ui/form";

interface IProps extends React.ComponentProps<typeof AppCombobox> {
  label?: string;
  name: string;
  required?: boolean;
  layout?: "horizontal" | "vertical";
  /** Inline helper text rendered under the field. Use for source/format
   *  hints that aren't validation errors (those go through FormMessage). */
  remark?: React.ReactNode;
}

const FormCombobox = (props: IProps) => {
  const { label, name, required, layout = "vertical", remark, ...rest } = props;
  const { control } = useFormContext();

  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem className="w-full min-w-0 grid-cols-1">
          <div
            className={cn(
              "flex min-w-0 gap-1",
              layout === "horizontal" ? "flex-row items-start" : "flex-col",
            )}
          >
            {label && <AppFormLabel label={label} required={required} layout={layout} />}
            <FormControl>
              <AppCombobox
                {...rest}
                aria-required={required || undefined}
                name={field.name}
                value={field.value}
                onValueChange={field.onChange}
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

export default FormCombobox;
