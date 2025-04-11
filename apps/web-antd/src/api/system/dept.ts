import { requestClient } from '#/api/request';

export namespace SystemDeptApi {
  export interface SystemDept {
    [key: string]: any;
    children?: SystemDept[];
    id?: string;
    name?: string;
    remark?: string;
    status?: 0 | 1;
  }
}

/**
 * 获取部门列表数据
 */
async function getDeptList(params?: SystemDeptApi.SystemDept) {
  return requestClient.get<Array<SystemDeptApi.SystemDept>>('/sys/dept/tree', {
    params,
  });
}

/**
 * 创建部门
 * @param data 部门数据
 */
async function createDept(
  data: Omit<SystemDeptApi.SystemDept, 'children' | 'id'>,
) {
  return requestClient.post('/sys/dept/save', data);
}

/**
 * 更新部门
 *
 * @param id 部门 ID
 * @param data 部门数据
 */
async function updateDept(
  id: string,
  data: Omit<SystemDeptApi.SystemDept, 'children' | 'id'>,
) {
  return requestClient.put(`/sys/dept/update`, data);
}

/**
 * 删除部门
 * @param id 部门 ID
 */
async function deleteDept(id: string) {
  return requestClient.delete(`/sys/dept/remove/${id}`);
}

export { createDept, deleteDept, getDeptList, updateDept };
