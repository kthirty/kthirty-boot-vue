<script lang="ts" setup>
import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { Spin } from 'ant-design-vue';

import { $t } from '#/locales';

import { buildUreportUrl, ensureUreportSession } from '../api';

const emit = defineEmits(['success']);

const loading = ref(false);
const src = ref('');
const title = ref('');
const opened = ref(false);

const [Modal, modalApi] = useVbenModal({
  footer: false,
  fullscreen: true,
  async onOpenChange(isOpen) {
    if (!isOpen) {
      src.value = '';
      if (opened.value) {
        opened.value = false;
        emit('success');
      }
      return;
    }
    const data = modalApi.getData<{
      mode?: 'design' | 'preview';
      name?: string;
    }>();
    const mode = data?.mode || 'design';
    title.value =
      mode === 'preview'
        ? $t('ureport.preview')
        : data?.name || $t('ureport.designer');
    loading.value = true;
    opened.value = true;
    try {
      await ensureUreportSession();
    } finally {
      src.value = buildUreportUrl(mode, data?.name);
      loading.value = false;
    }
  },
});
</script>

<template>
  <Modal :title="title" content-class="h-[calc(100vh-7.5rem)] !p-0">
    <Spin :spinning="loading" class="block h-full">
      <iframe v-if="src" :src="src" class="h-[calc(100vh-7.5rem)] w-full border-0"></iframe>
    </Spin>
  </Modal>
</template>
