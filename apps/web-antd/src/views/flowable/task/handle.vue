<script lang="ts" setup>
import type { Component } from 'vue';

import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import type { FlwTaskApi } from './api';

import { computed, ref, shallowRef } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { useUserStore } from '@vben/stores';

import {
  Button,
  Empty,
  Image,
  Input,
  message,
  TabPane,
  Tabs,
} from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { $t } from '#/locales';

import { getHisDiagram, getHisTaskList } from '../instance/api';
import { useHisTaskColumns } from '../instance/data';
import {
  claimTask,
  completeTask,
  getCompletePre,
  unclaimTask,
} from './api';
import { getFormComponent } from './utils/form-loader';

const emit = defineEmits(['success']);

const userStore = useUserStore();
const username = computed(() => userStore.userInfo?.username || '');

const taskData = ref<FlwTaskApi.Task>({});
const comment = ref('');
const formKey = ref('');
const handleButtons = ref<FlwTaskApi.FlowButton[]>([]);
const thumbnail = ref('');
const loading = ref(false);
const submitting = ref(false);
const formRef = ref<{
  getExtraParams?: () => Record<string, any>;
  validate?: () => Promise<boolean>;
}>();
const FormComponent = shallowRef<Component | null>(null);

const handling = computed(() => Boolean(taskData.value._handle));
const assignee = computed(() => taskData.value.assignee || '');
const claimedBy = computed(() => taskData.value.claimedBy || '');
const claimedByOther = computed(() => {
  if (claimedBy.value && claimedBy.value !== username.value) return true;
  return !!assignee.value && assignee.value !== username.value;
});
const needClaim = computed(
  () => handling.value && !claimedBy.value && !assignee.value,
);
const canComplete = computed(
  () => handling.value && !claimedByOther.value && !needClaim.value,
);
const showUnclaim = computed(
  () => handling.value && claimedBy.value === username.value,
);

const [TaskHisGrid] = useVbenVxeGrid({
  gridOptions: {
    border: 'none',
    columns: useHisTaskColumns(),
    height: 'auto',
    keepSource: false,
    stripe: false,
    pagerConfig: {
      enabled: false,
    },
    proxyConfig: {
      ajax: {
        query: async () => {
          const processInstanceId = taskData.value.processInstanceId;
          if (!processInstanceId) return [];
          return await getHisTaskList(processInstanceId);
        },
      },
    },
  } as VxeTableGridOptions,
});

function applyForm(key?: string) {
  formKey.value = key || '';
  FormComponent.value = getFormComponent(formKey.value);
}

async function reloadContext() {
  const data = taskData.value;
  handleButtons.value = [];
  thumbnail.value = '';
  applyForm('');
  if (!data.id && !data.processInstanceId) return;
  loading.value = true;
  try {
    if (handling.value && data.id) {
      const res = await getCompletePre(data.id);
      handleButtons.value = res.handleButtons || [];
      applyForm(res.formKey || data.formKey);
    } else {
      applyForm(data.formKey);
    }
    if (data.processInstanceId) {
      thumbnail.value = await getHisDiagram(data.processInstanceId);
    }
  } finally {
    loading.value = false;
  }
}

async function onClaim() {
  const taskId = taskData.value.id;
  if (!taskId) return;
  submitting.value = true;
  try {
    await claimTask(taskId);
    taskData.value = {
      ...taskData.value,
      assignee: username.value,
      claimedBy: username.value,
    };
    message.success($t('flowable.task.handle.claimSuccess'));
    emit('success');
  } finally {
    submitting.value = false;
  }
}

async function onUnclaim() {
  const taskId = taskData.value.id;
  if (!taskId) return;
  submitting.value = true;
  try {
    await unclaimTask(taskId);
    taskData.value = {
      ...taskData.value,
      assignee: '',
      claimedBy: '',
    };
    message.success($t('flowable.task.handle.unclaimSuccess'));
    emit('success');
  } finally {
    submitting.value = false;
  }
}

async function onHandle(button: FlwTaskApi.FlowButton) {
  if (!canComplete.value) return;
  if (button.commentRequired && !comment.value.trim()) {
    message.warning($t('flowable.task.handle.commentRequired'));
    return;
  }
  if (formRef.value?.validate) {
    const valid = await formRef.value.validate();
    if (!valid) return;
  }
  const taskId = taskData.value.id;
  const result = button.resultCode;
  if (!taskId || !result) return;
  submitting.value = true;
  try {
    await completeTask({
      taskId,
      result,
      comment: comment.value,
      extraParams: formRef.value?.getExtraParams?.(),
    });
    message.success($t('flowable.task.handle.success'));
    modalApi.close();
    emit('success');
  } finally {
    submitting.value = false;
  }
}

const [Modal, modalApi] = useVbenModal({
  async onOpenChange(isOpen) {
    if (!isOpen) return;
    comment.value = '';
    taskData.value = modalApi.getData<FlwTaskApi.Task>() || {};
    await reloadContext();
  },
});
</script>

<template>
  <Modal
    :title="
      handling
        ? $t('flowable.task.handle.title')
        : $t('flowable.task.handle.viewTitle')
    "
    :loading="loading"
    :show-cancel-button="false"
    :show-confirm-button="false"
  >
    <div class="flex h-[calc(100vh-140px)] flex-col gap-3 px-4">
      <div class="text-sm text-gray-500">
        <span class="mr-4">
          {{ $t('flowable.task.table.processInstanceName') }}：{{
            taskData.processInstanceName || '-'
          }}
        </span>
        <span class="mr-4">
          {{ $t('flowable.task.table.processDefinitionName') }}：{{
            taskData.processDefinitionName || '-'
          }}
        </span>
        <span class="mr-4">
          {{ $t('flowable.task.table.name') }}：{{ taskData.name || '-' }}
        </span>
        <span>
          {{ $t('flowable.task.table.processInstanceStartedBy') }}：{{
            taskData.processInstanceStartedBy || '-'
          }}
        </span>
      </div>

      <Tabs class="min-h-0 flex-1">
        <TabPane key="form" :tab="$t('flowable.task.handle.tab.form')">
          <div class="h-[calc(100vh-320px)] overflow-auto p-2">
            <component
              :is="FormComponent"
              v-if="FormComponent"
              ref="formRef"
              :readonly="!handling"
              :task="taskData"
            />
            <Empty
              v-else-if="formKey"
              :description="$t('flowable.task.handle.formNotFound', [formKey])"
            />
            <Empty
              v-else
              :description="$t('flowable.task.handle.noFormKey')"
            />
          </div>
        </TabPane>
        <TabPane key="history" :tab="$t('flowable.task.handle.tab.history')">
          <div class="h-[calc(100vh-320px)]">
            <TaskHisGrid />
          </div>
        </TabPane>
        <TabPane key="diagram" :tab="$t('flowable.task.handle.tab.diagram')">
          <div class="flex h-[calc(100vh-320px)] items-center justify-center overflow-auto p-2">
            <Image
              v-if="thumbnail"
              :src="thumbnail"
              style="max-width: 100%; max-height: 100%"
            />
            <Empty v-else :description="$t('flowable.task.handle.diagramPlaceholder')" />
          </div>
        </TabPane>
      </Tabs>

      <div v-if="handling" class="border-t pt-3">
        <div class="mb-2">{{ $t('flowable.task.handle.comment') }}</div>
        <Input.TextArea
          v-model:value="comment"
          :rows="3"
          :placeholder="$t('flowable.task.handle.commentPlaceholder')"
        />
        <div class="mt-3 flex flex-wrap items-center gap-2">
          <Button v-if="needClaim" :loading="submitting" type="primary" @click="onClaim">
            {{ $t('flowable.task.handle.claim') }}
          </Button>
          <Button v-if="showUnclaim" :loading="submitting" @click="onUnclaim">
            {{ $t('flowable.task.handle.unclaim') }}
          </Button>
          <Button
            v-for="button in handleButtons"
            :key="button.code || button.resultCode"
            :disabled="!canComplete"
            :loading="submitting"
            type="primary"
            @click="onHandle(button)"
          >
            {{ button.name }}
          </Button>
          <span v-if="needClaim" class="text-sm text-gray-500">
            {{ $t('flowable.task.handle.claimFirst') }}
          </span>
          <span v-else-if="claimedByOther" class="text-sm text-gray-500">
            {{
              $t('flowable.task.handle.claimedByOther', [
                claimedBy || assignee,
              ])
            }}
          </span>
        </div>
      </div>
    </div>
  </Modal>
</template>
