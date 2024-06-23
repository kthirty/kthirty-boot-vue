import { BasicColumn, FormSchema } from '@/components/Table';
import { getDeptList } from '@/api/system/dept';
import { getRoleList } from '@/api/system/role';
import { getPostList } from '@/api/system/post';

export const columns: BasicColumn[] = [
  { title: '用户名', dataIndex: 'username' },
  { title: '真实姓名', dataIndex: 'realName' },
  { title: '编码', dataIndex: 'code' },
  { title: '邮箱', dataIndex: 'email' },
  { title: '手机号', dataIndex: 'phone' },
  { title: '部门', dataIndex: 'deptName' },
  { title: '岗位', dataIndex: 'postName' },
  { title: '角色', dataIndex: 'roleName' },
  { title: '状态', dataIndex: 'statusLabel' },
];

export const searchFormSchema: FormSchema[] = [
  { label: '用户名', field: 'username', component: 'Input' },
  { label: '真实姓名', field: 'realName', component: 'Input' },
];

export const formSchema: FormSchema[] = [
  { field: 'id', ifShow: false, component: 'Input' },
  { field: 'username', label: '用户名', component: 'Input', required: true },
  { field: 'realName', label: '真实姓名', component: 'Input', required: true },
  { field: 'email', label: '邮箱', component: 'Input' },
  { field: 'phone', label: '手机号', component: 'Input' },
  {
    field: 'deptIds',
    label: '归属部门',
    component: 'ApiTreeSelect',
    componentProps: {
      api: getDeptList,
      labelField: 'name',
      valueField: 'id',
      multiple: true,
    },
  },
  {
    field: 'postIds',
    label: '岗位',
    component: 'ApiTreeSelect',
    componentProps: {
      api: getPostList,
      labelField: 'name',
      valueField: 'id',
      multiple: true,
    },
  },
  {
    field: 'roleIds',
    label: '拥有角色',
    component: 'ApiSelect',
    componentProps: {
      api: getRoleList,
      labelField: 'name',
      valueField: 'id',
      mode: 'multiple',
    },
  },
  {
    field: 'status',
    label: '状态',
    component: 'RadioButtonGroup',
    dictCode: 'enable_status',
    defaultValue: '1',
  },
];
