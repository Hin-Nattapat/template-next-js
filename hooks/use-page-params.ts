"use client";

import type { Route } from "next";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

import { type IPageParamsState, SortDir } from "@/types/pagination";

export function usePageParams(defaultSize = 25) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const state = useMemo<IPageParamsState>(() => {
    const page = Number(searchParams.get("page")) || 1;
    const size = Number(searchParams.get("size")) || defaultSize;
    const sort = searchParams.get("sort") ?? "";
    const dir = searchParams.get("dir") === "asc" ? SortDir.Asc : SortDir.Desc;
    return { page, size, sort, dir };
  }, [searchParams, defaultSize]);

  const patch = useCallback(
    (next: Partial<IPageParamsState> & { resetPage?: boolean }) => {
      const params = new URLSearchParams(searchParams.toString());
      if (next.page != null) {
        params.set("page", String(next.page));
      }
      if (next.size != null) {
        params.set("size", String(next.size));
      }
      if (next.sort != null) {
        params.set("sort", next.sort);
      }
      if (next.dir != null) {
        params.set("dir", next.dir);
      }
      if (next.resetPage) {
        params.set("page", "1");
      }
      // typedRoutes can't verify a runtime-composed path built from a dynamic
      // pathname, so cast to Route (the value is always a valid app route).
      router.replace(`${pathname}?${params.toString()}` as Route, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  const setPage = useCallback((page: number) => patch({ page }), [patch]);
  const setSize = useCallback(
    (size: number) => patch({ size, resetPage: true }),
    [patch],
  );
  const setSort = useCallback(
    (key: string) => {
      const dir =
        state.sort === key && state.dir === SortDir.Asc ? SortDir.Desc : SortDir.Asc;
      patch({ sort: key, dir, resetPage: true });
    },
    [patch, state.sort, state.dir],
  );

  return { ...state, setPage, setSize, setSort };
}
