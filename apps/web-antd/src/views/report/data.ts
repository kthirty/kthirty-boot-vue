import type { UReportApi } from './api';

import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';

import dayjs from 'dayjs';

import { $t } from '#/locales';

export function useSearchSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'name',
      label: $t('ureport.name'),
    },
  ];
}

export function useColumns(
  onActionClick: OnActionClickFn<UReportApi.ReportFile>,
): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'name',
      minWidth: 240,
      title: $t('ureport.name'),
    },
    {
      field: 'updateDate',
      formatter: ({ cellValue }) =>
        cellValue ? dayjs(cellValue).format('YYYY-MM-DD HH:mm:ss') : '',
      title: $t('ureport.updateDate'),
      width: 180,
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'name',
          nameTitle: $t('ureport.title'),
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          {
            code: 'edit',
            text: $t('ureport.edit'),
          },
          {
            code: 'preview',
            text: $t('ureport.preview'),
          },
          'delete',
        ],
      },
      field: 'operation',
      fixed: 'right',
      title: $t('common.operation'),
      width: 180,
    },
  ];
}
