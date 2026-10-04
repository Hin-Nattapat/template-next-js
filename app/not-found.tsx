import Link from "next/link";

import AppButton from "@/components/common/buttons/app-button";
import { getMessages } from "@/i18n/get-messages";
import { commonMessages } from "@/i18n/messages/common";

const NotFound = async () => {
  const m = await getMessages(commonMessages);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-6xl font-bold">{m.notFoundTitle}</h1>
      <p className="text-muted-foreground max-w-md text-sm">{m.notFoundDescription}</p>
      <AppButton asChild>
        <Link href="/">{m.goHome}</Link>
      </AppButton>
    </div>
  );
};

export default NotFound;
