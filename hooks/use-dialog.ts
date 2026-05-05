import { useDialogStore } from "@/stores/dialog.store";
import type { IAlertConfig, IConfirmConfig } from "@/types/dialog";

export function useDialog() {
  const { alert: storeAlert, confirm: storeConfirm } = useDialogStore();

  return {
    alert: (config: IAlertConfig) => storeAlert(config.title, config.message, config),

    info: (config: Omit<IAlertConfig, "variant">) =>
      storeAlert(config.title, config.message, { ...config, variant: "info" }),

    success: (config: Omit<IAlertConfig, "variant">) =>
      storeAlert(config.title, config.message, { ...config, variant: "success" }),

    warning: (config: Omit<IAlertConfig, "variant">) =>
      storeAlert(config.title, config.message, { ...config, variant: "warning" }),

    error: (config: Omit<IAlertConfig, "variant">) =>
      storeAlert(config.title, config.message, { ...config, variant: "error" }),

    confirm: (config: IConfirmConfig) =>
      storeConfirm(config.title, config.description, config),

    confirmDelete: (config?: Partial<IConfirmConfig>) =>
      storeConfirm(
        config?.title || "ยืนยันการลบ",
        config?.description || "คุณต้องการลบรายการนี้ใช่หรือไม่?",
        { variant: "destructive", ...config },
      ),
  };
}
