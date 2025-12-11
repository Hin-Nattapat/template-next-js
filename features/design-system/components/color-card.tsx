interface IProps {
  name: string;
  cssVar: string;
  description?: string;
}

const ColorCard = (props: IProps) => {
  const { name, cssVar, description } = props;

  return (
    <div className="space-y-2">
      <div
        className="h-24 w-full rounded-lg border shadow-sm"
        style={{ backgroundColor: `var(${cssVar})` }}
      />
      <div className="space-y-1">
        <p className="text-foreground font-semibold">{name}</p>
        <p className="text-muted-foreground font-mono text-xs">{cssVar}</p>
        {description && <p className="text-muted-foreground text-sm">{description}</p>}
      </div>
    </div>
  );
};

export default ColorCard;
