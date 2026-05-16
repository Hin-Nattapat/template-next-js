"use client";

import { Check, ChevronDown } from "lucide-react";
import { useState } from "react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface IComboboxOption {
  value: string;
  label: string;
  /** Extra search keywords (e.g. asset name + symbol) when label alone
   *  isn't enough — cmdk filters against this string in addition to label. */
  keywords?: string;
}

interface IProps {
  options: IComboboxOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  className?: string;
  name?: string;
  disabled?: boolean;
}

const AppCombobox = (props: IProps) => {
  const {
    options,
    value,
    onValueChange,
    placeholder = "Select…",
    searchPlaceholder = "Search…",
    emptyMessage = "No results.",
    className,
    name,
    disabled,
  } = props;
  const [open, setOpen] = useState(false);

  const selected = options.find(o => o.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          name={name}
          disabled={disabled}
          aria-expanded={open}
          className={cn(
            // Mirror SelectTrigger so the Asset combobox looks identical
            // to other selects/inputs in the form (border, dark bg tint,
            // rounded-sm, focus ring + transition).
            "border-input dark:bg-input/30 dark:hover:bg-input/50 focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive flex h-9 w-full items-center justify-between gap-2 rounded-sm border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
        >
          <span
            className={cn(
              "truncate text-left",
              !selected && "text-muted-foreground",
            )}
          >
            {selected?.label ?? placeholder}
          </span>
          <ChevronDown className="size-4 shrink-0 opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {options.map(opt => (
                <CommandItem
                  key={opt.value}
                  value={opt.keywords ? `${opt.label} ${opt.keywords}` : opt.label}
                  onSelect={() => {
                    onValueChange?.(opt.value);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 size-4",
                      opt.value === value ? "opacity-100" : "opacity-0",
                    )}
                  />
                  <span className="truncate">{opt.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default AppCombobox;
