<script lang="ts" setup>
import type { FlwModelApi } from '../api';

import { defineEmits, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { message } from 'ant-design-vue';
// @ts-ignore
import { BpmnDesigner } from 'kthirty-bpmn-vue3';

import { getModel, saveModel } from '../api';

import 'kthirty-bpmn-vue3/dist/style.css';

const emit = defineEmits(['success', 'close']);

const formData = ref<FlwModelApi.Model>({});
const formLoading = ref(false);

const [Modal, modalApi] = useVbenModal({
  appendToMain: true,
  zIndex: 990,
  modal: false,
  async onConfirm() {
    try {
      await saveModel({ ...formData.value });
      message.success('编辑成功');
      modalApi.close();
      emit('success');
    } finally {
      formLoading.value = false;
    }
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      const data = modalApi.getData<any>();
      formData.value = data ? { ...data } : {};
      if (formData.value.id) {
        formLoading.value = true;
        const res = await getModel(formData.value.id);
        formData.value = res;
        formLoading.value = false;
      }
    }
  },
  onCancel() {
    emit('close');
    modalApi.close();
  },
});
</script>

<template>
  <Modal title="模型编辑" :confirm-loading="formLoading">
    <Form class="mx-4" />
    <BpmnDesigner v-if="!formLoading" :xml="formData.xml" />
  </Modal>
</template>
