<script lang="ts" setup>
import { defineEmits, defineProps, ref, watch } from 'vue';

import { Form, Input, message, Modal, Select } from 'ant-design-vue';

const props = defineProps<{
  modelValue?: any;
}>();
const emits = defineEmits(['success', 'close']);
const formRef = ref();
const formLoading = ref(false);

const formData = ref({
  name: '',
  key: '',
  category: '',
  remark: '',
});

watch(
  () => props.modelValue,
  (val) => {
    formData.value = val
      ? {
          name: val.name || '',
          key: val.key || '',
          category: val.category || '',
          remark: val.remark || '',
        }
      : {
          name: '',
          key: '',
          category: '',
          remark: '',
        };
  },
  { immediate: true },
);

const rules = {
  name: [{ required: true, message: '请输入模型名称', trigger: 'blur' }],
  key: [{ required: true, message: '请输入模型标识', trigger: 'blur' }],
  category: [{ required: true, message: '请选择模型分类', trigger: 'change' }],
};

async function handleOk() {
  await formRef.value?.validate();
  formLoading.value = true;
  try {
    // 这里假设有 saveModel/updateModel 的API
    if (props.modelValue && props.modelValue.id) {
      // 编辑
      await updateModel(props.modelValue.id, formData.value);
      message.success('编辑成功');
    } else {
      // 新建
      await saveModel(formData.value);
      message.success('新建成功');
    }
    emits('success');
    handleCancel();
  } catch {
    // 错误处理
  } finally {
    formLoading.value = false;
  }
}

function handleCancel() {
  emits('close');
}
</script>

<template>
  <Modal
    v-bind="$attrs"
    :title="props.modelValue && props.modelValue.id ? '编辑模型' : '新建模型'"
    :confirm-loading="formLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    destroy-on-close
  >
    <Form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-col="{ span: 5 }"
      wrapper-col="{ span: 18 }"
      layout="horizontal"
    >
      <Form.Item label="模型名称" name="name">
        <Input v-model:value="formData.name" placeholder="请输入模型名称" />
      </Form.Item>
      <Form.Item label="模型标识" name="key">
        <Input v-model:value="formData.key" placeholder="请输入模型标识" />
      </Form.Item>
      <Form.Item label="模型分类" name="category">
        <Select v-model:value="formData.category" placeholder="请选择模型分类">
          <Select.Option value="form">表单</Select.Option>
          <Select.Option value="process">流程</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item label="备注" name="remark">
        <Input.TextArea
          v-model:value="formData.remark"
          placeholder="请输入备注"
        />
      </Form.Item>
    </Form>
  </Modal>
</template>
