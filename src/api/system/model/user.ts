import { BasicFetchResult, BasicPageParams } from '@/api/model/baseModel';

export type UserParam = {
  username?: string;
  deptId?: string;
};

export interface UserItem {
  id: string;
  realName: string;
  username: string;
  password: string;
  email: string;
  sex: string;
  avatar: string;
  status: string;
}

export type UserPageParams = BasicPageParams & UserParam;
export type UserPageListGetResultModel = BasicFetchResult<UserItem>;
