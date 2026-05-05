// Example feature-scoped util — pure helpers used by this feature only.
import type { TExample } from "../types";

export function formatExampleLabel(example: TExample): string {
  return `${example.name} — ${example.description}`;
}

export function sortExamplesByName(examples: TExample[]): TExample[] {
  return [...examples].sort((a, b) => a.name.localeCompare(b.name));
}
