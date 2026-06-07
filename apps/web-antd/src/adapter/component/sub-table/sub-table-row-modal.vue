<script lang="ts" setup>
import type { Recordable } from '@vben/types';

import type { SubTableColumnSchema } from './types';

import type { VbenFormSchema } from '#/adapter/form';

import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { isFunction } from '@vben/utils';

import { useVbenForm } from '#/adapter/form';
import { $t } from '#/locales';

const props = defineProps<{
  columns: SubTableColumnSchema[];
  modalTitle?: string;
}>();

const emit = defineEmits<{
  confirm: [values: Recordable<any>];
}>();

const editIndex = ref(-1);

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
  },
  schema: [],
  showDefaultActions: false,
});

const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) {
      return;
    }
    const values = await formApi.getValues();
    emit('confirm', values);
    modalApi.close();
  },
  onOpenChange(isOpen) {
    if (!isOpen) {
      editIndex.value = -1;
    }
  },
});

function buildSchema(row: Recordable<any>, index: number): VbenFormSchema[] {
  return props.columns
    .filter((col) => col.component)
    .map((col) => {
      const componentProps = isFunction(col.componentProps)
        ? col.componentProps(row, index)
        : col.componentProps;
      return {
        component: col.component!,
        componentProps,
        fieldName: col.field,
        label: col.title,
        modelPropName: col.modelPropName,
        rules: col.rules,
      } as VbenFormSchema;
    });
}

function open(row: Recordable<any>, index: number) {
  editIndex.value = index;
  formApi.setState({ schema: buildSchema(row, index) });
  formApi.resetForm();
  formApi.setValues({ ...row });
  modalApi.open();
}

function getTitle() {
  if (props.modalTitle) {
    return props.modalTitle;
  }
  return editIndex.value >= 0
    ? $t('ui.actionTitle.edit', [''])
    : $t('ui.actionTitle.create', ['']);
}

defineExpose({
  open,
});
</script>

<template>
  <Modal :title="getTitle()">
    <Form />
  </Modal>
</template>
