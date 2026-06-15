import type { DevFormRuntimeApi } from '../api';

import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';

import { useDictStore } from '#/store/dict';

const dictStore = useDictStore();

const QUERY_COMPONENT_MAP: Record<string, string> = {
  Input: 'Input',
  Select: 'Select',
  DatePicker: 'DatePicker',
  DateTimePicker: 'DatePicker',
  RangePicker: 'RangePicker',
  InputNumber: 'InputNumber',
};

const FORM_COMPONENT_MAP: Record<string, string> = {
  Input: 'Input',
  Textarea: 'Textarea',
  InputNumber: 'InputNumber',
  Select: 'Select',
  Radio: 'RadioGroup',
  Switch: 'Switch',
  DatePicker: 'DatePicker',
  DateTimePicker: 'DatePicker',
};

function buildComponentProps(column: DevFormRuntimeApi.ColumnSchema) {
  const props: Record<string, any> = {
    allowClear: true,
    class: 'w-full',
  };
  if (column.dictCode) {
    props.options = dictStore.getDict(column.dictCode);
  }
  if (column.formComponent === 'InputNumber') {
    props.min = 0;
    if (column.pointLength) {
      props.precision = column.pointLength;
    }
  }
  if (column.formComponent === 'DateTimePicker') {
    props.showTime = true;
  }
  return props;
}

export function buildSearchSchema(
  schema: DevFormRuntimeApi.Schema,
): VbenFormSchema[] {
  return schema.columns
    .filter((col) => col.showInQuery)
    .map((col) => ({
      fieldName: col.fieldName,
      label: col.label,
      component: QUERY_COMPONENT_MAP[col.queryComponent || 'Input'] || 'Input',
      componentProps: buildComponentProps(col),
    }));
}

export function buildFormSchema(
  schema: DevFormRuntimeApi.Schema,
  isEdit = false,
): VbenFormSchema[] {
  return schema.columns
    .filter((col) => col.showInForm)
    .filter((col) => !(isEdit && col.fieldAttribute === '2'))
    .filter((col) => col.fieldAttribute !== '3')
    .map((col) => {
      const item: VbenFormSchema = {
        fieldName: col.fieldName,
        label: col.label,
        component: FORM_COMPONENT_MAP[col.formComponent || 'Input'] || 'Input',
        componentProps: {
          ...buildComponentProps(col),
          disabled: col.readonly,
        },
        defaultValue: col.defaultValue,
        rules: col.required ? 'required' : undefined,
      };
      if (col.fieldAttribute === '2' && isEdit) {
        item.component = 'Input';
        item.componentProps = { disabled: true };
      }
      return item;
    });
}

export function buildGridColumns(
  schema: DevFormRuntimeApi.Schema,
  onActionClick: OnActionClickFn<any>,
): VxeTableGridOptions['columns'] {
  const listColumns = schema.columns
    .filter((col) => col.showInList)
    .map((col) => {
      const column: NonNullable<VxeTableGridOptions['columns']>[number] = {
        field: col.dictCode ? `${col.fieldName}Label` : col.fieldName,
        title: col.label,
        minWidth: 120,
        sortable: col.allowSort,
      };
      return column;
    });

  listColumns.push({
    align: 'center',
    cellRender: {
      attrs: {
        nameField: schema.treeConfig?.labelField || schema.primaryKeyField,
        nameTitle: schema.title,
        onClick: onActionClick,
      },
      options: ['edit', 'delete'],
      name: 'CellOperation',
    },
    field: 'operation',
    fixed: 'right',
    title: '操作',
    width: 140,
  });

  return listColumns;
}

export function isTreeList(schema?: DevFormRuntimeApi.Schema) {
  return schema?.listType === '3';
}

export function isPageList(schema?: DevFormRuntimeApi.Schema) {
  return !schema?.listType || schema.listType === '1';
}
