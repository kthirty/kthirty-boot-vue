import { BasicFetchResult } from '@/api/model/baseModel';

export interface PostInfo {
  id: string;
  sort: number;
  createDate: string;
  description: string;
  status: string;
  parentId: string;
  code: string;
  name: string;
}
export type PostListGetResultModel = BasicFetchResult<PostInfo>;
