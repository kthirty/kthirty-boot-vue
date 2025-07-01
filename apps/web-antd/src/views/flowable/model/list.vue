<script lang="ts" setup>
import type { FlwModelApi } from './api';

import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { Page, useVbenModal } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { Button, message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { $t } from '#/locales';

import { deleteModel, getModelList } from './api';
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
// function onDeploy(_row: FlwModelApi.Model) {
// }

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
      // onDeploy(row);
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
      </template>
    </Grid>
  </Page>
</template>
