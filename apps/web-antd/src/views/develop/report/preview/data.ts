import type { DevReportApi } from '../api';

import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { $t } from '#/locales';
import { useDictStore } from '#/store';

const QUERY_COMPONENT_MAP: Record<string, string> = {
  Input: 'Input',
  InputNumber: 'InputNumber',
  DatePicker: 'DatePicker',
  DateTimePicker: 'DatePicker',
  Select: 'Select',
};

/** 单元格文本格式化（优先取 xxxLabel，其次布尔值转是/否） */
export function formatCell(
  row: Record<string, any>,
  col: DevReportApi.ColumnSchema,
) {
  const label = row[`${col.fieldName}Label`];
  if (label !== undefined && label !== null && label !== '') {
    return label;
  }
  const value = row[col.fieldName];
  if (col.listComponent === 'Tag' || col.fieldType === 'Boolean') {
    if (value === true || value === 'true' || value === 1 || value === '1') {
      return $t('common.yes');
    }
    if (value === false || value === 'false' || value === 0 || value === '0') {
      return $t('common.no');
    }
  }
  return value ?? '';
}

/** 预览查询表单 */
export function buildSearchSchema(
  schema: DevReportApi.Schema,
): VbenFormSchema[] {
  const dictStore = useDictStore();
  return schema.columns
    .filter((col) => col.showInQuery)
    .map((col) => {
      const componentProps: Record<string, any> = {
        allowClear: true,
        class: 'w-full',
      };
      if (col.queryComponent === 'Select' && col.dictCode) {
        componentProps.options = dictStore.getDict(col.dictCode);
      }
      if (col.queryComponent === 'DatePicker') {
        componentProps.valueFormat = 'YYYY-MM-DD';
      }
      if (col.queryComponent === 'DateTimePicker') {
        componentProps.showTime = true;
        componentProps.valueFormat = 'YYYY-MM-DD HH:mm:ss';
      }
      return {
        component:
          QUERY_COMPONENT_MAP[col.queryComponent || 'Input'] || 'Input',
        componentProps,
        fieldName: col.fieldName,
        label: col.label,
      };
    });
}

/** 预览表格列 */
export function buildColumns(
  schema: DevReportApi.Schema,
): VxeTableGridOptions['columns'] {
  return schema.columns
    .filter((col) => col.showInList)
    .toSorted((a, b) => (a.weight || 0) - (b.weight || 0))
    .map((col) => {
      return {
        field: col.fieldName,
        formatter: ({ cellValue, row }: { cellValue: any; row: any }) =>
          formatCell(row, col) || cellValue,
        minWidth: 120,
        sortable: col.allowSort,
        title: col.label,
      };
    });
}
