<script lang="ts" setup>
import type { DevFormRuntimeApi } from '../api';

import { computed, ref, watch } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { SubTable } from '#/adapter/component';
import { useVbenForm } from '#/adapter/form';
import { $t } from '#/locales';

import { getDevFormDataInfo, saveDevFormData, updateDevFormData } from '../api';
import { buildFormSchema, buildSubTableColumns } from '../composables/useDevFormSchema';

const props = defineProps<{
  formId: string;
  schema: DevFormRuntimeApi.Schema;
}>();

const emits = defineEmits(['success']);

const recordId = ref<string>();
const subRows = ref<Record<string, Record<string, any>[]>>({});
const formSchema = ref(buildFormSchema(props.schema, false));
const pkField = computed(() => props.schema.primaryKeyField || 'id');
const subTables = computed(() => props.schema.subTables || []);

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
  },
  schema: formSchema.value as any,
  showDefaultActions: false,
  wrapperClass: 'grid-cols-2',
});

function emptySubRows() {
  const rows: Record<string, Record<string, any>[]> = {};
  subTables.value.forEach((sub) => {
    rows[sub.formId] = [];
  });
  return rows;
}

watch(subTables, () => {
  subRows.value = emptySubRows();
}, { immediate: true });

const [Drawer, drawerApi] = useVbenDrawer({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) return;
    const values = await formApi.getValues<Record<string, any>>();
    if (subTables.value.length > 0) {
      values.subTables = subRows.value;
    }
    if (recordId.value) {
      values[pkField.value] = recordId.value;
    }
    drawerApi.lock();
    (recordId.value
      ? updateDevFormData(props.formId, values)
      : saveDevFormData(props.formId, values)
    )
      .then(() => {
        emits('success');
        drawerApi.close();
      })
      .catch(() => drawerApi.unlock());
  },
  onOpenChange(isOpen) {
    if (!isOpen) return;
    const data = drawerApi.getData<Record<string, any>>();
    const id = data?.[pkField.value];
    formApi.resetForm();
    subRows.value = emptySubRows();
    if (id) {
      recordId.value = id;
      formSchema.value = buildFormSchema(props.schema, true);
      formApi.setState({ schema: formSchema.value as any });
      getDevFormDataInfo(props.formId, id).then((res) => {
        formApi.setValues(res);
        subRows.value = {
          ...emptySubRows(),
          ...(res?.subTables || {}),
        };
      });
    } else {
      recordId.value = undefined;
      formSchema.value = buildFormSchema(props.schema, false);
      formApi.setState({ schema: formSchema.value as any });
      if (data) {
        formApi.setValues(data);
      }
    }
  },
});

const drawerTitle = computed(() =>
  recordId.value
    ? $t('ui.actionTitle.edit', [props.schema.title])
    : $t('ui.actionTitle.create', [props.schema.title]),
);

defineExpose({
  open(data?: Record<string, any>) {
    drawerApi.setData(data || null).open();
  },
});
</script>

<template>
  <Drawer :title="drawerTitle" class="w-[960px]">
    <Form />
    <div v-if="subTables.length" class="mt-4 space-y-4">
      <div v-for="sub in subTables" :key="sub.formId">
        <div class="mb-2 font-medium">
          {{ sub.title || $t('develop.runtime.subTable') }}
        </div>
        <SubTable
          v-model:value="subRows[sub.formId]"
          :columns="buildSubTableColumns(sub)"
          :modal-title="sub.title"
          inline-edit
        />
      </div>
    </div>
  </Drawer>
</template>
