"use client";

import { useFormContext } from "react-hook-form";

import { cn } from "@/lib/utils";

import AppFormLabel from "../common/form/app-form-label";
import { FormField, FormItem, FormMessage } from "../ui/form";
import { Textarea } from "../ui/textarea";

interface IProps extends React.ComponentProps<typeof Textarea> {
  label?: string;
  name: string;
  required?: boolean;
  layout?: "horizontal" | "vertical";
  /** Inline helper text rendered under the field. Use for source/format
   *  hints that aren't validation errors (those go through FormMessage). */
  remark?: React.ReactNode;
}

const FormInputArea = (props: IProps) => {
  const { label, name, required, layout = "vertical", remark, ...rest } = props;
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
            <Textarea {...field} {...rest} />
            <FormMessage />
            {remark && <p className="text-fg-4 text-[11px]">{remark}</p>}
          </div>
        </FormItem>
      )}
    />
  );
};

export default FormInputArea;
