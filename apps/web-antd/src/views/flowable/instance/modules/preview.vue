<script lang="ts" setup>
import type { FlwInstanceApi } from '../api';

import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { getHisDiagram } from '../api';

const previewData = ref<FlwInstanceApi.Instance>({});
const diagram = ref('');
const previewLoading = ref(false);

const [Modal, modalApi] = useVbenModal({
  async onOpenChange(isOpen) {
    if (isOpen) {
      const data = modalApi.getData<any>();
      previewData.value = data ? { ...data } : {};
      diagram.value = '';
      if (previewData.value.id) {
        previewLoading.value = true;
        diagram.value = await getHisDiagram(previewData.value.id);
        previewLoading.value = false;
      }
    }
  },
});
</script>

<template>
  <Modal
    title="流程图预览"
    :confirm-loading="previewLoading"
    :show-cancel-button="false"
    :show-confirm-button="false"
  >
    <div style="text-align: center" v-if="!previewLoading">
      <img
        v-if="diagram"
        :src="`${diagram}`"
        style="max-width: 100%; max-height: 90vh"
      />
      <div v-else>暂无流程图</div>
    </div>
  </Modal>
</template>
