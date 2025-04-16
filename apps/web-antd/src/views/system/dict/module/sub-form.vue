<script lang="ts" setup>
import type { Recordable } from '@vben/types';

import type { SystemDictApi } from '#/api';

import { ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import { getPopupContainer } from '@vben/utils';

import { useVbenForm } from '#/adapter/form';
import { getDictItemList, saveDictItem } from '#/api';
import { $t } from '#/locales';
import { useDictStore } from '#/store';

const emits = defineEmits(['success']);

async function getDictItemTree() {
  const res = await getDictItemList({ code: code.value });
  res.forEach((item: Recordable<any>) => {
    handleDisabled(item);
  });
  return res;
}
function handleDisabled(node: Recordable<any>) {
  if (node.id === id.value) {
    setDeepDisabled(node);
  }
}
function setDeepDisabled(node: Recordable<any>) {
  node.disabled = true;
  if (node.children) {
    node.children.forEach((child: Recordable<any>) => {
      setDeepDisabled(child);
    });
  }
}

const dictStore = useDictStore();
const id = ref();
const code = ref();
const formData = ref<SystemDictApi.DictItem>();

const [Form, formApi] = useVbenForm({
  schema: [
    {
      fieldName: 'label',
      label: '标签',
      component: 'Input',
      rules: 'required',
    },
    {
      fieldName: 'value',
      label: '值',
      component: 'Input',
      rules: 'required',
    },
    {
      fieldName: 'weight',
      label: '权重',
      component: 'InputNumber',
      defaultValue: 0,
    },
    {
      fieldName: 'description',
      label: '描述',
      component: 'Textarea',
    },
    {
      fieldName: 'status',
      label: '状态',
      component: 'RadioGroup',
      defaultValue: '1',
      componentProps: {
        options: dictStore.getDict('enable_status'),
      },
    },
    {
      component: 'ApiTreeSelect',
      componentProps: {
        allowClear: true,
        api: getDictItemTree,
        class: 'w-full',
        filterTreeNode(input: string, node: Recordable<any>) {
          if (!input || input.length === 0) {
            return true;
          }
          const title: string = node.label;
          if (!title) return false;
          return title.includes(input) || $t(title).includes(input);
        },
        getPopupContainer,
        labelField: 'label',
        showSearch: true,
        treeDefaultExpandAll: true,
        valueField: 'id',
        childrenField: 'children',
        parentField: 'parentId',
      },
      fieldName: 'parentId',
      label: $t('system.dict.parent'),
    },
  ],
  showDefaultActions: false,
});

const [Drawer, drawerApi] = useVbenDrawer({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) return;
    const values = await formApi.getValues();
    drawerApi.lock();
    saveDictItem(id.value, {
      code: code.value,
      ...values,
    })
      .then(() => {
        emits('success');
        drawerApi.close();
      })
      .finally(() => {
        drawerApi.unlock();
      });
  },
  onOpenChange(isOpen) {
    if (isOpen) {
      const data = drawerApi.getData<SystemDictApi.DictItem>();
      formApi.resetForm();
      if (data) {
        formData.value = data;
        id.value = data.id;
        code.value = data.code;
        formApi.setValues(data);
      } else {
        id.value = undefined;
        code.value = undefined;
      }
    }
  },
});
function getTitle() {
  return formData.value?.id
    ? $t('ui.actionTitle.edit', [$t('system.dict.subTitle')])
    : $t('ui.actionTitle.create', [$t('system.dict.subTitle')]);
}
</script>

<template>
  <Drawer :title="getTitle()">
    <Form />
  </Drawer>
</template>
