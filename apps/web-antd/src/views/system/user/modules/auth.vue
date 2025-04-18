<script setup lang="ts">
import type { Recordable } from '@vben/types';

import { onMounted, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { Button, Divider, Select } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getDeptList, getPostTree, getRoleAllList } from '#/api';
import { $t } from '#/locales';

const deptTree = ref<Recordable<any>[]>([]);
const postOptions = ref<Recordable<any>[]>([]);
const roleOptions = ref<Recordable<any>[]>([]);

const userId = ref<string>();
const postList = ref<Recordable<any>[]>([]);

const roleId = ref<string[]>();

async function loadDeptTree() {
  const res = await getDeptList();
  deptTree.value = res;
}
async function loadPostTree() {
  const res = await getPostTree({});
  postOptions.value = res;
}
async function loadRoleOptions() {
  const res = await getRoleAllList();
  roleOptions.value = res;
}

onMounted(() => {
  loadDeptTree();
  loadPostTree();
  loadRoleOptions();
});
// 加载授权配置
async function loadAuthConfig() {}

const [Drawer, drawerApi] = useVbenDrawer({
  class: 'w-1/3',
  onOpenChange(isOpen) {
    if (isOpen) {
      userId.value = drawerApi.getData<Recordable<any>>().id;
      loadAuthConfig();
    }
  },
  onConfirm() {},
});
const document = ref<HTMLElement>();
onMounted(() => {
  document.value = window.document.body;
});

const [Grid] = useVbenVxeGrid({
  showSearchForm: false,
  gridOptions: {
    border: false,
    height: '100%',
    data: postList.value,
    pagerConfig: { enabled: false },
    columns: [
      {
        field: 'dept',
        title: $t('system.user.auth.dept'),
        cellRender: {
          name: 'CellTreeSelect',
          props: {
            class: 'w-full',
            getPopupContainer: (_) => {
              return document.value;
            },
            treeData: deptTree,
            treeDefaultExpandAll: true,
            fieldNames: {
              label: 'name',
              value: 'id',
              children: 'children',
            },
          },
        },
      },
      {
        field: 'post',
        title: $t('system.user.auth.post'),
        cellRender: {
          name: 'CellTreeSelect',
          props: {
            class: 'w-full',
            getPopupContainer: (_) => {
              return document.value;
            },
            treeData: postOptions,
            treeDefaultExpandAll: true,
            fieldNames: {
              label: 'name',
              value: 'id',
              children: 'children',
            },
          },
        },
      },
      {
        field: 'isMain',
        title: $t('system.user.auth.isMain'),
        width: 100,
        cellRender: {
          name: 'CellSwitch',
          props: {
            checkedChildren: $t('common.yes'),
            unCheckedChildren: $t('common.no'),
          },
        },
      },
    ],
  },
});
function onAddPost() {
  postList.value.push({
    dept: '',
    post: '',
    isMain: false,
  });
}
const filterOption = (input: string, option: any) => {
  return option.name.toLowerCase().includes(input.toLowerCase());
};
</script>

<template>
  <Drawer :title="$t('system.user.authorize')">
    <Divider orientation="left">
      <span class="text-lg font-bold">{{ $t('system.user.auth.post') }}</span>
    </Divider>
    <div class="h-1/3 overflow-y-auto p-4">
      <Grid>
        <template #toolbar-tools>
          <Button type="primary" @click="onAddPost">
            <Plus class="size-5" />
            {{ $t('ui.actionTitle.create', [$t('system.user.auth.post')]) }}
          </Button>
        </template>
      </Grid>
    </div>
    <Divider orientation="left">
      <span class="text-lg font-bold">{{ $t('system.user.auth.role') }}</span>
    </Divider>
    <div class="h-1/3 overflow-y-auto p-4">
      <Select
        v-model="roleId"
        multiple
        class="w-1/2"
        :options="roleOptions"
        allow-clear
        show-search
        :field-names="{ label: 'name', value: 'id' }"
        :placeholder="$t('ui.placeholder.select')"
        :filter-option="filterOption"
      />
    </div>
  </Drawer>
</template>
