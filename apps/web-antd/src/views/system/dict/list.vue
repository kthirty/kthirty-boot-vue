<script lang="ts" setup>
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { SystemDictApi } from '#/api';

import { ref } from 'vue';

import { Page, useVbenDrawer } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { Button, message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  deleteDictItem,
  deleteDictType,
  getDictItemList,
  getDictTypeList,
} from '#/api';
import { $t } from '#/locales';

import {
  useColumns,
  useSearchSchema,
  useSubColumns,
  useSubSearchSchema,
} from './data';
import Form from './module/form.vue';
import SubForm from './module/sub-form.vue';

const [FormDrawer, formDrawerApi] = useVbenDrawer({
  connectedComponent: Form,
  destroyOnClose: true,
});
const [SubFormDrawer, subFormDrawerApi] = useVbenDrawer({
  connectedComponent: SubForm,
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
      onSubRefresh();
    },
  },
  gridOptions: {
    radioConfig: {
      reserve: true,
      trigger: 'row',
    },
    rowConfig: {
      keyField: 'id',
    },
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
function onSubRefresh() {
  subGridApi.query();
}

const onSubActionClick = (
  params: OnActionClickParams<SystemDictApi.DictItem>,
) => {
  switch (params.code) {
    case 'delete': {
      onItemDelete(params.row);
      break;
    }
    case 'edit': {
      subFormDrawerApi.setData(params.row).open();
      break;
    }
  }
};
function onItemDelete(row: SystemDictApi.DictItem) {
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting', [row.label]),
    duration: 0,
    key: 'action_process_msg',
  });
  deleteDictItem(row.id!).then(() => {
    message.success({
      content: $t('ui.actionMessage.deleteSuccess', [row.label]),
      key: 'action_process_msg',
    });
    hideLoading();
    onSubRefresh();
  });
}

// 子表
const [SubGrid, subGridApi] = useVbenVxeGrid({
  formOptions: {
    showCollapseButton: false,
    schema: useSubSearchSchema(),
    submitOnEnter: true,
  },
  gridOptions: {
    columns: useSubColumns(onSubActionClick),
    height: 'auto',
    keepSource: true,
    pagerConfig: {
      enabled: false,
    },
    treeConfig: {
      parentField: 'parentId',
      childrenField: 'children',
      rowField: 'id',
      transform: false,
      expandAll: true,
    },
    proxyConfig: {
      ajax: {
        query: async (_, formValues) => {
          return await getDictItemList({
            code: currentDictType.value?.code || '',
            ...formValues,
          });
        },
      },
    },
  } as VxeTableGridOptions<SystemDictApi.DictItem>,
});
function onSubCreate() {
  subFormDrawerApi.setData({ code: currentDictType.value!.code }).open();
}
</script>

<template>
  <Page auto-content-height>
    <div class="bg-background flex h-full">
      <div class="h-full w-1/2 p-4">
        <Grid :table-title="$t('system.dict.title')">
          <template #toolbar-tools>
            <Button type="primary" @click="onCreate">
              <Plus class="size-5" />
              {{ $t('ui.actionTitle.create', [$t('system.dict.title')]) }}
            </Button>
          </template>
        </Grid>
        <FormDrawer @success="onRefresh" />
      </div>
      <div class="h-full flex-1 p-4">
        <SubGrid :table-title="$t('system.dict.subTitle')">
          <template #toolbar-tools>
            <Button
              type="primary"
              @click="onSubCreate"
              v-show="currentDictType?.code"
            >
              <Plus class="size-5" />
              {{ $t('ui.actionTitle.create', [$t('system.dict.subTitle')]) }}
            </Button>
          </template>
        </SubGrid>
        <SubFormDrawer @success="onSubRefresh" />
      </div>
    </div>
  </Page>
</template>
