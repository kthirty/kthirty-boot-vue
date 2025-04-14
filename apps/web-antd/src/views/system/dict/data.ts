import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { SystemDictApi } from '#/api';

import { $t } from '#/locales';

export function useSearchSchema(): VbenFormSchema[] {
  return [
    { fieldName: 'code', label: '字典编码', component: 'Input' },
    { fieldName: 'name', label: '字典名称', component: 'Input' },
  ];
}

export function useColumns<T = SystemDictApi.DictType>(
  onActionClick: OnActionClickFn<T>,
): VxeTableGridOptions['columns'] {
  return [
    { width: 60, type: 'radio' },
    { field: 'code', title: '字典编码' },
    { field: 'name', title: '字典名称' },
    { field: 'description', title: '描述' },
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
