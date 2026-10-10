import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

const AppSkeleton = (props: ComponentProps<"div">) => {
  const { className, ...rest } = props;

  return <div className={cn("motion-safe:animate-pulse", className)} {...rest} />;
};

export default AppSkeleton;
