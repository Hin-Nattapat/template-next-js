import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import { Button } from "../../ui/button";

// AppButton is the canonical button used everywhere in the app.
// Wrap reasons (per STYLE.md §3 "wrap shadcn primitives in
// components/common/"):
//
//   1. One seam for app-wide style additions — push tweaks here
//      instead of editing every call site.
//   2. Strong default API: `label` + optional `icon`. Most buttons
//      are plain "icon + text" so a typed prop reads cleaner than
//      typing the JSX every time.
//   3. `children` only kicks in for actual composition cases
//      (`asChild` + `<Link>`, custom layouts, animated icons that
//      need extra className handling). When you reach for children,
//      label/icon get ignored.
//
// Variant / size / asChild / className / on click / disabled / type
// flow straight through to shadcn Button.
interface IProps extends React.ComponentProps<typeof Button> {
  label?: string;
  icon?: LucideIcon;
  iconClassName?: string;
  children?: ReactNode;
}

const AppButton = (props: IProps) => {
  const { label, icon: Icon, iconClassName, children, ...rest } = props;
  // children path is only used when the caller needs to compose
  // arbitrary JSX (asChild + Link, animated icon + label, etc.).
  // Plain "icon + label" goes through the typed props.
  if (children !== undefined) {
    return <Button {...rest}>{children}</Button>;
  }
  return (
    <Button {...rest}>
      {Icon && <Icon className={cn("size-4", iconClassName)} />}
      {label}
    </Button>
  );
};

export default AppButton;
