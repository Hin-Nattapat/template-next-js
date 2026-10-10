import type { IOption } from "@/types/global";

export const SIZE_OPTIONS: IOption[] = [10, 25, 50, 100].map(n => ({
  value: String(n),
  label: `${n} / page`,
}));
