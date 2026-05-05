import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { TExample } from "../types";

interface IProps {
  example: TExample;
}

const ExampleCard = (props: IProps) => {
  const { example } = props;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{example.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">{example.description}</p>
      </CardContent>
    </Card>
  );
};

export default ExampleCard;
