import type { DefaultOptionType } from 'ant-design-vue/es/select';
import type { ColumnType } from 'ant-design-vue/es/table';

import type { DevFormItemApi } from './api';

import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';

import { h } from 'vue';

import { Input, Select, Switch } from 'ant-design-vue';

import { $t } from '#/locales';
import { useDictStore } from '#/store';

export function useSearchSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'tableName',
      label: $t('develop.form.tableName'),
      component: 'Input',
    },
  ];
}

export function useFormColumns(
  onActionClick: OnActionClickFn<any>,
): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'tableName',
      title: $t('develop.form.tableName'),
      minWidth: 120,
      align: 'left',
    },
    {
      field: 'tableTypeLabel',
      title: $t('develop.form.tableType'),
      minWidth: 100,
      align: 'left',
    },
    {
      field: 'listTypeLabel',
      title: $t('develop.form.listType'),
      minWidth: 100,
      align: 'left',
    },
    {
      field: 'isDbSyncLabel',
      title: $t('develop.form.isDbSync'),
      minWidth: 100,
      align: 'center',
    },
    {
      field: 'remarks',
      title: $t('develop.form.remarks'),
      minWidth: 120,
      align: 'left',
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'tableName',
          nameTitle: $t('develop.form.title'),
          onClick: onActionClick,
        },
        options: [
          { code: 'edit', text: $t('common.edit') },
          { code: 'delete', text: $t('common.delete') },
        ],
        name: 'CellOperation',
      },
      field: 'operation',
      fixed: 'right',
      title: $t('common.operation'),
      width: 160,
    },
  ];
}
const dictStore = useDictStore();

export const formComponentOptions = [
  { label: 'Input', value: 'Input' },
  { label: 'Textarea', value: 'Textarea' },
  { label: 'Select', value: 'Select' },
  { label: 'Radio', value: 'Radio' },
  { label: 'Checkbox', value: 'Checkbox' },
  { label: 'DatePicker', value: 'DatePicker' },
  { label: 'TimePicker', value: 'TimePicker' },
  { label: 'Upload', value: 'Upload' },
  { label: 'Slider', value: 'Slider' },
  { label: 'Rate', value: 'Rate' },
  { label: 'Switch', value: 'Switch' },
];

export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'tableName',
      label: $t('develop.form.tableName'),
      component: 'Input',
      rules: 'required',
    },
    {
      fieldName: 'tableType',
      label: $t('develop.form.tableType'),
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: dictStore.getDict('dev_table_type'),
      },
    },
    {
      fieldName: 'listType',
      label: $t('develop.form.listType'),
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: dictStore.getDict('dev_list_type'),
      },
    },
    {
      fieldName: 'remarks',
      label: $t('develop.form.remarks'),
      component: 'Textarea',
    },
  ];
}

function getInputColumn(name: string) {
  return {
    title: $t(`develop.form.fields.${name}`),
    dataIndex: `${name}`,
    key: `${name}`,
    customRender: (opt: { record: DevFormItemApi.Item }) => {
      return h(Input, {
        disabled: opt.record.disabled,
        value: opt.record[name],
        onChange: (e: any) => {
          opt.record[name] = e.target.value;
        },
      });
    },
  };
}
function getSwitchColumn(name: string) {
  return {
    title: $t(`develop.form.fields.${name}`),
    dataIndex: `${name}`,
    key: `${name}`,
    customRender: (opt: { record: DevFormItemApi.Item }) => {
      console.warn('opt.record[name]', opt.record[name]);
      return h(Switch, {
        disabled: opt.record.disabled,
        checked: opt.record[name],
        onChange: (checked: any) => {
          opt.record[name] = checked;
        },
      });
    },
  };
}
function getSelectColumn(name: string, options: DefaultOptionType[]) {
  return {
    title: $t(`develop.form.fields.${name}`),
    dataIndex: `${name}`,
    key: `${name}`,
    customRender: (opt: { record: DevFormItemApi.Item }) => {
      return h(Select, {
        disabled: opt.record.disabled,
        value: opt.record[name],
        class: 'w-full',
        onChange: (e: any) => {
          opt.record[name] = e.target.value;
        },
        options,
      });
    },
  };
}

export function useDatabaseColumns(): ColumnType<DevFormItemApi.Item>[] {
  return [
    getInputColumn('columnName'),
    getInputColumn('columnType'),
    getInputColumn('columnLength'),
    getInputColumn('columnPointLength'),
    getInputColumn('columnDefaultVal'),
    getInputColumn('columnRemarks'),
  ];
}
export function useEntityColumns(): ColumnType<DevFormItemApi.Item>[] {
  return [
    getSelectColumn('fieldType', [
      { label: 'String', value: 'String' },
      { label: 'Integer', value: 'Integer' },
      { label: 'Long', value: 'Long' },
      { label: 'BigDecimal', value: 'BigDecimal' },
      { label: 'Boolean', value: 'Boolean' },
      { label: 'Date', value: 'Date' },
    ]),
    getSelectColumn('fieldAttribute', [
      { label: '普通字段', value: '1' },
      { label: '主键', value: '2' },
      { label: '删除标记', value: '3' },
      { label: '非数据库字段', value: '4' },
    ]),
    getInputColumn('dictCode'),
  ];
}
export function usePageColumns(): ColumnType<DevFormItemApi.Item>[] {
  return [
    getSelectColumn('formComponent', formComponentOptions),
    getInputColumn('weight'),
    getSelectColumn('queryComponent', formComponentOptions),
    getSwitchColumn('formRequired'),
    getSwitchColumn('isShowQuery'),
    getSwitchColumn('isShowForm'),
    getSwitchColumn('isShowList'),
    getSwitchColumn('isAllowSort'),
  ];
}
export function useExtraColumns(): ColumnType<DevFormItemApi.Item>[] {
  return [
    getSwitchColumn('columnNullable'),
    getInputColumn('formRegexp'),
    getSwitchColumn('isReadonly'),
  ];
}
export function useForeignKeyColumns(): ColumnType<DevFormItemApi.Item>[] {
  return [
    getInputColumn('foreignKeyMainTable'),
    getInputColumn('foreignKeyMainColumn'),
  ];
}
export function useIndexColumns(): ColumnType<DevFormItemApi.Item>[] {
  return [];
}

export function useInitItems(): DevFormItemApi.Item[] {
  const id = Date.now().toString();
  return [
    {
      id: `${id}_id`,
      columnName: 'id',
      columnType: 'String',
      columnLength: 32,
      fieldType: 'String',
      fieldAttribute: '2',
      disabled: true,
    },
    {
      id: `${id}_create_by`,
      columnName: 'create_by',
      columnType: 'String',
      columnLength: 32,
      fieldType: 'String',
      fieldAttribute: '1',
      disabled: true,
    },
    {
      id: `${id}_update_by`,
      columnName: 'update_by',
      columnType: 'String',
      columnLength: 32,
      fieldType: 'String',
      fieldAttribute: '1',
      disabled: true,
    },
    {
      id: `${id}_create_date`,
      columnName: 'create_date',
      columnType: 'Date',
      fieldType: 'Date',
      fieldAttribute: '1',
      disabled: true,
    },
    {
      id: `${id}_update_date`,
      columnName: 'update_date',
      columnType: 'Date',
      fieldType: 'Date',
      fieldAttribute: '1',
      disabled: true,
    },
  ];
}
