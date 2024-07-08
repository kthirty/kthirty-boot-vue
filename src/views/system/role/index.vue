<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate"> 新增角色 </a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                icon: 'clarity:note-edit-line',
                onClick: handleEdit.bind(null, record),
                tooltip: '修改角色',
              },
              {
                icon: 'carbon:security',
                onClick: handleConfig.bind(null, record),
                tooltip: '配置角色菜单',
              },
              {
                icon: 'clarity:users-line',
                onClick: handleUsers.bind(null, record),
                tooltip: '拥有此角色的用户',
              },
              {
                icon: 'ant-design:delete-outlined',
                tooltip: '删除角色',
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
    <RoleDrawer @register="registerDrawer" @success="reload" />
    <RoleConfigDrawer @register="registerConfigDrawer" />
    <RoleUserLinkDrawer @register="registerUserLinkDrawer" />
  </div>
</template>
<script lang="ts" setup>
  import { BasicTable, useTable, TableAction } from '@/components/Table';
  import { deleteRole, getRolePage } from '@/api/system/role';

  import { useDrawer } from '@/components/Drawer';
  import RoleDrawer from './RoleDrawer.vue';
  import RoleConfigDrawer from './RoleConfigDrawer.vue';
  import RoleUserLinkDrawer from './RoleUserLinkDrawer.vue';

  import { columns, searchFormSchema } from './role.data';

  defineOptions({ name: 'SysRole' });

  const [registerDrawer, { openDrawer }] = useDrawer();
  const [registerConfigDrawer, { openDrawer: openConfigDrawer }] = useDrawer();
  const [registerUserLinkDrawer, { openDrawer: openUserLinkDrawer }] = useDrawer();
  const [registerTable, { reload }] = useTable({
    title: '角色列表',
    api: getRolePage,
    columns,
    formConfig: {
      labelWidth: 120,
      schemas: searchFormSchema,
    },
    useSearchForm: true,
    showTableSetting: true,
    bordered: true,
    showIndexColumn: false,
    actionColumn: {
      width: 200,
      title: '操作',
      dataIndex: 'action',
    },
  });

  function handleCreate() {
    openDrawer(true, {
      isUpdate: false,
    });
  }

  function handleEdit(record: Recordable) {
    openDrawer(true, {
      record,
      isUpdate: true,
    });
  }
  function handleConfig(record: Recordable) {
    openConfigDrawer(true, {
      record,
    });
  }

  function handleDelete(record: Recordable) {
    deleteRole(record.id);
    reload();
  }
  function handleUsers(record: Recordable) {
    openUserLinkDrawer(true, {
      record,
    });
  }
</script>
