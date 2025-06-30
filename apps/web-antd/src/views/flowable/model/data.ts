import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { $t } from '#/locales';

/**
 * 模型列表表格列配置
 * @param onActionClick 操作按钮点击回调
 */
export function useColumns(
  onActionClick: (params: { code: string; row: any }) => void,
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
