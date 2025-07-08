<script lang="ts" setup>
import { defineEmits, defineProps, ref, watch } from 'vue';

import { Input, message, Modal } from 'ant-design-vue';

import { $t } from '#/locales';

import { completeTask, getCompletePre } from './api';

const props = defineProps<{ open: boolean; taskId: string | undefined }>();
const emits = defineEmits(['update:open', 'success']);

const loading = ref(false);
const formKey = ref('');
const handleButtons = ref<string[]>([]);
const formModel = ref<Record<string, any>>({});

watch(
  () => props.open,
  async (val) => {
    if (val && props.taskId) {
      loading.value = true;
      try {
        const res = await getCompletePre(props.taskId);
        formKey.value = res.formKey || '';
        handleButtons.value = res.handleButtons || [];
        // TODO: 根据 formKey 获取表单 schema 或自定义表单
        formModel.value = {};
      } finally {
        loading.value = false;
      }
    }
  },
  { immediate: true },
);

async function onSubmit() {
  if (!props.taskId) return;
  loading.value = true;
  try {
    await completeTask({ taskId: props.taskId, variables: formModel.value });
    message.success($t('flowable.task.handle.success'));
    emits('success');
    emits('update:open', false);
  } finally {
    loading.value = false;
  }
}
</script>
<template>
  <Modal
    :open="props.open"
    :title="$t('flowable.task.handle.title')"
    :confirm-loading="loading"
    @ok="onSubmit"
    @cancel="() => emits('update:open', false)"
    :ok-text="$t('flowable.task.handle.submit')"
    :cancel-text="$t('flowable.task.handle.cancel')"
    destroy-on-close
  >
    <div v-if="loading" style="text-align: center">
      {{ $t('flowable.task.handle.loading') }}
    </div>
    <div v-else>
      <!-- TODO: 动态表单渲染，可根据 formKey 渲染不同表单，这里简单用 input 占位 -->
      <Input
        v-model:value="formModel.value.comment"
        :placeholder="$t('flowable.task.handle.commentPlaceholder')"
      />
    </div>
  </Modal>
</template>
