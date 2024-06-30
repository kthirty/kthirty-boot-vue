<template>
  <a-row>
    <a-col :span="12">
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
    </a-col>
    <a-col :span="12">
      <BasicTable @register="registerItemTable">
        <template #toolbar>
          <a-button type="primary" @click="handleAdd"> 新增 </a-button>
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
              ]"
            />
          </template>
        </template>
      </BasicTable>
    </a-col>
    <DictModal @register="registerModal" @success="reload" />
  </a-row>
</template>
<script lang="ts" setup>
  import { BasicTable, useTable, TableAction } from '@/components/Table';
  import { deleteDict, getDictItemList, getDictList } from '@/api/system/dict';

  import { useModal } from '@/components/Modal';
  import DictModal from './DictModal.vue';
  import { columns, searchFormSchema } from './dict.data';
  import { ref, unref } from 'vue';

  defineOptions({ name: 'SysDict' });
  const dictCode = ref<string>();

  const [registerModal, { openModal }] = useModal();
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
    },
    rowSelection: {
      type: 'radio',
      onChange: (_, rows) => {
        if (rows[0].code !== dictCode.value) {
          dictCode.value = rows[0].code;
          loadDetail();
        }
      },
    },
  });
  const [registerItemTable, { reload: loadDetail }] = useTable({
    title: '数据字典选项',
    api: getDictItemList,
    beforeFetch: () => {
      return { code: unref(dictCode) };
    },
    immediate: false,
    columns: [
      {
        title: '字典标签',
        dataIndex: 'label',
      },
      {
        title: '字典值',
        dataIndex: 'value',
      },
    ],
  });

  function handleCreate() {
    openModal(true, {
      isUpdate: false,
    });
  }

  function handleEdit(record: Recordable) {
    openModal(true, {
      record,
      isUpdate: true,
    });
  }

  function handleDelete(record: Recordable) {
    deleteDict(record.id);
    reload();
  }
</script>
