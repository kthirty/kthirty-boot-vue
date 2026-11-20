<script lang="ts" setup>
import type { DevReportApi } from '../api';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { Modal as AntdModal, Button, message, Space, Table } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { $t } from '#/locales';

import {
  getDatasourceKeys,
  getReportInfo,
  parseSql,
  saveReport,
  updateReport,
} from '../api';
import { useFormSchema, useReportItemColumns } from '../data';

const emit = defineEmits(['success']);

const loading = ref(false);
const parsing = ref(false);
const id = ref<string>();
const items = ref<DevReportApi.DevReportItem[]>([]);
const dsOptions = ref<Array<{ label: string; value: string }>>([]);

function toWhether(value: unknown, fallback: '0' | '1') {
  if (value === '1' || value === 1 || value === true || value === 'true') {
    return '1';
  }
  if (value === '0' || value === 0 || value === false || value === 'false') {
    return '0';
  }
  return fallback;
}

function addItem() {
  items.value.push({
    columnName: '',
    columnRemarks: '',
    dictCode: '',
    fieldType: 'String',
    isAllowSort: '0',
    isShowList: '1',
    isShowQuery: '0',
    listComponent: 'Text',
    queryComponent: 'Input',
    weight: items.value.length + 1,
  });
}

function removeItem(index: number) {
  items.value.splice(index, 1);
}

const columns = useReportItemColumns(removeItem);

const title = computed(() =>
  id.value
    ? $t('ui.actionTitle.edit', [$t('develop.report.title')])
    : $t('ui.actionTitle.create', [$t('develop.report.title')]),
);

const [MainForm, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
  },
  schema: useFormSchema(id),
  showDefaultActions: false,
  wrapperClass: 'grid-cols-1 md:grid-cols-2',
});

function confirm(content: string) {
  return new Promise<boolean>((resolve) => {
    AntdModal.confirm({
      cancelText: $t('common.cancel'),
      content,
      okText: $t('common.confirm'),
      onCancel: () => resolve(false),
      onOk: () => resolve(true),
      title: $t('common.prompt'),
    });
  });
}

async function handleParseSql() {
  const values = await formApi.getValues<Partial<DevReportApi.DevReport>>();
  if (!values.reportSql?.trim()) {
    message.warning($t('develop.report.reportSqlRequired'));
    return;
  }
  if (items.value.length > 0) {
    const ok = await confirm($t('develop.report.parseSqlConfirm'));
    if (!ok) return;
  }
  parsing.value = true;
  try {
    const data = await parseSql(values.reportSql, values.dsKey);
    items.value = data || [];
    message.success($t('develop.report.parseSqlSuccess', [items.value.length]));
  } finally {
    parsing.value = false;
  }
}

const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) return;
    if (items.value.length === 0) {
      message.warning($t('develop.report.noItems'));
      return;
    }
    const invalid = items.value.find((it) => !it.columnName?.trim());
    if (invalid) {
      message.warning($t('develop.report.columnNameRequired'));
      return;
    }
    const values = await formApi.getValues<Partial<DevReportApi.DevReport>>();
    const payload: DevReportApi.DevReport = {
      id: id.value,
      ...values,
      items: items.value.map((item, index) => ({
        ...item,
        isAllowSort: toWhether(item.isAllowSort, '0'),
        isShowList: toWhether(item.isShowList, '1'),
        isShowQuery: toWhether(item.isShowQuery, '0'),
        listComponent: item.listComponent || 'Text',
        queryComponent: item.queryComponent || 'Input',
        weight: item.weight ?? index + 1,
      })),
    };
    loading.value = true;
    try {
      if (payload.id) {
        await updateReport(payload);
        message.success($t('develop.report.updateSuccess'));
      } else {
        await saveReport(payload);
        message.success($t('develop.report.saveSuccess'));
      }
      modalApi.close();
      emit('success');
    } finally {
      loading.value = false;
    }
  },
  async onOpenChange(isOpen) {
    if (!isOpen) return;
    loading.value = true;
    try {
      const data = modalApi.getData<DevReportApi.DevReport>();
      id.value = data?.id;
      formApi.resetForm();
      dsOptions.value = await getDatasourceKeys();
      formApi.setState({ schema: useFormSchema(id, dsOptions.value) });
      if (data?.id) {
        const info = await getReportInfo(data.id);
        items.value = info.items || [];
        formApi.setValues(info);
      } else {
        items.value = [];
        formApi.setValues({
          ...data,
          dsKey: data?.dsKey ?? dsOptions.value[0]?.value,
          isPage: data?.isPage ?? '1',
        });
      }
    } finally {
      loading.value = false;
    }
  },
});
</script>

<template>
  <Modal :title="title" :loading="loading">
    <MainForm />
    <div class="mt-2">
      <div class="mb-2 flex items-center justify-between">
        <span class="font-medium">{{ $t('develop.report.items') }}</span>
        <Space>
          <Button type="primary" ghost :loading="parsing" @click="handleParseSql">
            {{ $t('develop.report.parseSql') }}
          </Button>
          <Button @click="addItem">{{ $t('develop.report.addItem') }}</Button>
        </Space>
      </div>
      <Table
        :columns="columns"
        :data-source="items"
        :pagination="false"
        :row-key="(record: any, index?: number) => record.id ?? index"
        bordered
        size="small"
      />
    </div>
  </Modal>
</template>
