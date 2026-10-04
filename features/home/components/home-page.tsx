import Link from "next/link";

import AppButton from "@/components/common/buttons/app-button";
import LanguageToggle from "@/components/common/language-toggle";
import ThemeToggle from "@/components/common/theme-toggle";
import { getMessages } from "@/i18n/get-messages";
import { homeMessages } from "@/i18n/messages/home";

const HomePage = async () => {
  const m = await getMessages(homeMessages);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="flex items-center gap-2">
        <LanguageToggle />
        <ThemeToggle />
      </div>
      <h1 className="text-4xl font-semibold tracking-tight">{m.title}</h1>
      <p className="text-muted-foreground max-w-md text-base">{m.description}</p>
      <AppButton asChild>
        <Link href="/example">{m.viewExample}</Link>
      </AppButton>
    </div>
  );
};

export default HomePage;
