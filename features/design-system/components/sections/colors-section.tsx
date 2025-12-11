import ColorCard from "../color-card";
import Section from "../section";

const ColorsSection = () => {
  return (
    <Section
      id="colors"
      title="1. Design Tokens"
      description="Our palette is warm, soft, and low-contrast to create a calming and inviting atmosphere. It avoids pure whites and blacks for a more natural feel."
    >
      <div className="space-y-8">
        <div>
          <h3 className="mb-4 text-xl font-semibold">Colors</h3>
          <p className="text-muted-foreground mb-6 text-sm">
            Built on a Coffee & Minimal aesthetic, emphasizing warmth, clarity, and ease
            of use.
          </p>

          <div className="space-y-6">
            <div>
              <h4 className="text-muted-foreground mb-3 text-sm font-medium">
                Semantic Colors
              </h4>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                <ColorCard name="Primary" cssVar="--primary" description="Brew Brown" />
                <ColorCard
                  name="Secondary"
                  cssVar="--secondary"
                  description="Light surface"
                />
                <ColorCard name="Accent" cssVar="--accent" description="Warm Latte" />
                <ColorCard
                  name="Background"
                  cssVar="--background"
                  description="Soft creamy brew"
                />
                <ColorCard
                  name="Foreground"
                  cssVar="--foreground"
                  description="Rich dark roast"
                />

                <ColorCard
                  name="Muted"
                  cssVar="--muted"
                  description="Subtle background"
                />
              </div>
            </div>

            <div>
              <h4 className="text-muted-foreground mb-3 text-sm font-medium">
                Feedback Colors
              </h4>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                <ColorCard name="Success" cssVar="--success" description="#6DA76A" />
                <ColorCard name="Info" cssVar="--info" description="#6B9BD1" />
                <ColorCard name="Warning" cssVar="--warning" description="#E8B55D" />
                <ColorCard name="Error" cssVar="--error" description="#D9534F" />
                <ColorCard
                  name="Destructive"
                  cssVar="--destructive"
                  description="#C9302C"
                />
              </div>
            </div>

            <div>
              <h4 className="text-muted-foreground mb-3 text-sm font-medium">
                Utility Colors
              </h4>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                <ColorCard name="Border" cssVar="--border" />
                <ColorCard name="Input" cssVar="--input" />
                <ColorCard name="Ring" cssVar="--ring" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default ColorsSection;
