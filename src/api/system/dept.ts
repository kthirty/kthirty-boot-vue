import { defHttp } from '@/utils/http/axios';
import { DeptListGetResultModel, DeptListItem } from './model/dept';

enum Api {
  DeptList = '/sys/dept/tree',
  SaveList = '/sys/dept/save',
  UpdateList = '/sys/dept/update',
  DeleteList = '/sys/dept/remove',
}

export const getDeptList = (params?: DeptListItem) =>
  defHttp.get<DeptListGetResultModel>({ url: Api.DeptList, params });

export const saveDept = (params?: any) =>
  defHttp.post({ url: Api.SaveList, params }, { successMessageMode: 'message' });
export const updateDept = (params?: any) =>
  defHttp.put({ url: Api.UpdateList, params }, { successMessageMode: 'message' });
export const deleteDept = (id: string) =>
  defHttp.delete({ url: `${Api.DeleteList}/${id}` }, { successMessageMode: 'message' });
