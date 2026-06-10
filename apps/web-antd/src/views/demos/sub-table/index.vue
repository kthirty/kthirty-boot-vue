<script lang="ts" setup>
import type { SubTableColumnSchema } from '#/adapter/component';
import { SUB_TABLE_DEFAULT_ROW_FLAG } from '#/adapter/component';

import { ref } from 'vue';

import { Page } from '@vben/common-ui';

import { Button, Card, message, Space } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { $t } from '#/locales';

const submitResult = ref('');

const subTableColumns: SubTableColumnSchema[] = [
  {
    fieldName: 'name',
    label: '商品名称',
    component: 'Input',
    rules: 'required',
    componentProps: {
      allowClear: true,
      placeholder: '请输入商品名称',
    },
  },
  {
    fieldName: 'category',
    label: '分类',
    component: 'Select',
    rules: 'selectRequired',
    width: 130,
    componentProps: {
      allowClear: true,
      options: [
        { label: '电子产品', value: 'electronics' },
        { label: '办公用品', value: 'office' },
        { label: '生活用品', value: 'daily' },
      ],
      placeholder: '请选择分类',
    },
  },
  {
    fieldName: 'quantity',
    label: '数量',
    component: 'InputNumber',
    width: 100,
    componentProps: {
      class: 'w-full',
      min: 1,
    },
  },
  {
    fieldName: 'price',
    label: '单价',
    component: 'InputNumber',
    width: 120,
    componentProps: {
      class: 'w-full',
      min: 0,
      precision: 2,
      prefix: '¥',
    },
  },
  {
    fieldName: 'enabled',
    label: '启用',
    component: 'Switch',
    width: 80,
  },
  {
    fieldName: 'remark',
    label: '备注',
    component: 'Textarea',
    editable: true,
    componentProps: {
      autoSize: { minRows: 2, maxRows: 4 },
      placeholder: '请输入备注',
    },
  },
  {
    fieldName: 'attachments',
    label: '附件',
    component: 'OosFile',
    editable: true,
    componentProps: {
      maxCount: 3,
      multiple: true,
    },
  },
];

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
  },
  handleSubmit: onSubmit,
  layout: 'vertical',
  schema: [
    {
      component: 'Input',
      fieldName: 'orderNo',
      label: '订单编号',
      rules: 'required',
    },
    {
      component: 'SubTable',
      fieldName: 'items',
      label: '订单明细（子表）',
      defaultValue: [
        {
          [SUB_TABLE_DEFAULT_ROW_FLAG]: true,
          quantity: 1,
          enabled: true,
          attachments: [],
        },
        {
          _subTableRowKey: 'demo-row-1',
          name: '无线鼠标',
          category: 'electronics',
          quantity: 2,
          price: 89.9,
          enabled: true,
          remark: '黑色款',
          attachments: [],
        },
        {
          _subTableRowKey: 'demo-row-2',
          name: '记事本',
          category: 'office',
          quantity: 5,
          price: 12.5,
          enabled: false,
          attachments: [],
        },
      ],
      componentProps: {
        columns: subTableColumns,
        inlineEdit: true,
        modalEdit: true,
        maxHeight: 360,
        modalTitle: '编辑明细',
      },
      formItemClass: 'col-span-full',
    },
  ],
  wrapperClass: 'grid-cols-1',
});

async function onSubmit(values: Record<string, any>) {
  submitResult.value = JSON.stringify(values, null, 2);
  message.success('提交成功，请查看下方 JSON 结果');
}

function handleReset() {
  formApi.resetForm();
  submitResult.value = '';
}
</script>

<template>
  <Page
    :description="$t('demos.subTable.description')"
    :title="$t('demos.subTable.title')"
  >
    <Card class="mb-4" :title="$t('demos.subTable.formTitle')">
      <Form />
      <div class="mt-4 flex justify-end">
        <Space>
          <Button @click="handleReset">{{ $t('common.reset') }}</Button>
          <Button type="primary" @click="formApi.validateAndSubmitForm()">
            {{ $t('common.confirm') }}
          </Button>
        </Space>
      </div>
    </Card>

    <Card :title="$t('demos.subTable.resultTitle')">
      <pre
        v-if="submitResult"
        class="bg-muted overflow-auto rounded-md p-4 text-sm"
      >
        {{ submitResult }}
      </pre>
      <div v-else class="text-muted-foreground text-sm">
        {{ $t('demos.subTable.resultEmpty') }}
      </div>
    </Card>

    <Card class="mt-4" :title="$t('demos.subTable.featureTitle')">
      <ul class="text-muted-foreground list-inside list-disc space-y-2 text-sm">
        <li>{{ $t('demos.subTable.featureInline') }}</li>
        <li>{{ $t('demos.subTable.featureModal') }}</li>
        <li>{{ $t('demos.subTable.featureModelProp') }}</li>
        <li>{{ $t('demos.subTable.featureRemark') }}</li>
        <li>{{ $t('demos.subTable.featureDefaultRow') }}</li>
        <li>{{ $t('demos.subTable.featureToolbar') }}</li>
        <li>{{ $t('demos.subTable.featureBatch') }}</li>
        <li>{{ $t('demos.subTable.featureOosFile') }}</li>
      </ul>
    </Card>
  </Page>
</template>
