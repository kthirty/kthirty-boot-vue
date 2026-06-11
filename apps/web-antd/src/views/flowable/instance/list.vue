<script lang="ts" setup>
import type { FlwProcInstApi } from './api';

import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { Page, useVbenModal } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { $t } from '#/locales';

import {
  activateProcInst,
  deleteProcInst,
  getProcInstList,
  suspendProcInst,
  upgradeProcInst,
} from './api';
import { useColumns, useSearchSchema } from './data';
import Preview from './modules/preview.vue';

const [PreviewModal, previewModalApi] = useVbenModal({
  connectedComponent: Preview,
  destroyOnClose: true,
  fullscreen: true,
});

function onPreview(row: FlwProcInstApi.ProcInst) {
  previewModalApi.setData(row).open();
}

function onActivate(row: FlwProcInstApi.ProcInst) {
  const hideLoading = message.loading({
    content: $t('flowable.procinst.action.activating', [row.name]),
    duration: 0,
    key: 'action_process_msg',
  });
  activateProcInst(row.id!)
    .then(() => {
      message.success({
        content: $t('flowable.procinst.action.activateSuccess', [row.name]),
        key: 'action_process_msg',
      });
      refreshGrid();
    })
    .catch(() => {
      hideLoading();
    });
}

function onSuspend(row: FlwProcInstApi.ProcInst) {
  const hideLoading = message.loading({
    content: $t('flowable.procinst.action.suspending', [row.name]),
    duration: 0,
    key: 'action_process_msg',
  });
  suspendProcInst(row.id!)
    .then(() => {
      message.success({
        content: $t('flowable.procinst.action.suspendSuccess', [row.name]),
        key: 'action_process_msg',
      });
      refreshGrid();
    })
    .catch(() => {
      hideLoading();
    });
}

function onUpgrade(row: FlwProcInstApi.ProcInst) {
  const hideLoading = message.loading({
    content: $t('flowable.procinst.action.upgrading', [row.name]),
    duration: 0,
    key: 'action_process_msg',
  });
  upgradeProcInst(row.id!)
    .then(() => {
      message.success({
        content: $t('flowable.procinst.action.upgradeSuccess', [row.name]),
        key: 'action_process_msg',
      });
      refreshGrid();
    })
    .catch(() => {
      hideLoading();
    });
}

function onDelete(row: FlwProcInstApi.ProcInst) {
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting', [row.name]),
    duration: 0,
    key: 'action_process_msg',
  });
  deleteProcInst(row.id!)
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

function onActionClick({
  code,
  row,
}: {
  code: string;
  row: FlwProcInstApi.ProcInst;
}) {
  switch (code) {
    case 'activate': {
      onActivate(row);
      break;
    }
    case 'delete': {
      onDelete(row);
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
    case 'upgrade': {
      onUpgrade(row);
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
          return await getProcInstList({
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
    <Grid :table-title="$t('flowable.procinst.title')" />
  </Page>
</template>
