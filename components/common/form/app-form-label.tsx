import { cn } from "@/lib/utils";

import { FormLabel } from "../../ui/form";

interface IProps extends React.ComponentProps<typeof FormLabel> {
  label?: string;
  required?: boolean;
  layout?: "horizontal" | "vertical";
}
const AppFormLabel = (props: IProps) => {
  const { label, required, layout = "vertical", ...rest } = props;
  return (
    <FormLabel
      className={cn("flex items-center gap-1", layout === "horizontal" && "pt-2")}
      {...rest}
    >
      <span>{label}</span>
      {required && <span className="text-destructive">*</span>}
    </FormLabel>
  );
};

export default AppFormLabel;
