<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { ref } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';

import { TabPane, Tabs } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';

import { getDoneList, getTodoList } from './api';
import {
  useTaskColumns,
  useTaskSearchSchema,
  useTodoTaskColumns,
} from './data';
import Handle from './handle.vue';

const [HandleModal, handleModalApi] = useVbenModal({
  connectedComponent: Handle,
  destroyOnClose: true,
  fullscreen: true,
  showCancelButton: false,
  showConfirmButton: false,
});

function onActionClick({ code, row }: { code: string; row: any }) {
  if (code === 'handle') {
    handleModalApi.setData(row).open();
  }
}
const doneGrid = ref();
const [TodoGrid, todoGridApi] = useVbenVxeGrid({
  formOptions: {
    showCollapseButton: false,
    schema: useTaskSearchSchema(),
    submitOnEnter: true,
  },
  gridOptions: {
    height: 'auto',
    columns: useTodoTaskColumns(onActionClick),
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
  } as VxeTableGridOptions,
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
  } as VxeTableGridOptions,
});
async function refreshTodo() {
  await todoGridApi.query();
}
async function refreshDone() {
  if (doneGrid.value) {
    await doneGridApi.query();
  }
}
async function onHandleSuccess() {
  await refreshTodo();
  await refreshDone();
}
</script>
<template>
  <Page auto-content-height>
    <div class="flex h-full flex-col">
      <Tabs default-active-key="todo" class="flex-1">
        <TabPane :tab="$t('flowable.task.tab.todo')" key="todo">
          <TodoGrid />
        </TabPane>
        <TabPane :tab="$t('flowable.task.tab.done')" key="done">
          <DoneGrid ref="doneGrid" />
        </TabPane>
      </Tabs>
      <HandleModal @success="onHandleSuccess" />
    </div>
  </Page>
</template>
