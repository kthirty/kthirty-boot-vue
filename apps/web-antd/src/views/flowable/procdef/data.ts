import type { FlwProcdefApi } from './api';

import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';

import { $t } from '#/locales';

/**
 * 流程定义列表表格列配置
 * @param onActionClick 操作按钮点击回调
 */
export function useColumns<T = FlwProcdefApi.Procdef>(
  onActionClick: OnActionClickFn<T>,
): VxeTableGridOptions['columns'] {
  return [
    {
      type: 'checkbox',
      width: 40,
      fixed: 'left',
      align: 'center',
    },
    {
      type: 'seq',
      width: 60,
      title: $t('flowable.procdef.seq'),
      fixed: 'left',
      align: 'center',
    },
    {
      field: 'name',
      title: $t('flowable.procdef.name'),
      minWidth: 160,
      align: 'left',
    },
    {
      field: 'key',
      title: $t('flowable.procdef.key'),
      minWidth: 120,
      align: 'left',
    },
    {
      field: 'version',
      title: $t('flowable.procdef.version'),
      minWidth: 80,
      align: 'center',
    },
    {
      field: 'suspended',
      title: $t('flowable.procdef.suspended'),
      minWidth: 100,
      align: 'center',
      formatter: ({ cellValue }) =>
        cellValue ? $t('common.yes') : $t('common.no'),
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'name',
          nameTitle: $t('flowable.procdef.title'),
          onClick: onActionClick,
        },
        options: [
          {
            code: 'preview',
            text: $t('flowable.procdef.button.preview'),
          },
          {
            code: 'suspend',
            text: $t('flowable.procdef.button.suspend'),
            title: $t('flowable.procdef.button.suspendConfirmTitle'),
            show: (row: FlwProcdefApi.Procdef) => !row.suspended,
          },
          {
            code: 'activate',
            text: $t('flowable.procdef.button.activate'),
            title: $t('flowable.procdef.button.activateConfirmTitle'),
            show: (row: FlwProcdefApi.Procdef) => row.suspended,
          },
        ],
        name: 'CellOperation',
      },
      field: 'operation',
      fixed: 'right',
      title: $t('flowable.procdef.operation'),
      width: 200,
    },
  ];
}

export function useSearchSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'name',
      label: $t('flowable.procdef.name'),
      component: 'Input',
    },
    {
      fieldName: 'key',
      label: $t('flowable.procdef.key'),
      component: 'Input',
    },
    {
      fieldName: 'suspended',
      label: $t('flowable.procdef.suspended'),
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: [
          { label: $t('common.yes'), value: 'true' },
          { label: $t('common.no'), value: 'false' },
        ],
        optionType: 'button',
      },
    },
  ];
}
