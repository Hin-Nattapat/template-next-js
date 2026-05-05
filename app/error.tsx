"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

interface IProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const ErrorBoundary = (props: IProps) => {
  const { error, reset } = props;

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <h2 className="text-2xl font-semibold">Something went wrong</h2>
      <p className="text-muted-foreground max-w-md text-sm">
        {error.message || "An unexpected error occurred."}
      </p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
};

export default ErrorBoundary;
