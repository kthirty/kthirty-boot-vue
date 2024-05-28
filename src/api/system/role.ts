import { defHttp } from '@/utils/http/axios';
import { RoleModel, RolePageListGetResultModel, RolePageParams } from './model/role';

enum Api {
  GetRoleList = '/sys/role/list',
  SaveRole = '/sys/role/save',
  UpdateRole = '/sys/role/update',
  DeleteRole = '/sys/role/remove',
}

export const getRoleList = (params?: RolePageParams) =>
  defHttp.get<RolePageListGetResultModel>({ url: Api.GetRoleList, params });

export const saveRole = (params: RoleModel) => defHttp.post({ url: Api.SaveRole, params });
export const updateRole = (params: RoleModel) => defHttp.put({ url: Api.UpdateRole, params });
export const deleteRole = (id: String) => defHttp.delete({ url: `${Api.DeleteRole}/${id}` });
