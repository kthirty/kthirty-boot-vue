<script lang="ts" setup>
import type { UploadFile } from 'ant-design-vue';

import type { OosFileApi } from '#/api/core/file';

import { h, ref } from 'vue';

import { Page } from '@vben/common-ui';

import { Button, Card, Divider, message, Space, Upload } from 'ant-design-vue';

import { OosFile } from '#/adapter/component/oos-file';
import { useVbenForm } from '#/adapter/form';
import {
  createOosUploadProps,
  downloadOosFile,
  mapOosFileToUploadItem,
} from '#/adapter/upload';
import { uploadFilesBatchApi } from '#/api/core/file';
import { $t } from '#/locales';

const singleFileList = ref<UploadFile[]>([]);
const multiFileList = ref<UploadFile[]>([]);
const batchFileList = ref<UploadFile[]>([]);
const uploadedFiles = ref<OosFileApi.OosFileVO[]>([]);
const batchUploading = ref(false);
const formResult = ref('');

const singleUploadProps = createOosUploadProps({
  maxCount: 1,
  multiple: false,
  onUploaded: (file) => {
    uploadedFiles.value = [
      file,
      ...uploadedFiles.value.filter((item) => item.id !== file.id),
    ];
  },
});

const multiUploadProps = createOosUploadProps({
  maxCount: 10,
  multiple: true,
  onUploaded: (file) => {
    uploadedFiles.value = [
      file,
      ...uploadedFiles.value.filter((item) => item.id !== file.id),
    ];
  },
});

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
  },
  layout: 'vertical',
  schema: [
    {
      component: 'OosFile',
      fieldName: 'attachments',
      label: 'OosFile（表单绑定）',
      defaultValue: [],
      componentProps: {
        maxCount: 5,
        multiple: true,
      },
      renderComponentContent: () => ({
        default: () =>
          h(Button, { type: 'primary' }, () => $t('ui.upload.select')),
      }),
    },
    {
      component: 'OosFile',
      fieldName: 'attachmentsReadonly',
      label: 'OosFile（查看模式）',
      defaultValue: [],
      componentProps: {
        readonly: true,
      },
    },
  ],
  wrapperClass: 'grid-cols-1 md:grid-cols-2',
});

async function handleBatchUpload() {
  const rawFiles = batchFileList.value
    .map((item) => item.originFileObj)
    .filter(Boolean) as File[];
  if (rawFiles.length === 0) {
    message.warning($t('demos.fileUpload.batchEmpty'));
    return;
  }
  batchUploading.value = true;
  try {
    const result = await uploadFilesBatchApi(rawFiles);
    uploadedFiles.value = [
      ...result,
      ...uploadedFiles.value.filter(
        (item) => !result.some((file) => file.id === item.id),
      ),
    ];
    batchFileList.value = result.map((file) => mapOosFileToUploadItem(file));
    message.success($t('demos.fileUpload.batchSuccess', [result.length]));
  } catch {
    message.error($t('ui.upload.failed'));
  } finally {
    batchUploading.value = false;
  }
}

async function handleFormSubmit() {
  const values = await formApi.getValues();
  formResult.value = JSON.stringify(values, null, 2);
  formApi.setFieldValue('attachmentsReadonly', values.attachments ?? []);
  message.success($t('demos.fileUpload.formSubmitSuccess'));
}
</script>

<template>
  <Page
    :description="$t('demos.fileUpload.description')"
    :title="$t('demos.fileUpload.title')"
  >
    <Card :title="$t('demos.fileUpload.formTitle')">
      <Form />
      <div class="mt-4 flex justify-end">
        <Button type="primary" @click="handleFormSubmit">
          {{ $t('demos.fileUpload.formSubmit') }}
        </Button>
      </div>
      <pre
        v-if="formResult"
        class="bg-muted mt-4 overflow-auto rounded-md p-4 text-sm"
      >
        {{ formResult }}
      </pre>
      <p class="text-muted-foreground mt-2 text-sm">
        {{ $t('demos.fileUpload.formHint') }}
      </p>
    </Card>

    <Divider>{{ $t('demos.fileUpload.lowLevelTitle') }}</Divider>

    <Card :title="$t('demos.fileUpload.singleTitle')">
      <Upload v-model:file-list="singleFileList" v-bind="singleUploadProps">
        <Button type="primary">{{ $t('demos.fileUpload.selectFile') }}</Button>
      </Upload>
    </Card>

    <Card :title="$t('demos.fileUpload.multiTitle')" class="mt-4">
      <Upload v-model:file-list="multiFileList" v-bind="multiUploadProps">
        <Button type="primary">
          {{ $t('demos.fileUpload.selectMultiple') }}
        </Button>
      </Upload>
      <p class="mt-2 text-sm text-gray-500">
        {{ $t('demos.fileUpload.multiHint') }}
      </p>
    </Card>

    <Card :title="$t('demos.fileUpload.batchTitle')" class="mt-4">
      <Space class="w-full" direction="vertical">
        <Upload
          v-model:file-list="batchFileList"
          :before-upload="() => false"
          multiple
        >
          <Button>{{ $t('demos.fileUpload.selectBatch') }}</Button>
        </Upload>
        <Button
          :loading="batchUploading"
          type="primary"
          @click="handleBatchUpload"
        >
          {{ $t('demos.fileUpload.batchSubmit') }}
        </Button>
      </Space>
    </Card>

    <Card :title="$t('demos.fileUpload.listTitle')" class="mt-4">
      <OosFile
        v-if="uploadedFiles.length > 0"
        :model-value="uploadedFiles"
        readonly
      />
      <p v-else class="text-gray-500">{{ $t('demos.fileUpload.listEmpty') }}</p>
    </Card>
  </Page>
</template>
