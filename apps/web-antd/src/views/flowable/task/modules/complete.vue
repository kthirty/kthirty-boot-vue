<script lang="ts" setup>
import type { FlwTaskApi } from '../api';
import type { FlowTaskFormExpose } from '../types';

import { ref, shallowRef } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { Button, Input, message, Spin } from 'ant-design-vue';

import { $t } from '#/locales';

import { completePre, completeTask } from '../api';
import { getFormComponent } from '../utils/form-loader';

const emit = defineEmits(['success']);

const taskData = ref<FlwTaskApi.Task>({});
const completePreData = ref<FlwTaskApi.CompletePre>({});
const loading = ref(false);
const submitting = ref(false);
const comment = ref('');
const formRef = ref<FlowTaskFormExpose>();
const FormComponent = shallowRef<ReturnType<typeof getFormComponent>>(null);

const [Modal, modalApi] = useVbenModal({
  appendToMain: true,
  fullscreen: true,
  showConfirmButton: false,
  async onOpenChange(isOpen) {
    if (isOpen) {
      comment.value = '';
      taskData.value = modalApi.getData<FlwTaskApi.Task>() || {};
      FormComponent.value = null;
      completePreData.value = {};
      if (!taskData.value.id) return;
      loading.value = true;
      try {
        completePreData.value = await completePre(taskData.value.id);
        FormComponent.value = getFormComponent(completePreData.value.formKey);
      } finally {
        loading.value = false;
      }
    }
  },
});

async function onHandle(button: FlwTaskApi.FlowButton) {
  if (button.commentRequired && !comment.value.trim()) {
    message.warning($t('flowable.task.commentRequired'));
    return;
  }
  if (formRef.value?.validate) {
    const valid = await formRef.value.validate();
    if (!valid) return;
  }
  submitting.value = true;
  try {
    await completeTask({
      taskId: taskData.value.id!,
      result: button.resultCode!,
      comment: comment.value,
      extraParams: formRef.value?.getExtraParams?.(),
    });
    message.success($t('flowable.task.completeSuccess'));
    modalApi.close();
    emit('success');
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <Modal :title="$t('flowable.task.handleTitle')">
    <Spin :spinning="loading">
      <div class="mx-4 flex h-[calc(100vh-180px)] flex-col gap-4">
        <div class="min-h-0 flex-1 overflow-auto">
          <component
            :is="FormComponent"
            v-if="FormComponent"
            ref="formRef"
            :task="taskData"
          />
          <div
            v-else-if="completePreData.formKey"
            class="rounded-md border border-dashed p-6 text-center text-gray-500"
          >
            {{ $t('flowable.task.formNotFound', [completePreData.formKey]) }}
          </div>
          <div
            v-else
            class="rounded-md border border-dashed p-6 text-center text-gray-500"
          >
            {{ $t('flowable.task.noFormKey') }}
          </div>
        </div>

        <div>
          <div class="mb-2">{{ $t('flowable.task.comment') }}</div>
          <Input.TextArea
            v-model:value="comment"
            :rows="3"
            :placeholder="$t('flowable.task.commentPlaceholder')"
          />
        </div>
      </div>
    </Spin>

    <template #append-footer>
      <Button
        v-for="button in completePreData.handleButtons || []"
        :key="button.code || button.resultCode"
        :loading="submitting"
        type="primary"
        class="ml-2"
        @click="onHandle(button)"
      >
        {{ button.name }}
      </Button>
    </template>
  </Modal>
</template>
