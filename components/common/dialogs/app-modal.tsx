"use client";

import { Fragment, type ReactNode } from "react";

import { cn } from "@/lib/utils";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";

// AppModal is the canonical content modal: controlled open state,
// typed title/description/children/footer, sensible default sizing.
// Wrap reasons (per STYLE.md §3):
//
//   1. Most call sites use the same Header → body → Footer shape; a
//      typed prop API reads cleaner than 5 lines of subcomponents.
//   2. One seam for app-wide tweaks (max-width, scroll behaviour,
//      Esc-to-close policy).
//   3. Falls back to `children`-only when callers need full control
//      (no header, custom body, etc.).
interface IProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  className?: string;
  /** Fixes the body area to this exact height (any CSS length string,
   *  e.g. "420px" or "60vh"). Use when the inner content changes size
   *  often — search results, async lists — and you want the modal to
   *  stay a constant size instead of bouncing. Body content scrolls
   *  when it exceeds the fixed height.
   *  When omitted, the body grows to fit, capped at 85vh. */
  bodyHeight?: string;
}

const AppModal = (props: IProps) => {
  const {
    open,
    onOpenChange,
    title,
    description,
    children,
    footer,
    className,
    bodyHeight,
  } = props;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/*
        Layout contract:
          - DialogContent is a flex column. Header + Footer stay at the
            edges; the body takes the rest of the height.
          - Default: body grows to fit, modal max-h capped at 85vh so a
            huge result list never overflows the viewport.
          - bodyHeight: body is locked to that exact pixel/vh height and
            scrolls internally when content exceeds it. Use when you
            want zero layout bounce as content changes.
      */}
      <DialogContent
        className={cn(
          "flex max-h-[85vh] flex-col gap-0 overflow-hidden sm:max-w-lg",
          className,
        )}
      >
        {(title || description) && (
          <DialogHeader className="pb-2">
            {title && <DialogTitle>{title}</DialogTitle>}
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
        )}
        <div
          className={cn("overflow-y-auto py-2", bodyHeight ? "" : "flex-1")}
          style={bodyHeight ? { height: bodyHeight } : undefined}
        >
          <Fragment>{children}</Fragment>
        </div>
        {footer && <DialogFooter className="pt-2">{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
};

export default AppModal;
