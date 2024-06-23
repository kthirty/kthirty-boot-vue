import { defHttp } from '@/utils/http/axios';
import { RolePageListGetResultModel, RolePageParams } from './model/role';

enum Api {
  GetRolePage = '/sys/role/page',
  GetRoleList = '/sys/role/list',
  SaveRole = '/sys/role/save',
  UpdateRole = '/sys/role/update',
  DeleteRole = '/sys/role/remove',
  GetRoleMenus = '/sys/role/menus',
  SaveRoleMenus = '/sys/role/configMenus',
}

export const getRolePage = (params?: RolePageParams) =>
  defHttp.get<RolePageListGetResultModel>({ url: Api.GetRolePage, params });

export const getRoleList = (params?: RolePageParams) =>
  defHttp.get<RolePageListGetResultModel>({ url: Api.GetRoleList, params });

export const saveRole = (params: Recordable) => defHttp.post({ url: Api.SaveRole, params });
export const updateRole = (params: Recordable) => defHttp.put({ url: Api.UpdateRole, params });
export const deleteRole = (id: string) => defHttp.delete({ url: `${Api.DeleteRole}/${id}` });
export const getRoleMenus = (id: string) =>
  defHttp.get<string[]>({ url: `${Api.GetRoleMenus}/${id}` });
export const saveRoleMenus = (params: Recordable) =>
  defHttp.post({ url: Api.SaveRoleMenus, params });
