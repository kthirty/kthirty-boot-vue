<script lang="ts" setup>
import type { SubTableColumnSchema } from '#/adapter/component';

import { h, ref } from 'vue';

import { Page } from '@vben/common-ui';

import { useDebounceFn } from '@vueuse/core';
import { Button, Card, message, Space, Spin, Tag } from 'ant-design-vue';
import dayjs from 'dayjs';

import { useVbenForm, z } from '#/adapter/form';
import { getAllMenusApi } from '#/api';
import { $t } from '#/locales';

const keyword = ref('');
const fetching = ref(false);
const submitResult = ref('');

function fetchRemoteOptions({ keyword: search = '选项' }: Record<string, any>) {
  fetching.value = true;
  return new Promise((resolve) => {
    setTimeout(() => {
      const options = Array.from({ length: 8 }).map((_, index) => ({
        label: `${search}-${index}`,
        value: `${search}-${index}`,
      }));
      resolve(options);
      fetching.value = false;
    }, 600);
  });
}

const subTableColumns: SubTableColumnSchema[] = [
  {
    fieldName: 'name',
    label: '名称',
    component: 'Input',
    componentProps: { placeholder: '名称' },
  },
  {
    fieldName: 'qty',
    label: '数量',
    component: 'InputNumber',
    componentProps: { class: 'w-full', min: 1 },
  },
];

const [Form, formApi] = useVbenForm({
  commonConfig: {
    colon: true,
    componentProps: {
      class: 'w-full',
    },
  },
  fieldMappingTime: [['rangePicker', ['startTime', 'endTime'], 'YYYY-MM-DD']],
  handleSubmit: onSubmit,
  layout: 'horizontal',
  schema: [
    {
      component: 'Divider',
      fieldName: '_divider_basic',
      formItemClass: 'col-span-full pb-0',
      hideLabel: true,
      renderComponentContent: () => ({
        default: () => h('div', { class: 'font-medium' }, '基础输入'),
      }),
    },
    {
      component: 'Input',
      componentProps: { placeholder: '请输入' },
      fieldName: 'input',
      label: 'Input',
      rules: 'required',
    },
    {
      component: 'Textarea',
      componentProps: { placeholder: '多行文本', rows: 3 },
      fieldName: 'textarea',
      label: 'Textarea',
    },
    {
      component: 'InputNumber',
      componentProps: { placeholder: '数字' },
      fieldName: 'inputNumber',
      label: 'InputNumber',
      suffix: () => '¥',
    },
    {
      component: 'InputPassword',
      componentProps: { placeholder: '密码' },
      fieldName: 'inputPassword',
      label: 'InputPassword',
    },
    {
      component: 'AutoComplete',
      componentProps: {
        options: [
          { label: 'Burns Bay Rd', value: 'Burns Bay Rd' },
          { label: 'Downing St', value: 'Downing St' },
        ],
        placeholder: '自动完成',
      },
      fieldName: 'autoComplete',
      label: 'AutoComplete',
    },
    {
      component: 'Mentions',
      componentProps: {
        options: [
          { label: 'afc163', value: 'afc163' },
          { label: 'zombieJ', value: 'zombieJ' },
        ],
        placeholder: '@提及',
      },
      fieldName: 'mentions',
      label: 'Mentions',
    },
    {
      component: 'Divider',
      fieldName: '_divider_select',
      formItemClass: 'col-span-full pb-0',
      hideLabel: true,
      renderComponentContent: () => ({
        default: () => h('div', { class: 'font-medium' }, '选择类'),
      }),
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: [
          { label: '选项1', value: '1' },
          { label: '选项2', value: '2' },
        ],
        placeholder: '请选择',
      },
      fieldName: 'select',
      label: 'Select',
    },
    {
      component: 'ApiSelect',
      componentProps: {
        afterFetch: (data: { name: string; path: string }[]) =>
          data.map((item) => ({ label: item.name, value: item.path })),
        api: getAllMenusApi,
      },
      fieldName: 'apiSelect',
      label: 'ApiSelect',
    },
    {
      component: 'ApiSelect',
      componentProps: () => ({
        api: fetchRemoteOptions,
        filterOption: false,
        notFoundContent: fetching.value ? undefined : null,
        onSearch: useDebounceFn((value: string) => {
          keyword.value = value;
        }, 300),
        params: { keyword: keyword.value || undefined },
        showSearch: true,
      }),
      fieldName: 'apiSelectRemote',
      label: 'ApiSelect（远程）',
      renderComponentContent: () => ({
        notFoundContent: fetching.value ? h(Spin) : undefined,
      }),
    },
    {
      component: 'TreeSelect',
      componentProps: {
        allowClear: true,
        placeholder: '树选择',
        treeData: [
          {
            label: '根节点',
            value: 'root',
            children: [
              { label: '子节点 A', value: 'a' },
              { label: '子节点 B', value: 'b' },
            ],
          },
        ],
      },
      fieldName: 'treeSelect',
      label: 'TreeSelect',
    },
    {
      component: 'ApiTreeSelect',
      componentProps: {
        afterFetch: (data: any[]) => data,
        api: getAllMenusApi,
        labelField: 'name',
        valueField: 'path',
        childrenField: 'children',
      },
      fieldName: 'apiTreeSelect',
      label: 'ApiTreeSelect',
    },
    {
      component: 'Divider',
      fieldName: '_divider_radio',
      formItemClass: 'col-span-full pb-0',
      hideLabel: true,
      renderComponentContent: () => ({
        default: () => h('div', { class: 'font-medium' }, '单选 / 多选 / 开关'),
      }),
    },
    {
      component: 'RadioGroup',
      componentProps: {
        options: [
          { label: '选项1', value: '1' },
          { label: '选项2', value: '2' },
        ],
      },
      fieldName: 'radioGroup',
      label: 'RadioGroup',
    },
    {
      component: 'Radio',
      fieldName: 'radio',
      label: '',
      renderComponentContent: () => ({
        default: () => ['单选 Radio'],
      }),
    },
    {
      component: 'CheckboxGroup',
      componentProps: {
        options: [
          { label: '选项1', value: '1' },
          { label: '选项2', value: '2' },
        ],
      },
      fieldName: 'checkboxGroup',
      label: 'CheckboxGroup',
    },
    {
      component: 'Checkbox',
      fieldName: 'checkbox',
      label: '',
      renderComponentContent: () => ({
        default: () => ['我已阅读并同意'],
      }),
      rules: z.boolean().refine((v) => v, { message: '请勾选' }),
    },
    {
      component: 'Switch',
      componentProps: { class: 'w-auto' },
      fieldName: 'switch',
      label: 'Switch',
    },
    {
      component: 'Divider',
      fieldName: '_divider_date',
      formItemClass: 'col-span-full pb-0',
      hideLabel: true,
      renderComponentContent: () => ({
        default: () => h('div', { class: 'font-medium' }, '日期 / 时间 / 评分'),
      }),
    },
    {
      component: 'DatePicker',
      fieldName: 'datePicker',
      label: 'DatePicker',
    },
    {
      component: 'RangePicker',
      fieldName: 'rangePicker',
      label: 'RangePicker',
    },
    {
      component: 'TimePicker',
      fieldName: 'timePicker',
      label: 'TimePicker',
    },
    {
      component: 'Rate',
      fieldName: 'rate',
      label: 'Rate',
    },
    {
      component: 'IconPicker',
      fieldName: 'iconPicker',
      label: 'IconPicker',
    },
    {
      component: 'Divider',
      fieldName: '_divider_upload',
      formItemClass: 'col-span-full pb-0',
      hideLabel: true,
      renderComponentContent: () => ({
        default: () => h('div', { class: 'font-medium' }, '上传 / 子表 / 按钮'),
      }),
    },
    {
      component: 'OosFile',
      componentProps: {
        maxCount: 3,
        multiple: true,
      },
      defaultValue: [],
      fieldName: 'oosFile',
      label: 'OosFile',
      renderComponentContent: () => ({
        default: () => h(Button, () => '点击上传'),
      }),
    },
    {
      component: 'SubTable',
      defaultValue: [],
      fieldName: 'subTable',
      formItemClass: 'col-span-full',
      label: 'SubTable',
      componentProps: {
        columns: subTableColumns,
        maxHeight: 240,
        modalTitle: '编辑子表行',
      },
    },
    {
      component: 'DefaultButton',
      componentProps: {
        onClick: () => message.info('DefaultButton'),
      },
      fieldName: '_defaultButton',
      hideLabel: true,
      renderComponentContent: () => ({
        default: () => 'DefaultButton',
      }),
    },
    {
      component: 'PrimaryButton',
      componentProps: {
        onClick: () => message.info('PrimaryButton'),
      },
      fieldName: '_primaryButton',
      hideLabel: true,
      renderComponentContent: () => ({
        default: () => 'PrimaryButton',
      }),
    },
    {
      component: 'Space',
      fieldName: '_space',
      formItemClass: 'col-span-full',
      hideLabel: true,
      renderComponentContent: () => ({
        default: () => h('span', { class: 'text-muted-foreground text-sm' }, 'Space 布局容器'),
      }),
    },
    {
      component: 'Input',
      componentProps: { placeholder: '自定义 label' },
      fieldName: 'customLabel',
      label: () => h(Tag, { color: 'processing' }, () => '自定义 Label'),
    },
  ],
  wrapperClass: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
});

async function onSubmit(values: Record<string, any>) {
  submitResult.value = JSON.stringify(values, null, 2);
  message.success($t('demos.formComponents.submitSuccess'));
}

function handleReset() {
  formApi.resetForm();
  submitResult.value = '';
}

function handleSetValues() {
  formApi.setValues({
    autoComplete: 'Burns Bay Rd',
    checkbox: true,
    checkboxGroup: ['1'],
    datePicker: dayjs('2024-06-01'),
    input: 'demo',
    inputNumber: 99,
    mentions: '@afc163',
    radio: true,
    radioGroup: '1',
    rangePicker: [dayjs('2024-06-01'), dayjs('2024-06-09')],
    rate: 4,
    select: '1',
    switch: true,
    textarea: '多行文本示例',
    timePicker: dayjs('2024-06-01 12:00:00'),
    treeSelect: 'a',
  });
}
</script>

<template>
  <Page
    :description="$t('demos.formComponents.description')"
    :title="$t('demos.formComponents.title')"
  >
    <Card :title="$t('demos.formComponents.formTitle')">
      <template #extra>
        <Space>
          <Button @click="handleSetValues">
            {{ $t('demos.formComponents.setValues') }}
          </Button>
          <Button @click="handleReset">{{ $t('common.reset') }}</Button>
          <Button type="primary" @click="formApi.validateAndSubmitForm()">
            {{ $t('common.confirm') }}
          </Button>
        </Space>
      </template>
      <Form />
    </Card>

    <Card class="mt-4" :title="$t('demos.formComponents.resultTitle')">
      <pre
        v-if="submitResult"
        class="bg-muted overflow-auto rounded-md p-4 text-sm"
      >
        {{ submitResult }}
      </pre>
      <div v-else class="text-muted-foreground text-sm">
        {{ $t('demos.formComponents.resultEmpty') }}
      </div>
    </Card>
  </Page>
</template>
