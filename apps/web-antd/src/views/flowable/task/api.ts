import { requestClient } from '#/api/request';

export namespace FlwTaskApi {
  export interface Task {
    id?: string;
    taskId?: string;
    name?: string;
    assignee?: string;
    owner?: string;
    processInstanceId?: string;
    processInstanceName?: string;
    processDefinitionName?: string;
    processDefinitionKey?: string;
    processInstanceStartedBy?: string;
    processInstanceStartTime?: string;
    createTime?: string;
    endTime?: string;
    claimTime?: string;
    claimedBy?: string;
    suspensionState?: number;
    formKey?: string;
    [key: string]: any;
  }

  export interface FlowButton {
    code?: string;
    name?: string;
    resultCode?: string;
    description?: string;
    commentRequired?: boolean;
  }

  export interface CompletePre {
    formKey?: string;
    handleButtons?: FlowButton[];
  }

  export interface TaskCompleteReq {
    taskId: string;
    result: string;
    comment?: string;
    extraParams?: Record<string, any>;
  }
}

/**
 * 获取待办任务列表
 */
export async function getTodoTaskList(params?: any) {
  return requestClient.get('/flw/task/todo', { params });
}

/**
 * 获取已办任务列表
 */
export async function getDoneTaskList(params?: any) {
  return requestClient.get('/flw/task/done', { params });
}

/**
 * 启动流程实例
 */
export async function startProcess(
  processDefinitionKey: string,
  businessKey: string,
) {
  return requestClient.post('/flw/task/start', null, {
    params: { processDefinitionKey, businessKey },
  });
}

/**
 * 任务办理前置信息
 */
export async function completePre(taskId: string) {
  return requestClient.get<FlwTaskApi.CompletePre>(
    `/flw/task/completePre?taskId=${taskId}`,
  );
}

/**
 * 任务办理
 */
export async function completeTask(data: FlwTaskApi.TaskCompleteReq) {
  return requestClient.put('/flw/task/complete', data);
}

/**
 * 任务签收
 */
export async function claimTask(taskId: string) {
  return requestClient.put(`/flw/task/claim?taskId=${taskId}`);
}

/**
 * 任务退签收
 */
export async function unclaimTask(taskId: string) {
  return requestClient.put(`/flw/task/unclaim?taskId=${taskId}`);
}

/**
 * 任务激活
 */
export async function activateTask(taskId: string) {
  return requestClient.put(`/flw/task/activate?taskId=${taskId}`);
}

/**
 * 任务挂起
 */
export async function suspendTask(taskId: string) {
  return requestClient.put(`/flw/task/suspend?taskId=${taskId}`);
}
