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
        options: [
          {
            code: 'preview',
            text: $t('flowable.model.button.preview'),
          },
          'edit',
          {
            code: 'deploy',
            text: $t('flowable.model.button.deploy'),
            title:
              $t('flowable.model.button.deploy') + $t('flowable.model.title'),
            titleConfirm: $t('flowable.model.button.deployConfirmTitle'),
          },
          'delete',
        ],
        name: 'CellOperation',
      },
      field: 'operation',
      fixed: 'right',
      title: $t('flowable.model.operation'),
      width: 200,
    },
  ];
}

export function useSearchSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'name',
      label: $t('flowable.model.name'),
      component: 'Input',
    },
    {
      fieldName: 'key',
      label: $t('flowable.model.key'),
      component: 'Input',
    },
    {
      fieldName: 'deployed',
      label: $t('flowable.model.deployed'),
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
