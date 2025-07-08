import type { FlwTaskApi } from './api';

import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';

import { $t } from '#/locales';

export function useTaskColumns<T = FlwTaskApi.Task>(
  onActionClick: OnActionClickFn<T>,
): VxeTableGridOptions['columns'] {
  return [
    {
      type: 'seq',
      width: 60,
      title: $t('flowable.task.table.seq'),
      align: 'center',
    },
    {
      field: 'name',
      title: $t('flowable.task.table.name'),
      minWidth: 160,
      align: 'left',
    },
    {
      field: 'assignee',
      title: $t('flowable.task.table.assignee'),
      minWidth: 120,
      align: 'center',
    },
    {
      field: 'owner',
      title: $t('flowable.task.table.owner'),
      minWidth: 120,
      align: 'center',
    },
    {
      field: 'processInstanceName',
      title: $t('flowable.task.table.processInstanceName'),
      minWidth: 160,
      align: 'center',
    },
    {
      field: 'processDefinitionName',
      title: $t('flowable.task.table.processDefinitionName'),
      minWidth: 160,
      align: 'center',
    },
    {
      field: 'createTime',
      title: $t('flowable.task.table.createTime'),
      minWidth: 180,
      align: 'center',
      formatter: 'formatDateTime',
    },
    {
      field: 'endTime',
      title: $t('flowable.task.table.endTime'),
      minWidth: 180,
      align: 'center',
      formatter: 'formatDateTime',
    },
    {
      field: 'state',
      title: $t('flowable.task.table.state'),
      minWidth: 100,
      align: 'center',
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'name',
          nameTitle: $t('flowable.task.table.name'),
          onClick: onActionClick,
        },
        options: [
          {
            code: 'handle',
            text: $t('flowable.task.button.handle'),
          },
        ],
        name: 'CellOperation',
      },
      field: 'operation',
      fixed: 'right',
      title: $t('flowable.task.table.action'),
      width: 120,
    },
  ];
}

export function useTaskSearchSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'taskName',
      label: $t('flowable.task.table.name'),
      component: 'Input',
    },
    {
      fieldName: 'processDefName',
      label: $t('flowable.task.table.processDefinitionName'),
      component: 'Input',
    },
    {
      fieldName: 'processInstanceName',
      label: $t('flowable.task.table.processInstanceName'),
      component: 'Input',
    },
    {
      fieldName: 'assignee',
      label: $t('flowable.task.table.assignee'),
      component: 'Input',
    },
  ];
}
