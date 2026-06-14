<script lang="ts" setup>
import type { DevFormRuntimeApi } from '../api';

import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import { Page } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { Button, message, Upload } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { $t } from '#/locales';

import {
  downloadDevFormImportTemplate,
  exportDevFormData,
  getDevFormDataPage,
  getDevFormDataTree,
  getDevFormSchema,
  importDevFormData,
  removeDevFormData,
} from '../api';
import {
  buildGridColumns,
  buildSearchSchema,
  isPageList,
  isTreeList,
} from '../composables/useDevFormSchema';
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
      ajax: {
        query: async ({ page }, formValues) => {
          if (!schema.value || !formId.value) {
            return { records: [], totalRow: 0 };
          }
          if (isTreeList(schema.value)) {
            const records = await getDevFormDataTree(formId.value, formValues);
            return { records, totalRow: records.length };
          }
          return await getDevFormDataPage(formId.value, {
            pageNumber: page.currentPage,
            pageSize: page.pageSize,
            ...formValues,
          });
        },
      },
    },
    rowConfig: { keyField: 'id' },
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
  await gridApi.formApi.setState({
    schema: buildSearchSchema(currentSchema),
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
  await exportDevFormData(formId.value, formValues);
}

async function onDownloadTemplate() {
  await downloadDevFormImportTemplate(formId.value);
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
        <Button
          v-if="schema.features.enableAdd"
          type="primary"
          @click="onCreate"
        >
          <Plus class="size-5" />
          {{ $t('ui.actionTitle.create', [schema.title]) }}
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
      </template>
    </Grid>
    <div v-else-if="!loading" class="p-8 text-center text-gray-500">
      {{ $t('develop.runtime.noFormId') }}
    </div>
  </Page>
</template>
