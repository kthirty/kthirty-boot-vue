import type { FlwProcInstApi } from './api';

import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';

import { $t } from '#/locales';

/**
 * 流程实例列表表格列配置
 * @param onActionClick 操作按钮点击回调
 */
export function useColumns<T = FlwProcInstApi.ProcInst>(
  onActionClick: OnActionClickFn<T>,
): VxeTableGridOptions['columns'] {
  return [
    {
      type: 'seq',
      width: 60,
      title: $t('flowable.procinst.seq'),
      fixed: 'left',
      align: 'center',
    },
    {
      field: 'name',
      title: $t('flowable.procinst.name'),
      minWidth: 140,
      align: 'left',
    },
    {
      field: 'processDefinitionName',
      title: $t('flowable.procinst.processDefinitionName'),
      minWidth: 160,
      align: 'left',
    },
    {
      field: 'processDefinitionKey',
      title: $t('flowable.procinst.processDefinitionKey'),
      minWidth: 120,
      align: 'left',
    },
    {
      field: 'startUserId',
      title: $t('flowable.procinst.startUserId'),
      minWidth: 100,
      align: 'center',
    },
    {
      field: 'startTime',
      title: $t('flowable.procinst.startTime'),
      minWidth: 180,
      align: 'left',
      formatter: 'formatDateTime',
    },
    {
      field: 'endTime',
      title: $t('flowable.procinst.endTime'),
      minWidth: 180,
      align: 'left',
      formatter: 'formatDateTime',
    },
    {
      field: 'suspended',
      title: $t('flowable.procinst.suspended'),
      minWidth: 80,
      align: 'center',
      formatter: ({ cellValue }) =>
        cellValue ? $t('common.yes') : $t('common.no'),
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'name',
          nameTitle: $t('flowable.procinst.title'),
          onClick: onActionClick,
        },
        options: [
          {
            code: 'preview',
            text: $t('flowable.procinst.button.preview'),
          },
          {
            code: 'activate',
            text: $t('flowable.procinst.button.activate'),
            show: (row: FlwProcInstApi.ProcInst) =>
              !row.endTime && row.suspended,
          },
          {
            code: 'suspend',
            text: $t('flowable.procinst.button.suspend'),
            show: (row: FlwProcInstApi.ProcInst) =>
              !row.endTime && !row.suspended,
          },
          {
            code: 'upgrade',
            text: $t('flowable.procinst.button.upgrade'),
            title: $t('flowable.procinst.button.upgrade'),
            titleConfirm: $t('flowable.procinst.button.upgradeConfirmTitle'),
            show: (row: FlwProcInstApi.ProcInst) => !row.endTime,
          },
          'delete',
        ],
        name: 'CellOperation',
      },
      field: 'operation',
      fixed: 'right',
      title: $t('flowable.procinst.operation'),
      width: 260,
    },
  ];
}

export function useSearchSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'name',
      label: $t('flowable.procinst.name'),
      component: 'Input',
    },
    {
      fieldName: 'processDefinitionName',
      label: $t('flowable.procinst.processDefinitionName'),
      component: 'Input',
    },
    {
      fieldName: 'processDefinitionKey',
      label: $t('flowable.procinst.processDefinitionKey'),
      component: 'Input',
    },
    {
      fieldName: 'startUserId',
      label: $t('flowable.procinst.startUserId'),
      component: 'Input',
    },
    {
      fieldName: 'finished',
      label: $t('flowable.procinst.finished'),
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
    {
      fieldName: 'deleted',
      label: $t('flowable.procinst.deleted'),
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
