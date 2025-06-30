import type { FlwModelApi } from './api';

import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';

import { $t } from '#/locales';

/**
 * 模型列表表格列配置
 * @param onActionClick 操作按钮点击回调
 */
export function useColumns<T = FlwModelApi.Model>(
  onActionClick: OnActionClickFn<T>,
): VxeTableGridOptions['columns'] {
  return [
    {
      type: 'seq',
      width: 60,
      title: $t('flowable.model.seq'),
      fixed: 'left',
      align: 'center',
    },
    {
      field: 'name',
      title: $t('flowable.model.name'),
      minWidth: 160,
      align: 'left',
    },
    {
      field: 'key',
      title: $t('flowable.model.key'),
      minWidth: 120,
      align: 'left',
    },
    {
      field: 'category',
      title: $t('flowable.model.category'),
      minWidth: 100,
      align: 'center',
    },
    {
      field: 'revision',
      title: $t('flowable.model.revision'),
      minWidth: 100,
      align: 'center',
    },
    {
      field: 'lastUpdateTime',
      title: $t('flowable.model.lastUpdateTime'),
      minWidth: 180,
      align: 'left',
      formatter: 'formatDateTime',
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'name',
          nameTitle: $t('flowable.model.title'),
          onClick: onActionClick,
        },
        options: ['edit', 'delete'],
        name: 'CellOperation',
      },
      field: 'operation',
      fixed: 'right',
      title: $t('flowable.model.operation'),
      width: 130,
    },
  ];
}
export function useSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'name',
      label: '模型名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入模型名称',
      },
    },
    {
      fieldName: 'key',
      label: '模型标识',
      component: 'Input',
      componentProps: {
        placeholder: '请输入模型标识',
      },
    },
    {
      fieldName: 'category',
      label: '模型分类',
      component: 'Select',
      componentProps: {
        placeholder: '请选择模型分类',
        options: [
          { label: '表单', value: 'form' },
          { label: '流程', value: 'process' },
        ],
      },
    },
    {
      fieldName: 'remark',
      label: '备注',
      component: 'Textarea',
      componentProps: {
        placeholder: '请输入备注',
      },
    },
  ];
}
