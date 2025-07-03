import type { FlwInstanceApi } from './api';

import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';

import { $t } from '#/locales';

export function useColumns<T = FlwInstanceApi.Instance>(
  onActionClick: OnActionClickFn<T>,
): VxeTableGridOptions['columns'] {
  return [
    { type: 'checkbox', width: 40, fixed: 'left', align: 'center' },
    {
      type: 'seq',
      width: 60,
      title: $t('flowable.instance.seq'),
      fixed: 'left',
      align: 'center',
    },
    {
      field: 'name',
      title: $t('flowable.instance.name'),
      minWidth: 160,
      align: 'left',
    },
    {
      field: 'processDefinitionName',
      title: $t('flowable.instance.processDefinitionName'),
      minWidth: 160,
      align: 'left',
    },
    {
      field: 'startUserId',
      title: $t('flowable.instance.startUserId'),
      minWidth: 120,
      align: 'center',
    },
    {
      field: 'startTime',
      title: $t('flowable.instance.startTime'),
      minWidth: 180,
      align: 'left',
      formatter: 'formatDateTime',
    },
    {
      field: 'endTime',
      title: $t('flowable.instance.endTime'),
      minWidth: 180,
      align: 'left',
      formatter: 'formatDateTime',
    },
    {
      field: 'suspended',
      title: $t('flowable.instance.suspended'),
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
          nameTitle: $t('flowable.instance.title'),
          onClick: onActionClick,
        },
        options: [
          { code: 'hisTask', text: $t('flowable.instance.button.hisTask') },
          {
            code: 'hisDiagram',
            text: $t('flowable.instance.button.hisDiagram'),
          },
          {
            code: 'suspend',
            text: $t('flowable.instance.button.suspend'),
            show: (row: FlwInstanceApi.Instance) => !row.suspended,
            title: $t('flowable.instance.button.suspendConfirmTitle'),
          },
          {
            code: 'activate',
            text: $t('flowable.instance.button.activate'),
            show: (row: FlwInstanceApi.Instance) => row.suspended,
            title: $t('flowable.instance.button.activateConfirmTitle'),
          },
          {
            code: 'delete',
            text: $t('flowable.instance.button.delete'),
            title: $t('flowable.instance.button.deleteConfirmTitle'),
          },
        ],
        name: 'CellOperation',
      },
      field: 'operation',
      fixed: 'right',
      title: $t('flowable.instance.operation'),
      width: 260,
    },
  ];
}

export function useSearchSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'name',
      label: $t('flowable.instance.name'),
      component: 'Input',
    },
    {
      fieldName: 'processDefinitionName',
      label: $t('flowable.instance.processDefinitionName'),
      component: 'Input',
    },
    {
      fieldName: 'startUserId',
      label: $t('flowable.instance.startUserId'),
      component: 'Input',
    },
    {
      fieldName: 'suspended',
      label: $t('flowable.instance.suspended'),
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
