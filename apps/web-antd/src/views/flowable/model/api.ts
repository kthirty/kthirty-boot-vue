import { requestClient } from '#/api/request';

export namespace FlwModelApi {
  export interface Model {
    id?: string;
    key?: string;
    name?: string;
    category?: string;
    metaInfo?: string;
    tenantId?: string;
    xml?: string;
    thumbnail?: string;
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
 * 获取模型
 * @param id 模型ID
 * @param queryXml 是否查询XML
 * @param queryThumbnail 是否查询缩略图
 */
export async function getModel(
  id: string,
  queryXml: boolean = true,
  queryThumbnail: boolean = false,
) {
  return requestClient.get(
    `/flw/model/get?modelId=${id}&queryXml=${queryXml}&queryThumbnail=${queryThumbnail}`,
  );
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
