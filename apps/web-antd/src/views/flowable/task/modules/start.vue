<script lang="ts" setup>
import type { FlwProcdefApi } from '../../procdef/api';

import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { $t } from '#/locales';

import { getProcdefList } from '../../procdef/api';
import { startProcess } from '../api';

const emit = defineEmits(['success']);

const procDefOptions = ref<Array<{ label: string; value: string }>>([]);
const loadingOptions = ref(false);

const [Form, formApi] = useVbenForm({
  layout: 'vertical',
  schema: [
    {
      component: 'Select',
      fieldName: 'processDefinitionKey',
      label: $t('flowable.task.processDefinitionName'),
      rules: 'required',
      componentProps: () => ({
        options: procDefOptions.value,
        loading: loadingOptions.value,
        showSearch: true,
        filterOption: (input: string, option: any) =>
          option.label.toLowerCase().includes(input.toLowerCase()),
      }),
    },
    {
      component: 'Input',
      fieldName: 'businessKey',
      label: $t('flowable.task.businessKey'),
      rules: 'required',
      componentProps: {
        placeholder: $t('flowable.task.businessKeyPlaceholder'),
      },
    },
  ],
  showDefaultActions: false,
});

async function loadProcDefs() {
  loadingOptions.value = true;
  try {
    const res = await getProcdefList({
      pageNumber: 1,
      pageSize: 500,
      suspended: false,
      showHistory: false,
    });
    const records = (res?.records ||
      res?.items ||
      res ||
      []) as FlwProcdefApi.Procdef[];
    procDefOptions.value = records.map((item) => ({
      label: `${item.name} (${item.key} v${item.version})`,
      value: item.key!,
    }));
    formApi.updateSchema([
      {
        fieldName: 'processDefinitionKey',
        componentProps: {
          options: procDefOptions.value,
          showSearch: true,
          filterOption: (input: string, option: any) =>
            option.label.toLowerCase().includes(input.toLowerCase()),
        },
      },
    ]);
  } finally {
    loadingOptions.value = false;
  }
}

const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) return;
    const values = await formApi.getValues();
    modalApi.lock();
    try {
      await startProcess(values.processDefinitionKey, values.businessKey);
      message.success($t('flowable.task.startSuccess'));
      modalApi.close();
      emit('success');
    } finally {
      modalApi.lock(false);
    }
  },
  onOpenChange(isOpen) {
    if (isOpen) {
      formApi.resetForm();
      loadProcDefs();
    }
  },
});
</script>

<template>
  <Modal :title="$t('flowable.task.startTitle')" class="w-full max-w-[520px]">
    <Form class="mx-4" />
  </Modal>
</template>
