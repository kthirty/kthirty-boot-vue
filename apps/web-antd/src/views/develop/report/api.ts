import { requestClient } from '#/api/request';

export namespace DevReportApi {
  /** 报表主表 */
  export interface DevReport {
    id?: string;
    code?: string;
    name?: string;
    reportSql?: string;
    isPage?: string;
    dsKey?: string;
    remarks?: string;
    items?: DevReportItem[];
  }

  /** 报表字段 */
  export interface DevReportItem {
    id?: string;
    reportId?: string;
    columnName?: string;
    columnRemarks?: string;
    fieldType?: string;
    dictCode?: string;
    weight?: number;
    isShowQuery?: string;
    queryComponent?: string;
    isShowList?: string;
    isAllowSort?: string;
    listComponent?: string;
    [key: string]: any;
  }

  /** 报表字段 Schema */
  export interface ColumnSchema {
    columnName: string;
    fieldName: string;
    label: string;
    fieldType?: string;
    showInList: boolean;
    allowSort: boolean;
    showInQuery: boolean;
    queryComponent?: string;
    listComponent?: string;
    dictCode?: string;
    weight?: number;
  }

  /** 报表 Schema */
  export interface Schema {
    reportId: string;
    code: string;
    name: string;
    isPage: string;
    dsKey?: string;
    remarks?: string;
    columns: ColumnSchema[];
  }

  /** 数据源选项 */
  export interface DatasourceKey {
    value: string;
    label: string;
  }
}

/** 报表列表分页 */
export async function getDevReportPage(params?: Record<string, any>) {
  return requestClient.get('/dev/report/page', { params });
}

/** 报表详情 */
export async function getReportInfo(id: string) {
  return requestClient.get<DevReportApi.DevReport>(`/dev/report/getInfo/${id}`);
}

/** 新增报表（带字段） */
export async function saveReport(data: DevReportApi.DevReport) {
  return requestClient.post('/dev/report/save', data);
}

/** 更新报表（带字段） */
export async function updateReport(data: DevReportApi.DevReport) {
  return requestClient.put('/dev/report/update', data);
}

/** 删除报表 */
export async function removeReport(id: string) {
  return requestClient.delete(`/dev/report/remove/${id}`);
}

/** 报表编码是否存在 */
export async function codeExists(code: string, id?: string) {
  return requestClient.get<boolean>('/dev/report/codeExists', {
    params: { code, id: id || '' },
  });
}

/** 数据源列表 */
export async function getDatasourceKeys() {
  return requestClient.get<DevReportApi.DatasourceKey[]>(
    '/dev/report/datasourceKeys',
  );
}

/** 解析 SQL 得到字段列表 */
export async function parseSql(reportSql: string, dsKey?: string) {
  return requestClient.post<DevReportApi.DevReportItem[]>(
    '/dev/report/parseSql',
    { reportSql, dsKey },
    { timeout: 60_000 },
  );
}

/** 按编码获取报表 Schema */
export async function getSchemaByCode(code: string) {
  return requestClient.get<DevReportApi.Schema>(
    `/dev/report/data/schemaByCode/${code}`,
  );
}

/** 按编码分页查询报表数据 */
export async function pageByCode(params: Record<string, any>) {
  return requestClient.get('/dev/report/data/pageByCode', {
    params,
    timeout: 60_000,
  });
}

/** 按编码查询报表数据（不分页） */
export async function listByCode(params: Record<string, any>) {
  return requestClient.get<Record<string, any>[]>(
    '/dev/report/data/listByCode',
    {
      params,
      timeout: 120_000,
    },
  );
}

/** 按编码导出报表 Excel */
export async function exportByCode(params: Record<string, any>) {
  return requestClient.download<Blob>('/dev/report/data/exportByCode', {
    params,
    timeout: 120_000,
  });
}
