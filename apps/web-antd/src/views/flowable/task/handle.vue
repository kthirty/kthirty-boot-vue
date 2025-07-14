<script lang="ts" setup>
import type { ComponentRecordType } from '@vben/types';

import type { FlwTaskApi } from './api';

import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { defineAsyncComponent, defineEmits, ref, shallowRef } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { normalizeViewPath } from '@vben/utils';

import {
  Button,
  Card,
  Empty,
  Image,
  message,
  TabPane,
  Tabs,
  Textarea,
  Tooltip,
} from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { $t } from '#/locales';

import { getHisDiagram, getHisTaskList } from '../instance/api';
import { useHisTaskColumns } from '../instance/data';
import { completeTask, getCompletePre } from './api';

const emit = defineEmits(['success', 'close']);

interface HandleButton {
  code: string;
  commentRequired: boolean;
  description: string;
  name: string;
  resultCode: string;
  descColor?: string;
  type?: string;
  danger?: boolean;
}
async function onHandleButtonClick(btn: HandleButton) {
  loading.value = true;
  try {
    if (btn.commentRequired && !comment.value) {
      message.error($t('flowable.task.handle.commentRequired'));
      return;
    }
    // 子form中验证
    if (typeof formRef.value?.beforeSubmit === 'function') {
      const pass = formRef.value?.beforeSubmit(btn);
      if (!pass) return;
    }
    // 组装提交信息
    const submitInfo: FlwTaskApi.CompleteReq = {
      taskId: taskData.value.id!,
      comment: comment.value,
      result: btn.resultCode,
      extraParams: {},
    };
    if (typeof formRef.value?.extraArgs === 'function') {
      const args = formRef.value?.extraArgs(btn);
      submitInfo.extraParams = args;
    }
    await completeTask(submitInfo);
    message.success($t('flowable.task.handle.success'));
    modalApi.close();
    emit('success');
  } finally {
    loading.value = false;
  }
}
const pageMap: ComponentRecordType = import.meta.glob('../views/**/*.vue');
function pathToComponent(component: string = '') {
  if (component) {
    const normalizePath = normalizeViewPath(component);
    const pageKey = normalizePath.endsWith('.vue')
      ? normalizePath
      : `${normalizePath}.vue`;
    if (pageMap[pageKey]) {
      return defineAsyncComponent(pageMap[pageKey]);
    }
    console.warn(`component is invalid: ${component}`);
  }
  return null;
}
const formComponent = shallowRef(null);
const formRef = ref();
const loading = ref(false);
const taskData = ref<FlwTaskApi.Task>({});
const comment = ref('');
const handleButtons = ref<HandleButton[]>([]);

// 流程历史
const thumbnail = ref('');

const [TaskHisGrid] = useVbenVxeGrid({
  gridOptions: {
    border: 'none',
    columns: useHisTaskColumns(() => {}),
    height: 'auto',
    keepSource: false,
    stripe: false,
    pagerConfig: {
      enabled: false,
    },
    proxyConfig: {
      ajax: {
        query: async () => {
          return await getHisTaskList(taskData.value.processInstanceId!);
        },
      },
    },
  } as VxeTableGridOptions,
});

const [Modal, modalApi] = useVbenModal({
  onCancel() {
    emit('close');
    modalApi.close();
  },
  async onOpenChange(isOpen) {
    if (isOpen) {
      loading.value = true;
      const data = modalApi.getData<FlwTaskApi.Task>();
      taskData.value = data;
      try {
        // 获取按钮和界面信息
        const res = await getCompletePre(data.id!);
        pathToComponent(res.formKey);
        handleButtons.value = res.handleButtons || [];
        // 获取流程历史处理图
        thumbnail.value = await getHisDiagram(
          taskData.value.processInstanceId!,
        );
      } finally {
        loading.value = false;
      }
    }
  },
});
</script>
<template>
  <Modal :title="$t('flowable.task.handle.title')" :loading="loading">
    <div class="flex h-full flex-col">
      <div class="h-2/3">
        <Tabs class="flex-1">
          <TabPane key="form" :tab="$t('flowable.task.handle.tab.form')">
            <!-- 业务表单内容区域 -->
            <div class="h-full p-4">
              <component
                :is="formComponent"
                ref="formRef"
                v-if="formComponent"
              />
              <Empty v-else :description="$t('flowable.task.handle.noForm')" />
            </div>
          </TabPane>
          <TabPane key="history" :tab="$t('flowable.task.handle.tab.history')">
            <div class="h-full p-4">
              <TaskHisGrid />
            </div>
          </TabPane>
          <TabPane key="diagram" :tab="$t('flowable.task.handle.tab.diagram')">
            <div class="h-full p-4">
              <Image
                :preview="false"
                :src="thumbnail"
                style="max-width: 100%; max-height: 90vh"
              />
            </div>
          </TabPane>
        </Tabs>
      </div>
      <div class="w-full">
        <Card :title="$t('flowable.task.handle.title')" :bordered="false">
          <Textarea
            v-model:value="comment"
            :rows="3"
            class="ml-20 w-3/4"
            :placeholder="$t('flowable.task.handle.commentPlaceholder')"
          />
          <div class="ml-20">
            <template v-for="(btn, _) in handleButtons" :key="_">
              <div class="ml-4 mt-4 inline-block">
                <Tooltip
                  v-if="btn.description"
                  :title="btn.description"
                  :color="btn.descColor ?? 'cyan'"
                >
                  <Button
                    @click="onHandleButtonClick(btn)"
                    :type="btn.type ?? 'primary'"
                    :danger="btn.danger ?? false"
                  >
                    {{ btn.name }}
                  </Button>
                </Tooltip>
                <Button v-else @click="onHandleButtonClick(btn)" type="primary">
                  {{ btn.name }}
                </Button>
              </div>
            </template>
          </div>
        </Card>
      </div>
    </div>
  </Modal>
</template>
