"use client";

import { ChevronDown, ChevronsUpDown, ChevronUp } from "lucide-react";
import { type ReactNode, useMemo, useState } from "react";

import AppButton from "@/components/common/buttons/app-button";
import AppTooltip from "@/components/common/overlays/app-tooltip";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { compareValues } from "@/utils/table";

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
  /** Renders a ⓘ beside the header that explains the column on hover/focus. */
  headerTooltip?: string;
}

const ALIGN_CLASS = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
} as const;

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
  /** Controlled server-sort. When `onSortChange` is set, the table renders
   *  `data` as-is and reports header clicks instead of sorting internally. */
  sortBy?: string;
  sortDir?: TAppTableSortDir;
  onSortChange?: (key: string) => void;
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

  const controlled = props.onSortChange != null;
  const [internalSortBy, setInternalSortBy] = useState<string | null>(
    defaultSortBy ?? null,
  );
  const [internalSortDir, setInternalSortDir] =
    useState<TAppTableSortDir>(defaultSortDir);

  const sortBy = controlled ? (props.sortBy ?? null) : internalSortBy;
  const sortDir = controlled ? (props.sortDir ?? "asc") : internalSortDir;

  const sortedData = useMemo(() => {
    if (controlled || !sortBy) {
      return data;
    }
    const column = columns.find(c => c.key === sortBy);
    if (!column?.sortAccessor) {
      return data;
    }
    const accessor = column.sortAccessor;
    const dirMul = sortDir === "asc" ? 1 : -1;
    return [...data].sort((a, b) => compareValues(accessor(a), accessor(b)) * dirMul);
  }, [controlled, data, columns, sortBy, sortDir]);

  const handleHeaderClick = (column: IAppTableColumn<TRow>) => {
    if (!column.sortable) {
      return;
    }
    if (controlled) {
      props.onSortChange?.(column.key);
      return;
    }
    if (internalSortBy === column.key) {
      setInternalSortDir(d => (d === "asc" ? "desc" : "asc"));
    } else {
      setInternalSortBy(column.key);
      setInternalSortDir("asc");
    }
  };

  const colSpan = columns.length;

  return (
    <div
      aria-busy={isLoading || undefined}
      className={cn(
        "border-border bg-card overflow-x-auto rounded-lg border shadow-xs",
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
            {columns.map(col => {
              const isSorted = sortBy === col.key;
              const Indicator = !col.sortable
                ? null
                : !isSorted
                  ? ChevronsUpDown
                  : sortDir === "asc"
                    ? ChevronUp
                    : ChevronDown;
              const headerContent = (
                <span
                  className={cn(
                    "inline-flex items-center gap-1",
                    col.align === "right" && "flex-row-reverse",
                  )}
                >
                  {col.header}
                  {Indicator && (
                    <Indicator
                      className={cn("h-3 w-3", isSorted ? "text-fg-2" : "text-fg-5")}
                    />
                  )}
                </span>
              );
              return (
                <TableHead
                  key={col.key}
                  style={col.width ? { width: col.width } : undefined}
                  className={cn(
                    "text-fg-3 font-medium",
                    ALIGN_CLASS[col.align ?? "left"],
                    col.headerClassName,
                  )}
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
                  {/* headerContent handles right-align reversal itself; keep
                      this wrapper in DOM order so the ⓘ hugs its own label. */}
                  <span className="inline-flex items-center gap-1">
                    {col.sortable ? (
                      // A real button so sorting works from the keyboard, not
                      // just onClick on the <th>.
                      <AppButton
                        variant="unstyled"
                        size="fit"
                        type="button"
                        onClick={() => handleHeaderClick(col)}
                        // Negative margins grow the hit area without moving
                        // the layout; coarse pointers get ~44px.
                        className="hover:text-fg -m-1 p-1 select-none pointer-coarse:-m-3 pointer-coarse:p-3"
                      >
                        {headerContent}
                      </AppButton>
                    ) : (
                      headerContent
                    )}
                    {col.headerTooltip && (
                      <AppTooltip content={col.headerTooltip}>
                        <AppButton
                          variant="unstyled"
                          size="fit"
                          aria-label="More info"
                          className="text-fg-4 cursor-help"
                        >
                          {"ⓘ"}
                        </AppButton>
                      </AppTooltip>
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
                {columns.map(col => (
                  <TableCell
                    key={col.key}
                    className={cn(ALIGN_CLASS[col.align ?? "left"], col.className)}
                  >
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
                {columns.map(col => (
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
