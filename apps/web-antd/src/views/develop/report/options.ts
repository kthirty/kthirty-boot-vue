import type { DefaultOptionType } from 'ant-design-vue/es/select';

/** 查询组件选项 */
export const queryComponentOptions: DefaultOptionType[] = [
  { label: '输入框', value: 'Input' },
  { label: '数字框', value: 'InputNumber' },
  { label: '日期', value: 'DatePicker' },
  { label: '日期时间', value: 'DateTimePicker' },
  { label: '下拉', value: 'Select' },
];

/** 列表组件选项 */
export const listComponentOptions: DefaultOptionType[] = [
  { label: '文本', value: 'Text' },
  { label: '标签', value: 'Tag' },
];

/** 字段类型选项 */
export const fieldTypeOptions: DefaultOptionType[] = [
  'String',
  'Integer',
  'Long',
  'Double',
  'BigDecimal',
  'Boolean',
  'Date',
  'Time',
  'DateTime',
].map((value) => ({ label: value, value }));
