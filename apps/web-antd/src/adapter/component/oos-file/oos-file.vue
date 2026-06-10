<script lang="ts" setup>
import type { UploadFile } from 'ant-design-vue';

import { type OosFileApi } from '#/api/core/file';

import { computed } from 'vue';

import { Button, List, Upload } from 'ant-design-vue';

import {
  createOosUploadRequest,
  downloadOosFile,
  getOosFileFromUploadItem,
  mapOosFileToUploadItem,
} from './upload';
import { $t } from '#/locales';

defineOptions({ name: 'OosFile', inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    disabled?: boolean;
    maxCount?: number;
    multiple?: boolean;
    /** 查看模式：仅展示文件列表并支持下载 */
    readonly?: boolean;
  }>(),
  {
    disabled: false,
    maxCount: 5,
    multiple: true,
    readonly: false,
  },
);

const modelValue = defineModel<OosFileApi.OosFileVO[]>('value', {
  default: () => [],
});

const isViewMode = computed(() => props.readonly || props.disabled);

const uploadFileList = computed<UploadFile[]>({
  get() {
    return (modelValue.value ?? []).map((file) => mapOosFileToUploadItem(file));
  },
  set(list) {
    modelValue.value = list
      .map((file) => getOosFileFromUploadItem(file))
      .filter(Boolean) as OosFileApi.OosFileVO[];
  },
});

const uploadProps = computed(() => ({
  ...createOosUploadRequest(),
  maxCount: props.maxCount,
  multiple: props.multiple,
  onDownload: (file: UploadFile) => {
    const item = getOosFileFromUploadItem(file);
    if (item) {
      downloadOosFile(item.id, item.fileName);
    }
  },
  showUploadList: {
    showDownloadIcon: true,
    showRemoveIcon: !isViewMode.value,
  },
}));

async function handleViewDownload(file: OosFileApi.OosFileVO) {
  await downloadOosFile(file.id, file.fileName);
}
</script>

<template>
  <div class="oos-file w-full">
    <template v-if="isViewMode">
      <List
        v-if="modelValue.length > 0"
        :data-source="modelValue"
        bordered
        size="small"
      >
        <template #renderItem="{ item }">
          <List.Item>
            <a @click="handleViewDownload(item)">{{ item.fileName }}</a>
          </List.Item>
        </template>
      </List>
      <span v-else class="text-muted-foreground text-sm">
        {{ $t('ui.upload.empty') }}
      </span>
    </template>

    <Upload v-else v-model:file-list="uploadFileList" v-bind="uploadProps">
      <slot>
        <Button type="primary">{{ $t('ui.upload.select') }}</Button>
      </slot>
    </Upload>
  </div>
</template>
