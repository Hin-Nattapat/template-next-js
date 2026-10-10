import type { ReactNode } from "react";

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
