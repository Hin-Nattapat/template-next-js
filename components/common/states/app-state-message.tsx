import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface IProps {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

const AppStateMessage = (props: IProps) => {
  const { title, description, action, className } = props;

  return (
    <div
      className={cn(
        "bg-card border-border flex flex-col items-start gap-4 rounded-lg border p-6",
        className,
      )}
    >
      <p className="text-lg font-semibold">{title}</p>
      {description && <p className="text-muted-foreground text-sm">{description}</p>}
      {action}
    </div>
  );
};

export default AppStateMessage;
