import type { OosFileApi } from '#/api/core/file';

import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';

import { $t } from '#/locales';

export function storageTypeOptions() {
  return [
    { color: 'blue', label: $t('oos.file.storage.local'), value: 'local' },
    { color: 'green', label: $t('oos.file.storage.minio'), value: 'minio' },
    {
      color: 'purple',
      label: $t('oos.file.storage.seaweedfs'),
      value: 'seaweedfs',
    },
  ];
}

function formatFileSize(size?: number) {
  if (size === undefined || size === null || Number.isNaN(size)) {
    return '';
  }
  if (size < 1024) {
    return `${size} B`;
  }
  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }
  if (size < 1024 * 1024 * 1024) {
    return `${(size / 1024 / 1024).toFixed(1)} MB`;
  }
  return `${(size / 1024 / 1024 / 1024).toFixed(1)} GB`;
}

export function useSearchSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'originalFileName',
      label: $t('oos.file.originalFileName'),
    },
    {
      component: 'Input',
      fieldName: 'fileExt',
      label: $t('oos.file.fileExt'),
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: storageTypeOptions(),
      },
      fieldName: 'storageType',
      label: $t('oos.file.storageType'),
    },
  ];
}

export function useColumns(
  onActionClick: OnActionClickFn<OosFileApi.OosFile>,
): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'originalFileName',
      minWidth: 200,
      title: $t('oos.file.originalFileName'),
    },
    {
      field: 'fileExt',
      title: $t('oos.file.fileExt'),
      width: 90,
    },
    {
      field: 'fileSize',
      formatter: ({ cellValue }) => formatFileSize(cellValue),
      title: $t('oos.file.fileSize'),
      width: 110,
    },
    {
      field: 'contentType',
      minWidth: 160,
      title: $t('oos.file.contentType'),
    },
    {
      cellRender: {
        name: 'CellTag',
        options: storageTypeOptions(),
      },
      field: 'storageType',
      title: $t('oos.file.storageType'),
      width: 120,
    },
    {
      field: 'bucket',
      minWidth: 120,
      title: $t('oos.file.bucket'),
    },
    {
      field: 'createDate',
      title: $t('oos.file.createDate'),
      width: 170,
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'originalFileName',
          nameTitle: $t('oos.file.title'),
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          {
            code: 'download',
            text: $t('oos.file.download'),
          },
          'delete',
        ],
      },
      field: 'operation',
      fixed: 'right',
      title: $t('common.operation'),
      width: 140,
    },
  ];
}
