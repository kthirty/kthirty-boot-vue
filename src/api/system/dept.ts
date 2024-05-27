import { defHttp } from '@/utils/http/axios';
import { DeptListGetResultModel, DeptListItem } from './model/dept';

enum Api {
  DeptList = '/sys/dept/tree',
}

export const getDeptList = (params?: DeptListItem) =>
  defHttp.get<DeptListGetResultModel>({ url: Api.DeptList, params });
