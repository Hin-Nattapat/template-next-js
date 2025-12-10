import type { IOption } from "@/types/global";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface IProps extends React.ComponentProps<typeof Select> {
  options?: IOption[];
}

const AppSelect = (props: IProps) => {
  const { options = [], ...rest } = props;
  return (
    <Select {...rest}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a product" />
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
};

export default AppSelect;
