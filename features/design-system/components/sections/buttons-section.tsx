"use client";

import { Coffee } from "lucide-react";

import { Button } from "@/components/ui/button";

import CodeBlock from "../code-block";
import Section from "../section";

const ButtonsSection = () => {
  return (
    <Section
      id="buttons"
      title="3. Buttons"
      description="Buttons feature medium-to-large rounded corners (8-12px) and soft shadows for a tactile feel. Interactive states provide clear feedback."
    >
      <div className="space-y-8">
        <div>
          <h3 className="text-muted-foreground mb-4 text-sm font-medium">Primary</h3>
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="default">Default</Button>
              <Button variant="default" disabled>
                Disabled
              </Button>
              <Button variant="destructive">Destructive</Button>
            </div>
            <CodeBlock
              code={`import { Button } from '@/components/ui/button'

<Button variant="default">Default</Button>
<Button variant="destructive">Destructive</Button>`}
            />
          </div>
        </div>

        <div>
          <h3 className="text-muted-foreground mb-4 text-sm font-medium">Secondary</h3>
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="outline">Default</Button>
              <Button variant="outline" disabled>
                Disabled
              </Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="secondary">Secondary</Button>
            </div>
            <CodeBlock
              code={`import { Button } from '@/components/ui/button'

<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="secondary">Secondary</Button>`}
            />
          </div>
        </div>

        <div>
          <h3 className="text-muted-foreground mb-4 text-sm font-medium">Sizes</h3>
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-4">
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
              <Button size="icon">
                <Coffee className="h-4 w-4" />
              </Button>
            </div>
            <CodeBlock
              code={`import { Button } from '@/components/ui/button'

<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>`}
            />
          </div>
        </div>

        <div>
          <h3 className="text-muted-foreground mb-4 text-sm font-medium">With Icons</h3>
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-4">
              <Button>
                <Coffee className="mr-2 h-4 w-4" />
                With Icon
              </Button>
              <Button variant="outline">
                Focus
                <Coffee className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <CodeBlock
              code={`import { Button } from '@/components/ui/button'
import { Coffee } from 'lucide-react'

<Button>
  <Coffee className="mr-2 h-4 w-4" />
  With Icon
</Button>`}
            />
          </div>
        </div>
      </div>
    </Section>
  );
};

export default ButtonsSection;
