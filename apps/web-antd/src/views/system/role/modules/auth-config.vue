<script setup lang="ts">
import type { DataNode } from 'ant-design-vue/es/tree';

import type { Recordable } from '@vben/types';

import type { SystemRoleApi } from '#/api/system/role';

import { ref } from 'vue';

import { useVbenDrawer, VbenTree } from '@vben/common-ui';

import { Spin } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { getMenuList } from '#/api/system/menu';
import { getRolePermissions, updateRolePermissions } from '#/api/system/role';
import { $t } from '#/locales';

import { useAuthorizeFormSchema } from '../data';

const emits = defineEmits(['success']);

const formData = ref<SystemRoleApi.RoleMenu>();
const permissions = ref<DataNode[]>([]);
const loadingPermissions = ref(false);

const [Form, formApi] = useVbenForm({
  schema: useAuthorizeFormSchema(),
  showDefaultActions: false,
});

const id = ref();
const [Drawer, drawerApi] = useVbenDrawer({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) return;
    const values = await formApi.getValues<SystemRoleApi.RoleMenu>();
    drawerApi.lock();
    updateRolePermissions(id.value, values).then(() => {
      emits('success');
      drawerApi.close();
    });
  },
  onOpenChange(isOpen) {
    if (isOpen) {
      const data = drawerApi.getData<SystemRoleApi.RoleMenu>();
      formApi.resetForm();
      if (data) {
        formData.value = data;
        id.value = data.id;
        drawerApi.lock();
        getRolePermissions(data.id).then((res) => {
          drawerApi.unlock();
          data.permissions = res;
          formApi.setValues(data);
        });
      } else {
        id.value = undefined;
      }

      if (permissions.value.length === 0) {
        loadPermissions();
      }
    }
  },
});

async function loadPermissions() {
  loadingPermissions.value = true;
  try {
    const res = await getMenuList();
    permissions.value = res as unknown as DataNode[];
  } finally {
    loadingPermissions.value = false;
  }
}
function getNodeClass(node: Recordable<any>) {
  const classes: string[] = [];
  if (node.value?.type === 'button') {
    classes.push('inline-flex');
    if (node.index % 3 >= 1) {
      classes.push('!pl-0');
    }
  }

  return classes.join(' ');
}
</script>

<template>
  <Drawer :title="$t('system.role.setPermissions')">
    <Form>
      <template #permissions="slotProps">
        <Spin :spinning="loadingPermissions">
          <VbenTree
            :tree-data="permissions"
            multiple
            bordered
            :default-expanded-level="2"
            :get-node-class="getNodeClass"
            v-bind="slotProps"
            value-field="id"
            label-field="meta.title"
            icon-field="meta.icon"
          >
            <template #node="{ value }">
              <!--  <IconifyIcon v-if="value?.meta?.icon" :icon="value?.meta?.icon" /> -->
              {{ $t(value?.meta?.title ?? '') }}
            </template>
          </VbenTree>
        </Spin>
      </template>
    </Form>
  </Drawer>
</template>
