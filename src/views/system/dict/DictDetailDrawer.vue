<template>
  <BasicDrawer v-bind="$attrs" @register="registerDrawer" title="字典选项编辑" width="60%">
    <BasicTable @register="registerTable">
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
    <BasicModal @register="registerModel" title="选项编辑" @ok="handleSubmit">
      <BasicForm @register="regForm" />
    </BasicModal>
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { BasicDrawer, useDrawerInner } from '@/components/Drawer';
  import { BasicTable, TableAction, useTable } from '@/components/Table';
  import { getDictItemList, saveDictItem } from '@/api/system/dict';
  import { nextTick, ref, unref } from 'vue';
  import { dictDetailColumns, dictDetailFormSchema } from '@/views/system/dict/dict.data';
  import { BasicForm, useForm } from '@/components/Form';
  import { useModal, BasicModal } from '@/components/Modal';

  const params = ref({});

  const [registerDrawer] = useDrawerInner(async (code) => {
    params.value.code = code;
    await reload();
  });

  const [registerTable, { reload }] = useTable({
    api: getDictItemList,
    searchInfo: unref(params),
    pagination: false,
    columns: dictDetailColumns,
    canResize: true,
    resizeHeightOffset: 100,
    showIndexColumn: false,
    actionColumn: {
      title: '操作',
      dataIndex: 'action',
    },
  });
  const [registerModel, { openModal, closeModal }] = useModal();
  const [regForm, { setFieldsValue, resetFields, validate }] = useForm({
    showActionButtonGroup: false,
    schemas: dictDetailFormSchema,
    labelWidth: 90,
    baseColProps: { span: 24 },
  });
  function handleAdd() {
    openModal(true);
    nextTick(() => {
      resetFields();
      setFieldsValue({ code: params.value.code });
    });
  }
  function handleEdit(record: Recordable) {
    openModal(true);
    nextTick(() => {
      resetFields();
      setFieldsValue({ ...record });
    });
  }
  async function handleSubmit() {
    const value = await validate();
    await saveDictItem(value);
    closeModal();
    await reload();
  }
</script>
