export interface IOption {
  key?: string | number;
  value: string;
  label: string | React.ReactNode;
  [name: string]: string | number | React.ReactNode | boolean | undefined;
}

export interface IPaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}
