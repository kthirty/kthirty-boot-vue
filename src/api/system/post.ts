import { defHttp } from '@/utils/http/axios';
import { PostListGetResultModel, PostInfo } from './model/post';

enum Api {
  PostList = '/sys/post/tree',
  SavePost = '/sys/post/save',
  UpdatePost = '/sys/post/update',
  DeletePost = '/sys/post/remove',
}

export const getPostList = (params?: PostInfo) =>
  defHttp.get<PostListGetResultModel>({ url: Api.PostList, params });

export const savePost = (params?: Recordable) =>
  defHttp.post({ url: Api.SavePost, params }, { successMessageMode: 'message' });
export const updatePost = (params?: Recordable) =>
  defHttp.put({ url: Api.UpdatePost, params }, { successMessageMode: 'message' });
export const deletePost = (id: string) =>
  defHttp.delete({ url: `${Api.DeletePost}/${id}` }, { successMessageMode: 'message' });
