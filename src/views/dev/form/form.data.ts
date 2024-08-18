import { BasicColumn, FormSchema } from '@/components/Table';

export const columns: BasicColumn[] = [
  { title: '表名', dataIndex: 'tableName' },
  { title: '备注', dataIndex: 'remarks' },
  { title: '类型', dataIndex: 'tableTypeLabel' },
  { title: '列表类型', dataIndex: 'listTypeLabel' },
  { title: '是否已同步数据库', dataIndex: 'isDbSyncLabel' },
];
export const searchFormSchema: FormSchema[] = [
  { label: '表名', field: 'tableName', component: 'Input' },
];
export const formSchema: FormSchema[] = [
  { field: 'id', ifShow: false, component: 'Input' },
  { label: '表名', field: 'tableName', component: 'Input' },
  { label: '备注', field: 'remarks', component: 'InputTextArea' },
  { label: '表类型', field: 'tableType', component: 'Select', dictCode: 'dev_table_type' },
  { label: '列表类型', field: 'listType', component: 'Select', dictCode: 'dev_list_type' },
];

export const subTableColumns: BasicColumn[] = [
  {
    title: '表字段名',
    dataIndex: 'columnName',
    editComponent: 'Input',
    editRow: true,
  },
  {
    title: '表字段类型',
    dataIndex: 'columnType',
    editComponent: 'Input',
    editRow: true,
  },
  {
    title: '表字段长度',
    dataIndex: 'columnLength',
    editComponent: 'Input',
    editRow: true,
  },
  {
    title: '小数点长度',
    dataIndex: 'columnPointLength',
    editComponent: 'Input',
    editRow: true,
  },
  {
    title: '默认值',
    dataIndex: 'columnDefaultVal',
    editComponent: 'Input',
    editRow: true,
  },
];
