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
    handleButtons?: string[];
    [key: string]: any;
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
