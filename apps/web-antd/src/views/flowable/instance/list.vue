<script lang="ts" setup>
import type { FlwInstanceApi } from './api';

import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { ref } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';

import { Input, message, Modal } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { $t } from '#/locales';

import {
  activateInstance,
  deleteInstance,
  getInstanceList,
  suspendInstance,
} from './api';
import { useColumns, useSearchSchema } from './data';
import History from './modules/history.vue';

const [HistoryModal, historyModalApi] = useVbenModal({
  destroyOnClose: true,
  fullscreen: true,
  connectedComponent: History,
});

const deleteReason = ref('');
const showDeleteModal = ref<boolean>(false);
const deleteRow = ref<FlwInstanceApi.Instance | null>(null);

function onHistory(row: FlwInstanceApi.Instance) {
  historyModalApi.setData(row).open();
}

function onSuspend(row: FlwInstanceApi.Instance) {
  const hideLoading = message.loading({
    content: $t('flowable.instance.action.suspending', [row.name]),
    duration: 0,
    key: 'action_process_msg',
  });
  suspendInstance(row.id!)
    .then(() => {
      message.success({
        content: $t('flowable.instance.action.suspendSuccess', [row.name]),
        key: 'action_process_msg',
      });
      refreshGrid();
    })
    .catch(() => {
      hideLoading();
    });
}
function onActivate(row: FlwInstanceApi.Instance) {
  const hideLoading = message.loading({
    content: $t('flowable.instance.action.activating', [row.name]),
    duration: 0,
    key: 'action_process_msg',
  });
  activateInstance(row.id!)
    .then(() => {
      message.success({
        content: $t('flowable.instance.action.activateSuccess', [row.name]),
        key: 'action_process_msg',
      });
      refreshGrid();
    })
    .catch(() => {
      hideLoading();
    });
}
function onDelete(row: FlwInstanceApi.Instance) {
  deleteRow.value = row;
  deleteReason.value = '';
  showDeleteModal.value = true;
}
async function handleDeleteConfirm() {
  if (!deleteRow.value) return;
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting', [deleteRow.value.name]),
    duration: 0,
    key: 'action_process_msg',
  });
  try {
    await deleteInstance(deleteRow.value.id!, deleteReason.value);
    message.success({
      content: $t('ui.actionMessage.deleteSuccess', [deleteRow.value.name]),
      key: 'action_process_msg',
    });
    refreshGrid();
  } finally {
    hideLoading();
    showDeleteModal.value = false;
    deleteRow.value = null;
  }
}
function onActionClick({
  code,
  row,
}: {
  code: string;
  row: FlwInstanceApi.Instance;
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
    case 'history': {
      onHistory(row);
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
          return await getInstanceList({
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
    <HistoryModal />
    <Grid :table-title="$t('flowable.instance.title')" />
    <Modal
      v-model:open="showDeleteModal"
      :title="$t('flowable.instance.button.delete')"
      @ok="handleDeleteConfirm"
      @cancel="() => (showDeleteModal = false)"
    >
      <Input.TextArea
        v-model:value="deleteReason"
        :placeholder="$t('flowable.instance.button.deleteConfirmTitle')"
      />
    </Modal>
  </Page>
</template>
