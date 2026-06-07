import type { Component } from 'vue';

import type { Recordable } from '@vben/types';

export interface SubTableColumnSchema {
  /** 列字段名 */
  field: string;
  /** 列标题 */
  title: string;
  /** 编辑组件，与表单 schema 的 component 一致（需在 adapter/component 中注册） */
  component?: Component | string;
  /** 组件参数 */
  componentProps?:
    | ((row: Recordable<any>, index: number) => Recordable<any>)
    | Recordable<any>;
  /** 默认值（新增行时使用） */
  defaultValue?: any;
  /** 列宽 */
  width?: number | string;
  /** 是否允许行内编辑，默认 true */
  editable?: boolean;
  /** 组件 v-model 绑定属性名，与表单 modelPropName 一致 */
  modelPropName?: string;
  /** 弹框编辑时的校验规则 */
  rules?: string;
}

export interface SubTableProps {
  /** 列配置 */
  columns?: SubTableColumnSchema[];
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否开启行内编辑，默认 true */
  inlineEdit?: boolean;
  /** 是否显示弹框编辑按钮，默认 true */
  modalEdit?: boolean;
  /** 是否显示新增按钮，默认 true */
  showAdd?: boolean;
  /** 是否显示删除按钮，默认 true */
  showDelete?: boolean;
  /** 表格最大高度 */
  maxHeight?: number | string;
  /** 行唯一标识字段，默认 _subTableRowKey */
  rowKey?: string;
  /** 弹框标题 */
  modalTitle?: string;
}
