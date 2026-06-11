import type { Recordable } from '@vben/types';

import type { SubTableColumnSchema } from './types';

/**
 * 表单 defaultValue 数组中标记「新增行默认数据」的特殊行。
 * 键名与 columns.fieldName 对应，由父表单字段（如 items）的 defaultValue 传入。
 */
export const SUB_TABLE_DEFAULT_ROW_FLAG = '__defaultRow';

function pickColumnDefaults(
  source: Recordable<any>,
  columns: SubTableColumnSchema[],
) {
  const row: Recordable<any> = {};
  columns.forEach((col) => {
    if (source[col.fieldName] !== undefined) {
      row[col.fieldName] = source[col.fieldName];
    }
  });
  return row;
}

/** 从表单绑定的行数据中提取默认配置行 */
export function extractRowDefaultsFromRows(
  rows: Recordable<any>[] | undefined,
  columns: SubTableColumnSchema[],
) {
  if (!rows?.length) {
    return {};
  }
  const defaultRow = rows.find(
    (row) => row?.[SUB_TABLE_DEFAULT_ROW_FLAG] === true,
  );
  return defaultRow ? pickColumnDefaults(defaultRow, columns) : {};
}

/** 过滤 defaultValue 中的默认配置行，仅保留业务数据行 */
export function filterDataRows(rows: Recordable<any>[] = []) {
  return rows.filter((row) => !row?.[SUB_TABLE_DEFAULT_ROW_FLAG]);
}
