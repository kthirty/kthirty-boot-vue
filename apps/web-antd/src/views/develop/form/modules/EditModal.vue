<script lang="ts" setup>
import type { DevFormApi, DevFormItemApi } from '../api';

import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { Button, Form, Input, message } from 'ant-design-vue';

import { getFormInfo, saveForm, updateForm } from '../api';
import { useFormSchema } from '../data';

const emit = defineEmits(['refresh']);

const [ModalComp, modalApi] = useVbenModal({
  async onOpenChange(isOpen) {
    if (isOpen) {
      const data = modalApi.getData<DevFormApi.Form>();
      if (data && data.id) {
        loading.value = true;
        const res = await getFormInfo(data.id);
        formModel.value = res;
        items.value = res.items ? [...res.items] : [];
        loading.value = false;
      } else {
        formModel.value = {};
        items.value = [];
      }
    }
  },
});

const loading = ref(false);
const formModel = ref<Partial<DevFormApi.Form>>({});
const items = ref<DevFormItemApi.Item[]>([]);

function addItem() {
  items.value.push({} as DevFormItemApi.Item);
}

async function handleOk() {
  loading.value = true;
  try {
    const submitData = { ...formModel.value, items: items.value };
    if (formModel.value.id) {
      await updateForm(submitData as DevFormApi.Form);
      message.success('更新成功');
    } else {
      await saveForm(submitData as DevFormApi.Form);
      message.success('新增成功');
    }
    modalApi.close();
    emit('refresh');
  } finally {
    loading.value = false;
  }
}
</script>
<template>
  <ModalComp
    :title="$t('develop.form.editTitle')"
    :confirm-loading="loading"
    width="80vw"
    @ok="handleOk"
    @cancel="() => modalApi.close()"
  >
    <Form
      :model="formModel"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 16 }"
      layout="horizontal"
    >
      <Form.Item
        v-for="schema in useFormSchema()"
        :key="schema.fieldName"
        :label="schema.label"
      >
        <Input
          v-model:value="formModel[schema.fieldName]"
          :placeholder="schema.label"
        />
      </Form.Item>
    </Form>
    <div style="margin: 16px 0; font-weight: bold">
      {{ $t('develop.formitem.title') }}
    </div>
    <Button type="dashed" block style="margin-top: 8px" @click="addItem">
      {{ $t('common.add') }}
    </Button>
  </ModalComp>
</template>
