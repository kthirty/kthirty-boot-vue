<script lang="ts" setup>
import type { FlwTaskApi } from './api';

import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { ref } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { Button, message, Tabs } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { $t } from '#/locales';

import {
  activateTask,
  claimTask,
  getDoneTaskList,
  getTodoTaskList,
  suspendTask,
  unclaimTask,
} from './api';
import { useDoneColumns, useSearchSchema, useTodoColumns } from './data';
import Complete from './modules/complete.vue';
import Start from './modules/start.vue';

/** 表格固定高度，避免 height:auto 在 Tabs 内与分页器触发高度重算 */
const GRID_HEIGHT = 600;

const activeTab = ref('todo');

const [StartModal, startModalApi] = useVbenModal({
  connectedComponent: Start,
  destroyOnClose: true,
});

const [CompleteModal, completeModalApi] = useVbenModal({
  connectedComponent: Complete,
  destroyOnClose: true,
});

function onStart() {
  startModalApi.open();
}

function onHandle(row: FlwTaskApi.Task) {
  completeModalApi.setData(row).open();
}

function onClaim(row: FlwTaskApi.Task) {
  const hideLoading = message.loading({
    content: $t('flowable.task.action.claiming', [row.name]),
    duration: 0,
    key: 'action_process_msg',
  });
  claimTask(row.id!)
    .then(() => {
      message.success({
        content: $t('flowable.task.action.claimSuccess', [row.name]),
        key: 'action_process_msg',
      });
      refreshTodoGrid();
    })
    .catch(() => {
      hideLoading();
    });
}

function onUnclaim(row: FlwTaskApi.Task) {
  const hideLoading = message.loading({
    content: $t('flowable.task.action.unclaiming', [row.name]),
    duration: 0,
    key: 'action_process_msg',
  });
  unclaimTask(row.id!)
    .then(() => {
      message.success({
        content: $t('flowable.task.action.unclaimSuccess', [row.name]),
        key: 'action_process_msg',
      });
      refreshTodoGrid();
    })
    .catch(() => {
      hideLoading();
    });
}

function onActivate(row: FlwTaskApi.Task) {
  const hideLoading = message.loading({
    content: $t('flowable.task.action.activating', [row.name]),
    duration: 0,
    key: 'action_process_msg',
  });
  activateTask(row.id!)
    .then(() => {
      message.success({
        content: $t('flowable.task.action.activateSuccess', [row.name]),
        key: 'action_process_msg',
      });
      refreshTodoGrid();
    })
    .catch(() => {
      hideLoading();
    });
}

function onSuspend(row: FlwTaskApi.Task) {
  const hideLoading = message.loading({
    content: $t('flowable.task.action.suspending', [row.name]),
    duration: 0,
    key: 'action_process_msg',
  });
  suspendTask(row.id!)
    .then(() => {
      message.success({
        content: $t('flowable.task.action.suspendSuccess', [row.name]),
        key: 'action_process_msg',
      });
      refreshTodoGrid();
    })
    .catch(() => {
      hideLoading();
    });
}

function onTodoActionClick({
  code,
  row,
}: {
  code: string;
  row: FlwTaskApi.Task;
}) {
  switch (code) {
    case 'activate': {
      onActivate(row);
      break;
    }
    case 'claim': {
      onClaim(row);
      break;
    }
    case 'handle': {
      onHandle(row);
      break;
    }
    case 'suspend': {
      onSuspend(row);
      break;
    }
    case 'unclaim': {
      onUnclaim(row);
      break;
    }
  }
}

function createGridOptions(
  columns: VxeTableGridOptions['columns'],
  queryFn: typeof getTodoTaskList,
): VxeTableGridOptions {
  return {
    columns,
    height: GRID_HEIGHT,
    keepSource: true,
    pagerConfig: {
      enabled: true,
    },
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          return await queryFn({
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
  };
}

const [TodoGrid, todoGridApi] = useVbenVxeGrid({
  formOptions: {
    showCollapseButton: false,
    schema: useSearchSchema(),
    submitOnEnter: true,
  },
  gridOptions: createGridOptions(
    useTodoColumns(onTodoActionClick),
    getTodoTaskList,
  ),
});

const [DoneGrid, doneGridApi] = useVbenVxeGrid({
  formOptions: {
    showCollapseButton: false,
    schema: useSearchSchema(),
    submitOnEnter: true,
  },
  gridOptions: createGridOptions(useDoneColumns(), getDoneTaskList),
});

async function refreshTodoGrid() {
  await todoGridApi.query();
}

async function refreshDoneGrid() {
  await doneGridApi.query();
}

function onTabChange(key: string | number) {
  activeTab.value = String(key);
  if (key === 'todo') {
    refreshTodoGrid();
  } else {
    refreshDoneGrid();
  }
}
</script>
<template>
  <Page auto-content-height >
    <StartModal @success="refreshTodoGrid" />
    <CompleteModal @success="refreshTodoGrid" />
    <Tabs
      v-model:active-key="activeTab"
      destroy-inactive-tab-pane
      @change="onTabChange"
    >
      <Tabs.TabPane key="todo" :tab="$t('flowable.task.todoTitle')">
        <TodoGrid :table-title="$t('flowable.task.todoTitle')">
          <template #toolbar-tools>
            <Button type="primary" @click="onStart">
              <Plus class="size-5" />
              {{ $t('flowable.task.startTitle') }}
            </Button>
          </template>
        </TodoGrid>
      </Tabs.TabPane>
      <Tabs.TabPane key="done" :tab="$t('flowable.task.doneTitle')">
        <DoneGrid :table-title="$t('flowable.task.doneTitle')" />
      </Tabs.TabPane>
    </Tabs>
  </Page>
</template>
