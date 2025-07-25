import type { ColumnType } from 'ant-design-vue/es/table';

import type { DevFormItemApi } from './api';

import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';

import { h } from 'vue';

import { Input } from 'ant-design-vue';

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
        value: opt.record[name],
        onChange: (e: any) => {
          opt.record[name] = e.target.value;
        },
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
