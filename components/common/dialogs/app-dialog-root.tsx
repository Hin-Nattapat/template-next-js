"use client";

import { AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useDialogStore } from "@/stores/dialog.store";
import type { IAlertConfig, IConfirmConfig } from "@/types/dialog.types";

const variantIcons = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: XCircle,
};

const variantStyles = {
  info: "text-blue-600",
  success: "text-green-600",
  warning: "text-yellow-600",
  error: "text-red-600",
};

const AppDialogRoot = () => {
  const dialog = useDialogStore(state => state.dialog);
  const closeDialog = useDialogStore(state => state.closeDialog);
  const handleConfirm = useDialogStore(state => state.handleConfirm);

  if (!dialog) return null;

  if (dialog.type === "alert") {
    const config = dialog.config as IAlertConfig;
    const Icon = variantIcons[config.variant || "info"];
    const iconColor = variantStyles[config.variant || "info"];

    return (
      <Dialog open={true} onOpenChange={closeDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <Icon className={cn("h-6 w-6", iconColor)} />
              <DialogTitle>{config.title}</DialogTitle>
            </div>
            <DialogDescription>{config.message}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={closeDialog}>{config.buttonText || "ตกลง"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  if (dialog.type === "confirm") {
    const config = dialog.config as IConfirmConfig;

    return (
      <AlertDialog open={true} onOpenChange={closeDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{config.title}</AlertDialogTitle>
            <AlertDialogDescription>{config.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{config.cancelText || "ยกเลิก"}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              className={
                config.variant === "destructive"
                  ? "bg-destructive hover:bg-destructive/90"
                  : ""
              }
            >
              {config.confirmText || "ยืนยัน"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return null;
};

export default AppDialogRoot;
