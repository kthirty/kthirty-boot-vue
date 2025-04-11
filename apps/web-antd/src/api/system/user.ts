import type { Recordable } from '@vben/types';

import { requestClient } from '#/api/request';

export namespace SystemUserApi {
  export interface SystemUser {
    [key: string]: any;
    id?: string;
    username?: string;
    realName?: string;
    code?: string;
    password?: string;
    email?: string;
    phone?: string;
    birthday?: Date;
    sex?: string;
    avatar?: string;
    status?: string;
    roleName?: string;
    deptName?: string;
  }
}

export async function getUserPage(params: Recordable<any>) {
  return await requestClient.get('/sys/user/page', { params });
}

export async function createUser(data: SystemUserApi.SystemUser) {
  return await requestClient.post('/sys/user/save', { data });
}

export async function updateUser(data: SystemUserApi.SystemUser) {
  return await requestClient.put('/sys/user/update', { data });
}

export async function deleteUser(id: string) {
  return await requestClient.delete(`/sys/user/remove/${id}`);
}
