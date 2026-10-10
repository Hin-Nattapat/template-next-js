"use client";

import AppButton from "@/components/common/buttons/app-button";
import { commonMessages } from "@/i18n/messages/common";
import { useMessages } from "@/i18n/use-i18n";

interface IProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const ErrorBoundary = (props: IProps) => {
  const { error, reset } = props;

  const m = useMessages(commonMessages);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <h2 className="text-2xl font-semibold">{m.errorTitle}</h2>
      <p className="text-muted-foreground max-w-md text-sm">
        {error.message || m.errorFallback}
      </p>
      <AppButton label={m.retry} onClick={reset} />
    </div>
  );
};

export default ErrorBoundary;
