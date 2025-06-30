import { requestClient } from '#/api/request';

export namespace FlwModelApi {
  export interface Model {
    id?: string;
    code: string;
    name: string;
    [key: string]: any;
  }
}

/**
 * 获取模型列表
 */
export async function getModelList(params?: any) {
  return requestClient.get('/flw/model/page', { params });
}

/**
 * 保存模型
 * @param data 模型数据
 */
export async function saveModel(data: any) {
  return requestClient.post('/flw/model/save', data);
}

/**
 * 删除模型
 * @param id 模型ID
 */
export async function deleteModel(id: string) {
  return requestClient.delete(`/flw/model/delete/${id}`);
}
