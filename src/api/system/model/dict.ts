import { BasicFetchResult } from '@/api/model/baseModel';

export interface DictInfo {
  id: string;
  code: string;
  name: string;
  description: string;
}
export interface DictItem {
  id: string;
  code: string;
  value: string;
  label: string;
  description: string;
  sort: number;
  parentId: string;
}
export type DictPageResult = BasicFetchResult<DictInfo>;
