<script lang="ts" setup>
import type { Recordable } from '@vben/types';

import type { SubTableColumnSchema } from './types';

import type { VbenFormSchema } from '#/adapter/form';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { isFunction } from '@vben/utils';

import { useVbenForm } from '#/adapter/form';
import { $t } from '#/locales';

const props = defineProps<{
  columns: SubTableColumnSchema[];
  modalTitle?: string;
}>();

const emit = defineEmits<{
  close: [];
  confirm: [values: Recordable<any>];
}>();

const editingIndexes = ref<number[]>([]);

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
      editingIndexes.value = [];
      emit('close');
    }
  },
});

/** 列配置即 FormSchema；默认值由 setValues 传入的行数据决定 */
function buildSchema(row: Recordable<any>, index: number): VbenFormSchema[] {
  return props.columns
    .filter((col) => col.component)
    .map((col) => {
      const { componentProps, width, ...schema } = col;
      const resolvedProps = isFunction(componentProps)
        ? componentProps(row, index)
        : componentProps;
      return {
        ...schema,
        componentProps: resolvedProps,
      } as VbenFormSchema;
    });
}

function open(row: Recordable<any>, indexes: number[]) {
  editingIndexes.value = indexes;
  const firstIndex = indexes[0] ?? 0;
  formApi.setState({ schema: buildSchema(row, firstIndex) });
  formApi.resetForm();
  formApi.setValues({ ...row });
  modalApi.open();
}

const modalTitleText = computed(() => {
  if (props.modalTitle) {
    return props.modalTitle;
  }
  if (editingIndexes.value.length > 1) {
    return $t('ui.subTable.batchEditTitle', [editingIndexes.value.length]);
  }
  return $t('ui.actionTitle.edit', ['']);
});

defineExpose({
  open,
});
</script>

<template>
  <Modal :title="modalTitleText">
    <Form />
  </Modal>
</template>
