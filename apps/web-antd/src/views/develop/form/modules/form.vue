<script lang="ts" setup>
import type { TableRowSelection } from 'ant-design-vue/es/table/interface';

import type { DevFormApi } from '../api';

import { reactive, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import {
  Button,
  Form,
  FormItem,
  Input,
  message,
  Space,
  Table,
  TabPane,
  Tabs,
} from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { $t } from '#/locales';

import { getFormInfo, saveForm, updateForm } from '../api';
import {
  useDatabaseColumns,
  useEntityColumns,
  useExtraColumns,
  useForeignKeyColumns,
  useFormSchema,
  useIndexColumns,
  useInitItems,
  usePageColumns,
} from '../data';

const emit = defineEmits(['success']);

const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) return;
    const values = await formApi.getValues();

    loading.value = true;
    try {
      const submitData = {
        id: id.value,
        ...values,
        items: form.value.items,
        indexes: form.value.indexes,
      } as DevFormApi.Form;
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
          form.value = formInfo;
        } else {
          form.value.items = useInitItems();
        }
      } finally {
        loading.value = false;
      }
    }
  },
});
const loading = ref(false);
const id = ref<string>();
const form = ref<DevFormApi.Form>({ items: [] });

const [MainForm, formApi] = useVbenForm({
  schema: useFormSchema(id),
  showDefaultActions: false,
  wrapperClass: 'grid-cols-1 md:grid-cols-4',
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
  },
});

function addItem() {
  form.value.items!.push({
    id: Date.now().toString(),
    columnNullable: true,
    formRequired: false,
    weight: 0,
    isShowQuery: true,
    isShowForm: true,
    isShowList: true,
    isAllowSort: true,
    isReadonly: false,
  });
}
function deleteItem() {
  form.value.items = form.value.items.filter(
    (item) => !rowSelection.selectedRowKeys?.includes(item.id!),
  );
}

const rowSelection = reactive({
  type: 'checkbox',
  selectedRowKeys: [],
  onChange: (selectedKeys: string[]) => {
    rowSelection.selectedRowKeys = selectedKeys;
  },
} as TableRowSelection);
</script>
<template>
  <Modal :title="$t('develop.form.editTitle')" :loading="loading">
    <MainForm class="mx-4" />
    <div class="flex w-full flex-col gap-4 pl-4">
      <Form :model="form" layout="inline" autocomplete="off">
        <FormItem :label="false" name="username" required>
          <Input v-model:value="form.username" />
        </FormItem>

        <Tabs>
          <TabPane key="database" :tab="$t('develop.form.tabs.database')">
            <Space class="mb-4">
              <Button type="primary" @click="addItem">
                {{ $t('develop.form.addItem') }}
              </Button>
              <Button type="primary" danger @click="deleteItem">
                {{ $t('develop.form.deleteItem') }}
              </Button>
            </Space>
            <Table
              :data-source="form.items"
              :row-selection="rowSelection"
              :pagination="false"
              :columns="useDatabaseColumns()"
              bordered
              :row-key="(record) => record.id"
              size="middle"
            />
          </TabPane>
          <TabPane key="entity" :tab="$t('develop.form.tabs.entity')">
            <Table
              :data-source="form.items"
              :pagination="false"
              :columns="useEntityColumns()"
              bordered
              :row-key="(record) => record.id"
              size="middle"
            />
          </TabPane>
          <TabPane key="page" :tab="$t('develop.form.tabs.page')">
            <Table
              :data-source="form.items"
              :pagination="false"
              :columns="usePageColumns()"
              bordered
              :row-key="(record) => record.id"
              size="middle"
            />
          </TabPane>
          <TabPane key="extra" :tab="$t('develop.form.tabs.extra')">
            <Table
              :data-source="form.items"
              :pagination="false"
              :columns="useExtraColumns()"
              bordered
              :row-key="(record) => record.id"
              size="middle"
            />
          </TabPane>
          <TabPane key="foreignKey" :tab="$t('develop.form.tabs.foreignKey')">
            <Table
              :data-source="form.items"
              :pagination="false"
              :columns="useForeignKeyColumns()"
              bordered
              :row-key="(record) => record.id"
              size="middle"
            />
          </TabPane>
          <TabPane key="index" :tab="$t('develop.form.tabs.index')">
            <Table
              :data-source="form.indexes"
              :pagination="false"
              :columns="useIndexColumns()"
              bordered
              :row-key="(record) => record.id"
              size="middle"
            />
          </TabPane>
        </Tabs>
      </Form>
    </div>
  </Modal>
</template>
