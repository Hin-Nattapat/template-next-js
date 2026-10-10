"use client";

import { TriangleAlert } from "lucide-react";

import AppButton from "@/components/common/buttons/app-button";
import { commonMessages } from "@/i18n/messages/common";
import { useMessages } from "@/i18n/use-i18n";

interface IProps {
  retry: () => void;
}

const AppLoadError = (props: IProps) => {
  const { retry } = props;

  const m = useMessages(commonMessages);

  return (
    <div
      role="alert"
      className="bg-card border-border flex flex-col items-start gap-4 rounded-lg border p-5"
    >
      <p className="flex items-center gap-2 font-semibold">
        <TriangleAlert aria-hidden className="text-warning size-5 shrink-0" />
        {m.loadError}
      </p>
      <AppButton label={m.retry} onClick={retry} />
    </div>
  );
};

export default AppLoadError;
