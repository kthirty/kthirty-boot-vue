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
const presetKey = ref('');

function filterOption(input: string, option?: { label?: string }) {
  return (option?.label || '').toLowerCase().includes(input.toLowerCase());
}

const [Form, formApi] = useVbenForm({
  layout: 'vertical',
  schema: [
    {
      component: 'Select',
      fieldName: 'processDefinitionKey',
      label: $t('flowable.task.processDefinition'),
      rules: 'required',
      componentProps: {
        options: [],
        showSearch: true,
        filterOption,
      },
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

function syncProcessField() {
  formApi.updateSchema([
    {
      fieldName: 'processDefinitionKey',
      componentProps: {
        options: procDefOptions.value,
        disabled: !!presetKey.value,
        showSearch: true,
        filterOption,
      },
    },
  ]);
}

async function loadProcDefs() {
  const res = await getProcdefList({
    pageNumber: 1,
    pageSize: 500,
    suspended: false,
    showHistory: false,
  });
  const records = (res?.records || []) as FlwProcdefApi.Procdef[];
  procDefOptions.value = records
    .filter(
      (item): item is FlwProcdefApi.Procdef & { key: string } => !!item.key,
    )
    .map((item) => ({
      label: `${item.name} (${item.key} v${item.version})`,
      value: item.key,
    }));
  if (
    presetKey.value &&
    !procDefOptions.value.some((item) => item.value === presetKey.value)
  ) {
    procDefOptions.value.unshift({
      label: presetKey.value,
      value: presetKey.value,
    });
  }
  syncProcessField();
  if (presetKey.value) {
    await formApi.setValues({ processDefinitionKey: presetKey.value });
  }
}

const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) return;
    const values = await formApi.getValues();
    const processDefinitionKey =
      presetKey.value || values.processDefinitionKey;
    modalApi.lock();
    try {
      await startProcess(processDefinitionKey, values.businessKey);
      message.success($t('flowable.task.startSuccess'));
      modalApi.close();
      emit('success');
    } finally {
      modalApi.lock(false);
    }
  },
  async onOpenChange(isOpen) {
    if (!isOpen) return;
    const data = modalApi.getData<{ processDefinitionKey?: string }>() || {};
    presetKey.value = data.processDefinitionKey || '';
    await formApi.resetForm();
    syncProcessField();
    await loadProcDefs();
  },
});
</script>

<template>
  <Modal :title="$t('flowable.task.startTitle')" class="w-full max-w-[520px]">
    <Form class="mx-4" />
  </Modal>
</template>
