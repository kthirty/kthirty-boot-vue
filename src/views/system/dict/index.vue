<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate"> 新增字典 </a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                icon: 'clarity:note-edit-line',
                tooltip: '编辑',
                onClick: handleEdit.bind(null, record),
              },
              {
                icon: 'clarity:add-text-line',
                tooltip: '选项配置',
                onClick: handleDetailEdit.bind(null, record),
              },
              {
                icon: 'ant-design:delete-outlined',
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
    <DictDrawer @register="registerDrawer" @success="handleSuccess" />
    <DictDetailDrawer @register="registerDetailDrawer" />
  </div>
</template>
<script lang="ts" setup>
  import { BasicTable, useTable, TableAction } from '@/components/Table';
  import { deleteDict, getDictList } from '@/api/system/dict';

  import { useDrawer } from '@/components/Drawer';
  import DictDrawer from './DictDrawer.vue';
  import DictDetailDrawer from './DictDetailDrawer.vue';
  import { columns, searchFormSchema } from './dict.data';

  defineOptions({ name: 'SysDict' });

  const [registerDrawer, { openDrawer }] = useDrawer();
  const [registerDetailDrawer, { openDrawer: openDetailDrawer }] = useDrawer();
  const [registerTable, { reload }] = useTable({
    title: '字典列表',
    api: getDictList,
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
      width: 120,
      title: '操作',
      dataIndex: 'action',
      fixed: undefined,
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
  function handleDetailEdit(record: Recordable) {
    openDetailDrawer(true, record.code);
  }

  function handleDelete(record: Recordable) {
    deleteDict(record.id);
    reload();
  }

  function handleSuccess() {
    reload();
  }
</script>
