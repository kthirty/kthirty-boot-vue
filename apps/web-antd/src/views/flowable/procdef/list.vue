<script lang="ts" setup>
import type { FlwProcdefApi } from './api';

import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { Page, useVbenModal } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { $t } from '#/locales';

import { activateProcdef, getProcdefList, suspendProcdef } from './api';
import { useColumns, useSearchSchema } from './data';
import Preview from './modules/preview.vue';

const [PreviewModal, previewModalApi] = useVbenModal({
  connectedComponent: Preview,
  destroyOnClose: true,
  fullscreen: true,
});

function onPreview(row: FlwProcdefApi.Procdef) {
  previewModalApi.setData(row).open();
}

function onSuspend(row: FlwProcdefApi.Procdef) {
  const hideLoading = message.loading({
    content: $t('flowable.procdef.action.suspending', [row.name]),
    duration: 0,
    key: 'action_process_msg',
  });
  suspendProcdef(row.id!)
    .then(() => {
      message.success({
        content: $t('flowable.procdef.action.suspendSuccess', [row.name]),
        key: 'action_process_msg',
      });
      refreshGrid();
    })
    .catch(() => {
      hideLoading();
    });
}

function onActivate(row: FlwProcdefApi.Procdef) {
  const hideLoading = message.loading({
    content: $t('flowable.procdef.action.activating', [row.name]),
    duration: 0,
    key: 'action_process_msg',
  });
  activateProcdef(row.id!)
    .then(() => {
      message.success({
        content: $t('flowable.procdef.action.activateSuccess', [row.name]),
        key: 'action_process_msg',
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
  row: FlwProcdefApi.Procdef;
}) {
  switch (code) {
    case 'activate': {
      onActivate(row);
      break;
    }
    case 'preview': {
      onPreview(row);
      break;
    }
    case 'suspend': {
      onSuspend(row);
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
          return await getProcdefList({
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
    <PreviewModal />
    <Grid :table-title="$t('flowable.procdef.title')" />
  </Page>
</template>
