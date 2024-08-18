import { defHttp } from '@/utils/http/axios';

const BASE_URL = '/dev/form/';
enum Api {
  QueryPageUrl = BASE_URL + '/page',
  DeleteUrl = BASE_URL + '/remove',
  UpdateUrl = BASE_URL + '/update',
  SaveUrl = BASE_URL + '/save',
  GetDetail = BASE_URL + '/getInfo',
}

export const getList = (params?: any) => defHttp.get<any>({ url: Api.QueryPageUrl, params });
export const save = (params: Recordable) => defHttp.post({ url: Api.SaveUrl, params });
export const update = (params: Recordable) => defHttp.put({ url: Api.UpdateUrl, params });
export const del = (id: string) => defHttp.delete({ url: `${Api.DeleteUrl}/${id}` });
export const detail = (id: string) => defHttp.get({ url: `${Api.GetDetail}/${id}` });
