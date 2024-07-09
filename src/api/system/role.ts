import { defHttp } from '@/utils/http/axios';
import { AddLinkInfo, RolePageListGetResultModel, RolePageParams, UserRoleRl } from './model/role';
import { UserInfo } from '#/store';

enum Api {
  GetRolePage = '/sys/role/page',
  GetRoleList = '/sys/role/list',
  SaveRole = '/sys/role/save',
  UpdateRole = '/sys/role/update',
  DeleteRole = '/sys/role/remove',
  GetRoleMenus = '/sys/role/menus',
  SaveRoleMenus = '/sys/role/configMenus',
  GetUsersByRole = '/sys/role/users',
  RemoveUserLink = '/sys/role/removeLink',
  AddUserLink = '/sys/role/addLink',
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
  defHttp.post({ url: Api.SaveRoleMenus, params }, { successMessageMode: 'message' });
/**
 * 获取拥有此角色的用户
 * @param id 角色ID
 */
export const getUsersByRole = (id: string) =>
  defHttp.get<UserInfo>({ url: `${Api.GetUsersByRole}/${id}` });
/**
 * 删除用户与角色的关联
 * @param params UserRoleRl
 */
export const removeUserLink = (params: UserRoleRl) =>
  defHttp.delete({ url: Api.RemoveUserLink, params }, { successMessageMode: 'message' });
/**
 * 分配给用户角色
 * @param params UserRoleRl
 */
export const addUserLink = (params: AddLinkInfo) =>
  defHttp.post({ url: Api.AddUserLink, params }, { successMessageMode: 'message' });
