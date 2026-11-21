<script lang="ts" setup>
import type { UReportApi } from './api';

import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { Page, useVbenModal } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { Button, message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { $t } from '#/locales';

import { getReportList, removeReport } from './api';
import { useColumns, useSearchSchema } from './data';
import Designer from './modules/designer.vue';

const [DesignerModal, designerModalApi] = useVbenModal({
  connectedComponent: Designer,
  destroyOnClose: true,
});

function onCreate() {
  designerModalApi.setData({ mode: 'design' }).open();
}

function onEdit(row: UReportApi.ReportFile) {
  designerModalApi.setData({ mode: 'design', name: row.name }).open();
}

function onPreview(row: UReportApi.ReportFile) {
  designerModalApi.setData({ mode: 'preview', name: row.name }).open();
}

function onDelete(row: UReportApi.ReportFile) {
  if (!row.name) return;
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting', [row.name]),
    duration: 0,
    key: 'ureport_action',
  });
  removeReport(row.name)
    .then(() => {
      message.success({
        content: $t('ui.actionMessage.deleteSuccess', [row.name]),
        key: 'ureport_action',
      });
      refreshGrid();
    })
    .catch(() => {
      hideLoading();
    });
}

function onActionClick({
  code,
  row,
}: {
  code: string;
  row: UReportApi.ReportFile;
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
          const list = (await getReportList()) || [];
          const keyword = String(formValues?.name || '')
            .trim()
            .toLowerCase();
          const filtered = keyword
            ? list.filter((item) =>
                item.name?.toLowerCase().includes(keyword),
              )
            : list;
          const start = (page.currentPage - 1) * page.pageSize;
          return {
            records: filtered.slice(start, start + page.pageSize),
            totalRow: filtered.length,
          };
        },
      },
    },
    rowConfig: {
      keyField: 'name',
    },
    toolbarConfig: {
      custom: true,
      export: false,
      refresh: { code: 'query' },
      zoom: true,
    },
  } as VxeTableGridOptions<UReportApi.ReportFile>,
});

function refreshGrid() {
  gridApi.query();
}
</script>

<template>
  <Page auto-content-height>
    <DesignerModal @success="refreshGrid" />
    <Grid :table-title="$t('ureport.title')">
      <template #toolbar-tools>
        <Button type="primary" @click="onCreate">
          <Plus class="size-5" />
          {{ $t('ureport.create') }}
        </Button>
      </template>
    </Grid>
  </Page>
</template>
