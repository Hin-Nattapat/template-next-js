"use client";

import AppButton from "@/components/common/buttons/app-button";
import { Locale } from "@/i18n/locale";
import { useI18n } from "@/i18n/use-i18n";
import { cn } from "@/lib/utils";

interface IProps {
  className?: string;
}

const LanguageToggle = (props: IProps) => {
  const { className } = props;

  const { locale, common, setLocale } = useI18n();

  const options = [
    { locale: Locale.Th, label: "ไทย", ariaLabel: common.thaiLanguage },
    { locale: Locale.En, label: "EN", ariaLabel: common.englishLanguage },
  ];

  return (
    <div
      role="group"
      aria-label={common.language}
      className={cn(
        "border-border inline-flex overflow-hidden rounded-md border",
        className,
      )}
    >
      {options.map(option => (
        <AppButton
          key={option.locale}
          type="button"
          variant={locale === option.locale ? "secondary" : "ghost"}
          size="sm"
          label={option.label}
          aria-label={option.ariaLabel}
          aria-pressed={locale === option.locale}
          className="min-w-11 rounded-none"
          onClick={() => setLocale(option.locale)}
        />
      ))}
    </div>
  );
};

export default LanguageToggle;
