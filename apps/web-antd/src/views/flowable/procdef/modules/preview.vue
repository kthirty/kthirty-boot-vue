<script lang="ts" setup>
import type { FlwProcDefApi } from '../api';

import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { Tabs } from 'ant-design-vue';

import { $t } from '#/locales';

import { getProcDef } from '../api';

const previewData = ref<FlwProcDefApi.ProcDef>({});
const previewLoading = ref(false);
const activeTab = ref('diagram');

const [Modal, modalApi] = useVbenModal({
  async onOpenChange(isOpen) {
    if (isOpen) {
      activeTab.value = 'diagram';
      const data = modalApi.getData<any>();
      previewData.value = data ? { ...data } : {};
      if (previewData.value.id) {
        previewLoading.value = true;
        try {
          const res = await getProcDef(previewData.value.id, true, true);
          previewData.value = res;
        } finally {
          previewLoading.value = false;
        }
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
    <Tabs v-if="!previewLoading" v-model:active-key="activeTab">
      <Tabs.TabPane key="diagram" :tab="$t('flowable.procdef.previewDiagram')">
        <div class="preview-diagram">
          <img
            v-if="previewData.thumbnail"
            :src="previewData.thumbnail"
            alt="process diagram"
          />
          <div v-else>{{ $t('flowable.procdef.noThumbnail') }}</div>
        </div>
      </Tabs.TabPane>
      <Tabs.TabPane key="xml" :tab="$t('flowable.procdef.previewXml')">
        <pre v-if="previewData.xml" class="preview-xml">{{ previewData.xml }}</pre>
        <div v-else class="preview-empty">
          {{ $t('flowable.procdef.noXml') }}
        </div>
      </Tabs.TabPane>
    </Tabs>
  </Modal>
</template>

<style scoped>
.preview-diagram {
  display: flex;
  min-height: calc(100vh - 220px);
  align-items: center;
  justify-content: center;
  text-align: center;
}

.preview-diagram img {
  max-width: 100%;
  max-height: calc(100vh - 220px);
}

.preview-xml {
  overflow: auto;
  max-height: calc(100vh - 220px);
  margin: 0;
  padding: 12px 16px;
  border-radius: 6px;
  background: hsl(var(--muted));
  font-family:
    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono',
    'Courier New', monospace;
  font-size: 13px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-all;
}

.preview-empty {
  display: flex;
  min-height: calc(100vh - 220px);
  align-items: center;
  justify-content: center;
  color: hsl(var(--muted-foreground));
}
</style>
