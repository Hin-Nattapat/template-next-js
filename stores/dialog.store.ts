import { create } from "zustand";

import type { IAlertConfig, IConfirmConfig, IDialogItem } from "@/types/dialog";

export type TDialogState = {
  dialog: IDialogItem | null;
  alert: (title: string, message: string, config?: Partial<IAlertConfig>) => void;
  confirm: (
    title: string,
    description: string,
    config?: Partial<IConfirmConfig>,
  ) => Promise<boolean>;
  closeDialog: () => void;
  handleConfirm: () => void;
};

export const useDialogStore = create<TDialogState>((set, get) => ({
  dialog: null,

  alert: (title, message, config?) => {
    set({
      dialog: {
        id: crypto.randomUUID(),
        type: "alert",
        config: { title, message, variant: "info", ...config },
      },
    });
  },

  confirm: (title, description, config?) => {
    return new Promise<boolean>(resolve => {
      set({
        dialog: {
          id: crypto.randomUUID(),
          type: "confirm",
          config: {
            title,
            description,
            confirmText: "ยืนยัน",
            cancelText: "ยกเลิก",
            ...config,
          },
          resolve,
        },
      });
    });
  },

  closeDialog: () => {
    const { dialog } = get();
    if (dialog?.resolve) {
      dialog.resolve(false);
    }
    set({ dialog: null });
  },

  handleConfirm: () => {
    const { dialog } = get();
    if (dialog?.resolve) {
      dialog.resolve(true);
    }
    set({ dialog: null });
  },
}));
