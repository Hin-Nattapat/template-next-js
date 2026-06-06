import type { LucideIcon } from "lucide-react";

// Icon-badge + heading for an AppModal title slot. Uses spans only so it
// stays valid inside the DialogTitle (an <h2>).
interface IProps {
  icon: LucideIcon;
  title: string;
}

const AppModalTitle = (props: IProps) => {
  const { icon: Icon, title } = props;

  return (
    <span className="inline-flex items-center gap-2.5">
      <span className="bg-accent text-primary inline-flex size-8 items-center justify-center rounded-lg">
        <Icon className="size-4" />
      </span>
      {title}
    </span>
  );
};

export default AppModalTitle;
