<script lang="ts" setup>
import type { DevReportApi } from '../api';

import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import { Page } from '@vben/common-ui';

import { downloadFileFromBlob } from '@vben/utils';

import { Button, message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { $t } from '#/locales';

import { exportByCode, getSchemaByCode, listByCode, pageByCode } from '../api';
import { buildColumns, buildSearchSchema } from './data';

const route = useRoute();

const schema = ref<DevReportApi.Schema>();
const exporting = ref(false);

const code = computed(() =>
  String(route.query.code || route.params.code || ''),
);

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    showCollapseButton: false,
    schema: [],
    submitOnEnter: true,
  },
  gridOptions: {
    columns: [],
    height: 'auto',
    pagerConfig: { enabled: true },
    proxyConfig: {
      sort: true,
      ajax: {
        query: async ({ page, sort }, formValues) => {
          if (!schema.value) {
            return { records: [], totalRow: 0 };
          }
          const params: Record<string, any> = {
            code: code.value,
            ...formValues,
            pageNumber: page.currentPage,
            pageSize: page.pageSize,
          };
          if (sort?.field) {
            params.sortField = sort.field;
            params.sortOrder = sort.order || 'asc';
          }
          if (schema.value.isPage !== '0') {
            return await pageByCode(params);
          }
          const records = await listByCode(params);
          return { records, totalRow: records.length };
        },
      },
    },
    sortConfig: { remote: true, trigger: 'default' },
    toolbarConfig: {
      custom: true,
      export: false,
      refresh: { code: 'query' },
      zoom: true,
    },
  } as VxeTableGridOptions,
});

async function setupGrid(current: DevReportApi.Schema) {
  await gridApi.setGridOptions({
    columns: buildColumns(current),
    pagerConfig: { enabled: current.isPage !== '0' },
  });
  gridApi.setState({
    formOptions: {
      schema: buildSearchSchema(current),
      showCollapseButton: false,
      submitOnEnter: true,
    },
  });
  await gridApi.query();
}

async function loadSchema() {
  if (!code.value) {
    message.error($t('develop.report.codeRequired'));
    return;
  }
  schema.value = await getSchemaByCode(code.value);
  await setupGrid(schema.value);
}

async function handleExport() {
  if (!schema.value) return;
  exporting.value = true;
  try {
    const formValues = await gridApi.formApi.getValues();
    const sort = gridApi.grid?.getSortColumns?.()?.[0];
    const blob = await exportByCode({
      code: code.value,
      ...formValues,
      ...(sort?.field
        ? { sortField: sort.field, sortOrder: sort.order || 'asc' }
        : {}),
    });
    const baseName = schema.value.name || schema.value.code || 'report';
    downloadFileFromBlob({
      fileName: `${baseName}.xlsx`,
      source: blob,
    });
    message.success($t('develop.report.exportSuccess'));
  } finally {
    exporting.value = false;
  }
}

onMounted(loadSchema);
watch(code, (value, oldValue) => {
  if (value && value !== oldValue) loadSchema();
});
</script>

<template>
  <Page auto-content-height>
    <Grid :table-title="schema?.name || $t('develop.report.previewTitle')">
      <template #toolbar-tools>
        <Button :loading="exporting" @click="handleExport">
          {{ $t('develop.report.export') }}
        </Button>
      </template>
    </Grid>
  </Page>
</template>
