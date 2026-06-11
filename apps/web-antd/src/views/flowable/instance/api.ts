import { requestClient } from '#/api/request';

export namespace FlwProcInstApi {
  export interface ProcInst {
    id?: string;
    name?: string;
    businessKey?: string;
    processDefinitionId?: string;
    processDefinitionKey?: string;
    processDefinitionName?: string;
    processDefinitionVersion?: number;
    processDefinitionCategory?: string;
    startUserId?: string;
    startTime?: string;
    endTime?: string;
    deleteReason?: string;
    suspended?: boolean;
    deleted?: boolean;
    [key: string]: any;
  }
}

/**
 * 获取流程实例列表
 */
export async function getProcInstList(params?: any) {
  return requestClient.get('/flw/process/instance/page', { params });
}

/**
 * 删除流程实例
 */
export async function deleteProcInst(procInstId: string, deleteReason?: string) {
  return requestClient.delete('/flw/process/instance/delete', {
    params: { procInstId, deleteReason: deleteReason || '管理员删除' },
  });
}

/**
 * 挂起流程实例
 */
export async function suspendProcInst(id: string) {
  return requestClient.put(`/flw/process/instance/suspend?id=${id}`);
}

/**
 * 激活流程实例
 */
export async function activateProcInst(id: string) {
  return requestClient.put(`/flw/process/instance/activate?id=${id}`);
}

/**
 * 升级流程实例到最新版本
 */
export async function upgradeProcInst(procInstId: string) {
  return requestClient.put(
    `/flw/process/instance/upgrade?procInstId=${procInstId}`,
  );
}

/**
 * 获取流程实例历史流程图
 */
export async function getHisDiagram(procInstId: string) {
  return requestClient.get('/flw/process/instance/hisDiagram', {
    params: { procInstId },
  });
}

/**
 * 获取流程实例历史任务
 */
export async function getHisTasks(procInstId: string) {
  return requestClient.get('/flw/process/instance/hisTask', {
    params: { procInstId },
  });
}
