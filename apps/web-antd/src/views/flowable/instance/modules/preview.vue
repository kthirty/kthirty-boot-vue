<script lang="ts" setup>
import type { FlwInstanceApi } from '../api';

import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { TabPane, Tabs } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';

import { getHisDiagram, getHisTaskList } from '../api';
import { useHisTaskColumns } from '../data';

const previewData = ref<FlwInstanceApi.Instance>({});
const previewLoading = ref(false);

function onActionClick() {}

const [Grid] = useVbenVxeGrid({
  gridOptions: {
    border: 'none',
    columns: useHisTaskColumns(onActionClick),
    height: 'auto',
    keepSource: false,
    stripe: false,
    pagerConfig: {
      enabled: false,
    },
    proxyConfig: {
      ajax: {
        query: async () => {
          return await getHisTaskList(previewData.value.id!);
        },
      },
    },
  } as VxeTableGridOptions,
});

const [Modal, modalApi] = useVbenModal({
  async onOpenChange(isOpen) {
    if (isOpen) {
      const data = modalApi.getData<any>();
      previewData.value = data ? { ...data } : {};
      if (previewData.value.id) {
        previewLoading.value = true;
        previewData.value.thumbnail = await getHisDiagram(previewData.value.id);
        previewLoading.value = false;
        console.warn(previewData.value);
      }
    }
  },
});
</script>

<template>
  <Modal
    title="模型预览"
    :confirm-loading="previewLoading"
    :show-cancel-button="false"
    :show-confirm-button="false"
  >
    <Tabs v-if="!previewLoading" default-active-key="history">
      <TabPane key="history" tab="历史流转">
        <Grid />
      </TabPane>
      <TabPane key="diagram" tab="流程图">
        <div style="text-align: center">
          <img
            v-if="previewData.thumbnail"
            :src="`${previewData.thumbnail}`"
            style="max-width: 100%; max-height: 90vh"
          />
          <div v-else>暂无缩略图</div>
        </div>
      </TabPane>
    </Tabs>
    <div v-else style="text-align: center">加载中...</div>
  </Modal>
</template>
