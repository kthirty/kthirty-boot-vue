<script lang="ts" setup>
import { ref } from 'vue';

import { Page } from '@vben/common-ui';

import { TabPane, Tabs } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';

import { getDoneList, getTodoList } from './api';
import { useTaskColumns, useTaskSearchSchema } from './data';
import HandleModal from './handle.vue';

const activeTab = ref<'done' | 'todo'>('todo');
const handleOpen = ref(false);
const handleTaskId = ref<string | undefined>(undefined);

function onActionClick({ code, row }: { code: string; row: any }) {
  if (code === 'handle') {
    handleTaskId.value = row.id;
    handleOpen.value = true;
  }
}

const [TodoGrid, todoGridApi] = useVbenVxeGrid({
  formOptions: {
    showCollapseButton: false,
    schema: useTaskSearchSchema(),
    submitOnEnter: true,
  },
  gridOptions: {
    height: 'auto',
    columns: useTaskColumns(onActionClick),
    keepSource: true,
    pagerConfig: { enabled: true },
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          return await getTodoList({
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
  },
});
const [DoneGrid, doneGridApi] = useVbenVxeGrid({
  formOptions: {
    showCollapseButton: false,
    schema: useTaskSearchSchema(),
    submitOnEnter: true,
  },
  gridOptions: {
    height: 'auto',
    columns: useTaskColumns(() => {}),
    keepSource: true,
    pagerConfig: { enabled: true },
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          return await getDoneList({
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
  },
});
function refreshTodo() {
  todoGridApi.query();
}
function refreshDone() {
  doneGridApi.query();
}
function onHandleSuccess() {
  handleOpen.value = false;
  refreshTodo();
  refreshDone();
}
</script>
<template>
  <Page auto-content-height>
    <div class="flex h-full flex-col">
      <Tabs v-model:active-key="activeTab" class="flex-1">
        <TabPane :tab="$t('flowable.task.tab.todo')" key="todo">
          <TodoGrid :table-title="$t('flowable.task.tab.todo')" />
        </TabPane>
        <TabPane :tab="$t('flowable.task.tab.done')" key="done">
          <DoneGrid :table-title="$t('flowable.task.tab.done')" />
        </TabPane>
      </Tabs>
      <HandleModal
        v-model:open="handleOpen"
        :task-id="handleTaskId"
        @success="onHandleSuccess"
      />
    </div>
  </Page>
</template>
