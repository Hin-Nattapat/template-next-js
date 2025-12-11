"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

interface IProps {
  code: string;
}

const CodeBlock = (props: IProps) => {
  const { code } = props;
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <div className="absolute top-2 right-2">
        <Button variant="ghost" size="sm" onClick={handleCopy} className="h-8 w-8 p-0">
          {copied ? (
            <Check className="text-success h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>
      <pre className="bg-secondary overflow-x-auto rounded-lg border p-4 font-mono text-sm">
        <code>{code}</code>
      </pre>
    </div>
  );
};

export default CodeBlock;
