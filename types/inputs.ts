export interface IComboboxOption {
  value: string;
  label: string;
  /** Extra search keywords (e.g. an entity's name + code) when label alone
   *  isn't enough — cmdk filters against this string in addition to label. */
  keywords?: string;
}

export interface ISelectButtonOption<T extends string> {
  value: T;
  label: string;
}
