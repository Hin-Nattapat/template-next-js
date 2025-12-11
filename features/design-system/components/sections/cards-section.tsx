"use client";

import { Coffee } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import CodeBlock from "../code-block";
import Section from "../section";

const CardsSection = () => {
  return (
    <Section
      id="cards"
      title="5. Cards"
      description="Cards are the primary content containers, using soft backgrounds and shadows to create a sense of elevation and focus."
    >
      <div className="space-y-8">
        <div>
          <h3 className="text-muted-foreground mb-4 text-sm font-medium">Base Card</h3>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Card Title</CardTitle>
                  <CardDescription>
                    This is a base card component. It serves as a flexible container for
                    any type of content, providing elevation and separation from the
                    background.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    Card content goes here. You can add any elements inside the card
                    content area.
                  </p>
                </CardContent>
              </Card>
            </div>
            <CodeBlock
              code={`import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content</p>
  </CardContent>
</Card>`}
            />
          </div>
        </div>

        <div>
          <h3 className="text-muted-foreground mb-4 text-sm font-medium">Product Card</h3>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <div className="bg-accent aspect-square overflow-hidden rounded-lg">
                    <Coffee className="text-primary h-full w-full p-8" />
                  </div>
                </CardHeader>
                <CardContent>
                  <CardTitle className="mb-2">Yirgacheffe Natural</CardTitle>
                  <CardDescription>
                    Floral notes with blueberry undertones
                  </CardDescription>
                </CardContent>
                <CardFooter className="flex items-center justify-between">
                  <span className="text-lg font-semibold">$18.50</span>
                  <Button size="sm">Add to Cart</Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <div className="bg-secondary aspect-square overflow-hidden rounded-lg">
                    <Coffee className="text-muted-foreground h-full w-full p-8" />
                  </div>
                </CardHeader>
                <CardContent>
                  <CardTitle className="mb-2">Colombia Supremo</CardTitle>
                  <CardDescription>Balanced with caramel sweetness</CardDescription>
                </CardContent>
                <CardFooter className="flex items-center justify-between">
                  <span className="text-lg font-semibold">$16.00</span>
                  <Button size="sm">Add to Cart</Button>
                </CardFooter>
              </Card>
            </div>
            <CodeBlock
              code={`import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

<Card>
  <CardHeader>
    <div className="aspect-square overflow-hidden rounded-lg">
      <img src="/coffee.jpg" alt="Product" />
    </div>
  </CardHeader>
  <CardContent>
    <CardTitle>Product Name</CardTitle>
    <CardDescription>Product description</CardDescription>
  </CardContent>
  <CardFooter>
    <span>$18.50</span>
    <Button>Add to Cart</Button>
  </CardFooter>
</Card>`}
            />
          </div>
        </div>

        <div>
          <h3 className="text-muted-foreground mb-4 text-sm font-medium">
            Card with Action
          </h3>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Card with Action</CardTitle>
                  <CardAction>
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  </CardAction>
                  <CardDescription>
                    This card includes an action button in the header
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    Use this pattern when you need quick actions accessible from the card
                    header.
                  </p>
                </CardContent>
              </Card>
            </div>
            <CodeBlock
              code={`import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

<Card>
  <CardHeader>
    <CardTitle>Card with Action</CardTitle>
    <CardAction>
      <Button variant="ghost" size="sm">Edit</Button>
    </CardAction>
    <CardDescription>Description</CardDescription>
  </CardHeader>
</Card>`}
            />
          </div>
        </div>
      </div>
    </Section>
  );
};

export default CardsSection;
