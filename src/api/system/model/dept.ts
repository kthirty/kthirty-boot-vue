import { BasicFetchResult } from '@/api/model/baseModel';

export interface DeptListItem {
  id: string;
  sort: number;
  createDate: string;
  description: string;
  status: number;
  parentId: string;
}
export type DeptListGetResultModel = BasicFetchResult<DeptListItem>;
