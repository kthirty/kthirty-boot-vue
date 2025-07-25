<script lang="ts" setup>
import type { DevFormApi, DevFormItemApi } from '../api';

import { ref, watch } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { message, Table, TabPane, Tabs } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { $t } from '#/locales';

import { getFormInfo, saveForm, updateForm } from '../api';
import { useDatabaseColumns, useFormSchema } from '../data';

const emit = defineEmits(['success']);

const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) return;
    const values = await formApi.getValues();

    loading.value = true;
    try {
      const submitData = { ...values, items: items.value } as DevFormApi.Form;
      if (submitData.id) {
        await updateForm(submitData);
        message.success('更新成功');
      } else {
        await saveForm(submitData);
        message.success('新增成功');
      }
      modalApi.close();
      emit('success');
    } finally {
      loading.value = false;
    }
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      loading.value = true;
      try {
        const data = modalApi.getData<DevFormApi.Form>();
        formApi.resetForm();
        if (data && data.id) {
          const formInfo = await getFormInfo(data.id);
          formApi.setValues(formInfo);
          id.value = data.id;
          items.value = formInfo.items;
          indexes.value = formInfo.indexes;
          console.warn('items', items.value);
          console.warn('indexes', indexes.value);
        }
      } finally {
        loading.value = false;
      }
    }
  },
});

const [Form, formApi] = useVbenForm({
  schema: useFormSchema(),
  showDefaultActions: false,
  wrapperClass: 'grid-cols-1 md:grid-cols-4',
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
  },
});

const loading = ref(false);
const id = ref<string>();
const items = ref<DevFormItemApi.Item[]>([]);
const indexes = ref<DevFormItemApi.Index[]>([]);
watch(
  items,
  (newVal) => {
    console.warn('items', newVal);
  },
  { deep: true, immediate: true },
);
</script>
<template>
  <Modal :title="$t('develop.form.editTitle')" :loading="loading">
    <Form class="mx-4" />
    <div class="flex w-full flex-col gap-4 pl-4">
      <Tabs>
        <TabPane key="database" :tab="$t('develop.form.tabs.database')">
          <Table
            :data-source="items"
            :pagination="false"
            :columns="useDatabaseColumns()"
            bordered
            :row-key="(record) => record.id"
            size="middle"
          />
        </TabPane>
        <TabPane key="entity" :tab="$t('develop.form.tabs.entity')" />
        <TabPane key="page" :tab="$t('develop.form.tabs.page')" />
        <TabPane key="extra" :tab="$t('develop.form.tabs.extra')" />
        <TabPane key="foreignKey" :tab="$t('develop.form.tabs.foreignKey')" />
        <TabPane key="index" :tab="$t('develop.form.tabs.index')" />
      </Tabs>
    </div>
  </Modal>
</template>
