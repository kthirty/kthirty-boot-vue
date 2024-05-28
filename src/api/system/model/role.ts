import { BasicFetchResult, BasicPageParams } from '@/api/model/baseModel';

export type RoleParams = {
  roleName?: string;
  status?: string;
};

export interface RoleListItem {
  id: string;
  roleName: string;
  roleValue: string;
  status: number;
  orderNo: string;
  createTime: string;
}

export type RoleModel = RoleListItem;
export type RolePageParams = BasicPageParams & RoleParams;

export type RolePageListGetResultModel = BasicFetchResult<RoleListItem>;
