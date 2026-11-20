<script lang="ts" setup>
import type { DevReportApi } from './api';

import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { useRouter } from 'vue-router';

import { Page, useVbenModal } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { Button, message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { $t } from '#/locales';

import { getDevReportPage, removeReport } from './api';
import { useColumns, useSearchSchema } from './data';
import Form from './modules/form.vue';

const router = useRouter();

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: Form,
  destroyOnClose: true,
  fullscreen: true,
});

function onCreate() {
  formModalApi.setData({}).open();
}

function onEdit(row: DevReportApi.DevReport) {
  formModalApi.setData(row).open();
}

function onPreview(row: DevReportApi.DevReport) {
  const { code } = row;
  if (!code) {
    message.warning($t('develop.report.codeRequired'));
    return;
  }
  router.push({ path: '/dev/report/preview', query: { code } });
}

function onDelete(row: DevReportApi.DevReport) {
  const { id } = row;
  if (!id) return;
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting', [row.name]),
    duration: 0,
    key: 'report_action_msg',
  });
  removeReport(id)
    .then(() => {
      message.success({
        content: $t('ui.actionMessage.deleteSuccess', [row.name]),
        key: 'report_action_msg',
      });
      refreshGrid();
    })
    .finally(() => hideLoading());
}

function onActionClick({
  code,
  row,
}: {
  code: string;
  row: DevReportApi.DevReport;
}) {
  switch (code) {
    case 'delete': {
      onDelete(row);
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
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          return await getDevReportPage({
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

async function refreshGrid() {
  await gridApi.query();
}
</script>

<template>
  <Page auto-content-height>
    <FormModal @success="refreshGrid" />
    <Grid :table-title="$t('develop.report.title')">
      <template #toolbar-tools>
        <Button type="primary" @click="onCreate">
          <Plus class="size-5" />
          {{ $t('ui.actionTitle.create', [$t('develop.report.title')]) }}
        </Button>
      </template>
    </Grid>
  </Page>
</template>
