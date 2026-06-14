<script lang="ts" setup>
import type { DevFormRuntimeApi } from '../api';

import { computed, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { $t } from '#/locales';

import { getDevFormDataInfo, saveDevFormData, updateDevFormData } from '../api';
import { buildFormSchema } from '../composables/useDevFormSchema';

const props = defineProps<{
  formId: string;
  schema: DevFormRuntimeApi.Schema;
}>();

const emits = defineEmits(['success']);

const recordId = ref<string>();
const formSchema = ref(buildFormSchema(props.schema, false));

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
  },
  schema: formSchema.value,
  showDefaultActions: false,
  wrapperClass: 'grid-cols-2',
});

const [Drawer, drawerApi] = useVbenDrawer({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) return;
    const values = await formApi.getValues<Record<string, any>>();
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
    if (isOpen) {
      const data = drawerApi.getData<Record<string, any>>();
      formApi.resetForm();
      if (data?.id) {
        recordId.value = data.id;
        formSchema.value = buildFormSchema(props.schema, true);
        formApi.setState({ schema: formSchema.value });
        getDevFormDataInfo(props.formId, data.id).then((res) => {
          formApi.setValues(res);
        });
      } else {
        recordId.value = undefined;
        formSchema.value = buildFormSchema(props.schema, false);
        formApi.setState({ schema: formSchema.value });
        if (data) {
          formApi.setValues(data);
        }
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
  <Drawer :title="drawerTitle" class="w-[720px]">
    <Form />
  </Drawer>
</template>
