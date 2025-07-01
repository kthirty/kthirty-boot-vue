<script lang="ts" setup>
import type { FlwModelApi } from '../api';

import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { getModel } from '../api';

const previewData = ref<FlwModelApi.Model>({});
const previewLoading = ref(false);

const [Modal, modalApi] = useVbenModal({
  async onOpenChange(isOpen) {
    if (isOpen) {
      const data = modalApi.getData<any>();
      previewData.value = data ? { ...data } : {};
      if (previewData.value.id) {
        previewLoading.value = true;
        const res = await getModel(previewData.value.id, true, true);
        previewData.value = res;
        previewLoading.value = false;
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
    <div style="text-align: center" v-if="!previewLoading">
      <img
        v-if="previewData.thumbnail"
        :src="`${previewData.thumbnail}`"
        style="max-width: 100%; max-height: 90vh"
      />
      <div v-else>暂无缩略图</div>
    </div>
  </Modal>
</template>
