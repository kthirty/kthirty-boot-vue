import { requestClient } from '#/api/request';

export namespace DevFormItemApi {
  export interface Item {
    id?: string;
    formId?: string;
    columnName?: string;
    columnType?: string;
    columnLength?: number;
    columnPointLength?: number;
    columnDefaultVal?: string;
    columnNullable?: boolean;
    columnRemarks?: string;
    fieldType?: string;
    fieldAttribute?: string;
    dictCode?: string;
    formComponent?: string;
    formRequired?: boolean;
    formRegexp?: string;
    weight?: number;
    isShowQuery?: boolean;
    queryComponent?: string;
    isShowForm?: boolean;
    isShowList?: boolean;
    isAllowSort?: boolean;
    isReadonly?: boolean;
    foreignKeyMainTable?: string;
    foreignKeyMainColumn?: string;
    [key: string]: any;
  }
}

/**
 * 分页查询表单字段
 */
export async function getItemList(params?: any) {
  return requestClient.get('/dev/form/item/page', { params });
}

/**
 * 新增表单字段
 */
export async function saveItem(data: DevFormItemApi.Item) {
  return requestClient.post('/dev/form/item/save', data);
}

/**
 * 更新表单字段
 */
export async function updateItem(data: DevFormItemApi.Item) {
  return requestClient.put('/dev/form/item/update', data);
}

/**
 * 删除表单字段
 */
export async function removeItem(id: string) {
  return requestClient.delete(`/dev/form/item/remove/${id}`);
}

/**
 * 获取表单字段详情
 */
export async function getItemInfo(id: string) {
  return requestClient.get(`/dev/form/item/getInfo/${id}`);
}

export namespace DevFormApi {
  export interface Form {
    id?: string;
    tableName?: string;
    remarks?: string;
    tableType?: string;
    listType?: string;
    isDbSync?: string;
    items?: DevFormItemApi.Item[];
    [key: string]: any;
  }
}

/**
 * 分页查询表单
 */
export async function getFormList(params?: any) {
  return requestClient.get('/dev/form/page', { params });
}

/**
 * 新增表单（带字段）
 */
export async function saveForm(data: DevFormApi.Form) {
  return requestClient.post('/dev/form/save', data);
}

/**
 * 更新表单（带字段）
 */
export async function updateForm(data: DevFormApi.Form) {
  return requestClient.put('/dev/form/update', data);
}

/**
 * 删除表单
 */
export async function removeForm(id: string) {
  return requestClient.delete(`/dev/form/remove/${id}`);
}

/**
 * 获取表单详情
 */
export async function getFormInfo(id: string) {
  return requestClient.get(`/dev/form/getInfo/${id}`);
}
