import { useAccessStore } from '@vben/stores';

import { requestClient } from '#/api/request';

export namespace UReportApi {
  export interface ReportFile {
    name: string;
    updateDate?: string;
  }
}

/** 报表文件列表 */
export async function getReportList() {
  return requestClient.get<UReportApi.ReportFile[]>('/report/list');
}

/** 删除报表文件 */
export async function removeReport(name: string) {
  return requestClient.delete<boolean>('/report/remove', {
    params: { name },
  });
}

/** 用当前登录态换取 UReport Session，供内嵌页面携带 Cookie */
export async function ensureUreportSession() {
  const accessStore = useAccessStore();
  const headers: Record<string, string> = {};
  if (accessStore.accessToken) {
    headers.Authorization = `Bearer ${accessStore.accessToken}`;
  }
  await fetch('/ureport/designer', {
    credentials: 'include',
    headers,
  });
}

export function buildUreportUrl(mode: 'design' | 'preview', name?: string) {
  const path = mode === 'preview' ? '/ureport/preview' : '/ureport/designer';
  if (!name) {
    return path;
  }
  const file = name.startsWith('db:') ? name : `db:${name}`;
  return `${path}?_u=${encodeURIComponent(file)}`;
}
