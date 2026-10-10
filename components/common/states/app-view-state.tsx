import type { ReactNode } from "react";

import { type TViewState, ViewStateKind } from "@/types/view-state";

import AppLoadError from "./app-load-error";

interface IProps<T> {
  view: TViewState<T>;
  loading: ReactNode;
  empty?: ReactNode;
  notFound?: ReactNode;
  error?: ReactNode;
  children: (data: T) => ReactNode;
}

const AppViewState = <T,>(props: IProps<T>) => {
  const { view, loading, empty, notFound, error, children } = props;

  switch (view.kind) {
    case ViewStateKind.Loading:
      return loading;
    case ViewStateKind.Error:
      return error === undefined ? <AppLoadError retry={view.retry} /> : error;
    case ViewStateKind.Empty:
      return empty ?? null;
    case ViewStateKind.NotFound:
      return notFound ?? null;
    case ViewStateKind.Ready:
      return children(view.data);
  }
};

export default AppViewState;
