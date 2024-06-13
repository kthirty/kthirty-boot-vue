import { BasicColumn, FormSchema } from '@/components/Table';

export const columns: BasicColumn[] = [
  { title: '用户名', dataIndex: 'username' },
  { title: '真实姓名', dataIndex: 'realName' },
  { title: '编码', dataIndex: 'code' },
  { title: '邮箱', dataIndex: 'email' },
  { title: '手机号', dataIndex: 'phone' },
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
];
