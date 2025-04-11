import type { Recordable } from '@vben/types';

import type { DictData } from '#/store/dict';

import { requestClient } from '#/api/request';

async function queryAllItem(params?: Recordable<any>) {
  return requestClient.get<DictData>('/sys/dict/queryAllItem', {
    params,
  });
}

export { queryAllItem };
