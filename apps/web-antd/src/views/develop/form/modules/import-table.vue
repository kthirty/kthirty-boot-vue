<script lang="ts" setup>
import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { message, Select, Switch } from 'ant-design-vue';

import { $t } from '#/locales';

import { getDbTables, importTableFields, previewImportTable } from '../api';

const emits = defineEmits(['success', 'preview']);

const formId = ref('');
const tableName = ref<string>();
const overwrite = ref(false);
const loading = ref(false);
const tableOptions = ref<Array<{ label: string; value: string }>>([]);

const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    if (!tableName.value) {
      message.warning($t('develop.form.importTableRequired'));
      return;
    }
    loading.value = true;
    try {
      if (formId.value) {
        await importTableFields(formId.value, tableName.value, overwrite.value);
        message.success($t('develop.form.importTableSuccess'));
        emits('success');
      } else {
        const imported = await previewImportTable(tableName.value);
        emits('preview', imported);
        message.success($t('develop.form.importTableSuccess'));
      }
      modalApi.close();
    } finally {
      loading.value = false;
    }
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      const data = modalApi.getData<{ formId?: string }>();
      formId.value = data?.formId || '';
      tableName.value = undefined;
      overwrite.value = false;
      if (tableOptions.value.length === 0) {
        const tables = await getDbTables();
        tableOptions.value = tables.map((item) => ({
          label: item,
          value: item,
        }));
      }
    }
  },
});
</script>

<template>
  <Modal
    :confirm-loading="loading"
    :title="$t('develop.form.importTableTitle')"
  >
    <div class="space-y-4 p-2">
      <div>
        <div class="mb-2">{{ $t('develop.form.importTableName') }}</div>
        <Select
          v-model:value="tableName"
          :options="tableOptions"
          allow-clear
          class="w-full"
          show-search
        />
      </div>
      <div v-if="formId" class="flex items-center gap-2">
        <Switch v-model:checked="overwrite" />
        <span>{{ $t('develop.form.importTableOverwrite') }}</span>
      </div>
    </div>
  </Modal>
</template>
