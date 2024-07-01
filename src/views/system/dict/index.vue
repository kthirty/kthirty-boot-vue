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
          <a-button type="primary" @click="handleAddItem"> 新增 </a-button>
        </template>
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <TableAction :actions="createActions(record)" />
          </template>
        </template>
      </BasicTable>
    </a-col>
    <DictModal @register="registerModal" @success="reload" />
  </a-row>
</template>
<script lang="ts" setup>
  import { BasicTable, useTable, TableAction, EditRecordRow, ActionItem } from '@/components/Table';
  import { deleteDict, getDictItemList, getDictList } from '@/api/system/dict';

  import { useModal } from '@/components/Modal';
  import DictModal from './DictModal.vue';
  import { columns, searchFormSchema } from './dict.data';
  import { ref, unref } from 'vue';

  defineOptions({ name: 'SysDict' });
  const dictCode = ref<string>();
  const currentEditKeyRef = ref('');

  const [registerModal, { openModal }] = useModal();
  const [registerTable, { reload }] = useTable({
    api: getDictList,
    columns,
    formConfig: {
      labelWidth: 120,
      schemas: searchFormSchema,
    },
    useSearchForm: true,
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
  const [registerItemTable, { reload: loadDetail, insertTableDataRecord }] = useTable({
    api: getDictItemList,
    beforeFetch: (param) => {
      console.log(param);
      return { code: unref(dictCode), ...param };
    },
    afterFetch: () => {
      currentEditKeyRef.value = '';
    },
    immediate: false,
    useSearchForm: true,
    bordered: true,
    showIndexColumn: false,
    formConfig: {
      labelWidth: 120,
      schemas: [
        {
          field: 'label',
          label: '字典标签',
          component: 'Input',
          colProps: { span: 8 },
        },
      ],
    },
    columns: [
      {
        title: '字典标签',
        dataIndex: 'label',
        editRow: true,
      },
      {
        title: '字典值',
        dataIndex: 'value',
        editRow: true,
      },
    ],
    actionColumn: {
      width: 160,
      dataIndex: 'action',
    },
  });
  function createActions(record: EditRecordRow): ActionItem[] {
    if (!record.editable) {
      return [
        {
          label: '编辑',
          disabled: currentEditKeyRef.value ? currentEditKeyRef.value !== record.key : false,
          onClick: () => {
            currentEditKeyRef.value = record.key;
            record.onEdit?.(true);
          },
        },
      ];
    }
    return [
      {
        label: '保存',
        onClick: () => {
          console.log('record', record);
        },
      },
      {
        label: '取消',
        popConfirm: {
          title: '是否取消编辑',
          confirm: () => {
            record.onEdit?.(false, false);
          },
        },
      },
    ];
  }

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
  function handleAddItem() {
    insertTableDataRecord({ code: dictCode.value });
  }

  function handleDelete(record: Recordable) {
    deleteDict(record.id);
    reload();
  }
</script>
