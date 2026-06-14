<script lang="ts" setup>
import type { DevFormApi } from './api';

import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { useRouter } from 'vue-router';

import { Page, useVbenDrawer, useVbenModal } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { Button, message, Modal } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { $t } from '#/locales';

import {
  generateDevFormCode,
  getDevFormPage,
  removeDevForm,
  syncDevFormDb,
} from './api';
import { useColumns, useSearchSchema } from './data';
import Form from './modules/form.vue';
import ImportTable from './modules/import-table.vue';

const router = useRouter();

const [FormDrawer, formDrawerApi] = useVbenDrawer({
  connectedComponent: Form,
  destroyOnClose: true,
});

const [ImportModal, importModalApi] = useVbenModal({
  connectedComponent: ImportTable,
  destroyOnClose: true,
});

function onCreate() {
  formDrawerApi.setData({}).open();
}

function onEdit(row: DevFormApi.DevForm) {
  formDrawerApi.setData(row).open();
}

function onData(row: DevFormApi.DevForm) {
  router.push({
    path: '/dev/runtime',
    query: { formId: row.id },
  });
}

function onSyncDb(row: DevFormApi.DevForm) {
  Modal.confirm({
    title: $t('develop.form.syncDbConfirmTitle'),
    content: $t('develop.form.syncDbConfirmContent', [row.tableName]),
    onOk: async () => {
      const result = await syncDevFormDb(row.id!);
      message.success(
        result.messages?.join('；') || $t('develop.form.syncDbSuccess'),
      );
      refreshGrid();
    },
  });
}

async function onGenerateCode(row: DevFormApi.DevForm) {
  await generateDevFormCode(row.id!);
  message.success($t('develop.form.generateCodeSuccess'));
}

function onDelete(row: DevFormApi.DevForm) {
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting', [row.tableName]),
    duration: 0,
    key: 'action_process_msg',
  });
  removeDevForm(row.id!)
    .then(() => {
      message.success({
        content: $t('ui.actionMessage.deleteSuccess', [row.tableName]),
        key: 'action_process_msg',
      });
      refreshGrid();
    })
    .finally(() => hideLoading());
}

function onActionClick({
  code,
  row,
}: {
  code: string;
  row: DevFormApi.DevForm;
}) {
  switch (code) {
    case 'data': {
      onData(row);
      break;
    }
    case 'delete': {
      onDelete(row);
      break;
    }
    case 'edit': {
      onEdit(row);
      break;
    }
    case 'generateCode': {
      onGenerateCode(row);
      break;
    }
    case 'syncDb': {
      onSyncDb(row);
      break;
    }
  }
}

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    showCollapseButton: false,
    schema: useSearchSchema(),
    submitOnEnter: true,
  },
  gridOptions: {
    columns: useColumns(onActionClick),
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          return await getDevFormPage({
            pageNumber: page.currentPage,
            pageSize: page.pageSize,
            ...formValues,
          });
        },
      },
    },
    toolbarConfig: {
      custom: true,
      export: false,
      refresh: { code: 'query' },
      zoom: true,
    },
  } as VxeTableGridOptions,
});

async function refreshGrid() {
  await gridApi.query();
}

function onImportFromDb() {
  importModalApi.setData({ formId: '' }).open();
}
</script>

<template>
  <Page auto-content-height>
    <FormDrawer @success="refreshGrid" />
    <ImportModal
      @preview="(data) => formDrawerApi.setData(data).open()"
      @success="refreshGrid"
    />
    <Grid :table-title="$t('develop.form.title')">
      <template #toolbar-tools>
        <Button @click="onImportFromDb">
          {{ $t('develop.form.importFromDb') }}
        </Button>
        <Button type="primary" @click="onCreate">
          <Plus class="size-5" />
          {{ $t('ui.actionTitle.create', [$t('develop.form.title')]) }}
        </Button>
      </template>
    </Grid>
  </Page>
</template>
