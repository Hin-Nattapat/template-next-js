export type TDialogType = "alert" | "confirm";

export type TAlertVariant = "info" | "success" | "warning" | "error";

export type TConfirmVariant = "default" | "destructive";

export interface IAlertConfig {
  title: string;
  message: string;
  variant?: TAlertVariant;
  buttonText?: string;
}

export interface IConfirmConfig {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: TConfirmVariant;
}

export interface IDialogItem {
  id: string;
  type: TDialogType;
  config: IAlertConfig | IConfirmConfig;
  resolve?: (value: boolean) => void;
}
