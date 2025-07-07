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
      field: 'id',
      title: $t('flowable.instance.id'),
      minWidth: 160,
      align: 'left',
    },
    {
      field: 'name',
      title: $t('flowable.instance.name'),
      minWidth: 160,
      align: 'left',
    },
    {
      field: 'businessKey',
      title: $t('flowable.instance.businessKey'),
      minWidth: 160,
      align: 'left',
    },
    {
      field: 'businessStatus',
      title: $t('flowable.instance.businessStatus'),
      minWidth: 120,
      align: 'left',
    },
    {
      field: 'processDefinitionName',
      title: $t('flowable.instance.processDefinitionName'),
      minWidth: 160,
      align: 'left',
    },
    {
      field: 'processDefinitionKey',
      title: $t('flowable.instance.processDefinitionKey'),
      minWidth: 120,
      align: 'left',
    },
    {
      field: 'processDefinitionVersion',
      title: $t('flowable.instance.processDefinitionVersion'),
      minWidth: 100,
      align: 'center',
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
      field: 'durationInMillis',
      title: $t('flowable.instance.durationInMillis'),
      minWidth: 120,
      align: 'center',
    },
    {
      field: 'deleteReason',
      title: $t('flowable.instance.deleteReason'),
      minWidth: 120,
      align: 'left',
    },
    {
      field: 'description',
      title: $t('flowable.instance.description'),
      minWidth: 120,
      align: 'left',
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
          { code: 'history', text: $t('flowable.instance.button.history') },
          {
            code: 'suspend',
            text: $t('flowable.instance.button.suspend'),
            show: (row: FlwInstanceApi.Instance) =>
              !row.suspended && !row.endTime,
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
            show: (row: FlwInstanceApi.Instance) =>
              !row.isDeleted && !row.suspended && !row.endTime,
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
      fieldName: 'processDefinitionKey',
      label: $t('flowable.instance.processDefinitionKey'),
      component: 'Input',
    },
    {
      fieldName: 'startUserId',
      label: $t('flowable.instance.startUserId'),
      component: 'Input',
    },
    {
      fieldName: 'finished',
      label: $t('flowable.instance.finished'),
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
      label: $t('flowable.instance.deleted'),
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

export function useHisTaskColumns<T = FlwInstanceApi.Instance>(
  _onActionClick: OnActionClickFn<T>,
): VxeTableGridOptions['columns'] {
  return [
    {
      type: 'seq',
      width: 60,
      title: $t('flowable.instance.seq'),
      align: 'center',
    },
    {
      field: 'id',
      title: $t('flowable.instance.id'),
      minWidth: 160,
      align: 'left',
    },
    {
      field: 'name',
      title: $t('flowable.instance.name'),
      minWidth: 160,
      align: 'left',
    },
    {
      field: 'assignee',
      title: $t('flowable.instance.assignee'),
      minWidth: 120,
      align: 'left',
    },
    {
      field: 'startTime',
      title: $t('flowable.instance.startTime'),
      minWidth: 160,
      align: 'center',
      formatter: 'formatDateTime',
    },
    {
      field: 'endTime',
      title: $t('flowable.instance.endTime'),
      minWidth: 160,
      align: 'center',
      formatter: 'formatDateTime',
    },
    {
      field: 'durationInMillis',
      title: $t('flowable.instance.duration'),
      minWidth: 120,
      align: 'center',
    },
    {
      field: 'comment',
      title: $t('flowable.instance.comment'),
      minWidth: 160,
      align: 'left',
      cellRender: {
        name: 'Timeline',
      },
    },
  ];
}
