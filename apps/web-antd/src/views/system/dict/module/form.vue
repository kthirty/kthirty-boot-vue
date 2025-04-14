<script lang="ts" setup>
import type { SystemDictApi } from '#/api';

import { ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { createDictType, updateDictType } from '#/api';

const emits = defineEmits(['success']);

const formData = ref<SystemDictApi.DictType>();

const [Form, formApi] = useVbenForm({
  schema: [
    {
      fieldName: 'code',
      label: '字典编码',
      component: 'Input',
      rules: 'required',
    },
    {
      fieldName: 'name',
      label: '字典名称',
      component: 'Input',
      rules: 'required',
    },
    {
      fieldName: 'description',
      label: '描述',
      component: 'Textarea',
    },
  ],
  showDefaultActions: false,
});

const id = ref();
const [Drawer, drawerApi] = useVbenDrawer({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) return;
    const values = await formApi.getValues();
    drawerApi.lock();
    (id.value
      ? updateDictType({ id: id.value, ...values })
      : createDictType(values)
    )
      .then(() => {
        emits('success');
        drawerApi.close();
      })
      .catch(() => {
        drawerApi.unlock();
      });
  },
  onOpenChange(isOpen) {
    if (isOpen) {
      const data = drawerApi.getData<SystemDictApi.DictType>();
      formApi.resetForm();
      if (data) {
        formData.value = data;
        id.value = data.id;
        formApi.setValues(data);
      } else {
        id.value = undefined;
      }
    }
  },
});
</script>

<template>
  <Drawer :title="formData?.id ? '编辑字典类型' : '新建字典类型'">
    <Form />
  </Drawer>
</template>
