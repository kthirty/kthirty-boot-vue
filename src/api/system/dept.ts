import { defHttp } from '@/utils/http/axios';
import { DeptListGetResultModel, DeptListItem } from './model/dept';

enum Api {
  DeptList = '/sys/dept/tree',
  SaveDept = '/sys/dept/save',
  UpdateDept = '/sys/dept/update',
  DeleteDept = '/sys/dept/remove',
}

export const getDeptList = (params?: DeptListItem) =>
  defHttp.get<DeptListGetResultModel>({ url: Api.DeptList, params });

export const saveDept = (params?: any) =>
  defHttp.post({ url: Api.SaveDept, params }, { successMessageMode: 'message' });
export const updateDept = (params?: any) =>
  defHttp.put({ url: Api.UpdateDept, params }, { successMessageMode: 'message' });
export const deleteDept = (id: string) =>
  defHttp.delete({ url: `${Api.DeleteDept}/${id}` }, { successMessageMode: 'message' });
