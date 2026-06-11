import type { FlwTaskApi } from './api';

import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';

import { $t } from '#/locales';

function useBaseColumns(): VxeTableGridOptions['columns'] {
  return [
    {
      type: 'seq',
      width: 60,
      title: $t('flowable.task.seq'),
      fixed: 'left',
      align: 'center',
    },
    {
      field: 'name',
      title: $t('flowable.task.name'),
      minWidth: 140,
      align: 'left',
    },
    {
      field: 'processDefinitionName',
      title: $t('flowable.task.processDefinitionName'),
      minWidth: 160,
      align: 'left',
    },
    {
      field: 'processInstanceName',
      title: $t('flowable.task.processInstanceName'),
      minWidth: 140,
      align: 'left',
    },
    {
      field: 'assignee',
      title: $t('flowable.task.assignee'),
      minWidth: 100,
      align: 'center',
    },
    {
      field: 'processInstanceStartedBy',
      title: $t('flowable.task.processInstanceStartedBy'),
      minWidth: 100,
      align: 'center',
    },
    {
      field: 'createTime',
      title: $t('flowable.task.createTime'),
      minWidth: 180,
      align: 'left',
      formatter: 'formatDateTime',
    },
  ];
}

/**
 * 待办任务列表表格列配置
 */
export function useTodoColumns<T = FlwTaskApi.Task>(
  onActionClick: OnActionClickFn<T>,
): VxeTableGridOptions['columns'] {
  return [
    ...(useBaseColumns() || []),
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'name',
          nameTitle: $t('flowable.task.todoTitle'),
          onClick: onActionClick,
        },
        options: [
          {
            code: 'handle',
            text: $t('flowable.task.button.handle'),
          },
          {
            code: 'claim',
            text: $t('flowable.task.button.claim'),
            show: (row: FlwTaskApi.Task) => !row.assignee,
          },
          {
            code: 'unclaim',
            text: $t('flowable.task.button.unclaim'),
            show: (row: FlwTaskApi.Task) => !!row.assignee,
          },
          {
            code: 'activate',
            text: $t('flowable.task.button.activate'),
            show: (row: FlwTaskApi.Task) => row.suspensionState === 2,
          },
          {
            code: 'suspend',
            text: $t('flowable.task.button.suspend'),
            show: (row: FlwTaskApi.Task) => row.suspensionState !== 2,
          },
        ],
        name: 'CellOperation',
      },
      field: 'operation',
      fixed: 'right',
      title: $t('flowable.task.operation'),
      width: 280,
    },
  ];
}

/**
 * 已办任务列表表格列配置
 */
export function useDoneColumns(): VxeTableGridOptions['columns'] {
  return [
    ...(useBaseColumns() || []),
    {
      field: 'endTime',
      title: $t('flowable.task.endTime'),
      minWidth: 180,
      align: 'left',
      formatter: 'formatDateTime',
    },
  ];
}

export function useSearchSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'taskName',
      label: $t('flowable.task.name'),
      component: 'Input',
    },
    {
      fieldName: 'processDefName',
      label: $t('flowable.task.processDefinitionName'),
      component: 'Input',
    },
    {
      fieldName: 'processInstName',
      label: $t('flowable.task.processInstanceName'),
      component: 'Input',
    },
    {
      fieldName: 'processDefKey',
      label: $t('flowable.task.processDefinitionKey'),
      component: 'Input',
    },
  ];
}
