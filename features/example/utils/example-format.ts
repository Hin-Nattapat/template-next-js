// Example feature-scoped util — pure helpers used by this feature only.
import type { IOption } from "@/types/global";

import { LABEL_SEPARATOR, OPTION_VALUES } from "../constants";
import type { TExample } from "../types";

export function formatExampleLabel(example: TExample): string {
  return [example.name, example.description].join(LABEL_SEPARATOR);
}

export function sortExamplesByName(examples: TExample[]): TExample[] {
  return [...examples].sort((a, b) => a.name.localeCompare(b.name));
}

export function toCategoryOptions(optionLabel: (n: number) => string): IOption[] {
  return OPTION_VALUES.map(value => ({ value, label: optionLabel(Number(value)) }));
}
