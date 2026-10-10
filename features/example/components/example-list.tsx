import type { TExample } from "../types";
import { formatExampleLabel } from "../utils/example-format";

interface IProps {
  examples: TExample[];
}

const ExampleList = (props: IProps) => {
  const { examples } = props;

  return (
    <ul className="mb-8 flex flex-col gap-1 text-sm">
      {examples.map(example => (
        <li key={example.id}>{formatExampleLabel(example)}</li>
      ))}
    </ul>
  );
};

export default ExampleList;
