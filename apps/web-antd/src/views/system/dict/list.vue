<script lang="ts" setup>
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { SystemDictApi } from '#/api';

import { ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { Button, message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteDictType, getDictTypeList } from '#/api';
import { $t } from '#/locales';

import { useColumns, useSearchSchema } from './data';
import Form from './module/form.vue';

const [FormDrawer, formDrawerApi] = useVbenDrawer({
  connectedComponent: Form,
  destroyOnClose: true,
});
const currentDictType = ref<SystemDictApi.DictType>();

const onActionClick = (params: OnActionClickParams<SystemDictApi.DictType>) => {
  switch (params.code) {
    case 'delete': {
      onDelete(params.row);
      break;
    }
    case 'edit': {
      formDrawerApi.setData(params.row).open();
      break;
    }
  }
};
function onDelete(row: SystemDictApi.DictType) {
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting', [row.name]),
    duration: 0,
    key: 'action_process_msg',
  });
  deleteDictType(row.id!).then(() => {
    message.success({
      content: $t('ui.actionMessage.deleteSuccess', [row.name]),
      key: 'action_process_msg',
    });
    hideLoading();
    onRefresh();
  });
}

// 主表Grid配置
const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    showCollapseButton: false,
    schema: useSearchSchema(),
    submitOnEnter: true,
  },
  gridEvents: {
    radioChange: ({ row }: { row: SystemDictApi.DictType }) => {
      currentDictType.value = row;
    },
  },
  gridOptions: {
    columns: useColumns(onActionClick),
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          return await getDictTypeList({
            pageNumber: page.currentPage,
            pageSize: page.pageSize,
            ...formValues,
          });
        },
      },
    },
  } as VxeTableGridOptions<SystemDictApi.DictType>,
});

// 新建
function onCreate() {
  formDrawerApi.setData({}).open();
}
function onRefresh() {
  gridApi.query();
}
</script>

<template>
  <div class="bg-background flex h-screen">
    <div class="w-1/2 overflow-y-auto p-4">
      <Grid table-title="字典类型">
        <template #toolbar-tools>
          <Button type="primary" @click="onCreate">
            <Plus class="size-5" />
            新建字典类型
          </Button>
        </template>
      </Grid>
      <FormDrawer @success="onRefresh" />
    </div>
    <div class="flex-1 overflow-y-auto p-4"></div>
  </div>
</template>
