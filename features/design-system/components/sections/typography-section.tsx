import Section from "../section";

const TypographySection = () => {
  return (
    <Section
      id="typography"
      title="2. Typography"
      description="Our typography system uses Geist Sans for clarity and Geist Mono for code."
    >
      <div className="space-y-8">
        <div>
          <h3 className="text-muted-foreground mb-4 text-sm font-medium">
            Font Families
          </h3>
          <div className="space-y-3">
            <div className="rounded-lg border p-4">
              <p className="font-sans text-lg">{`Geist Sans - Primary Typography`}</p>
              <p className="text-muted-foreground text-sm">
                {`The quick brown fox jumps over the lazy dog`}
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="font-mono text-lg">{`Geist Mono - Code & Technical`}</p>
              <p className="text-muted-foreground font-mono text-sm">
                {`const greeting = 'Hello World';`}
              </p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-muted-foreground mb-4 text-sm font-medium">Font Sizes</h3>
          <div className="space-y-2">
            <p className="text-xs">Extra Small (text-xs) - Labels, captions</p>
            <p className="text-sm">Small (text-sm) - Body text, descriptions</p>
            <p className="text-base">Base (text-base) - Default body text</p>
            <p className="text-lg">Large (text-lg) - Emphasis, leads</p>
            <p className="text-xl">XL (text-xl) - Subtitles</p>
            <p className="text-2xl">2XL (text-2xl) - Section headers</p>
            <p className="text-3xl">3XL (text-3xl) - Page titles</p>
            <p className="text-4xl">4XL (text-4xl) - Display text</p>
          </div>
        </div>

        <div>
          <h3 className="text-muted-foreground mb-4 text-sm font-medium">Font Weights</h3>
          <div className="space-y-2">
            <p className="text-lg font-light">Light (font-light) - 300</p>
            <p className="text-lg font-normal">Normal (font-normal) - 400</p>
            <p className="text-lg font-medium">Medium (font-medium) - 500</p>
            <p className="text-lg font-semibold">Semibold (font-semibold) - 600</p>
            <p className="text-lg font-bold">Bold (font-bold) - 700</p>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default TypographySection;
