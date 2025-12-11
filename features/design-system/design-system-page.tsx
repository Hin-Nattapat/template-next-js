"use client";

import { Coffee } from "lucide-react";

import DesignSystemNav from "./components/design-system-nav";
import Section from "./components/section";
import AccordionSection from "./components/sections/accordion-section";
import ButtonsSection from "./components/sections/buttons-section";
import CardsSection from "./components/sections/cards-section";
import ColorsSection from "./components/sections/colors-section";
import FeedbackSection from "./components/sections/feedback-section";
import FormsSection from "./components/sections/forms-section";
import TypographySection from "./components/sections/typography-section";

const DesignSystemPage = () => {
  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-12 lg:grid-cols-[280px_1fr]">
          <aside className="hidden lg:block">
            <DesignSystemNav />
          </aside>

          <main className="space-y-16">
            <Section
              id="introduction"
              title="BrewHub Design System"
              description="A comprehensive guide to the visual language, components, and design principles that shape the BrewHub experience. Our system is built on a Coffee & Minimal aesthetic, emphasizing warmth, clarity, and ease of use."
            >
              <div className="space-y-6">
                <div className="bg-accent/20 rounded-lg border p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary rounded-lg p-3">
                      <Coffee className="text-primary-foreground h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="mb-2 font-semibold">Design Principles</h3>
                      <ul className="text-muted-foreground space-y-2 text-sm">
                        <li>
                          <strong>Warmth:</strong> Soft, earthy tones inspired by coffee
                          culture
                        </li>
                        <li>
                          <strong>Clarity:</strong> Clean layouts and intuitive
                          interactions
                        </li>
                        <li>
                          <strong>Ease of Use:</strong> Accessible and straightforward
                          components
                        </li>
                        <li>
                          <strong>Consistency:</strong> Unified visual language across the
                          platform
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="prose prose-sm max-w-none">
                  <p className="text-muted-foreground">
                    This design system uses OKLCH color space for perceptually uniform
                    colors, ensuring consistent visual weight across all hues. All
                    components are built with accessibility in mind, featuring proper
                    contrast ratios, keyboard navigation, and ARIA labels.
                  </p>
                </div>
              </div>
            </Section>

            <ColorsSection />
            <TypographySection />
            <ButtonsSection />
            <FormsSection />
            <CardsSection />
            <FeedbackSection />
            <AccordionSection />

            <Section
              id="usage"
              title="Usage Guidelines"
              description="Best practices for implementing the BrewHub design system in your projects."
            >
              <div className="space-y-4">
                <div className="rounded-lg border p-6">
                  <h3 className="mb-3 font-semibold">Component Imports</h3>
                  <p className="text-muted-foreground mb-3 text-sm">
                    All components are located in the{" "}
                    <code className="bg-secondary rounded px-1.5 py-0.5 font-mono text-xs">
                      @/components/ui
                    </code>{" "}
                    directory. Import them as needed:
                  </p>
                  <pre className="bg-secondary overflow-x-auto rounded-lg border p-4 font-mono text-sm">
                    <code>
                      {`import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader } from '@/components/ui/card'`}
                    </code>
                  </pre>
                </div>

                <div className="rounded-lg border p-6">
                  <h3 className="mb-3 font-semibold">Styling Utilities</h3>
                  <p className="text-muted-foreground mb-3 text-sm">
                    Use the{" "}
                    <code className="bg-secondary rounded px-1.5 py-0.5 font-mono text-xs">
                      cn()
                    </code>{" "}
                    utility function from{" "}
                    <code className="bg-secondary rounded px-1.5 py-0.5 font-mono text-xs">
                      @/lib/utils
                    </code>{" "}
                    to conditionally apply Tailwind classes:
                  </p>
                  <pre className="bg-secondary overflow-x-auto rounded-lg border p-4 font-mono text-sm">
                    <code>
                      {`import { cn } from '@/lib/utils'

<div className={cn(
  'base-classes',
  isActive && 'active-classes',
  'additional-classes'
)} />`}
                    </code>
                  </pre>
                </div>

                <div className="rounded-lg border p-6">
                  <h3 className="mb-3 font-semibold">Color Variables</h3>
                  <p className="text-muted-foreground mb-3 text-sm">
                    Access color variables using CSS custom properties:
                  </p>
                  <pre className="bg-secondary overflow-x-auto rounded-lg border p-4 font-mono text-sm">
                    <code>
                      {`/* In CSS */
background-color: var(--primary);
color: var(--foreground);

/* In Tailwind */
<div className="bg-primary text-foreground" />

/* Inline styles */
<div style={{ backgroundColor: 'var(--primary)' }} />`}
                    </code>
                  </pre>
                </div>
              </div>
            </Section>
          </main>
        </div>
      </div>
    </div>
  );
};

export default DesignSystemPage;
