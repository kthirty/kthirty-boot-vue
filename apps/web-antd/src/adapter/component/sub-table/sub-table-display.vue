<script lang="ts" setup>
import type { Recordable } from '@vben/types';

import type { SubTableColumnSchema } from './types';

import { computed } from 'vue';

import { normalizeOosFiles } from '#/adapter/component/oos-file/upload';

const props = defineProps<{
  column: SubTableColumnSchema;
  row: Recordable<any>;
}>();

const displayValue = computed(() => {
  const value = props.row[props.column.fieldName];
  const { component, componentProps } = props.column;

  if (value === undefined || value === null || value === '') {
    return '';
  }

  if (component === 'Switch') {
    return value ? '是' : '否';
  }

  if (
    component === 'OosFile' ||
    (Array.isArray(value) && value[0]?.fileName)
  ) {
    return normalizeOosFiles(value)
      .map((file) => file.fileName)
      .join('、');
  }

  if (component === 'Select') {
    const options =
      typeof componentProps === 'function'
        ? componentProps(props.row, 0)?.options
        : componentProps?.options;
    if (Array.isArray(options)) {
      const matched = options.find(
        (item: Recordable<any>) => item.value === value,
      );
      if (matched?.label) {
        return matched.label;
      }
    }
  }

  if (Array.isArray(value)) {
    return value.join('、');
  }

  return String(value);
});
</script>

<template>
  <span class="sub-table-display">{{ displayValue }}</span>
</template>
