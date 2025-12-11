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
}

const FormInputArea = (props: IProps) => {
  const { label, name, required, layout = "vertical", ...rest } = props;
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
          </div>
        </FormItem>
      )}
    />
  );
};

export default FormInputArea;
