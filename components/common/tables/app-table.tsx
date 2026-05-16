"use client";

import { ChevronDown, ChevronsUpDown, ChevronUp } from "lucide-react";
import { type ReactNode, useMemo, useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export type TAppTableSortDir = "asc" | "desc";

export interface IAppTableColumn<TRow> {
  /** Stable identifier — used for the React key + sort tracking. */
  key: string;
  header: ReactNode;
  cell: (row: TRow) => ReactNode;
  align?: "left" | "right" | "center";
  className?: string;
  headerClassName?: string;
  width?: string;
  sortable?: boolean;
  /** Required when sortable=true; lets the table extract a comparable value. */
  sortAccessor?: (row: TRow) => string | number | Date | null | undefined;
}

export interface IAppTableProps<TRow> {
  columns: IAppTableColumn<TRow>[];
  data: TRow[];
  getRowKey: (row: TRow, index: number) => string;
  emptyState?: ReactNode;
  isLoading?: boolean;
  onRowClick?: (row: TRow) => void;
  /** Pin the header to the top of a scrolling container. */
  stickyHeader?: boolean;
  defaultSortBy?: string;
  defaultSortDir?: TAppTableSortDir;
  className?: string;
}

const ALIGN_CLASS = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
} as const;

function compare(a: unknown, b: unknown): number {
  if (a == null && b == null) return 0;
  if (a == null) return -1;
  if (b == null) return 1;
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
  if (typeof a === "number" && typeof b === "number") return a - b;
  return String(a).localeCompare(String(b));
}

const AppTable = <TRow,>(props: IAppTableProps<TRow>) => {
  const {
    columns,
    data,
    getRowKey,
    emptyState,
    isLoading,
    onRowClick,
    stickyHeader,
    defaultSortBy,
    defaultSortDir = "asc",
    className,
  } = props;

  const [sortBy, setSortBy] = useState<string | null>(defaultSortBy ?? null);
  const [sortDir, setSortDir] = useState<TAppTableSortDir>(defaultSortDir);

  const sortedData = useMemo(() => {
    if (!sortBy) return data;
    const column = columns.find((c) => c.key === sortBy);
    if (!column?.sortAccessor) return data;
    const accessor = column.sortAccessor;
    const dirMul = sortDir === "asc" ? 1 : -1;
    return [...data].sort((a, b) => compare(accessor(a), accessor(b)) * dirMul);
  }, [data, columns, sortBy, sortDir]);

  const handleHeaderClick = (column: IAppTableColumn<TRow>) => {
    if (!column.sortable) return;
    if (sortBy === column.key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(column.key);
      setSortDir("asc");
    }
  };

  const colSpan = columns.length;

  return (
    <div
      className={cn(
        "border-border bg-card overflow-hidden rounded-lg border shadow-xs",
        className,
      )}
    >
      <Table className="min-w-full">
        <TableHeader
          className={cn(
            "bg-surface-2 text-fg-3 text-[11px] tracking-wide uppercase",
            stickyHeader && "sticky top-0 z-10",
          )}
        >
          <TableRow className="hover:bg-surface-2">
            {columns.map((col) => {
              const isSorted = sortBy === col.key;
              const Indicator = !col.sortable
                ? null
                : !isSorted
                  ? ChevronsUpDown
                  : sortDir === "asc"
                    ? ChevronUp
                    : ChevronDown;
              return (
                <TableHead
                  key={col.key}
                  style={col.width ? { width: col.width } : undefined}
                  className={cn(
                    "text-fg-3 font-medium",
                    ALIGN_CLASS[col.align ?? "left"],
                    col.headerClassName,
                    col.sortable && "hover:text-fg cursor-pointer select-none",
                  )}
                  onClick={() => handleHeaderClick(col)}
                  aria-sort={
                    isSorted
                      ? sortDir === "asc"
                        ? "ascending"
                        : "descending"
                      : col.sortable
                        ? "none"
                        : undefined
                  }
                >
                  <span
                    className={cn(
                      "inline-flex items-center gap-1",
                      col.align === "right" && "flex-row-reverse",
                    )}
                  >
                    {col.header}
                    {Indicator && (
                      <Indicator
                        className={cn(
                          "h-3 w-3",
                          isSorted ? "text-fg-2" : "text-fg-5",
                        )}
                      />
                    )}
                  </span>
                </TableHead>
              );
            })}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <TableRow key={`skeleton-${i}`} className="hover:bg-transparent">
                {columns.map((col) => (
                  <TableCell key={col.key} className={ALIGN_CLASS[col.align ?? "left"]}>
                    <div className="bg-surface-2 h-4 w-full animate-pulse rounded" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : sortedData.length === 0 ? (
            <TableRow className="hover:bg-transparent">
              <TableCell
                colSpan={colSpan}
                className="text-fg-4 px-4 py-8 text-center text-sm"
              >
                {emptyState ?? "No data."}
              </TableCell>
            </TableRow>
          ) : (
            sortedData.map((row, index) => (
              <TableRow
                key={getRowKey(row, index)}
                className={cn(onRowClick && "cursor-pointer")}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
              >
                {columns.map((col) => (
                  <TableCell
                    key={col.key}
                    className={cn(ALIGN_CLASS[col.align ?? "left"], col.className)}
                  >
                    {col.cell(row)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AppTable;
