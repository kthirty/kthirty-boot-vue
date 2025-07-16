<script lang="ts" setup>
import type { DevFormApi } from './api';

import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { Page, useVbenModal } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { Button, message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { $t } from '#/locales';

import { getFormList } from './api';
import { useFormColumns } from './data';
import Form from './modules/form.vue';

const [EditModalComp, editModalApi] = useVbenModal({
  destroyOnClose: true,
  fullscreen: true,
  connectedComponent: Form,
});

function onEdit(row: DevFormApi.Form) {
  editModalApi.setData(row).open();
}

function onActionClick({ code, row }: { code: string; row: DevFormApi.Form }) {
  switch (code) {
    case 'delete': {
      handleDelete(row);
      break;
    }
    case 'edit': {
      onEdit(row);
      break;
    }
  }
}

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    showCollapseButton: false,
    submitOnEnter: true,
  },
  gridOptions: {
    columns: useFormColumns(onActionClick),
    height: 'auto',
    keepSource: true,
    pagerConfig: { enabled: true },
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          return await getFormList({
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

async function handleDelete(row: DevFormApi.Form) {
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting', [row.tableName]),
    duration: 0,
    key: 'action_process_msg',
  });
  try {
    await import('./api').then((m) => m.removeForm(row.id!));
    message.success({
      content: $t('ui.actionMessage.deleteSuccess', [row.tableName]),
      key: 'action_process_msg',
    });
    refreshGrid();
  } finally {
    hideLoading();
  }
}

async function refreshGrid() {
  await gridApi.query();
}
</script>
<template>
  <Page auto-content-height>
    <EditModalComp @refresh="refreshGrid" />
    <Grid :table-title="$t('develop.form.title')">
      <template #toolbar-tools>
        <Button type="primary" @click="onEdit({})">
          <Plus class="size-5" />
          {{ $t('ui.actionTitle.create', [$t('develop.form.title')]) }}
        </Button>
      </template>
    </Grid>
  </Page>
</template>
