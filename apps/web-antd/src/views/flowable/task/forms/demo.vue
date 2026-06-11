<script lang="ts" setup>
import type { FlowTaskFormExpose, FlowTaskFormProps } from '../types';

import { ref } from 'vue';

import { Input } from 'ant-design-vue';

const props = defineProps<FlowTaskFormProps>();

const remark = ref('');

defineExpose<FlowTaskFormExpose>({
  getExtraParams() {
    return {
      remark: remark.value,
      taskId: props.task.id,
      processInstanceId: props.task.processInstanceId,
    };
  },
});
</script>

<template>
  <div class="rounded-md border p-4">
    <div class="mb-2 text-sm text-gray-500">示例业务表单（formKey: demo）</div>
    <div class="mb-3">
      <span class="mr-2">任务名称：</span>
      <span>{{ task.name }}</span>
    </div>
    <div class="mb-1">业务备注</div>
    <Input v-model:value="remark" placeholder="请输入业务备注" />
  </div>
</template>
