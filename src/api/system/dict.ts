import { DictInfo, DictItem, DictPageResult } from '@/api/system/model/dict';
import { defHttp } from '@/utils/http/axios';

enum Api {
  GetList = '/sys/dict/page',
  DeleteDict = '/sys/dict/remove',
  SaveDict = '/sys/dict/save',
  UpdateDict = '/sys/dict/update',
  GetDictItemList = '/sys/dict/queryItem',
  SaveDictItem = '/sys/dict/saveItem',
}

export const getDictList = (params: DictInfo) =>
  defHttp.get<DictPageResult>({ url: Api.GetList, params });

export const saveDict = (params: Recordable) => defHttp.post({ url: Api.SaveDict, params });

export const updateDict = (params: Recordable) => defHttp.put({ url: Api.UpdateDict, params });

export const deleteDict = (id: string) => defHttp.delete({ url: `${Api.DeleteDict}/${id}` });

export const getDictItemList = (params: Recordable) => {
  return defHttp.get<DictItem[]>({ url: `${Api.GetDictItemList}`, params });
};

export const saveDictItem = (params: Recordable) => defHttp.post({ url: Api.SaveDictItem, params });
