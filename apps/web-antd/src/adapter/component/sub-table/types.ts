import type { Recordable } from '@vben/types';

import type { VbenFormSchema } from '#/adapter/form';

export interface SubTableColumnSchema
  extends Omit<VbenFormSchema, 'componentProps' | 'defaultValue' | 'modelPropName'> {
  /** 组件参数；函数参数使用子表行上下文 */
  componentProps?:
    | ((row: Recordable<any>, index: number) => Recordable<any>)
    | Recordable<any>;
  /** 列宽 */
  width?: number | string;
  /** 是否允许行内编辑，默认 true；为 false 时行内只读，仍可通过弹框编辑 */
  editable?: boolean;
}

export interface SubTableProps {
  /** 列配置（与 FormSchema 一致） */
  columns?: SubTableColumnSchema[];
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否显示行选择框，默认 true */
  rowSelection?: boolean;
  /** 是否显示新增按钮，默认 true */
  showAdd?: boolean;
  /** 是否支持表格内直接编辑，默认 false */
  inlineEdit?: boolean;
  /** 是否支持弹窗编辑，默认 true */
  modalEdit?: boolean;
  /** 是否显示顶部批量编辑按钮，默认 true；需同时开启 modalEdit */
  showEdit?: boolean;
  /** 是否显示删除按钮，默认 true */
  showDelete?: boolean;
  /** 表格最大高度 */
  maxHeight?: number | string;
  /** 行唯一标识字段，默认 _subTableRowKey */
  rowKey?: string;
  /** 弹框标题 */
  modalTitle?: string;
}
