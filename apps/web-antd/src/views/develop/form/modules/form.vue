<script lang="ts" setup>
import type { DevFormApi } from '../api';

import { computed, ref } from 'vue';

import { useVbenDrawer, useVbenModal } from '@vben/common-ui';

import { Button, message, Modal } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { $t } from '#/locales';

import {
  getDevFormInfo,
  saveDevForm,
  syncDevFormDb,
  updateDevForm,
} from '../api';
import { useFormSchema } from '../data';
import ImportTable from './import-table.vue';

const emits = defineEmits(['success']);

const formData = ref<DevFormApi.DevForm>();
const id = ref<string>();

const [ImportModal, importModalApi] = useVbenModal({
  connectedComponent: ImportTable,
  destroyOnClose: true,
});

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
  },
  schema: useFormSchema(),
  showDefaultActions: false,
  wrapperClass: 'grid-cols-2',
});

const [Drawer, drawerApi] = useVbenDrawer({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) return;
    const values = await formApi.getValues<DevFormApi.DevForm>();
    drawerApi.lock();
    const payload = {
      ...values,
      id: id.value,
      items: values.items || [],
      indexes: values.indexes || [],
    };
    (id.value ? updateDevForm(payload) : saveDevForm(payload))
      .then(() => {
        emits('success');
        drawerApi.close();
      })
      .catch(() => drawerApi.unlock());
  },
  onOpenChange(isOpen) {
    if (isOpen) {
      const data = drawerApi.getData<DevFormApi.DevForm>();
      formApi.resetForm();
      if (data?.id) {
        id.value = data.id;
        getDevFormInfo(data.id).then((res) => {
          formData.value = res;
          formApi.setValues(res);
        });
      } else {
        id.value = undefined;
        formData.value = data || {};
        if (data) {
          formApi.setValues(data);
        }
      }
    }
  },
});

const drawerTitle = computed(() =>
  id.value
    ? $t('ui.actionTitle.edit', [$t('develop.form.title')])
    : $t('ui.actionTitle.create', [$t('develop.form.title')]),
);

function onImportTable() {
  importModalApi.setData({ formId: id.value || '' }).open();
}

function onImportPreview(imported: DevFormApi.DevForm) {
  formApi.setValues(imported);
}

function onImportSuccess() {
  if (!id.value) return;
  getDevFormInfo(id.value).then((res) => {
    formData.value = res;
    formApi.setValues(res);
  });
  emits('success');
}

function onSyncDb() {
  if (!id.value) return;
  Modal.confirm({
    title: $t('develop.form.syncDbConfirmTitle'),
    content: $t('develop.form.syncDbConfirmContent', [
      formData.value?.tableName,
    ]),
    onOk: async () => {
      const result = await syncDevFormDb(id.value!);
      message.success(
        result.messages?.join('；') || $t('develop.form.syncDbSuccess'),
      );
      emits('success');
    },
  });
}
</script>

<template>
  <Drawer :title="drawerTitle" class="w-[80%]">
    <div class="mb-4 flex gap-2">
      <Button @click="onImportTable">
        {{ $t('develop.form.importFromDb') }}
      </Button>
      <Button v-if="id" @click="onSyncDb">
        {{ $t('develop.form.button.syncDb') }}
      </Button>
    </div>
    <Form />
    <ImportModal @preview="onImportPreview" @success="onImportSuccess" />
  </Drawer>
</template>
