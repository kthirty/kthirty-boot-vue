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
  getHisTaskList,
  getInstanceList,
  suspendInstance,
} from './api';
import { useColumns, useSearchSchema } from './data';

const [HisTaskModal, hisTaskModalApi] = useVbenModal({
  destroyOnClose: true,
  fullscreen: true,
});
const [HisDiagramModal, hisDiagramModalApi] = useVbenModal({
  destroyOnClose: true,
  fullscreen: true,
});

const deleteReason = ref('');
const showDeleteModal = ref(false);
const deleteRow = ref<FlwInstanceApi.Instance | null>(null);

function onHisTask(row: FlwInstanceApi.Instance) {
  getHisTaskList(row.id!).then((res) => {
    hisTaskModalApi.setData(res).open();
  });
}
function onHisDiagram(row: FlwInstanceApi.Instance) {
  getHisDiagram(row.id!).then((res) => {
    hisDiagramModalApi.setData({ base64: res }).open();
  });
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
    case 'hisDiagram': {
      onHisDiagram(row);
      break;
    }
    case 'hisTask': {
      onHisTask(row);
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
    <HisTaskModal />
    <HisDiagramModal v-slot="{ data }">
      <div v-if="data && data.base64">
        <img
          :src="`data:image/png;base64,${data.base64}`"
          style="max-width: 100%; max-height: 80vh"
        />
      </div>
    </HisDiagramModal>
    <Grid :table-title="$t('flowable.instance.title')" />
    <Modal
      v-model:open="showDeleteModal"
      title="$t('flowable.instance.button.delete')"
      @ok="handleDeleteConfirm"
      @cancel="() => (showDeleteModal.value = false)"
    >
      <Input.TextArea
        v-model:value="deleteReason"
        :placeholder="$t('flowable.instance.button.deleteConfirmTitle')"
        rows="3"
      />
    </Modal>
  </Page>
</template>
