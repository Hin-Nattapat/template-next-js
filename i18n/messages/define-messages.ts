export type TMatchingMessages<T> = {
  [K in keyof T]: T[K] extends string
    ? string
    : T[K] extends (...args: infer TArgs) => string
      ? (...args: TArgs) => string
      : T[K] extends object
        ? TMatchingMessages<T[K]>
        : never;
};

export type TMessageBundle<T> = {
  en: T;
  th: TMatchingMessages<T>;
};

export function defineMessages<const T extends Record<string, unknown>>(
  en: T,
  th: TMatchingMessages<T>,
): TMessageBundle<T> {
  return { en, th };
}
