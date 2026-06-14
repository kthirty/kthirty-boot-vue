import { requestClient } from '#/api/request';

export namespace DevFormApi {
  export interface DevFormItem {
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
    isDbSync?: boolean;
  }

  export interface DevForm {
    id?: string;
    tableName?: string;
    remarks?: string;
    tableType?: string;
    listType?: string;
    isDbSync?: string;
    treeParentField?: string;
    treeLabelField?: string;
    treeSortField?: string;
    treeRootValue?: string;
    items?: DevFormItem[];
    indexes?: any[];
  }
}

export async function getDevFormPage(params?: Record<string, any>) {
  return requestClient.get('/dev/form/page', { params });
}

export async function getDevFormInfo(id: string) {
  return requestClient.get(`/dev/form/getInfo/${id}`);
}

export async function saveDevForm(data: DevFormApi.DevForm) {
  return requestClient.post('/dev/form/save', data);
}

export async function updateDevForm(data: DevFormApi.DevForm) {
  return requestClient.put('/dev/form/update', data);
}

export async function removeDevForm(id: string) {
  return requestClient.delete(`/dev/form/remove/${id}`);
}

export async function tableNameExists(id: string, tableName: string) {
  return requestClient.get('/dev/form/tableNameExists', {
    params: { id, tableName },
  });
}

export async function getItemPresetTypes() {
  return requestClient.get('/dev/form/itemPresetTypes');
}

export async function getDbTypes() {
  return requestClient.get('/dev/form/dbTypes');
}

export async function getDbTables() {
  return requestClient.get<string[]>('/dev/form/dbTables');
}

export async function previewImportTable(tableName: string) {
  return requestClient.get<DevFormApi.DevForm>('/dev/form/importTable', {
    params: { tableName },
  });
}

export async function importTableFields(
  formId: string,
  tableName: string,
  overwrite = false,
) {
  return requestClient.post<DevFormApi.DevForm>(
    `/dev/form/importTable/${formId}`,
    null,
    { params: { tableName, overwrite } },
  );
}

export async function syncDevFormDb(formId: string) {
  return requestClient.post(`/dev/form/syncDb/${formId}`);
}

export async function generateDevFormCode(
  formId: string,
  params?: Record<string, any>,
) {
  return requestClient.download(`/dev/form/generateCode/${formId}`, { params });
}
