"use client";

import { useExamples } from "../hooks/use-examples";
import ExampleCard from "./example-card";

const ExamplePage = () => {
  const { examples, isLoading, error } = useExamples();

  if (isLoading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="text-destructive p-8">Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-6 text-2xl font-semibold">Examples</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {examples.map(example => (
          <ExampleCard key={example.id} example={example} />
        ))}
      </div>
    </div>
  );
};

export default ExamplePage;
