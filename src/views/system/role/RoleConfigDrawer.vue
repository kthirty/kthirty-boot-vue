<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    title="权限配置"
    width="40%"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm">
      <template #menu="{ model, field }">
        <BasicTree
          v-model:value="model[field]"
          :treeData="treeData"
          :fieldNames="{ title: 'name', key: 'id' }"
          checkable
          toolbar
          default-expand-all
        />
      </template>
    </BasicForm>
  </BasicDrawer>
</template>
<script setup lang="ts">
  import { BasicDrawer, useDrawerInner } from '@/components/Drawer';
  import { BasicTree, TreeItem } from '@/components/Tree';
  import { BasicForm, useForm } from '@/components/Form';
  import { ref, unref } from 'vue';
  import { getMenuList } from '@/api/system/menu';
  import { getRoleMenus } from '@/api/system/role';

  const treeData = ref<TreeItem[]>([]);

  const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
    labelWidth: 90,
    baseColProps: { span: 24 },
    schemas: [
      { field: 'id', ifShow: false, component: 'Input' },
      { field: 'menus', slot: 'menu' },
    ],
    showActionButtonGroup: false,
  });
  const [registerDrawer] = useDrawerInner(async ({ record }) => {
    if (unref(treeData).length === 0) {
      treeData.value = (await getMenuList()) as any as TreeItem[];
    }
    const menus = await getRoleMenus(record['id']);
    await setFieldsValue({
      id: record['id'],
      menus,
    });
  });

  async function handleSubmit() {
    const values = await validate();
    console.log('handleSubmit', values);
  }
</script>
