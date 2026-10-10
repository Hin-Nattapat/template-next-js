export enum SortDir {
  Asc = "asc",
  Desc = "desc",
}

export interface IPagination {
  page: number;
  size: number;
  count?: number;
  last_page: number;
}

export interface IPageResponse<T> {
  page_information: IPagination;
  entities: T[];
}

export interface IPageParamsState {
  page: number;
  size: number;
  sort: string;
  dir: SortDir;
}
