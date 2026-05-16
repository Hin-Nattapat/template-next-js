"use client";

import { Command as CommandPrimitive } from "cmdk";
import { Search } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

const Command = (props: React.ComponentProps<typeof CommandPrimitive>) => {
  const { className, ...rest } = props;
  return (
    <CommandPrimitive
      data-slot="command"
      className={cn(
        "bg-popover text-popover-foreground flex h-full w-full flex-col overflow-hidden rounded-md",
        className,
      )}
      {...rest}
    />
  );
};

const CommandInput = (
  props: React.ComponentProps<typeof CommandPrimitive.Input>,
) => {
  const { className, ...rest } = props;
  return (
    <div data-slot="command-input-wrapper" className="flex h-9 items-center gap-2 border-b px-3">
      <Search className="size-4 shrink-0 opacity-50" />
      <CommandPrimitive.Input
        data-slot="command-input"
        className={cn(
          "placeholder:text-fg-4 flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...rest}
      />
    </div>
  );
};

const CommandList = (
  props: React.ComponentProps<typeof CommandPrimitive.List>,
) => {
  const { className, ...rest } = props;
  return (
    <CommandPrimitive.List
      data-slot="command-list"
      className={cn("max-h-[300px] scroll-py-1 overflow-x-hidden overflow-y-auto", className)}
      {...rest}
    />
  );
};

const CommandEmpty = (
  props: React.ComponentProps<typeof CommandPrimitive.Empty>,
) => (
  <CommandPrimitive.Empty
    data-slot="command-empty"
    className="py-6 text-center text-sm"
    {...props}
  />
);

const CommandGroup = (
  props: React.ComponentProps<typeof CommandPrimitive.Group>,
) => {
  const { className, ...rest } = props;
  return (
    <CommandPrimitive.Group
      data-slot="command-group"
      className={cn(
        "text-fg [&_[cmdk-group-heading]]:text-fg-4 overflow-hidden p-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium",
        className,
      )}
      {...rest}
    />
  );
};

const CommandItem = (
  props: React.ComponentProps<typeof CommandPrimitive.Item>,
) => {
  const { className, ...rest } = props;
  return (
    <CommandPrimitive.Item
      data-slot="command-item"
      className={cn(
        "data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
        className,
      )}
      {...rest}
    />
  );
};

export {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
};
