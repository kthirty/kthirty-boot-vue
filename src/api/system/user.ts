import { defHttp } from '@/utils/http/axios';
import { UserPageListGetResultModel, UserPageParams } from '@/api/system/model/user';

enum Api {
  UserList = '/sys/user/list',
  DeleteUser = '/sys/user/remove',
  UpdateUser = '/sys/user/update',
  SaveUser = '/sys/user/save',
  GetUserDetail = '/sys/user/getInfo',
}

export const getUserList = (params?: UserPageParams) =>
  defHttp.get<UserPageListGetResultModel>({ url: Api.UserList, params });
export const saveUser = (params: Recordable) => defHttp.post({ url: Api.SaveUser, params });
export const updateUser = (params: Recordable) => defHttp.put({ url: Api.UpdateUser, params });
export const deleteUser = (id: string) => defHttp.delete({ url: `${Api.DeleteUser}/${id}` });
export const getUserDetail = (id: string) => defHttp.get({ url: `${Api.GetUserDetail}/${id}` });
