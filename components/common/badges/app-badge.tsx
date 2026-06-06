import { cn } from "@/lib/utils";

// The app's pill badge — status chips like Stale / Cash / DCA status / txn
// type. Promoted from the identical span repeated across six features.
// 11px is the type scale's smallest readable step (matches micro-labels);
// tone (border/bg/text token classes) comes from the caller via className.
// Extends span props so Radix asChild triggers (e.g. AppTooltip) can attach.
interface IProps extends React.ComponentProps<"span"> {
  className?: string;
}

const AppBadge = (props: IProps) => {
  const { children, className, ...rest } = props;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium tracking-wide uppercase",
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
};

export default AppBadge;
