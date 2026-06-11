import type { UploadFile } from 'ant-design-vue';

import type { OosFileApi } from '#/api/core/file';

import { downloadFileFromBlobPart } from '@vben/utils';

import { message } from 'ant-design-vue';

import { downloadOosFileApi } from '#/api/core/file';
import { $t } from '#/locales';

export type OosUploadFile = UploadFile & {
  response?: OosFileApi.OosFileVO;
};

/** 规范化表单值为 OosFileVO 数组 */
export function normalizeOosFiles(value?: null | OosFileApi.OosFileVO[]) {
  return Array.isArray(value) ? value : [];
}

/** 将后端文件结果映射为 Ant Upload fileList 项（仅用于 Upload 内部展示） */
export function mapOosFileToUploadItem(
  file: OosFileApi.OosFileVO,
  uid?: string,
): UploadFile {
  return {
    uid: uid ?? file.id,
    name: file.fileName,
    status: 'done',
    url: file.url,
    response: file,
  };
}

/** 从 Upload fileList 项中取出后端文件对象 */
export function getOosFileFromUploadItem(file: UploadFile) {
  if (file.response) {
    return file.response as OosFileApi.OosFileVO;
  }
  if (file.uid && file.name) {
    return {
      id: file.uid,
      fileName: file.name,
      url: file.url ?? '',
    } as OosFileApi.OosFileVO;
  }
  return null;
}

/** 鉴权下载对象存储文件 */
export async function downloadOosFile(id: string, fileName?: string) {
  const blob = await downloadOosFileApi(id);
  downloadFileFromBlobPart({
    fileName: fileName ?? 'download',
    source: blob,
  });
}

/** OosFile / Upload 共用的上传请求逻辑 */
export function createOosUploadRequest() {
  return {
    customRequest: async ({
      file,
      onError,
      onProgress,
      onSuccess,
    }: Record<string, any>) => {
      try {
        onProgress?.({ percent: 20 });
        const { uploadFileApi } = await import('#/api/core/file');
        const result = await uploadFileApi(file as File);
        onProgress?.({ percent: 100 });
        onSuccess?.(result);
        message.success($t('ui.upload.success'));
      } catch (error) {
        onError?.(error);
        message.error($t('ui.upload.failed'));
      }
    },
  };
}

export interface CreateOosUploadPropsOptions {
  maxCount?: number;
  multiple?: boolean;
  onUploaded?: (file: OosFileApi.OosFileVO) => void;
}

/** 创建对接 kthirty-oos 的 Upload componentProps（用于 Demo 等直接使用 Upload 的场景） */
export function createOosUploadProps(
  options: CreateOosUploadPropsOptions = {},
) {
  const { maxCount = 5, multiple = true } = options;

  return {
    ...createOosUploadRequest(),
    maxCount,
    multiple,
    onDownload: async (file: UploadFile) => {
      const item = getOosFileFromUploadItem(file);
      if (item) {
        await downloadOosFile(item.id, item.fileName);
      }
    },
    showUploadList: {
      showDownloadIcon: true,
      showRemoveIcon: true,
    },
  };
}
