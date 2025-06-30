<script lang="ts" setup>
import { computed, defineEmits, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';

import { saveModel } from '../api';
import { useSchema } from '../data';

const emit = defineEmits(['success', 'close']);
const formData = ref<any>({});
const formLoading = ref(false);

const getTitle = computed(() => {
  return formData.value?.id ? '编辑模型' : '新建模型';
});

const [Form, formApi] = useVbenForm({
  layout: 'horizontal',
  schema: useSchema(),
  showDefaultActions: false,
  wrapperClass: 'grid-cols-1 md:grid-cols-4',
});

const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (valid) {
      formLoading.value = true;
      const data = formApi.getValues();
      try {
        if (formData.value?.id) {
          await saveModel({ id: formData.value.id, ...data });
          message.success('编辑成功');
        } else {
          await saveModel(data);
          message.success('新建成功');
        }
        modalApi.close();
        emit('success');
      } finally {
        formLoading.value = false;
      }
    }
  },
  onOpenChange(isOpen) {
    if (isOpen) {
      const data = modalApi.getData<any>();
      formData.value = data
        ? { ...data }
        : { name: '', key: '', category: '', remark: '' };
      formApi.setValues(formData.value);
    }
  },
  onCancel() {
    emit('close');
  },
});
</script>

<template>
  <Modal :title="getTitle" :confirm-loading="formLoading">
    <Form class="mx-4" />
  </Modal>
</template>
