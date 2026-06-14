import { requestClient } from '#/api/request';

export namespace DevFormRuntimeApi {
  export interface ColumnSchema {
    columnName: string;
    fieldName: string;
    label: string;
    fieldType?: string;
    fieldAttribute?: string;
    showInList: boolean;
    allowSort: boolean;
    showInQuery: boolean;
    queryComponent?: string;
    showInForm: boolean;
    formComponent?: string;
    required: boolean;
    readonly: boolean;
    regexp?: string;
    defaultValue?: string;
    dictCode?: string;
    nullable?: boolean;
    maxLength?: number;
    pointLength?: number;
    weight?: number;
  }

  export interface TreeConfig {
    parentField: string;
    labelField: string;
    sortField?: string;
    rootValue?: string;
  }

  export interface Features {
    enableAdd: boolean;
    enableEdit: boolean;
    enableDelete: boolean;
    enableExport: boolean;
    enableImport: boolean;
    enableBatchDelete: boolean;
  }

  export interface Schema {
    formId: string;
    tableName: string;
    title: string;
    tableType: string;
    listType: string;
    isDbSync: string;
    primaryKey: string;
    primaryKeyField: string;
    logicDeleteField?: string;
    auditFields?: string[];
    treeConfig?: TreeConfig;
    columns: ColumnSchema[];
    features: Features;
  }

  export interface ImportResult {
    total: number;
    success: number;
    fail: number;
    errors: Array<{ column?: string; message: string; row: number }>;
  }
}

export async function getDevFormSchema(formId: string) {
  return requestClient.get<DevFormRuntimeApi.Schema>(
    `/dev/form/data/schema/${formId}`,
  );
}

export async function getDevFormDataPage(
  formId: string,
  params?: Record<string, any>,
) {
  return requestClient.get('/dev/form/data/page', {
    params: { formId, ...params },
  });
}

export async function getDevFormDataList(
  formId: string,
  params?: Record<string, any>,
) {
  return requestClient.get('/dev/form/data/list', {
    params: { formId, ...params },
  });
}

export async function getDevFormDataTree(
  formId: string,
  params?: Record<string, any>,
) {
  return requestClient.get('/dev/form/data/tree', {
    params: { formId, ...params },
  });
}

export async function getDevFormDataInfo(formId: string, id: string) {
  return requestClient.get(`/dev/form/data/getInfo/${formId}/${id}`);
}

export async function saveDevFormData(
  formId: string,
  data: Record<string, any>,
) {
  return requestClient.post('/dev/form/data/save', data, {
    params: { formId },
  });
}

export async function updateDevFormData(
  formId: string,
  data: Record<string, any>,
) {
  return requestClient.put('/dev/form/data/update', data, {
    params: { formId },
  });
}

export async function removeDevFormData(formId: string, id: string) {
  return requestClient.delete(`/dev/form/data/remove/${formId}/${id}`);
}

export async function removeDevFormDataBatch(formId: string, ids: string[]) {
  return requestClient.delete('/dev/form/data/removeBatch', {
    params: { formId },
    data: ids,
  });
}

export async function exportDevFormData(
  formId: string,
  params?: Record<string, any>,
) {
  return requestClient.download('/dev/form/data/export', {
    params: { formId, ...params },
  });
}

export async function downloadDevFormImportTemplate(formId: string) {
  return requestClient.download('/dev/form/data/importTemplate', {
    params: { formId },
  });
}

export async function importDevFormData(formId: string, file: File) {
  const formData = new FormData();
  formData.append('file', file);
  return requestClient.post<DevFormRuntimeApi.ImportResult>(
    '/dev/form/data/import',
    formData,
    {
      params: { formId },
      headers: { 'Content-Type': 'multipart/form-data' },
    },
  );
}
