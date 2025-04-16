import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { SystemDictApi } from '#/api';

import { $t } from '#/locales';

export function useSearchSchema(): VbenFormSchema[] {
  return [
    { fieldName: 'code', label: $t('system.dict.code'), component: 'Input' },
    { fieldName: 'name', label: $t('system.dict.name'), component: 'Input' },
  ];
}

export function useColumns<T = SystemDictApi.DictType>(
  onActionClick: OnActionClickFn<T>,
): VxeTableGridOptions['columns'] {
  return [
    { width: 60, type: 'radio' },
    { field: 'code', title: $t('system.dict.code') },
    { field: 'name', title: $t('system.dict.name') },
    { field: 'description', title: $t('system.dict.description') },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'name',
          nameTitle: $t('system.role.name'),
          onClick: onActionClick,
        },
        options: ['edit', 'delete'],
        name: 'CellOperation',
      },
      field: 'operation',
      fixed: 'right',
      title: $t('system.role.operation'),
      width: 130,
    },
  ];
}

export function useSubSearchSchema(): VbenFormSchema[] {
  return [
    { fieldName: 'value', label: $t('system.dict.value'), component: 'Input' },
    { fieldName: 'label', label: $t('system.dict.label'), component: 'Input' },
  ];
}

export function useSubColumns(
  onActionClick: OnActionClickFn<SystemDictApi.DictItem>,
): VxeTableGridOptions['columns'] {
  return [
    { field: 'label', title: $t('system.dict.label'), treeNode: true },
    { field: 'value', title: $t('system.dict.value') },
    { field: 'description', title: $t('system.dict.description') },
    { field: 'weight', title: $t('system.dict.weight') },
    { field: 'statusLabel', title: $t('system.dict.status') },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'name',
          nameTitle: $t('system.dict.name'),
          onClick: onActionClick,
        },
        options: ['edit', 'delete'],
        name: 'CellOperation',
      },
      field: 'operation',
      fixed: 'right',
      title: $t('system.dict.subOperation'),
      width: 130,
    },
  ];
}
