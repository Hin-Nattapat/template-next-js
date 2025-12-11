import type { LucideIcon } from "lucide-react";

import { Button } from "../../ui/button";

interface IProps extends React.ComponentProps<typeof Button> {
  icon?: LucideIcon;
  text: string;
}

const AppButton = (props: IProps) => {
  const { icon: Icon, text, ...rest } = props;
  return (
    <Button {...rest}>
      {Icon && <Icon size={16} />}
      {text}
    </Button>
  );
};

export default AppButton;
