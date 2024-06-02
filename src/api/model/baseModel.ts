export interface BasicPageParams {
  pageNumber: number;
  pageSize: number;
}

export interface BasicFetchResult<T> {
  records: T[];
  pageNumber: number;
  pageSize: number;
  totalPage: number;
  totalRow: number;
}
