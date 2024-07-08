<template>
  <BasicDrawer v-bind="$attrs" @register="registerDrawer" title="拥有此角色的用户" width="40%">
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button type="primary" @click="handleAdd"> 添加用户 </a-button>
      </template>
    </BasicTable>
  </BasicDrawer>
</template>
<script setup lang="ts">
  import { BasicDrawer, useDrawerInner } from '@/components/Drawer';
  import { BasicTable, useTable } from '@/components/Table';
  import { getUsersByRole } from '@/api/system/role';
  import { ref } from 'vue';
  import { RoleListItem } from '@/api/system/model/role';

  const currentRole = ref<RoleListItem>();
  const [registerDrawer] = useDrawerInner(async ({ record }) => {
    currentRole.value = record;
    console.log(currentRole.value);
  });
  const [registerTable] = useTable({
    api: () => getUsersByRole(currentRole.value!.id),
    showIndexColumn: false,
    columns: [
      {
        title: '真实姓名',
        dataIndex: 'realName',
      },
      {
        title: '用户代码',
        dataIndex: 'code',
      },
      {
        title: '登录名',
        dataIndex: 'username',
      },
      {
        title: '归属部门',
        dataIndex: 'deptName',
      },
    ],
  });

  /**
   * 新增用户
   */
  function handleAdd() {}
</script>
