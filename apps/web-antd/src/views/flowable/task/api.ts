import { requestClient } from '#/api/request';

export namespace FlwTaskApi {
  export interface Task {
    id?: string;
    name?: string;
    assignee?: string;
    owner?: string;
    processInstanceName?: string;
    processInstanceId?: string;
    processDefinitionName?: string;
    createTime?: string;
    endTime?: string;
    state?: string;
    formKey?: string;
    [key: string]: any;
  }
  export interface TaskQuery {
    taskName?: string;
    processDefKey?: string;
    processDefName?: string;
    processInstName?: string;
    processInstId?: string;
    active?: boolean;
    businessKey?: string;
    taskCreateTime?: [string, string];
    pageNumber?: number;
    pageSize?: number;
    [key: string]: any;
  }
  export interface CompleteReq {
    taskId: string;
    extraParams?: Record<string, any>;
    comment?: string;
    result?: string;
    [key: string]: any;
  }
  export interface CompletePre {
    formKey?: string;
    handleButtons?: FlowButton[];
    [key: string]: any;
  }
  export interface FlowButton {
    code?: string;
    name?: string;
    resultCode?: string;
    description?: string;
    commentRequired?: boolean;
  }
}

/** 获取代办任务列表 */
export async function getTodoList(params: FlwTaskApi.TaskQuery) {
  return requestClient.get('/flw/task/todo', { params });
}
/** 获取已办任务列表 */
export async function getDoneList(params: FlwTaskApi.TaskQuery) {
  return requestClient.get('/flw/task/done', { params });
}
/** 获取办理前置信息 */
export async function getCompletePre(taskId: string) {
  return requestClient.get('/flw/task/completePre', { params: { taskId } });
}
/** 办理任务 */
export async function completeTask(data: FlwTaskApi.CompleteReq) {
  return requestClient.put('/flw/task/complete', data);
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
