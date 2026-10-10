import { cn } from "@/lib/utils";
import type { ISelectButtonOption } from "@/types/inputs";

interface IProps<T extends string> {
  options: ISelectButtonOption<T>[];
  active: T;
  onChange: (value: T) => void;
  label?: string;
  description?: string;
  className?: string;
}

const AppSelectButton = <T extends string>(props: IProps<T>) => {
  const { options, active, onChange, label, description, className } = props;

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {label && <span className="text-fg-3 text-xs font-medium">{label}</span>}
      <div className="flex items-center gap-1">
        {options.map(opt => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              "rounded-md border px-3 py-1.5 text-xs font-medium transition-colors",
              opt.value === active
                ? "border-primary bg-primary/10 text-fg"
                : "border-border text-fg-3 hover:bg-surface-2",
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
      {description && <p className="text-fg-4 text-[11px]">{description}</p>}
    </div>
  );
};

export default AppSelectButton;
