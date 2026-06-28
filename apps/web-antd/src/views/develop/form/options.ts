import type { DefaultOptionType } from 'ant-design-vue/es/select';

import { getDbTypes, getItemPresetTypes } from './api';

export const formComponentOptions: DefaultOptionType[] = [
  { label: 'Input', value: 'Input' },
  { label: 'Textarea', value: 'Textarea' },
  { label: 'Select', value: 'Select' },
  { label: 'Radio', value: 'Radio' },
  { label: 'Checkbox', value: 'Checkbox' },
  { label: 'DatePicker', value: 'DatePicker' },
  { label: 'TimePicker', value: 'TimePicker' },
  { label: 'DateTimePicker', value: 'DateTimePicker' },
  { label: 'Upload', value: 'Upload' },
  { label: 'Slider', value: 'Slider' },
  { label: 'Rate', value: 'Rate' },
  { label: 'Switch', value: 'Switch' },
];

export const fieldTypeOptions: DefaultOptionType[] = [
  { label: 'String', value: 'String' },
  { label: 'Integer', value: 'Integer' },
  { label: 'Long', value: 'Long' },
  { label: 'BigDecimal', value: 'BigDecimal' },
  { label: 'Boolean', value: 'Boolean' },
  { label: 'Date', value: 'Date' },
];

export const fieldAttributeOptions: DefaultOptionType[] = [
  { label: '普通字段', value: '1' },
  { label: '主键', value: '2' },
  { label: '删除标记', value: '3' },
  { label: '非数据库字段', value: '4' },
];

export const useDbTypeOptions = async () => {
  return await getDbTypes();
};
export const usePreSetTypeOptions = async () => {
  const res = await getItemPresetTypes();
  res.forEach((it: any) => {
    it.value = JSON.stringify(it.value);
  });
  return res;
};

export const dbTypeToFieldType: Record<string, string> = {
  varchar: 'String',
  char: 'String',
  text: 'String',
  longtext: 'String',
  int: 'Integer',
  bigint: 'Long',
  smallint: 'Integer',
  tinyint: 'Integer',
  decimal: 'BigDecimal',
  float: 'Float',
  double: 'Double',
  date: 'Date',
  datetime: 'Date',
  timestamp: 'Date',
  boolean: 'Boolean',
  bit: 'Boolean',
};

export const dbTypeToComponent: Record<string, string> = {
  varchar: 'Input',
  char: 'Input',
  text: 'Textarea',
  longtext: 'Textarea',
  int: 'InputNumber',
  bigint: 'InputNumber',
  smallint: 'InputNumber',
  tinyint: 'InputNumber',
  decimal: 'InputNumber',
  float: 'InputNumber',
  double: 'InputNumber',
  date: 'DatePicker',
  datetime: 'DateTimePicker',
  timestamp: 'DateTimePicker',
  boolean: 'Switch',
  bit: 'Switch',
};
