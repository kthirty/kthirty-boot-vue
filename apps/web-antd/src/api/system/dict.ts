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
  export interface DictItem {
    id?: string;
    code: string;
    value: string;
    label: string;
    description?: string;
    weight?: number;
    parentId?: string;
    status?: string;
    [key: string]: any;
  }
}

async function queryAllItem(params?: Recordable<any>) {
  return requestClient.get<DictData>('/sys/dict/queryAllItem', {
    params,
  });
}
async function deleteDictType(id: string) {
  return requestClient.delete(`/sys/dict/remove/${id}`);
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
async function getDictItemList(params?: Recordable<any>) {
  return requestClient.get<Array<SystemDictApi.DictItem>>(
    '/sys/dict/queryItem',
    {
      params,
    },
  );
}
async function deleteDictItem(id: string) {
  return requestClient.delete(`/sys/dict/removeItem/${id}`);
}
async function saveDictItem(id: any, data: Omit<SystemDictApi.DictItem, 'id'>) {
  return requestClient.post('/sys/dict/saveItem', {
    id,
    ...data,
  });
}

export {
  createDictType,
  deleteDictItem,
  deleteDictType,
  getDictItemList,
  getDictTypeList,
  queryAllItem,
  saveDictItem,
  updateDictType,
};
