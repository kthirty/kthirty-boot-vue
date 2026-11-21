<script lang="ts" setup>
import type { OosFileApi } from '#/api/core/file';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { Page } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';
import { downloadFileFromBlob } from '@vben/utils';

import { Button, message, Upload } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  downloadOosFileApi,
  getOosFilePage,
  removeOosFileApi,
  uploadFileApi,
} from '#/api/core/file';
import { $t } from '#/locales';

import { useColumns, useSearchSchema } from './data';

function onActionClick({
  code,
  row,
}: {
  code: string;
  row: OosFileApi.OosFile;
}) {
  switch (code) {
    case 'delete': {
      onDelete(row);
      break;
    }
    case 'download': {
      onDownload(row);
      break;
    }
  }
}

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: useSearchSchema(),
    showCollapseButton: false,
    submitOnEnter: true,
  },
  gridOptions: {
    columns: useColumns(onActionClick),
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          return await getOosFilePage({
            pageNumber: page.currentPage,
            pageSize: page.pageSize,
            ...formValues,
          });
        },
      },
    },
    rowConfig: {
      keyField: 'id',
    },
    toolbarConfig: {
      custom: true,
      export: false,
      refresh: { code: 'query' },
      zoom: true,
    },
  } as VxeTableGridOptions<OosFileApi.OosFile>,
});

function refreshGrid() {
  gridApi.query();
}

async function onUpload(options: {
  file: Blob | File | string;
  onError?: (error: Error) => void;
  onSuccess?: (body: any) => void;
}) {
  const file = options.file as File;
  try {
    const result = await uploadFileApi(file);
    options.onSuccess?.(result);
    message.success($t('ui.actionMessage.operationSuccess'));
    refreshGrid();
  } catch (error) {
    options.onError?.(error as Error);
  }
}

async function onDownload(row: OosFileApi.OosFile) {
  if (!row.id) return;
  const blob = await downloadOosFileApi(row.id);
  downloadFileFromBlob({
    fileName: row.originalFileName || row.id,
    source: blob,
  });
}

function onDelete(row: OosFileApi.OosFile) {
  if (!row.id) return;
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting', [row.originalFileName]),
    duration: 0,
    key: 'oos_file_action',
  });
  removeOosFileApi(row.id)
    .then(() => {
      message.success({
        content: $t('ui.actionMessage.deleteSuccess', [row.originalFileName]),
        key: 'oos_file_action',
      });
      refreshGrid();
    })
    .catch(() => {
      hideLoading();
    });
}
</script>

<template>
  <Page auto-content-height>
    <Grid :table-title="$t('oos.file.title')">
      <template #toolbar-tools>
        <Upload :custom-request="onUpload" :show-upload-list="false" multiple>
          <Button type="primary">
            <IconifyIcon class="size-5" icon="lucide:upload" />
            {{ $t('oos.file.upload') }}
          </Button>
        </Upload>
      </template>
    </Grid>
  </Page>
</template>
