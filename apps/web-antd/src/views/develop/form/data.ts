import type { DevFormApi } from './api';

import type { SubTableColumnSchema } from '#/adapter/component';
import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';

import { $t } from '#/locales';
import { useDictStore } from '#/store/dict';

const dictStore = useDictStore();

export function useSearchSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'tableName',
      label: $t('develop.form.tableName'),
      component: 'Input',
    },
    {
      fieldName: 'remarks',
      label: $t('develop.form.remarks'),
      component: 'Input',
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
  ];
}

export function useColumns(
  onActionClick: OnActionClickFn<DevFormApi.DevForm>,
): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'tableName',
      title: $t('develop.form.tableName'),
      minWidth: 140,
    },
    {
      field: 'remarks',
      title: $t('develop.form.remarks'),
      minWidth: 160,
    },
    {
      cellRender: {
        name: 'CellTag',
        options: dictStore.getDict('dev_table_type'),
      },
      field: 'tableType',
      title: $t('develop.form.tableType'),
      width: 100,
    },
    {
      cellRender: {
        name: 'CellTag',
        options: dictStore.getDict('dev_list_type'),
      },
      field: 'listType',
      title: $t('develop.form.listType'),
      width: 110,
    },
    {
      cellRender: { name: 'CellTag', options: dictStore.getDict('whether') },
      field: 'isDbSync',
      title: $t('develop.form.isDbSync'),
      width: 110,
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
          { code: 'data', text: $t('develop.form.button.data') },
          { code: 'syncDb', text: $t('develop.form.button.syncDb') },
          {
            code: 'generateCode',
            text: $t('develop.form.button.generateCode'),
          },
          'edit',
          'delete',
        ],
        name: 'CellOperation',
      },
      field: 'operation',
      fixed: 'right',
      title: $t('develop.form.operation'),
      width: 280,
    },
  ];
}

export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'tableName',
      label: $t('develop.form.tableName'),
      component: 'Input',
      rules: 'required',
    },
    {
      fieldName: 'remarks',
      label: $t('develop.form.remarks'),
      component: 'Input',
      rules: 'required',
    },
    {
      fieldName: 'tableType',
      label: $t('develop.form.tableType'),
      component: 'RadioGroup',
      defaultValue: '1',
      componentProps: {
        buttonStyle: 'solid',
        optionType: 'button',
        options: dictStore.getDict('dev_table_type'),
      },
    },
    {
      fieldName: 'listType',
      label: $t('develop.form.listType'),
      component: 'RadioGroup',
      defaultValue: '1',
      componentProps: {
        buttonStyle: 'solid',
        optionType: 'button',
        options: dictStore.getDict('dev_list_type'),
      },
    },
    {
      fieldName: 'treeParentField',
      label: $t('develop.form.treeParentField'),
      component: 'Input',
      dependencies: {
        triggerFields: ['listType'],
        if(values) {
          return values.listType === '3';
        },
      },
    },
    {
      fieldName: 'treeLabelField',
      label: $t('develop.form.treeLabelField'),
      component: 'Input',
      dependencies: {
        triggerFields: ['listType'],
        if(values) {
          return values.listType === '3';
        },
      },
    },
    {
      fieldName: 'treeSortField',
      label: $t('develop.form.treeSortField'),
      component: 'Input',
      dependencies: {
        triggerFields: ['listType'],
        if(values) {
          return values.listType === '3';
        },
      },
    },
    {
      fieldName: 'treeRootValue',
      label: $t('develop.form.treeRootValue'),
      component: 'Input',
      defaultValue: '0',
      dependencies: {
        triggerFields: ['listType'],
        if(values) {
          return values.listType === '3';
        },
      },
    },
    {
      fieldName: 'items',
      label: $t('develop.form.items'),
      component: 'SubTable',
      formItemClass: 'col-span-2',
      defaultValue: [],
      componentProps: {
        columns: useItemSubTableColumns(),
      },
    },
  ];
}

function useItemSubTableColumns(): SubTableColumnSchema[] {
  const componentOptions = [
    { label: 'Input', value: 'Input' },
    { label: 'Textarea', value: 'Textarea' },
    { label: 'InputNumber', value: 'InputNumber' },
    { label: 'Select', value: 'Select' },
    { label: 'Radio', value: 'Radio' },
    { label: 'Switch', value: 'Switch' },
    { label: 'DatePicker', value: 'DatePicker' },
    { label: 'DateTimePicker', value: 'DateTimePicker' },
  ];
  return [
    {
      field: 'columnName',
      title: $t('develop.form.columnName'),
      component: 'Input',
      rules: 'required',
      width: 120,
    },
    {
      field: 'columnRemarks',
      title: $t('develop.form.columnRemarks'),
      component: 'Input',
      width: 120,
    },
    {
      field: 'columnType',
      title: $t('develop.form.columnType'),
      component: 'Input',
      width: 100,
    },
    {
      field: 'fieldAttribute',
      title: $t('develop.form.fieldAttribute'),
      component: 'Select',
      width: 110,
      componentProps: {
        options: [
          { label: '普通', value: '1' },
          { label: '主键', value: '2' },
          { label: '删除标记', value: '3' },
        ],
      },
    },
    {
      field: 'formComponent',
      title: $t('develop.form.formComponent'),
      component: 'Select',
      width: 120,
      componentProps: { options: componentOptions },
    },
    {
      field: 'dictCode',
      title: $t('develop.form.dictCode'),
      component: 'Input',
      width: 100,
    },
    {
      field: 'formRequired',
      title: $t('develop.form.formRequired'),
      component: 'Switch',
      width: 80,
    },
    {
      field: 'isShowList',
      title: $t('develop.form.isShowList'),
      component: 'Switch',
      defaultValue: true,
      width: 80,
    },
    {
      field: 'isShowForm',
      title: $t('develop.form.isShowForm'),
      component: 'Switch',
      defaultValue: true,
      width: 80,
    },
    {
      field: 'isShowQuery',
      title: $t('develop.form.isShowQuery'),
      component: 'Switch',
      defaultValue: false,
      width: 80,
    },
    {
      field: 'weight',
      title: $t('develop.form.weight'),
      component: 'InputNumber',
      defaultValue: 1,
      width: 80,
    },
  ];
}
