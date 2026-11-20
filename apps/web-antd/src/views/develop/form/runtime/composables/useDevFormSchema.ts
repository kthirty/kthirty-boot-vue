import type { DevFormRuntimeApi } from '../api';

import type { SubTableColumnSchema } from '#/adapter/component';
import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';

import { z } from '#/adapter/form';
import { $t } from '#/locales';
import { useDictStore } from '#/store/dict';

import { getDevFormDataTree } from '../api';

const COMPONENT_MAP: Record<string, string> = {
  Checkbox: 'CheckboxGroup',
  CheckboxGroup: 'CheckboxGroup',
  DatePicker: 'DatePicker',
  DateTimePicker: 'DatePicker',
  Input: 'Input',
  InputNumber: 'InputNumber',
  Radio: 'RadioGroup',
  RadioGroup: 'RadioGroup',
  RangePicker: 'RangePicker',
  Rate: 'Rate',
  Select: 'Select',
  Slider: 'Slider',
  Switch: 'Switch',
  Textarea: 'Textarea',
  TimePicker: 'TimePicker',
  TreeSelect: 'TreeSelect',
  Upload: 'Upload',
};

const DICT_COMPONENTS = new Set([
  'Checkbox',
  'CheckboxGroup',
  'Radio',
  'RadioGroup',
  'Select',
  'TreeSelect',
]);

function flattenDict(items: any[] = [], result: any[] = []) {
  items.forEach((item) => {
    result.push({
      color: item.color,
      label: item.label,
      value: item.value,
    });
    if (item.children?.length) {
      flattenDict(item.children, result);
    }
  });
  return result;
}

function resolveComponent(name?: string) {
  return COMPONENT_MAP[name || 'Input'] || 'Input';
}

function buildRules(column: DevFormRuntimeApi.ColumnSchema) {
  const stringLike = !column.fieldType || column.fieldType === 'String';
  if (stringLike && column.regexp) {
    const pattern = new RegExp(column.regexp);
    if (column.required) {
      return z
        .string({ message: `${column.label}为必填项` })
        .min(1, { message: `${column.label}为必填项` })
        .regex(pattern, { message: `${column.label}格式不正确` });
    }
    return z
      .string()
      .regex(pattern, { message: `${column.label}格式不正确` })
      .or(z.literal(''))
      .optional();
  }
  return column.required ? 'required' : undefined;
}

type BuildComponentPropsOptions = {
  forSearch?: boolean;
};

function resolveDictCode(
  column: DevFormRuntimeApi.ColumnSchema,
  options?: BuildComponentPropsOptions,
) {
  if (column.dictCode) {
    return column.dictCode;
  }
  if (
    options?.forSearch &&
    (column.formComponent === 'Switch' || column.fieldType === 'Boolean')
  ) {
    return 'whether';
  }
  return undefined;
}

/** 检索组件：有字典时与表单录入使用同一套字典控件 */
function resolveSearchComponent(column: DevFormRuntimeApi.ColumnSchema) {
  const configured = column.queryComponent || 'Input';
  if (column.dictCode) {
    if (configured === 'TreeSelect' || column.formComponent === 'TreeSelect') {
      return 'TreeSelect';
    }
    if (DICT_COMPONENTS.has(configured)) {
      return configured;
    }
    const formComp = column.formComponent || 'Select';
    if (formComp === 'TreeSelect') {
      return 'TreeSelect';
    }
    if (formComp === 'Checkbox') {
      return 'CheckboxGroup';
    }
    if (
      ['CheckboxGroup', 'Radio', 'RadioGroup', 'Select'].includes(formComp)
    ) {
      return formComp;
    }
    return 'Select';
  }
  if (
    (column.formComponent === 'Switch' || column.fieldType === 'Boolean') &&
    configured === 'Input'
  ) {
    return 'Select';
  }
  return configured;
}

export function buildComponentProps(
  column: DevFormRuntimeApi.ColumnSchema,
  componentName?: string,
  options?: BuildComponentPropsOptions,
) {
  const dictStore = useDictStore();
  const component = componentName || column.formComponent || 'Input';
  const resolved = resolveComponent(component);
  const dictCode = resolveDictCode(column, options);
  const props: Record<string, any> = {
    allowClear: true,
    class: resolved === 'Switch' ? 'w-auto' : 'w-full',
    disabled: options?.forSearch ? false : column.readonly,
  };
  if (dictCode) {
    const dict = dictStore.getDict(dictCode);
    if (resolved === 'TreeSelect') {
      props.treeData = dict;
      props.fieldNames = {
        children: 'children',
        label: 'label',
        value: 'value',
      };
      props.treeDefaultExpandAll = true;
    } else if (
      DICT_COMPONENTS.has(component) ||
      DICT_COMPONENTS.has(resolved) ||
      resolved === 'Select'
    ) {
      props.options = flattenDict(dict);
    }
  }
  if (resolved === 'Input' || resolved === 'Textarea') {
    if (column.maxLength && column.maxLength > 0) {
      props.maxlength = column.maxLength;
      props.showCount = true;
    }
  }
  if (resolved === 'InputNumber') {
    if (column.pointLength) {
      props.precision = column.pointLength;
    }
    props.class = 'w-full';
  }
  if (resolved === 'Switch') {
    props.checkedValue = '1';
    props.unCheckedValue = '0';
  }
  if (resolved === 'DatePicker' && component !== 'DateTimePicker') {
    props.valueFormat = 'YYYY-MM-DD';
  }
  if (resolved === 'DatePicker' && component === 'DateTimePicker') {
    props.showTime = true;
    props.valueFormat = 'YYYY-MM-DD HH:mm:ss';
  }
  if (resolved === 'TimePicker') {
    props.valueFormat = 'HH:mm:ss';
  }
  if (resolved === 'RangePicker') {
    const dateTime = column.queryComponent === 'DateTimePicker';
    props.showTime = dateTime;
    props.valueFormat = dateTime ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD';
  }
  if (resolved === 'RadioGroup' || component === 'Radio') {
    props.optionType = 'button';
  }
  return props;
}

function isVisibleColumn(column: DevFormRuntimeApi.ColumnSchema) {
  return column.fieldAttribute !== '3' && column.fieldAttribute !== '4';
}

/** 列表查询表单 */
export function buildSearchSchema(
  schema: DevFormRuntimeApi.Schema,
): VbenFormSchema[] {
  return schema.columns
    .filter((col) => col.showInQuery && isVisibleColumn(col))
    .map((col) => {
      const queryComponent = resolveSearchComponent(col);
      return {
        component: resolveComponent(queryComponent),
        componentProps: buildComponentProps(col, queryComponent, {
          forSearch: true,
        }),
        fieldName: col.fieldName,
        label: col.label,
      };
    });
}

/** 数据表单（根据字段配置生成） */
export function buildFormSchema(
  schema: DevFormRuntimeApi.Schema,
  isEdit = false,
): VbenFormSchema[] {
  return schema.columns
    .filter((col) => col.showInForm && isVisibleColumn(col))
    .filter((col) => !(isEdit && col.fieldAttribute === '2'))
    .map((col) => {
      const isTreeParent =
        schema.listType === '3' &&
        col.fieldName === schema.treeConfig?.parentField;
      const component = isTreeParent
        ? 'ApiTreeSelect'
        : resolveComponent(col.formComponent);
      const item: VbenFormSchema = {
        component,
        componentProps: isTreeParent
          ? {
              allowClear: true,
              api: () => getDevFormDataTree(schema.formId),
              childrenField: 'children',
              class: 'w-full',
              labelField: schema.treeConfig?.labelField || 'name',
              valueField: schema.primaryKeyField || 'id',
            }
          : buildComponentProps(col, col.formComponent),
        defaultValue:
          col.formComponent === 'Switch'
            ? (col.defaultValue ?? '0')
            : col.defaultValue,
        fieldName: col.fieldName,
        label: col.label,
        rules: buildRules(col),
      };
      return item;
    });
}

/** 子表行编辑列 */
export function buildSubTableColumns(
  schema: DevFormRuntimeApi.Schema,
): SubTableColumnSchema[] {
  return schema.columns
    .filter((col) => col.showInForm && isVisibleColumn(col))
    .filter((col) => col.fieldAttribute !== '2')
    .filter((col) => !col.foreignKeyMainTable)
    .map((col) => ({
      component: resolveComponent(col.formComponent),
      componentProps: buildComponentProps(col, col.formComponent),
      defaultValue:
        col.formComponent === 'Switch'
          ? (col.defaultValue ?? '0')
          : col.defaultValue,
      fieldName: col.fieldName,
      label: col.label,
      rules: col.required ? 'required' : undefined,
      width: 160,
    }));
}

/** 列表表格列 */
export function buildGridColumns(
  schema: DevFormRuntimeApi.Schema,
  onActionClick: OnActionClickFn<any>,
): VxeTableGridOptions['columns'] {
  const listColumns: VxeTableGridOptions['columns'] = [];
  if (schema.features?.enableBatchDelete && !isTreeList(schema)) {
    listColumns.push({ type: 'checkbox', width: 48 });
  }
  schema.columns
    .filter((col) => col.showInList && isVisibleColumn(col))
    .forEach((col) => {
      const column: NonNullable<VxeTableGridOptions['columns']>[number] = {
        field: col.fieldName,
        minWidth: 120,
        sortable: col.allowSort,
        title: col.label,
      };
      if (col.dictCode) {
        column.formatter = ({ row }) =>
          row[`${col.fieldName}Label`] ?? row[col.fieldName];
      }
      listColumns.push(column);
    });

  const operations: Array<'delete' | 'edit' | string> = [];
  if (schema.features?.enableEdit !== false) {
    operations.push('edit');
  }
  if (schema.features?.enableDelete !== false) {
    operations.push('delete');
  }
  if (operations.length > 0) {
    listColumns.push({
      align: 'center',
      cellRender: {
        attrs: {
          nameField: schema.treeConfig?.labelField || schema.primaryKeyField,
          nameTitle: schema.title,
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: operations,
      },
      field: 'operation',
      fixed: 'right',
      title: $t('common.operation'),
      width: 140,
    });
  }
  return listColumns;
}

export function buildColumns(
  schema: DevFormRuntimeApi.Schema,
  onActionClick: OnActionClickFn<any>,
) {
  return buildGridColumns(schema, onActionClick);
}

export function isTreeList(schema?: DevFormRuntimeApi.Schema) {
  return schema?.listType === '3';
}

export function isPageList(schema?: DevFormRuntimeApi.Schema) {
  return !schema?.listType || schema.listType === '1';
}
