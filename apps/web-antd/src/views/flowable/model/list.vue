<script lang="ts" setup>
import type { FlwModelApi } from './api';

import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { Page, useVbenModal } from '@vben/common-ui';
import { Plus } from '@vben/icons';
import { downloadFileFromBlob } from '@vben/utils';

import { Button, message, Upload } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { $t } from '#/locales';

import {
  deleteModel,
  deployModel,
  exportZip,
  getModelList,
  importModel,
} from './api';
import { useColumns, useSearchSchema } from './data';
import Form from './modules/form.vue';
import Preview from './modules/preview.vue';

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: Form,
  destroyOnClose: true,
  fullscreen: true,
});

const [PreviewModal, previewModalApi] = useVbenModal({
  connectedComponent: Preview,
  destroyOnClose: true,
  fullscreen: true,
});

/**
 * 编辑模型
 * @param row
 */
function onEdit(row: any) {
  formModalApi.setData(row).open();
}

/**
 * 创建新模型
 */
function onCreate() {
  formModalApi.setData(null).open();
}
function onPreview(row: any) {
  previewModalApi.setData(row).open();
}
function onDeploy(row: FlwModelApi.Model) {
  const hideLoading = message.loading({
    content: $t('flowable.model.action.deploying', [row.name]),
    duration: 0,
    key: 'action_process_msg',
  });
  deployModel(row.id!)
    .then(() => {
      message.success({
        content: $t('flowable.model.action.deploySuccess', [row.name]),
        key: 'action_process_msg',
      });
      refreshGrid();
    })
    .catch(() => {
      hideLoading();
    });
}

/**
 * 删除模型
 * @param row
 */
function onDelete(row: any) {
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting', [row.name]),
    duration: 0,
    key: 'action_process_msg',
  });
  deleteModel(row.id)
    .then(() => {
      message.success({
        content: $t('ui.actionMessage.deleteSuccess', [row.name]),
        key: 'action_process_msg',
      });
      refreshGrid();
    })
    .catch(() => {
      hideLoading();
    });
}

/**
 * 表格操作按钮的回调函数
 */
function onActionClick({
  code,
  row,
}: {
  code: string;
  row: FlwModelApi.Model;
}) {
  switch (code) {
    case 'delete': {
      onDelete(row);
      break;
    }
    case 'deploy': {
      onDeploy(row);
      break;
    }
    case 'edit': {
      onEdit(row);
      break;
    }
    case 'preview': {
      onPreview(row);
      break;
    }
  }
}

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    showCollapseButton: false,
    schema: useSearchSchema(),
    submitOnEnter: true,
  },
  gridOptions: {
    columns: useColumns(onActionClick),
    height: 'auto',
    keepSource: true,
    pagerConfig: {
      enabled: true,
    },
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          return await getModelList({
            pageNumber: page.currentPage,
            pageSize: page.pageSize,
            ...formValues,
          });
        },
      },
    },
    toolbarConfig: {
      custom: true,
      export: false,
      refresh: { code: 'query' },
      zoom: true,
    },
  } as VxeTableGridOptions,
});

/**
 * 刷新表格
 */
async function refreshGrid() {
  await gridApi.query();
}

/**
 * 导出选中数据
 */
function onExportSelected() {
  const checkedModelIds = gridApi.grid
    ?.getCheckboxRecords(true)
    .map((it) => it.id)
    .join(',');
  if (!checkedModelIds) {
    message.warning($t('flowable.model.export.noSelect'));
    return;
  }
  exportZip(checkedModelIds).then((res) => {
    downloadFileFromBlob({
      fileName: 'model.zip',
      source: res,
    });
  });
}

/**
 * 导入数据
 */
function onImportChange(info: any) {
  // 获取上传的文件对象
  const { file } = info;
  if (!file) {
    message.warning($t('flowable.model.import.noSelect'));
    return;
  }

  // 构造 FormData，将文件作为参数传递
  const formData = new FormData();
  formData.append('file', file);

  importModel(formData)
    .then(() => {
      message.success($t('flowable.model.import.success'));
      refreshGrid();
    })
    .catch(() => {
      message.error($t('flowable.model.import.fail'));
    });
}
</script>
<template>
  <Page auto-content-height>
    <FormModal @success="refreshGrid" />
    <PreviewModal />
    <Grid :table-title="$t('flowable.model.title')">
      <template #toolbar-tools>
        <Button type="primary" @click="onCreate">
          <Plus class="size-5" />
          {{ $t('ui.actionTitle.create', [$t('flowable.model.title')]) }}
        </Button>
        <Upload
          :show-upload-list="false"
          :before-upload="() => false"
          @change="onImportChange"
          accept=".zip"
        >
          <Button class="ml-2" type="default">
            {{ $t('flowable.model.button.import') }}
          </Button>
        </Upload>
        <Button class="ml-2" type="default" @click="onExportSelected">
          {{ $t('flowable.model.button.export') }}
        </Button>
      </template>
    </Grid>
  </Page>
</template>
