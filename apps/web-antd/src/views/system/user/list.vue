<script lang="ts" setup>
import type { DataNode } from 'ant-design-vue/es/tree';

import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { SystemDeptApi } from '#/api/system/dept';
import type { SystemUserApi } from '#/api/system/user';

import { onMounted, ref, watch } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { Button, InputSearch, message, Spin, Tree } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getDeptList } from '#/api/system/dept';
import { deleteUser, getUserPage } from '#/api/system/user';
import { $t } from '#/locales';

import { useColumns, useGridFormSchema } from './data';
import Auth from './modules/auth.vue';
import Form from './modules/form.vue';

const deptTree = ref<DataNode[]>([]);
const loadingDept = ref(false);
const currentDept = ref();
// 加载部门树
async function loadDept(data?: SystemDeptApi.SystemDept) {
  loadingDept.value = true;
  try {
    const res = await getDeptList(data);
    deptTree.value = res as unknown as DataNode[];
  } finally {
    loadingDept.value = false;
  }
}
onMounted(loadDept);
const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: useGridFormSchema(),
    submitOnEnter: true,
  },
  gridOptions: {
    columns: useColumns(onActionClick),
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          return await getUserPage({
            pageNumber: page.currentPage,
            pageSize: page.pageSize,
            deptIds: currentDept.value?.[0],
            ...formValues,
          });
        },
      },
    },
    toolbarConfig: {
      custom: true,
      export: true,
      refresh: { code: 'query' },
      search: true,
      zoom: true,
    },
  } as VxeTableGridOptions<SystemUserApi.SystemUser>,
});
async function onActionClick(e: OnActionClickParams<SystemUserApi.SystemUser>) {
  switch (e.code) {
    case 'authorize': {
      onAuthorize(e.row);
      break;
    }

    case 'delete': {
      onDelete(e.row);
      break;
    }
    case 'edit': {
      onEdit(e.row);
      break;
    }
  }
}
async function onAuthorize(row: SystemUserApi.SystemUser) {
  authDrawerApi.setData({ id: row.id }).open();
}

async function onCreate() {
  formDrawerApi.setData({}).open();
}
async function onEdit(row: SystemUserApi.SystemUser) {
  formDrawerApi.setData(row).open();
}
async function onDelete(row: SystemUserApi.SystemUser) {
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting', [row.name]),
    duration: 0,
    key: 'action_process_msg',
  });
  deleteUser(row.id!)
    .then(() => {
      message.success({
        content: $t('ui.actionMessage.deleteSuccess', [row.realName]),
        key: 'action_process_msg',
      });
      onRefresh();
    })
    .catch(() => {
      hideLoading();
    });
}
function onRefresh() {
  gridApi.query();
}
const [FormDrawer, formDrawerApi] = useVbenDrawer({
  connectedComponent: Form,
  destroyOnClose: true,
});
watch(currentDept, () => {
  onRefresh();
});
const [AuthDrawer, authDrawerApi] = useVbenDrawer({
  connectedComponent: Auth,
  destroyOnClose: true,
});
</script>
<template>
  <div class="bg-background flex h-screen">
    <div class="w-1/4 overflow-y-auto p-4">
      <Spin :spinning="loadingDept">
        <div class="mb-2">
          <InputSearch
            placeholder="请输入部门名称"
            class="w-full"
            @search="(name) => loadDept({ name })"
          />
        </div>
        <Tree
          v-if="deptTree.length > 0"
          selectable
          v-model:selected-keys="currentDept"
          :tree-data="deptTree"
          :default-expand-all="true"
          :field-names="{ key: 'id', title: 'name' }"
        />
      </Spin>
    </div>
    <div class="flex-1 overflow-y-auto p-4">
      <FormDrawer />
      <AuthDrawer />
      <Grid :table-title="$t('system.user.list')">
        <template #toolbar-tools>
          <Button type="primary" @click="onCreate">
            <Plus class="size-5" />
            {{ $t('ui.actionTitle.create', [$t('system.user.name')]) }}
          </Button>
        </template>
      </Grid>
    </div>
  </div>
</template>
