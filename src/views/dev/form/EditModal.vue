<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="getTitle"
    @ok="handleSubmit"
    width="90%"
  >
    <BasicForm @register="registerForm" />
    <a-tabs>
      <a-tab-pane key="item" tab="字段配置">
        <BasicTable @register="registerTable" />
        <a-button @click="subAdd">新增</a-button>
      </a-tab-pane>
    </a-tabs>
  </BasicModal>
</template>
<script lang="tsx" setup>
  import { ref, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { BasicForm, useForm } from '@/components/Form';
  import { formSchema, subTableColumns } from './form.data';

  import { save, update } from './form.api';
  import { BasicTable, EditRecordRow, useTable } from '@/components/Table';

  defineOptions({ name: 'DevFormModal' });

  const emit = defineEmits(['success', 'register']);

  const isUpdate = ref(true);
  const current = ref({});

  const [registerTable, { getDataSource, setTableData }] = useTable({
    columns: subTableColumns,
    showIndexColumn: false,
    dataSource: current.value.items,
    actionColumn: {
      width: 160,
      title: '操作',
      dataIndex: 'action',
    },
    scroll: { y: '100%' },
    pagination: false,
  });

  const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
    labelWidth: 100,
    baseColProps: { span: 24 },
    schemas: formSchema,
    showActionButtonGroup: false,
  });

  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    await resetFields();
    setModalProps({ confirmLoading: false });
    isUpdate.value = !!data?.isUpdate;

    if (unref(isUpdate)) {
      await setFieldsValue({
        ...data.record,
        items: [{}],
      });
      current.value = data.record;
    }
  });

  const getTitle = computed(() => (!unref(isUpdate) ? '新增' : '编辑'));

  async function handleSubmit() {
    try {
      const values = await validate();
      setModalProps({ confirmLoading: true });
      if (unref(isUpdate)) {
        await update(values);
      } else {
        await save(values);
      }
      closeModal();
      emit('success');
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }
  function subAdd() {
    const data = getDataSource();
    const addRow: EditRecordRow = {
      editable: true,
      key: `${Date.now()}`,
    };
    data.push(addRow);
    setTableData(data);
  }
</script>
