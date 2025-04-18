import type { Recordable } from '@vben/types';

import { requestClient } from '#/api/request';

export namespace SystemRoleApi {
  export interface SystemRole {
    [key: string]: any;
    id: string;
    name: string;
  }
  export interface RoleMenu {
    id: string;
    permissions: string[];
  }
}

/**
 * 获取角色列表数据
 */
async function getRoleList(params: Recordable<any>) {
  return requestClient.get<Array<SystemRoleApi.SystemRole>>('/sys/role/page', {
    params,
  });
}

async function getRoleAllList(params?: Recordable<any>) {
  return requestClient.get<Array<SystemRoleApi.SystemRole>>('/sys/role/list', {
    params,
  });
}

/**
 * 创建角色
 * @param data 角色数据
 */
async function createRole(data: Omit<SystemRoleApi.SystemRole, 'id'>) {
  return requestClient.post('/sys/role/save', data);
}

/**
 * 更新角色
 *
 * @param id 角色 ID
 * @param data 角色数据
 */
async function updateRole(
  id: string,
  data: Omit<SystemRoleApi.SystemRole, 'id'>,
) {
  return requestClient.put(`/sys/role/update`, { ...data, id });
}

/**
 * 删除角色
 * @param id 角色 ID
 */
async function deleteRole(id: string) {
  return requestClient.delete(`/sys/role/remove/${id}`);
}

async function getRolePermissions(id: string) {
  return requestClient.get(`/sys/role/menus/${id}`);
}

async function updateRolePermissions(
  id: string,
  data: { permissions: string[] },
) {
  return requestClient.post(`/sys/role/configMenus`, {
    roleId: id,
    menus: data.permissions,
  });
}

export {
  createRole,
  deleteRole,
  getRoleAllList,
  getRoleList,
  getRolePermissions,
  updateRole,
  updateRolePermissions,
};
