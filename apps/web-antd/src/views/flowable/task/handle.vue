<script lang="ts" setup>
import { defineEmits, defineProps, ref, watch } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { message, TabPane, Tabs } from 'ant-design-vue';

import { $t } from '#/locales';

import { completeTask, getCompletePre } from './api';

const props = defineProps<{ open: boolean; taskId: string | undefined }>();
const emits = defineEmits(['update:open', 'success']);

const loading = ref(false);
const formKey = ref('');
const handleButtons = ref<string[]>([]);
const formModel = ref<Record<string, any>>({});

const [Modal, modalApi] = useVbenModal({
  async onOpenChange(isOpen) {
    if (isOpen) {
      const data = modalApi.getData<any>();
      console.warn('data', data);
    }
  },
});

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
        console.warn('formKey', formKey);
        console.warn('handleButtons', handleButtons);
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
    :title="$t('flowable.task.handle.title')"
    :confirm-loading="loading"
    @ok="onSubmit"
  >
    <div class="flex flex-col">
      <Tabs class="flex-1">
        <TabPane key="form" :tab="$t('flowable.task.handle.tab.form')">
          <!-- 业务表单内容区域 -->
          <div class="p-4">
            <span v-if="!formKey">{{ $t('flowable.task.handle.noForm') }}</span>
            <span v-else>
              <!-- TODO  -->
            </span>
          </div>
        </TabPane>
        <TabPane key="history" :tab="$t('flowable.task.handle.tab.history')">
          <!-- 处理历史内容区域 -->
          <div class="p-4">
            <span>{{ $t('flowable.task.handle.historyPlaceholder') }}</span>
          </div>
        </TabPane>
        <TabPane key="diagram" :tab="$t('flowable.task.handle.tab.diagram')">
          <!-- 流程历史图内容区域 -->
          <div class="p-4">
            <span>{{ $t('flowable.task.handle.diagramPlaceholder') }}</span>
          </div>
        </TabPane>
      </Tabs>
      <div class="mt-4 flex w-full justify-end gap-2 bg-blue-50"></div>
    </div>
  </Modal>
</template>
