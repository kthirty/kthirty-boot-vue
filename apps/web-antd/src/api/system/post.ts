import type { Recordable } from '@vben/types';

import { requestClient } from '#/api/request';

export async function getPostTree(params?: Recordable<any>) {
  return requestClient.get('/sys/post/tree', { params });
}
