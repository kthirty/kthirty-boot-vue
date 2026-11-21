import { requestClient } from '#/api/request';

export namespace OosFileApi {
  /** 文件上传结果 */
  export interface OosFileVO {
    id: string;
    fileName: string;
    url: string;
    contentType?: string;
    fileSize?: number;
    createDate?: string;
  }

  /** 文件元数据 */
  export interface OosFile {
    id?: string;
    originalFileName?: string;
    objectKey?: string;
    fileExt?: string;
    fileSize?: number;
    contentType?: string;
    storageType?: string;
    bucket?: string;
    md5?: string;
    createBy?: string;
    createDate?: string;
    updateBy?: string;
    updateDate?: string;
  }

  export interface OosFilePage {
    records: OosFile[];
    totalRow: number;
  }
}

/** 分页查询文件 */
export async function getOosFilePage(params?: Record<string, any>) {
  return requestClient.get<OosFileApi.OosFilePage>('/oos/file/page', {
    params,
  });
}

/** 上传单个文件 */
export async function uploadFileApi(
  file: Blob | File,
  extra?: Record<string, any>,
) {
  return requestClient.upload<OosFileApi.OosFileVO>('/oos/file/upload', {
    file,
    ...extra,
  });
}

/** 批量上传文件 */
export async function uploadFilesBatchApi(files: File[]) {
  const formData = new FormData();
  files.forEach((file) => formData.append('files', file));
  return requestClient.post<OosFileApi.OosFileVO[]>(
    '/oos/file/upload/batch',
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
  );
}

/** 获取文件信息 */
export async function getOosFileInfoApi(id: string) {
  return requestClient.get<OosFileApi.OosFileVO>(`/oos/file/info/${id}`);
}

/** 下载文件（带登录鉴权） */
export async function downloadOosFileApi(id: string) {
  return requestClient.download<Blob>(`/oos/file/download/${id}`);
}

/** 删除文件 */
export async function removeOosFileApi(id: string) {
  return requestClient.delete<boolean>(`/oos/file/remove/${id}`);
}
