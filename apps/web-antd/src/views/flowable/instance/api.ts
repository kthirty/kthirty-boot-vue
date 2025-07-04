import { requestClient } from '#/api/request';

export namespace FlwInstanceApi {
  export interface Instance {
    id?: string;
    name?: string;
    processDefinitionName?: string;
    processDefinitionKey?: string;
    processDefinitionId?: string;
    startUserId?: string;
    startTime?: string;
    endTime?: string;
    suspended?: boolean;
    isDeleted?: boolean;
    [key: string]: any;
  }
}

/**
 * 获取流程实例列表
 */
export async function getInstanceList(params?: any) {
  return requestClient.get('/flw/process/instance/page', { params });
}

/**
 * 删除流程实例
 */
export async function deleteInstance(id: string, deleteReason: string) {
  return requestClient.delete(`/flw/process/instance/delete`, {
    params: { procInstId: id, deleteReason },
  });
}

/**
 * 挂起流程实例
 */
export async function suspendInstance(id: string) {
  return requestClient.put(`/flw/process/instance/suspend?id=${id}`);
}

/**
 * 激活流程实例
 */
export async function activateInstance(id: string) {
  return requestClient.put(`/flw/process/instance/activate?id=${id}`);
}

/**
 * 查看历史任务
 */
export async function getHisTaskList(procInstId: string) {
  return requestClient.get(
    `/flw/process/instance/hisTask?procInstId=${procInstId}`,
  );
}

/**
 * 查看历史流程图，返回base64图片
 */
export async function getHisDiagram(procInstId: string) {
  return requestClient.get(
    `/flw/process/instance/hisDiagram?procInstId=${procInstId}`,
  );
}
