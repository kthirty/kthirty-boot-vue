<script lang="ts" setup>
import type { DevFormApi, DevFormItemApi } from '../api';

import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';

import { getFormInfo, saveForm, updateForm } from '../api';
import { useFormSchema } from '../data';

const emit = defineEmits(['success']);

const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) return;
    const values = await formApi.getValues();

    loading.value = true;
    try {
      const submitData = { ...values, items: items.value } as DevFormApi.Form;
      if (submitData.id) {
        await updateForm(submitData);
        message.success('更新成功');
      } else {
        await saveForm(submitData);
        message.success('新增成功');
      }
      modalApi.close();
      emit('success');
    } finally {
      loading.value = false;
    }
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      loading.value = true;
      try {
        const data = modalApi.getData<DevFormApi.Form>();
        formApi.resetForm();
        if (data && data.id) {
          formApi.setValues(await getFormInfo(data.id));
          id.value = data.id;
        }
      } finally {
        loading.value = false;
      }
    }
  },
});

const [Form, formApi] = useVbenForm({
  schema: useFormSchema(),
  showDefaultActions: false,
  wrapperClass: 'grid-cols-1 md:grid-cols-4',
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
  },
});

const loading = ref(false);
const id = ref<string>();
const items = ref<DevFormItemApi.Item[]>([]);
</script>
<template>
  <Modal :title="$t('develop.form.editTitle')" :loading="loading">
    <Form class="mx-4" />
  </Modal>
</template>
