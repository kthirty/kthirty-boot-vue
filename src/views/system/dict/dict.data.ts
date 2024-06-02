import { BasicColumn, FormSchema } from '@/components/Table';

export const columns: BasicColumn[] = [
  {
    title: '字典名称',
    dataIndex: 'name',
  },
  {
    title: '字典代码',
    dataIndex: 'code',
  },
  {
    title: '描述',
    dataIndex: 'description',
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'name',
    label: '字典名称',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'code',
    label: '字典代码',
    component: 'Input',
    colProps: { span: 8 },
  },
];

export const formSchema: FormSchema[] = [
  { field: 'id', ifShow: false, component: 'Input' },
  {
    field: 'code',
    label: '字典代码',
    required: true,
    component: 'Input',
    dynamicDisabled: (param) => !!param.model.id,
  },
  {
    field: 'name',
    label: '字典名称',
    required: true,
    component: 'Input',
  },
  {
    label: '描述',
    field: 'description',
    component: 'InputTextArea',
  },
];

export const dictDetailColumns: BasicColumn[] = [
  {
    title: '字典标签',
    dataIndex: 'label',
  },
  {
    title: '字典值',
    dataIndex: 'value',
  },
  {
    title: '排序',
    dataIndex: 'sort',
  },
  {
    title: '上级标签',
    dataIndex: 'parentId',
  },
];
export const dictDetailFormSchema: FormSchema[] = [
  { field: 'id', ifShow: false, component: 'Input' },
  { field: 'code', ifShow: false, component: 'Input' },
  { field: 'label', label: '字典标签', required: true, component: 'Input' },
  { field: 'value', label: '字典值', required: true, component: 'Input' },
  { field: 'sort', label: '排序', required: true, component: 'InputNumber', defaultValue: '0' },
  {
    field: 'status',
    label: '状态',
    component: 'RadioButtonGroup',
    defaultValue: '1',
    dictCode: 'enable_status',
  },
  { field: 'description', label: '描述', component: 'InputTextArea' },
];
