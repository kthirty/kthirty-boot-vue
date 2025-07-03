import { requestClient } from '#/api/request';

export namespace FlwProcdefApi {
  export interface Procdef {
    id?: string;
    key?: string;
    name?: string;
    category?: string;
    version?: number;
    deploymentId?: string;
    suspended?: boolean;
    resourceName?: string;
    diagramResourceName?: string;
    tenantId?: string;
    description?: string;
    [key: string]: any;
  }
}

/**
 * 获取流程定义列表
 */
export async function getProcdefList(params?: any) {
  return requestClient.get('/flw/process/definition/page', { params });
}

/**
 * 获取流程定义详情
 */
export async function getProcdef(
  id: string,
  queryXml: boolean = true,
  queryThumbnail: boolean = false,
) {
  return requestClient.get(
    `/flw/process/definition/get?id=${id}&queryXml=${queryXml}&queryThumbnail=${queryThumbnail}`,
  );
}

/**
 * 挂起流程定义
 */
export async function suspendProcdef(id: string) {
  return requestClient.put(`/flw/process/definition/suspended?id=${id}`);
}

/**
 * 激活流程定义
 */
export async function activateProcdef(id: string) {
  return requestClient.put(`/flw/process/definition/active?id=${id}`);
}
