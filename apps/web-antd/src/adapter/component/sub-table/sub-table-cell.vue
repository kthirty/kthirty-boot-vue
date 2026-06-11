<script lang="ts" setup>
import type { Component } from 'vue';

import type { Recordable } from '@vben/types';

import type { SubTableColumnSchema } from './types';

import { computed } from 'vue';

import { globalShareState } from '@vben/common-ui';
import { isFunction, isString } from '@vben/utils';

import { createModelBind } from './use-model-prop';

const props = defineProps<{
  column: SubTableColumnSchema;
  disabled?: boolean;
  index: number;
  row: Recordable<any>;
}>();

const emit = defineEmits<{
  change: [field: string, value: any];
}>();

const componentName = computed(() => {
  const { component } = props.column;
  return isString(component) ? component : undefined;
});

const FieldComponent = computed<Component | undefined>(() => {
  const { component } = props.column;
  if (!component) {
    return undefined;
  }
  if (isString(component)) {
    return globalShareState.getComponents()[component];
  }
  return component;
});

const resolvedComponentProps = computed(() => {
  const { componentProps } = props.column;
  if (isFunction(componentProps)) {
    return componentProps(props.row, props.index);
  }
  return componentProps ?? {};
});

// 字段值来自表单 v-model 绑定的行数据
const bindProps = computed(() => {
  const field = props.column.fieldName;
  const value = props.row[field];
  return createModelBind(componentName.value, value, (val) =>
    emit('change', field, val),
  );
});
</script>

<template>
  <component
    :is="FieldComponent"
    v-if="FieldComponent"
    v-bind="{ ...resolvedComponentProps, ...bindProps, disabled }"
    class="w-full"
  />
  <span v-else>{{ row[column.fieldName] ?? '' }}</span>
</template>
