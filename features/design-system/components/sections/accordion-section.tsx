"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import CodeBlock from "../code-block";
import Section from "../section";

const AccordionSection = () => {
  return (
    <Section
      id="accordion"
      title="7. Accordion"
      description="A collapsible content component to organize information concisely. The clean, soft design allows for easy scanning and interaction."
    >
      <div className="space-y-8">
        <div>
          <h3 className="text-muted-foreground mb-4 text-sm font-medium">
            Basic Accordion
          </h3>
          <div className="space-y-4">
            <div className="max-w-2xl">
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger>What is the return policy?</AccordionTrigger>
                  <AccordionContent>
                    {`
                      If you're not satisfied with your purchase, you can return the coffee
                      beans within 30 days of delivery. Please contact our support team.
                    `}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>How fresh is the coffee?</AccordionTrigger>
                  <AccordionContent>
                    {`
                      All our coffee is roasted to order. You'll receive beans that are no
                      more than 2-3 days post-roast, ensuring maximum freshness and flavor.
                    `}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>Do you offer subscriptions?</AccordionTrigger>
                  <AccordionContent>
                    Yes! We offer flexible subscription plans where you can receive your
                    favorite coffee beans monthly. Save 15% on all subscription orders.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
            <CodeBlock
              code={`import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

<Accordion type="single" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger>
      What is the return policy?
    </AccordionTrigger>
    <AccordionContent>
      If you're not satisfied with your purchase...
    </AccordionContent>
  </AccordionItem>
</Accordion>`}
            />
          </div>
        </div>

        <div>
          <h3 className="text-muted-foreground mb-4 text-sm font-medium">
            Multiple Items Accordion
          </h3>
          <div className="space-y-4">
            <div className="max-w-2xl">
              <Accordion type="multiple">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Brewing Methods</AccordionTrigger>
                  <AccordionContent>
                    We recommend pour-over, French press, or espresso methods for the best
                    flavor extraction from our beans.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>Storage Tips</AccordionTrigger>
                  <AccordionContent>
                    Store your coffee beans in an airtight container in a cool, dark
                    place. Avoid refrigeration as it can introduce moisture.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>Grind Size Guide</AccordionTrigger>
                  <AccordionContent>
                    Use coarse grind for French press, medium for drip coffee, and fine
                    grind for espresso machines.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
            <CodeBlock
              code={`import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

<Accordion type="multiple">
  <AccordionItem value="item-1">
    <AccordionTrigger>Brewing Methods</AccordionTrigger>
    <AccordionContent>
      We recommend pour-over, French press...
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-2">
    <AccordionTrigger>Storage Tips</AccordionTrigger>
    <AccordionContent>
      Store your coffee beans...
    </AccordionContent>
  </AccordionItem>
</Accordion>`}
            />
          </div>
        </div>
      </div>
    </Section>
  );
};

export default AccordionSection;
