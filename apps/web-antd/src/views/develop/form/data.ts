import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';

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
    {
      fieldName: 'field',
      component: 'Input',
    },
  ];
}

function _useItemColumns<T = DevFormItemApi.Item>(
  onActionClick: OnActionClickFn<T>,
): VxeTableGridOptions['columns'] {
  return [
    { type: 'checkbox', width: 40, fixed: 'left', align: 'center' },
    {
      type: 'seq',
      width: 60,
      fixed: 'left',
      align: 'center',
    },
    {
      field: 'columnName',
      title: $t('develop.formitem.columnName'),
      minWidth: 120,
      align: 'left',
    },
    {
      field: 'columnType',
      title: $t('develop.formitem.columnType'),
      minWidth: 100,
      align: 'left',
    },
    {
      field: 'columnLength',
      title: $t('develop.formitem.columnLength'),
      minWidth: 80,
      align: 'center',
    },
    {
      field: 'columnDefaultVal',
      title: $t('develop.formitem.columnDefaultVal'),
      minWidth: 100,
      align: 'left',
    },
    {
      field: 'formComponent',
      title: $t('develop.formitem.formComponent'),
      minWidth: 120,
      align: 'left',
    },
    {
      field: 'formRequired',
      title: $t('develop.formitem.formRequired'),
      minWidth: 80,
      align: 'center',
      formatter: ({ cellValue }) =>
        cellValue ? $t('common.yes') : $t('common.no'),
    },
    {
      field: 'isShowList',
      title: $t('develop.formitem.isShowList'),
      minWidth: 80,
      align: 'center',
      formatter: ({ cellValue }) =>
        cellValue ? $t('common.yes') : $t('common.no'),
    },
    {
      field: 'isShowForm',
      title: $t('develop.formitem.isShowForm'),
      minWidth: 80,
      align: 'center',
      formatter: ({ cellValue }) =>
        cellValue ? $t('common.yes') : $t('common.no'),
    },
    {
      field: 'isReadonly',
      title: $t('develop.formitem.isReadonly'),
      minWidth: 80,
      align: 'center',
      formatter: ({ cellValue }) =>
        cellValue ? $t('common.yes') : $t('common.no'),
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'columnName',
          nameTitle: $t('develop.formitem.title'),
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
function _useEditSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'columnName',
      label: $t('develop.formitem.columnName'),
      component: 'Input',
    },
    {
      fieldName: 'columnType',
      label: $t('develop.formitem.columnType'),
      component: 'Input',
    },
    {
      fieldName: 'columnLength',
      label: $t('develop.formitem.columnLength'),
      component: 'InputNumber',
    },
    {
      fieldName: 'columnDefaultVal',
      label: $t('develop.formitem.columnDefaultVal'),
      component: 'Input',
    },
    {
      fieldName: 'formComponent',
      label: $t('develop.formitem.formComponent'),
      component: 'Input',
    },
    {
      fieldName: 'formRequired',
      label: $t('develop.formitem.formRequired'),
      component: 'Switch',
    },
    {
      fieldName: 'isShowList',
      label: $t('develop.formitem.isShowList'),
      component: 'Switch',
    },
    {
      fieldName: 'isShowForm',
      label: $t('develop.formitem.isShowForm'),
      component: 'Switch',
    },
    {
      fieldName: 'isReadonly',
      label: $t('develop.formitem.isReadonly'),
      component: 'Switch',
    },
    {
      fieldName: 'columnRemarks',
      label: $t('develop.formitem.columnRemarks'),
      component: 'Input',
    },
  ];
}
