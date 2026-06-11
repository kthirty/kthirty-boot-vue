import { requestClient } from '#/api/request';

export namespace FlwProcDefApi {
  export interface ProcDef {
    id?: string;
    key?: string;
    name?: string;
    category?: string;
    version?: number;
    deploymentId?: string;
    suspended?: boolean;
    xml?: string;
    thumbnail?: string;
    [key: string]: any;
  }
}

/**
 * 获取流程定义列表
 */
export async function getProcDefList(params?: any) {
  return requestClient.get('/flw/process/definition/page', { params });
}

/**
 * 获取流程定义详情
 */
export async function getProcDef(
  id: string,
  queryXml: boolean = false,
  queryThumbnail: boolean = true,
) {
  return requestClient.get(
    `/flw/process/definition/get?id=${id}&queryXml=${queryXml}&queryThumbnail=${queryThumbnail}`,
  );
}

/**
 * 激活流程定义
 */
export async function activeProcDef(id: string) {
  return requestClient.put(`/flw/process/definition/active?id=${id}`);
}

/**
 * 挂起流程定义
 */
export async function suspendProcDef(id: string) {
  return requestClient.put(`/flw/process/definition/suspended?id=${id}`);
}
