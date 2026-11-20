<script lang="ts" setup>
import type { DevFormRuntimeApi } from './api';

import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import { Page } from '@vben/common-ui';
import { Plus } from '@vben/icons';
import { downloadFileFromBlob } from '@vben/utils';

import { Button, message, Modal, Space, Upload } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { $t } from '#/locales';

import {
  downloadDevFormImportTemplate,
  exportDevFormData,
  getDevFormDataList,
  getDevFormDataPage,
  getDevFormDataTree,
  getDevFormSchema,
  importDevFormData,
  removeDevFormData,
  removeDevFormDataBatch,
} from './api';
import {
  buildGridColumns,
  buildSearchSchema,
  isPageList,
  isTreeList,
} from './composables/useDevFormSchema';
import DataForm from './modules/form.vue';

const route = useRoute();
const formId = computed(() => String(route.query.formId || ''));
const schema = ref<DevFormRuntimeApi.Schema>();
const dataFormRef = ref<InstanceType<typeof DataForm>>();
const loading = ref(true);
const gridReady = ref(false);

function onActionClick({ code, row }: { code: string; row: any }) {
  switch (code) {
    case 'delete': {
      onDelete(row);
      break;
    }
    case 'edit': {
      onEdit(row);
      break;
    }
  }
}

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    showCollapseButton: true,
    schema: [],
    submitOnEnter: true,
  },
  gridOptions: {
    columns: [],
    height: 'auto',
    keepSource: true,
    pagerConfig: { enabled: true },
    proxyConfig: {
      sort: true,
      ajax: {
        query: async ({ page, sort }, formValues) => {
          if (!schema.value || !formId.value) {
            return { records: [], totalRow: 0 };
          }
          const params: Record<string, any> = { ...formValues };
          Object.keys(params).forEach((key) => {
            if (Array.isArray(params[key])) {
              params[key] = params[key].filter((item) => item != null && item !== '').join(',');
            }
          });
          if (sort?.field) {
            params.sortField = sort.field;
            params.sortOrder = sort.order || 'asc';
          }
          if (isTreeList(schema.value)) {
            const records = await getDevFormDataTree(formId.value, params);
            return { records, totalRow: records.length };
          }
          if (!isPageList(schema.value)) {
            const records = await getDevFormDataList(formId.value, params);
            return { records, totalRow: records.length };
          }
          return await getDevFormDataPage(formId.value, {
            pageNumber: page.currentPage,
            pageSize: page.pageSize,
            ...params,
          });
        },
      },
    },
    rowConfig: { keyField: 'id' },
    sortConfig: { remote: true, trigger: 'default' },
    toolbarConfig: {
      custom: true,
      export: false,
      refresh: { code: 'query' },
      zoom: true,
    },
  } as VxeTableGridOptions,
});

async function setupGrid(currentSchema: DevFormRuntimeApi.Schema) {
  const options: VxeTableGridOptions = {
    columns: buildGridColumns(currentSchema, onActionClick),
    pagerConfig: { enabled: isPageList(currentSchema) },
    rowConfig: { keyField: currentSchema.primaryKeyField || 'id' },
    sortConfig: { remote: !isTreeList(currentSchema), trigger: 'default' },
  };
  if (isTreeList(currentSchema)) {
    options.treeConfig = {
      transform: false,
      rowField: currentSchema.primaryKeyField || 'id',
      parentField: currentSchema.treeConfig?.parentField || 'parentId',
      childrenField: 'children',
      expandAll: true,
    };
  }
  await gridApi.setGridOptions(options);
  // 使用 gridApi.setState 更新 formOptions，这样会自动触发 formApi 的响应式更新
  gridApi.setState({
    formOptions: {
      schema: buildSearchSchema(currentSchema),
      showCollapseButton: true,
      submitOnEnter: true,
    },
  });
  gridReady.value = true;
  await gridApi.query();
}

async function loadSchema() {
  gridReady.value = false;
  if (!formId.value) {
    schema.value = undefined;
    loading.value = false;
    return;
  }
  loading.value = true;
  try {
    schema.value = await getDevFormSchema(formId.value);
    await setupGrid(schema.value);
  } finally {
    loading.value = false;
  }
}

onMounted(loadSchema);
watch(formId, loadSchema);

function onCreate() {
  dataFormRef.value?.open();
}

function onEdit(row: Record<string, any>) {
  dataFormRef.value?.open(row);
}

function onDelete(row: Record<string, any>) {
  const pk = schema.value?.primaryKeyField || 'id';
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting', [row[pk]]),
    duration: 0,
    key: 'runtime_delete',
  });
  removeDevFormData(formId.value, row[pk])
    .then(() => {
      message.success($t('ui.actionMessage.deleteSuccess', [row[pk]]));
      refreshGrid();
    })
    .finally(() => hideLoading());
}

async function onExport() {
  const formValues = await gridApi.formApi.getValues();
  const blob = await exportDevFormData(formId.value, formValues);
  downloadFileFromBlob({
    fileName: `${schema.value?.title || 'form'}.xlsx`,
    source: blob,
  });
}

function onBatchDelete() {
  const pk = schema.value?.primaryKeyField || 'id';
  const ids = gridApi.grid
    ?.getCheckboxRecords?.()
    ?.map((row: Record<string, any>) => row[pk])
    .filter(Boolean);
  if (!ids?.length) {
    message.warning($t('develop.runtime.noSelection'));
    return;
  }
  Modal.confirm({
    title: $t('develop.runtime.batchDelete'),
    onOk: async () => {
      await removeDevFormDataBatch(formId.value, ids);
      message.success($t('ui.actionMessage.deleteSuccess', [ids.length]));
      refreshGrid();
    },
  });
}

async function onDownloadTemplate() {
  const blob = await downloadDevFormImportTemplate(formId.value);
  downloadFileFromBlob({
    fileName: `${schema.value?.tableName || schema.value?.title || 'form'}_import_template.xlsx`,
    source: blob,
  });
}

async function onImport(file: File) {
  const result = await importDevFormData(formId.value, file);
  message.success(
    $t('develop.runtime.importResult', [result.success, result.fail]),
  );
  refreshGrid();
  return false;
}

async function refreshGrid() {
  await gridApi.query();
  if (schema.value && isTreeList(schema.value)) {
    gridApi.grid?.setAllTreeExpand(true);
  }
}
</script>

<template>
  <Page auto-content-height>
    <DataForm
      v-if="schema"
      ref="dataFormRef"
      :form-id="formId"
      :schema="schema"
      @success="refreshGrid"
    />
    <Grid
      v-if="schema && gridReady"
      :table-title="schema.title || $t('develop.runtime.title')"
    >
      <template #toolbar-tools>
        <Space wrap>
          <Button
            v-if="schema.features.enableAdd"
            type="primary"
            @click="onCreate"
          >
            <Plus class="size-5" />
            {{ $t('ui.actionTitle.create', [schema.title]) }}
          </Button>
          <Button
            v-if="schema.features.enableBatchDelete && !isTreeList(schema)"
            danger
            @click="onBatchDelete"
          >
            {{ $t('develop.runtime.batchDelete') }}
          </Button>
          <Button v-if="schema.features.enableExport" @click="onExport">
            {{ $t('develop.runtime.export') }}
          </Button>
          <Button v-if="schema.features.enableImport" @click="onDownloadTemplate">
            {{ $t('develop.runtime.importTemplate') }}
          </Button>
          <Upload
            v-if="schema.features.enableImport"
            :before-upload="onImport"
            :show-upload-list="false"
            accept=".xlsx,.xls"
          >
            <Button>{{ $t('develop.runtime.import') }}</Button>
          </Upload>
        </Space>
      </template>
    </Grid>
    <div v-else-if="!loading" class="p-8 text-center text-gray-500">
      {{ $t('develop.runtime.noFormId') }}
    </div>
  </Page>
</template>
