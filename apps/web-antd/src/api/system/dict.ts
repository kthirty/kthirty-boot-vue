import type { Recordable } from '@vben/types';

import type { DictData } from '#/store/dict';

import { requestClient } from '#/api/request';

export namespace SystemDictApi {
  export interface DictType {
    id?: string;
    code: string;
    name: string;
    [key: string]: any;
  }
}

async function queryAllItem(params?: Recordable<any>) {
  return requestClient.get<DictData>('/sys/dict/queryAllItem', {
    params,
  });
}
async function deleteDictType(id: string) {
  return requestClient.delete(`/sys/dict/delete/${id}`);
}
async function createDictType(data: Omit<SystemDictApi.DictType, 'id'>) {
  return requestClient.post('/sys/dict/save', data);
}
async function updateDictType(data: Omit<SystemDictApi.DictType, 'id'>) {
  return requestClient.put('/sys/dict/update', data);
}

async function getDictTypeList(params?: Recordable<any>) {
  return requestClient.get<Array<SystemDictApi.DictType>>('/sys/dict/page', {
    params,
  });
}

export {
  createDictType,
  deleteDictType,
  getDictTypeList,
  queryAllItem,
  updateDictType,
};
