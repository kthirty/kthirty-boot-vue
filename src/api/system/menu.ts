import { defHttp } from '@/utils/http/axios';
import { MenuListGetResultModel, MenuParams } from './model/menu';

enum Api {
  MenuList = '/sys/menu/tree',
  SaveMenu = '/sys/menu/save',
  UpdateMenu = '/sys/menu/update',
  DeleteMenu = '/sys/menu/remove',
}
export const getMenuList = (params?: MenuParams) =>
  defHttp.get<MenuListGetResultModel>({ url: Api.MenuList, params });

export const saveMenu = (params: any) => defHttp.post({ url: Api.SaveMenu, params });
export const updateMenu = (params: any) => defHttp.put({ url: Api.UpdateMenu, params });
export const deleteMenu = (id: string) =>
  defHttp.delete({ url: `${Api.DeleteMenu}/${id}` }, { successMessageMode: 'message' });
