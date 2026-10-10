"use client";

import AppSelect from "@/components/common/inputs/app-select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { pageWindow } from "@/utils/pagination";

import { SIZE_OPTIONS } from "./app-pagination.constants";

interface IProps {
  page: number;
  lastPage: number;
  size: number;
  count?: number;
  onPageChange: (page: number) => void;
  onSizeChange: (size: number) => void;
  className?: string;
}

const AppPagination = (props: IProps) => {
  const { page, lastPage, size, count, onPageChange, onSizeChange, className } = props;

  const from = count === 0 ? 0 : (page - 1) * size + 1;
  const to = count != null ? Math.min(page * size, count) : page * size;

  return (
    <div className={cn("flex flex-wrap items-center justify-between gap-3", className)}>
      <div className="flex items-center gap-3">
        <div className="w-36 shrink-0">
          <AppSelect
            value={String(size)}
            onValueChange={v => onSizeChange(Number(v))}
            options={SIZE_OPTIONS}
          />
        </div>

        <p className="text-fg-4 text-[11px]">
          {count != null ? `Showing ${from}–${to} of ${count}` : `Page ${page}`}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Pagination className="mx-0 w-auto">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                aria-disabled={page <= 1}
                className={cn(page <= 1 && "pointer-events-none opacity-50")}
                onClick={e => {
                  e.preventDefault();
                  if (page > 1) {
                    onPageChange(page - 1);
                  }
                }}
                href="#"
              />
            </PaginationItem>
            {pageWindow(page, lastPage).map((p, i) =>
              p === -1 ? (
                <PaginationItem key={`gap-${i}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={p}>
                  <PaginationLink
                    isActive={p === page}
                    href="#"
                    onClick={e => {
                      e.preventDefault();
                      onPageChange(p);
                    }}
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              ),
            )}
            <PaginationItem>
              <PaginationNext
                aria-disabled={page >= lastPage}
                className={cn(page >= lastPage && "pointer-events-none opacity-50")}
                onClick={e => {
                  e.preventDefault();
                  if (page < lastPage) {
                    onPageChange(page + 1);
                  }
                }}
                href="#"
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default AppPagination;
