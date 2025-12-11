interface IProps {
  id: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}

const Section = (props: IProps) => {
  const { id, title, description, children } = props;

  return (
    <section id={id} className="scroll-mt-24 space-y-6">
      <div className="space-y-2">
        <h2 className="text-foreground text-3xl font-semibold tracking-tight">{title}</h2>
        {description && <p className="text-muted-foreground text-lg">{description}</p>}
      </div>
      <div>{children}</div>
    </section>
  );
};

export default Section;
