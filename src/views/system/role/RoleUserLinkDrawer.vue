<template>
  <BasicDrawer v-bind="$attrs" @register="registerDrawer" title="拥有此角色的用户" width="50%">
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button type="primary" @click="handleAdd"> 添加用户 </a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                icon: 'ant-design:delete-outlined',
                tooltip: '删除关联',
                color: 'error',
                popConfirm: {
                  title: '是否确认删除',
                  placement: 'left',
                  confirm: handleDelete.bind(null, record),
                },
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <BasicDrawer @register="registerUserSelectDrawer" width="45%" showFooter @ok="handleOk">
      <BasicTable @register="registerUserTable"
    /></BasicDrawer>
  </BasicDrawer>
</template>
<script setup lang="ts">
  import { BasicDrawer, useDrawer, useDrawerInner } from '@/components/Drawer';
  import { BasicTable, TableAction, useTable } from '@/components/Table';
  import { getUsersByRole, removeUserLink, addUserLink } from '@/api/system/role';
  import { ref } from 'vue';
  import { RoleListItem } from '@/api/system/model/role';
  import { getUserList } from '@/api/system/user';

  const currentRole = ref<RoleListItem>();
  const [registerDrawer] = useDrawerInner(async ({ record }) => {
    currentRole.value = record;
  });
  const [registerTable, { reload }] = useTable({
    api: () => getUsersByRole(currentRole.value!.id),
    showIndexColumn: false,
    pagination: false,
    inset: true,
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
    ],
    actionColumn: {
      title: '操作',
      dataIndex: 'action',
    },
  });
  const [
    registerUserSelectDrawer,
    { openDrawer: openUserSelectDrawer, closeDrawer: closeUserSelectDrawer },
  ] = useDrawer();
  const [registerUserTable, { reload: reloadUserSelectTable, getSelectRowKeys }] = useTable({
    api: getUserList,
    rowKey: 'id',
    title: '用户列表',
    showIndexColumn: false,
    clickToRowSelect: true,
    showSelectionBar: true,
    rowSelection: { type: 'checkbox' },
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
    ],
  });

  /**
   * 新增用户
   */
  async function handleAdd() {
    openUserSelectDrawer(true);
    await reloadUserSelectTable();
  }

  /**
   * 保存角色与用户连接
   */
  async function handleOk() {
    const userIds = getSelectRowKeys().map((it) => it.toString());
    await addUserLink({ roleId: currentRole.value!.id, userIds: userIds });
    closeUserSelectDrawer();
    await reload();
  }

  /**
   * 删除用户关联
   * @param record user
   */
  async function handleDelete(record: Recordable) {
    await removeUserLink({ userId: record.id, roleId: currentRole.value!.id });
    await reload();
  }
</script>
