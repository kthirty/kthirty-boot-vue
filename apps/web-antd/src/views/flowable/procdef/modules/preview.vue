<script lang="ts" setup>
import type { FlwProcdefApi } from '../api';

import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { Image, Spin, TabPane, Tabs, Textarea } from 'ant-design-vue';

import { getProcdef } from '../api';

const previewData = ref<FlwProcdefApi.Procdef>({});
const previewLoading = ref(false);

const [Modal, modalApi] = useVbenModal({
  async onOpenChange(isOpen) {
    if (isOpen) {
      const data = modalApi.getData<any>();
      previewData.value = data ? { ...data } : {};
      if (previewData.value.id) {
        previewLoading.value = true;
        const res = await getProcdef(previewData.value.id, true, true);
        previewData.value = res;
        previewLoading.value = false;
      }
    }
  },
});
</script>

<template>
  <Modal
    :title="$t('flowable.procdef.button.preview')"
    :confirm-loading="previewLoading"
    :show-cancel-button="false"
    :show-confirm-button="false"
  >
    <Tabs v-if="!previewLoading" style="min-height: 400px">
      <TabPane :tab="$t('flowable.procdef.preview.diagram')" key="diagram">
        <div style="text-align: center">
          <template v-if="previewData.thumbnail">
            <Image
              :preview="false"
              :src="`${previewData.thumbnail}`"
              style="max-width: 100%; max-height: 90vh"
            />
          </template>
          <template v-else>
            <div>{{ $t('flowable.procdef.noDiagram') }}</div>
          </template>
        </div>
      </TabPane>
      <TabPane :tab="$t('flowable.procdef.preview.xml')" key="xml">
        <Spin :spinning="previewLoading">
          <Textarea
            v-model:value="previewData.xml"
            :auto-size="{ minRows: 10, maxRows: 40 }"
            readonly
            style="font-family: monospace; background: #f6f6f6"
          />
        </Spin>
      </TabPane>
    </Tabs>
  </Modal>
</template>
